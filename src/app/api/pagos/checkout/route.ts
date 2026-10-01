import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PRECIO_PRO_COP } from "@/lib/plan";
import { clienteAdmin, DIAS_POR_PAGO, MONEDA, urlCheckout } from "@/lib/wompi";

export const dynamic = "force-dynamic";

// Crea un pago pendiente y devuelve la URL del checkout de Wompi. El monto sale del servidor,
// nunca del navegador.
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const admin = clienteAdmin();
  const montoCentavos = PRECIO_PRO_COP * 100;
  const referencia = `studia-${Date.now()}-${randomBytes(6).toString("hex")}`;
  const url = urlCheckout({ referencia, montoCentavos });
  if (!admin || !url) {
    console.error("Pagos: faltan SUPABASE_SERVICE_ROLE_KEY, WOMPI_PUBLIC_KEY o WOMPI_INTEGRITY_SECRET");
    return NextResponse.json({ error: "El pago en línea no está disponible en este momento" }, { status: 503 });
  }

  const { error } = await admin.from("pagos").insert({
    referencia,
    user_id: user.id,
    monto_centavos: montoCentavos,
    moneda: MONEDA,
    dias: DIAS_POR_PAGO,
  });
  if (error) {
    console.error("Pagos: no se pudo crear el pago:", error.message);
    return NextResponse.json({ error: "No se pudo iniciar el pago. Intenta de nuevo." }, { status: 500 });
  }

  return NextResponse.json({ url });
}
