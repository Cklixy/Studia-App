-- Tope mensual de 100 recomendaciones de método con IA (antes solo había un límite por minuto).
-- Aplica a Free y a Pro. Al llegar al tope la app sigue recomendando métodos con el motor de reglas,
-- sin IA. Se cuenta con consumir_uso_ia('metodo') y se devuelve con devolver_uso_ia('metodo').

alter table public.uso_ia add column if not exists metodos_ia integer not null default 0 check (metodos_ia >= 0);

create or replace function public.limite_uso_ia(es_pro boolean, tipo text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case tipo
    when 'ruta' then case when es_pro then 50 else 5 end
    when 'mensaje' then case when es_pro then 100 else 20 end
    when 'metodo' then 100
  end;
$$;

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
  if p_tipo not in ('ruta', 'mensaje', 'metodo') then
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
  elsif p_tipo = 'mensaje' then
    update public.uso_ia set mensajes_tutor = mensajes_tutor + 1
    where user_id = v_uid and periodo = v_periodo and mensajes_tutor < v_limite
    returning mensajes_tutor into v_usados;
  else
    update public.uso_ia set metodos_ia = metodos_ia + 1
    where user_id = v_uid and periodo = v_periodo and metodos_ia < v_limite
    returning metodos_ia into v_usados;
  end if;

  -- Si el UPDATE condicional no tocó la fila, ya estaba en el tope
  v_permitido := v_usados is not null;
  if not v_permitido then
    select case p_tipo when 'ruta' then u.rutas_ia when 'mensaje' then u.mensajes_tutor else u.metodos_ia end into v_usados
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
  elsif p_tipo = 'metodo' then
    update public.uso_ia set metodos_ia = greatest(metodos_ia - 1, 0)
    where user_id = v_uid and periodo = public.periodo_uso_actual();
  end if;
end;
$$;

revoke execute on function public.consumir_uso_ia(text), public.devolver_uso_ia(text) from public, anon;
grant execute on function public.consumir_uso_ia(text), public.devolver_uso_ia(text) to authenticated;
