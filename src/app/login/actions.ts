"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { URL_SITIO } from "@/lib/sitio";
import { conMensaje, LONGITUD_MINIMA_CONTRASENA, traducirErrorAuth } from "@/lib/auth/mensajes";

// Origen del despliegue actual (producción o Preview) para los enlaces de los correos
function origenActual() {
  return headers().get("origin") || URL_SITIO;
}

export async function login(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(conMensaje("/login", "error", traducirErrorAuth(error.message)));
  }

  revalidatePath("/", "layout");
  redirect("/hoy");
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  };

  if (data.password.length < LONGITUD_MINIMA_CONTRASENA) {
    redirect(conMensaje("/registro", "error", `La contraseña debe tener al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres.`));
  }

  const { data: signupData, error } = await supabase.auth.signUp({
    ...data,
    options: { emailRedirectTo: `${origenActual()}/auth/confirm?next=/hoy` },
  });

  if (error) {
    // M8a: mensaje genérico si el correo ya existe — no confirma si está registrado
    const mensaje = error.message.includes("User already registered")
      ? "Si la dirección es válida, recibirás un correo de confirmación en breve."
      : traducirErrorAuth(error.message);
    redirect(conMensaje("/registro", error.message.includes("User already registered") ? "exito" : "error", mensaje));
  }

  if (!signupData.session) {
    redirect(conMensaje("/login", "exito", "Revisa tu correo para confirmar tu cuenta."));
  }

  revalidatePath("/", "layout");
  redirect("/hoy");
}

// Paso 1 de la recuperación: envía el enlace para crear una contraseña nueva.
// El mensaje es el mismo exista o no el correo, para no revelar qué cuentas existen.
export async function solicitarRecuperacion(formData: FormData) {
  const supabase = createClient();
  const email = String(formData.get("email") || "").trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origenActual()}/auth/confirm?next=/nueva-contrasena`,
  });

  if (error && /rate limit|For security purposes/i.test(error.message)) {
    redirect(conMensaje("/recuperar", "error", traducirErrorAuth(error.message)));
  }

  redirect(
    conMensaje(
      "/recuperar",
      "exito",
      "Si el correo está registrado, te enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de spam."
    )
  );
}

// Paso 2: la persona llega con sesión temporal desde /auth/confirm y fija la nueva contraseña.
export async function actualizarContrasena(formData: FormData) {
  const supabase = createClient();
  const password = String(formData.get("password") || "");

  if (password.length < LONGITUD_MINIMA_CONTRASENA) {
    redirect(conMensaje("/nueva-contrasena", "error", `Usa al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres.`));
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(conMensaje("/recuperar", "error", "El enlace caducó o ya se usó. Pide uno nuevo."));
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(conMensaje("/nueva-contrasena", "error", traducirErrorAuth(error.message)));
  }

  revalidatePath("/", "layout");
  redirect("/hoy");
}
