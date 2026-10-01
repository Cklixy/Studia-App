-- Pagos del plan Pro con Wompi (pago único: 30 días de Pro por cada pago aprobado).
--
-- Flujo:
--   1. La app crea una fila 'pendiente' con una referencia única (api/pagos/checkout).
--   2. El usuario paga en el checkout de Wompi.
--   3. Wompi avisa al webhook (api/pagos/webhook), que llama a confirmar_pago_wompi(...).
--      Esa función es idempotente: un evento repetido no regala días de más.
--
-- Seguridad: RLS sin políticas de escritura; el usuario solo lee sus pagos y solo service_role
-- (servidor) puede crear o confirmar pagos.

create table if not exists public.pagos (
  referencia text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  monto_centavos integer not null check (monto_centavos > 0),
  moneda text not null default 'COP',
  dias integer not null check (dias between 1 and 366),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobado', 'rechazado')),
  wompi_transaccion_id text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists pagos_user_id_idx on public.pagos (user_id);
-- Una transacción de Wompi solo puede acreditarse una vez
create unique index if not exists pagos_wompi_transaccion_idx on public.pagos (wompi_transaccion_id)
  where wompi_transaccion_id is not null;

alter table public.pagos enable row level security;

drop policy if exists "Cada usuario lee sus pagos" on public.pagos;
create policy "Cada usuario lee sus pagos" on public.pagos
  for select to authenticated using ((select auth.uid()) = user_id);

revoke insert, update, delete on public.pagos from anon, authenticated;

-- Confirma un pago de Wompi y otorga el Pro. Devuelve true solo la primera vez que se aprueba.
create or replace function public.confirmar_pago_wompi(
  p_referencia text,
  p_transaccion_id text,
  p_estado text,
  p_monto_centavos integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pago public.pagos%rowtype;
begin
  if p_estado not in ('aprobado', 'rechazado') then
    raise exception 'Estado no válido: %', p_estado using errcode = '22023';
  end if;

  select * into v_pago from public.pagos where referencia = p_referencia for update;
  if not found then
    raise exception 'Referencia de pago desconocida: %', p_referencia using errcode = 'P0002';
  end if;

  -- Ya acreditado: no hacer nada (idempotencia ante reenvíos del webhook)
  if v_pago.estado = 'aprobado' then
    return false;
  end if;

  if p_estado = 'rechazado' then
    update public.pagos
    set estado = 'rechazado', wompi_transaccion_id = p_transaccion_id, actualizado_en = now()
    where referencia = p_referencia;
    return false;
  end if;

  -- El monto pagado debe ser el que se pidió al crear el pago
  if v_pago.monto_centavos <> p_monto_centavos then
    raise exception 'El monto pagado (%) no coincide con el esperado (%)', p_monto_centavos, v_pago.monto_centavos
      using errcode = '22023';
  end if;

  update public.pagos
  set estado = 'aprobado', wompi_transaccion_id = p_transaccion_id, actualizado_en = now()
  where referencia = p_referencia;

  perform private.otorgar_pro(v_pago.user_id, v_pago.dias, 'pago', 'Wompi ' || p_transaccion_id);
  return true;
end;
$$;

revoke execute on function public.confirmar_pago_wompi(text, text, text, integer) from public, anon, authenticated;
grant execute on function public.confirmar_pago_wompi(text, text, text, integer) to service_role;
grant select, insert, update on public.pagos to service_role;
