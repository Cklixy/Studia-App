"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    let message = error.message;
    if (error.message.includes("Invalid login credentials")) {
      message = "Correo o contraseña incorrectos.";
    } else if (error.message.includes("Email not confirmed")) {
      message = "Por favor confirma tu correo electrónico antes de ingresar.";
    }
    redirect(`/login?message=${encodeURIComponent(message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/materias");
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signupData, error } = await supabase.auth.signUp(data);

  if (error) {
    let message = error.message;
    if (error.message.includes("User already registered")) {
      message = "Si la dirección es válida recibirás un correo de confirmación en breve.";
      // M8a: Mensaje genérico — no confirma si el correo existe en el sistema
    }
    redirect(`/registro?message=${encodeURIComponent(message)}`);
  }

  if (!signupData.session) {
    redirect("/login?message=Revisa tu correo para confirmar tu cuenta.");
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Cuenta creada exitosamente. Inicia sesión.");
}
