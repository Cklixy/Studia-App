import { createHash, timingSafeEqual } from "crypto";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { URL_SITIO } from "@/lib/sitio";

// Pagos del plan Pro con Wompi (Web Checkout): pago único, 30 días de Pro por pago aprobado.
// Todo esto corre solo en el servidor: las llaves secretas no llegan al navegador.

export const DIAS_POR_PAGO = 30;
export const MONEDA = "COP";
const URL_CHECKOUT = "https://checkout.wompi.co/p/";

/** Cliente con service_role: único que puede crear y confirmar pagos (ver migración 00015). */
export function clienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !llave) return null;
  return createAdminClient(url, llave, { auth: { persistSession: false, autoRefreshToken: false } });
}

const sha256 = (texto: string) => createHash("sha256").update(texto).digest("hex");

function iguales(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Arma la URL del checkout con la firma de integridad (impide que alteren el monto en el navegador). */
export function urlCheckout(opts: { referencia: string; montoCentavos: number }): string | null {
  const llavePublica = process.env.WOMPI_PUBLIC_KEY;
  const secretoIntegridad = process.env.WOMPI_INTEGRITY_SECRET;
  if (!llavePublica || !secretoIntegridad) return null;

  const firma = sha256(`${opts.referencia}${opts.montoCentavos}${MONEDA}${secretoIntegridad}`);
  const params = new URLSearchParams({
    "public-key": llavePublica,
    currency: MONEDA,
    "amount-in-cents": String(opts.montoCentavos),
    reference: opts.referencia,
    "signature:integrity": firma,
    "redirect-url": `${URL_SITIO}/planes?pago=${encodeURIComponent(opts.referencia)}`,
  });
  return `${URL_CHECKOUT}?${params.toString()}`;
}

export interface EventoWompi {
  event?: string;
  data?: { transaction?: Record<string, unknown> } & Record<string, unknown>;
  timestamp?: number;
  signature?: { checksum?: string; properties?: string[] };
}

// Lee una propiedad con ruta tipo "transaction.amount_in_cents"
function leer(obj: unknown, ruta: string): unknown {
  return ruta.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}

/**
 * Verifica que el evento lo envió Wompi: SHA256 de los valores de `signature.properties`
 * (en orden) + timestamp + secreto de eventos, comparado con `signature.checksum`.
 */
export function eventoValido(evento: EventoWompi): boolean {
  const secreto = process.env.WOMPI_EVENTS_SECRET;
  const checksum = evento.signature?.checksum;
  const propiedades = evento.signature?.properties;
  if (!secreto || !checksum || !Array.isArray(propiedades) || propiedades.length === 0 || evento.timestamp == null) return false;

  const valores = propiedades.map((p) => leer(evento.data, p));
  if (valores.some((v) => v === undefined || v === null)) return false;

  const esperado = sha256(`${valores.join("")}${evento.timestamp}${secreto}`);
  return iguales(esperado, checksum.toLowerCase());
}
