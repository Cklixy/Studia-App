-- Protectores de racha: si un día no estudias, un protector mantiene viva la racha.
--   Free: 1 protector al mes. Pro: 3 al mes (el mes es el calendario en hora de Colombia).
--   Se gastan solos: al terminar la primera sesión tras días sin estudiar, la app llama a
--   consumir_protectores(); si alcanzan para cubrir los días perdidos, la racha sigue; si no, se rompe
--   (y no se gasta ninguno).
--
-- Seguridad: RLS; el usuario solo LEE lo suyo. Las escrituras pasan por la función SECURITY DEFINER.

create table if not exists public.protectores_racha (
  user_id uuid not null references auth.users (id) on delete cascade,
  periodo date not null,
  usados integer not null default 0 check (usados >= 0),
  primary key (user_id, periodo)
);

-- Días concretos cubiertos por un protector (para mostrarlos en la semana y el calendario)
create table if not exists public.dias_protegidos (
  user_id uuid not null references auth.users (id) on delete cascade,
  fecha date not null,
  primary key (user_id, fecha)
);

alter table public.protectores_racha enable row level security;
alter table public.dias_protegidos enable row level security;

drop policy if exists "Cada usuario lee sus protectores" on public.protectores_racha;
create policy "Cada usuario lee sus protectores" on public.protectores_racha
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Cada usuario lee sus dias protegidos" on public.dias_protegidos;
create policy "Cada usuario lee sus dias protegidos" on public.dias_protegidos
  for select to authenticated using ((select auth.uid()) = user_id);

revoke insert, update, delete on public.protectores_racha, public.dias_protegidos from anon, authenticated;

create or replace function public.limite_protectores(es_pro boolean)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when es_pro then 3 else 1 end;
$$;

-- Protectores del mes: {plan, limite, usados, disponibles}
create or replace function public.estado_protectores()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_pro boolean;
  v_limite integer;
  v_usados integer;
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;
  select coalesce(s.pro_hasta > now(), false) into v_pro from public.suscripciones s where s.user_id = v_uid;
  v_pro := coalesce(v_pro, false);
  v_limite := public.limite_protectores(v_pro);
  select coalesce(p.usados, 0) into v_usados
  from public.protectores_racha p
  where p.user_id = v_uid and p.periodo = public.periodo_uso_actual();
  v_usados := coalesce(v_usados, 0);
  return jsonb_build_object(
    'plan', case when v_pro then 'pro' else 'free' end,
    'limite', v_limite,
    'usados', v_usados,
    'disponibles', greatest(v_limite - v_usados, 0)
  );
end;
$$;

-- Cubre con protectores los días perdidos entre la última actividad y hoy (hora de Colombia).
-- Devuelve {ok, protegidos}: ok = la racha sigue viva; protegidos = días cubiertos ahora.
-- Atómico: el UPDATE condicional no deja pasarse del límite aunque lleguen dos peticiones a la vez.
create or replace function public.consumir_protectores(p_ultima_actividad date)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_hoy date := (now() at time zone 'America/Bogota')::date;
  v_periodo date := public.periodo_uso_actual();
  v_perdidos integer;
  v_pro boolean;
  v_limite integer;
  v_filas integer;
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;
  if p_ultima_actividad is null then
    return jsonb_build_object('ok', false, 'protegidos', 0);
  end if;

  v_perdidos := v_hoy - p_ultima_actividad - 1;
  if v_perdidos <= 0 then
    return jsonb_build_object('ok', true, 'protegidos', 0);
  end if;

  select coalesce(s.pro_hasta > now(), false) into v_pro from public.suscripciones s where s.user_id = v_uid;
  v_limite := public.limite_protectores(coalesce(v_pro, false));
  if v_perdidos > v_limite then
    return jsonb_build_object('ok', false, 'protegidos', 0);
  end if;

  insert into public.protectores_racha (user_id, periodo) values (v_uid, v_periodo)
  on conflict (user_id, periodo) do nothing;

  update public.protectores_racha set usados = usados + v_perdidos
  where user_id = v_uid and periodo = v_periodo and usados + v_perdidos <= v_limite;
  get diagnostics v_filas = row_count;
  if v_filas = 0 then
    return jsonb_build_object('ok', false, 'protegidos', 0);
  end if;

  insert into public.dias_protegidos (user_id, fecha)
  select v_uid, p_ultima_actividad + g from generate_series(1, v_perdidos) g
  on conflict do nothing;

  return jsonb_build_object('ok', true, 'protegidos', v_perdidos);
end;
$$;

revoke execute on function public.estado_protectores(), public.consumir_protectores(date) from public, anon;
grant execute on function public.estado_protectores(), public.consumir_protectores(date) to authenticated;
