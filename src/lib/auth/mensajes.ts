// Traduce los errores de Supabase Auth a mensajes en español para el estudiante.
// Los mensajes originales vienen en inglés y se mostraban tal cual en /registro.
const TRADUCCIONES: Array<[RegExp, string]> = [
  [/Invalid login credentials/i, "Correo o contraseña incorrectos."],
  [/Email not confirmed/i, "Confirma tu correo electrónico antes de ingresar. Revisa tu bandeja de entrada o spam."],
  [/Password should be at least (\d+)/i, "La contraseña debe tener al menos 8 caracteres."],
  [/weak password|password is too weak|pwned|compromised/i, "Esa contraseña es demasiado común o apareció en filtraciones. Elige otra."],
  [/Unable to validate email address|invalid format|email address .* is invalid/i, "Revisa el correo: el formato no es válido."],
  [/rate limit|too many requests|For security purposes, you can only request this after/i, "Demasiados intentos. Espera un minuto y vuelve a intentarlo."],
  [/same password|New password should be different/i, "La nueva contraseña debe ser distinta de la anterior."],
  [/expired|invalid.*(token|link|otp)|otp_expired/i, "El enlace caducó o ya se usó. Pide uno nuevo."],
  [/signups not allowed|Signups not allowed/i, "El registro está desactivado temporalmente."],
];

export function traducirErrorAuth(mensaje: string | undefined | null): string {
  if (!mensaje) return "Ocurrió un error. Inténtalo de nuevo.";
  for (const [patron, texto] of TRADUCCIONES) if (patron.test(mensaje)) return texto;
  return "Ocurrió un error. Inténtalo de nuevo.";
}

// Longitud mínima exigida en el registro y al cambiar la contraseña
export const LONGITUD_MINIMA_CONTRASENA = 8;

// Construye la URL de redirección con el tipo explícito: el cliente ya no adivina
// si es error o éxito por las palabras del mensaje (antes "correo" = éxito).
export function conMensaje(ruta: string, tipo: "error" | "exito", mensaje: string) {
  return `${ruta}?tipo=${tipo}&message=${encodeURIComponent(mensaje)}`;
}
