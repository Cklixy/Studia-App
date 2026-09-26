-- Suscripciones Free / Pro con límites de uso mensual de la IA (plan de suscripciones, fases 1 y 2).
-- Sin pasarela de pago todavía: el Pro se otorga a mano con private.admin_dar_pro(...).
--
--   Free: 5 rutas con IA y 20 mensajes al tutor por mes.
--   Pro:  50 rutas con IA y 100 mensajes al tutor por mes.
--   El mes es el calendario en hora de Colombia: se reinicia el día 1 sin cron.
--   El plan no se guarda como texto: es Pro mientras pro_hasta > now(); vence solo.
--
-- Seguridad:
--   - RLS en todas las tablas; el usuario solo LEE lo suyo, nunca escribe (ni siquiera su uso).
--   - Las escrituras pasan por funciones SECURITY DEFINER con search_path vacío.
--   - Las funciones de administración viven en el esquema private (no expuesto por la API) y
--     solo las puede ejecutar el dueño del proyecto (editor SQL de Supabase) o service_role.

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

create table if not exists public.suscripciones (
  user_id uuid primary key references auth.users (id) on delete cascade,
  pro_hasta timestamptz,
  origen text check (origen in ('pago', 'manual', 'prueba')),
  nota text,
  actualizado_en timestamptz not null default now()
);

create table if not exists public.uso_ia (
  user_id uuid not null references auth.users (id) on delete cascade,
  periodo date not null,
  rutas_ia integer not null default 0 check (rutas_ia >= 0),
  mensajes_tutor integer not null default 0 check (mensajes_tutor >= 0),
  primary key (user_id, periodo)
);

create table if not exists public.cambios_plan (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  pro_hasta_antes timestamptz,
  pro_hasta_despues timestamptz,
  motivo text not null check (motivo in ('pago', 'manual', 'prueba')),
  nota text,
  creado_en timestamptz not null default now()
);

create index if not exists cambios_plan_user_id_idx on public.cambios_plan (user_id);

alter table public.suscripciones enable row level security;
alter table public.uso_ia enable row level security;
alter table public.cambios_plan enable row level security;

-- Lectura de lo propio; ninguna política de escritura (solo las funciones escriben)
drop policy if exists "Cada usuario lee su suscripcion" on public.suscripciones;
create policy "Cada usuario lee su suscripcion" on public.suscripciones
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Cada usuario lee su uso de IA" on public.uso_ia;
create policy "Cada usuario lee su uso de IA" on public.uso_ia
  for select to authenticated using ((select auth.uid()) = user_id);

-- cambios_plan: sin políticas = nadie la lee desde la API (auditoría interna)

revoke insert, update, delete on public.suscripciones, public.uso_ia, public.cambios_plan from anon, authenticated;
revoke all on public.cambios_plan from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Reglas del plan
-- ---------------------------------------------------------------------------

-- Límite mensual según plan y tipo ('ruta' | 'mensaje')
create or replace function public.limite_uso_ia(es_pro boolean, tipo text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case tipo
    when 'ruta' then case when es_pro then 50 else 5 end
    when 'mensaje' then case when es_pro then 100 else 20 end
  end;
$$;

-- Día 1 del mes actual en hora de Colombia
create or replace function public.periodo_uso_actual()
returns date
language sql
stable
set search_path = ''
as $$
  select date_trunc('month', now() at time zone 'America/Bogota')::date;
$$;

-- ---------------------------------------------------------------------------
-- Funciones para la app (usuario autenticado)
-- ---------------------------------------------------------------------------

-- Comprueba el límite y suma 1 en una sola sentencia (atómico: dos pestañas no se pasan del tope).
-- Devuelve {permitido, usados, limite, plan, reinicia_el}.
create or replace function public.consumir_uso_ia(p_tipo text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_periodo date := public.periodo_uso_actual();
  v_pro boolean;
  v_limite integer;
  v_usados integer;
  v_permitido boolean;
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;
  if p_tipo not in ('ruta', 'mensaje') then
    raise exception 'Tipo de uso no válido: %', p_tipo using errcode = '22023';
  end if;

  select coalesce(s.pro_hasta > now(), false) into v_pro
  from public.suscripciones s
  where s.user_id = v_uid;
  v_pro := coalesce(v_pro, false);
  v_limite := public.limite_uso_ia(v_pro, p_tipo);

  insert into public.uso_ia (user_id, periodo) values (v_uid, v_periodo)
  on conflict (user_id, periodo) do nothing;

  if p_tipo = 'ruta' then
    update public.uso_ia set rutas_ia = rutas_ia + 1
    where user_id = v_uid and periodo = v_periodo and rutas_ia < v_limite
    returning rutas_ia into v_usados;
  else
    update public.uso_ia set mensajes_tutor = mensajes_tutor + 1
    where user_id = v_uid and periodo = v_periodo and mensajes_tutor < v_limite
    returning mensajes_tutor into v_usados;
  end if;

  -- Si el UPDATE condicional no tocó la fila, ya estaba en el tope
  v_permitido := v_usados is not null;
  if not v_permitido then
    select case when p_tipo = 'ruta' then u.rutas_ia else u.mensajes_tutor end into v_usados
    from public.uso_ia u
    where u.user_id = v_uid and u.periodo = v_periodo;
  end if;

  return jsonb_build_object(
    'permitido', v_permitido,
    'usados', v_usados,
    'limite', v_limite,
    'plan', case when v_pro then 'pro' else 'free' end,
    'reinicia_el', (v_periodo + interval '1 month')::date
  );
end;
$$;

-- Devuelve una unidad si la IA falló (un intento fallido no cuenta)
create or replace function public.devolver_uso_ia(p_tipo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;
  if p_tipo = 'ruta' then
    update public.uso_ia set rutas_ia = greatest(rutas_ia - 1, 0)
    where user_id = v_uid and periodo = public.periodo_uso_actual();
  elsif p_tipo = 'mensaje' then
    update public.uso_ia set mensajes_tutor = greatest(mensajes_tutor - 1, 0)
    where user_id = v_uid and periodo = public.periodo_uso_actual();
  end if;
end;
$$;

-- Plan y consumo del mes para la interfaz
create or replace function public.estado_plan()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_periodo date := public.periodo_uso_actual();
  v_pro_hasta timestamptz;
  v_pro boolean;
  v_rutas integer := 0;
  v_mensajes integer := 0;
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.pro_hasta into v_pro_hasta from public.suscripciones s where s.user_id = v_uid;
  v_pro := coalesce(v_pro_hasta > now(), false);

  select coalesce(u.rutas_ia, 0), coalesce(u.mensajes_tutor, 0) into v_rutas, v_mensajes
  from public.uso_ia u
  where u.user_id = v_uid and u.periodo = v_periodo;

  return jsonb_build_object(
    'plan', case when v_pro then 'pro' else 'free' end,
    'pro_hasta', case when v_pro then v_pro_hasta end,
    'reinicia_el', (v_periodo + interval '1 month')::date,
    'rutas', jsonb_build_object('usados', coalesce(v_rutas, 0), 'limite', public.limite_uso_ia(v_pro, 'ruta')),
    'mensajes', jsonb_build_object('usados', coalesce(v_mensajes, 0), 'limite', public.limite_uso_ia(v_pro, 'mensaje'))
  );
end;
$$;

revoke execute on function public.consumir_uso_ia(text), public.devolver_uso_ia(text), public.estado_plan() from public, anon;
grant execute on function public.consumir_uso_ia(text), public.devolver_uso_ia(text), public.estado_plan() to authenticated;

-- ---------------------------------------------------------------------------
-- Administración (esquema private: no expuesto por la API)
-- Uso desde el editor SQL de Supabase:
--   select private.admin_dar_pro('alumno@correo.com', 30, 'Cortesía');
--   select private.admin_quitar_pro('alumno@correo.com', 'Fin de la prueba');
--   select * from private.admin_estado_usuario('alumno@correo.com');
-- ---------------------------------------------------------------------------

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Única forma de dar Pro (la usará también el webhook de pago): extiende desde la fecha mayor
-- entre hoy y el vencimiento actual, y deja constancia en cambios_plan.
create or replace function private.otorgar_pro(p_user uuid, p_dias integer, p_origen text, p_nota text default null)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_antes timestamptz;
  v_despues timestamptz;
begin
  if p_dias is null or p_dias < 1 or p_dias > 366 then
    raise exception 'Los días deben estar entre 1 y 366';
  end if;
  if p_origen not in ('pago', 'manual', 'prueba') then
    raise exception 'Origen no válido: %', p_origen;
  end if;

  select s.pro_hasta into v_antes from public.suscripciones s where s.user_id = p_user for update;
  v_despues := greatest(coalesce(v_antes, now()), now()) + make_interval(days => p_dias);

  insert into public.suscripciones (user_id, pro_hasta, origen, nota, actualizado_en)
  values (p_user, v_despues, p_origen, p_nota, now())
  on conflict (user_id) do update
    set pro_hasta = excluded.pro_hasta, origen = excluded.origen, nota = excluded.nota, actualizado_en = now();

  insert into public.cambios_plan (user_id, pro_hasta_antes, pro_hasta_despues, motivo, nota)
  values (p_user, v_antes, v_despues, p_origen, p_nota);

  return v_despues;
end;
$$;

create or replace function private.usuario_por_correo(p_correo text)
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
begin
  select u.id into v_uid from auth.users u where lower(u.email) = lower(trim(p_correo));
  if v_uid is null then
    raise exception 'No existe un usuario con el correo %', p_correo;
  end if;
  return v_uid;
end;
$$;

create or replace function private.admin_dar_pro(p_correo text, p_dias integer default 30, p_nota text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hasta timestamptz;
begin
  v_hasta := private.otorgar_pro(private.usuario_por_correo(p_correo), p_dias, 'manual', p_nota);
  return format('%s es Pro hasta el %s (hora de Colombia)', p_correo,
    to_char(v_hasta at time zone 'America/Bogota', 'DD/MM/YYYY HH24:MI'));
end;
$$;

create or replace function private.admin_quitar_pro(p_correo text, p_nota text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := private.usuario_por_correo(p_correo);
  v_antes timestamptz;
begin
  select s.pro_hasta into v_antes from public.suscripciones s where s.user_id = v_uid for update;
  if v_antes is null or v_antes <= now() then
    return format('%s ya estaba en Free', p_correo);
  end if;
  update public.suscripciones set pro_hasta = now(), nota = p_nota, actualizado_en = now() where user_id = v_uid;
  insert into public.cambios_plan (user_id, pro_hasta_antes, pro_hasta_despues, motivo, nota)
  values (v_uid, v_antes, now(), 'manual', coalesce(p_nota, 'Pro retirado'));
  return format('%s vuelve a Free', p_correo);
end;
$$;

create or replace function private.admin_estado_usuario(p_correo text)
returns table (
  correo text,
  plan text,
  pro_hasta timestamptz,
  rutas_mes integer,
  mensajes_mes integer,
  ultimo_cambio text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := private.usuario_por_correo(p_correo);
begin
  return query
  select
    p_correo,
    case when s.pro_hasta > now() then 'pro' else 'free' end,
    s.pro_hasta,
    coalesce(u.rutas_ia, 0),
    coalesce(u.mensajes_tutor, 0),
    (select format('%s · %s · %s', c.motivo, to_char(c.creado_en at time zone 'America/Bogota', 'DD/MM/YYYY'), coalesce(c.nota, ''))
       from public.cambios_plan c where c.user_id = v_uid order by c.creado_en desc limit 1)
  from (select v_uid as id) x
  left join public.suscripciones s on s.user_id = x.id
  left join public.uso_ia u on u.user_id = x.id and u.periodo = public.periodo_uso_actual();
end;
$$;

revoke all on all functions in schema private from public, anon, authenticated;
grant usage on schema private to service_role;
grant execute on all functions in schema private to service_role;
