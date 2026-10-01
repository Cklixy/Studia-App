import { NextRequest, NextResponse } from "next/server";
import { clienteAdmin, eventoValido, type EventoWompi } from "@/lib/wompi";

export const dynamic = "force-dynamic";

// Webhook de Wompi: lo llama Wompi (no el navegador) cuando cambia el estado de una transacción.
// Configura en Wompi (Desarrolladores → Eventos) la URL https://<tu-dominio>/api/pagos/webhook.
// No hay sesión de usuario: la autenticidad se comprueba con la firma del evento.
export async function POST(request: NextRequest) {
  const evento = (await request.json().catch(() => null)) as EventoWompi | null;
  if (!evento || !eventoValido(evento)) {
    return NextResponse.json({ error: "Firma no válida" }, { status: 401 });
  }

  // Solo interesan los cambios de estado de transacciones
  const tx = evento.event === "transaction.updated" ? evento.data?.transaction : undefined;
  if (!tx) return NextResponse.json({ ok: true });

  const estado = tx.status === "APPROVED" ? "aprobado" : ["DECLINED", "VOIDED", "ERROR"].includes(String(tx.status)) ? "rechazado" : null;
  if (!estado) return NextResponse.json({ ok: true }); // PENDING: se espera el siguiente evento

  const admin = clienteAdmin();
  if (!admin) {
    console.error("Webhook de pagos: falta SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  const { error } = await admin.rpc("confirmar_pago_wompi", {
    p_referencia: String(tx.reference),
    p_transaccion_id: String(tx.id),
    p_estado: estado,
    p_monto_centavos: Number(tx.amount_in_cents),
  });
  if (error) {
    console.error("Webhook de pagos:", error.message);
    // Referencia desconocida o monto distinto: reintentar no ayuda. Cualquier otro fallo: 500 para que Wompi reintente.
    const definitivo = error.code === "P0002" || error.code === "22023";
    return NextResponse.json({ error: "No se pudo procesar el pago" }, { status: definitivo ? 400 : 500 });
  }

  return NextResponse.json({ ok: true });
}
