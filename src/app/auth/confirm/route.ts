import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { conMensaje } from "@/lib/auth/mensajes";

// Destino de los enlaces de los correos de Supabase (confirmación de cuenta y recuperación).
// Admite los dos formatos: ?code= (PKCE, el que usa @supabase/ssr) y ?token_hash=&type=.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Solo rutas internas: evita redirecciones abiertas con ?next=https://otro-sitio
  const nextParam = searchParams.get("next") || "/hoy";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/hoy";

  const supabase = createClient();
  let error: { message: string } | null = null;

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  } else {
    error = { message: "sin código" };
  }

  if (error) {
    const destino = next === "/nueva-contrasena" ? "/recuperar" : "/login";
    return NextResponse.redirect(new URL(conMensaje(destino, "error", "El enlace caducó o ya se usó. Pide uno nuevo."), origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
