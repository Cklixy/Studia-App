"use client";

import { useEffect, useState } from "react";

// Indica si el navegador tiene la cookie de sesión de Supabase (sb-<ref>-auth-token).
// Es solo una pista para la interfaz pública (p. ej. mostrar "Ir a mis materias"): no valida
// la sesión. Las rutas privadas siguen comprobándola en el servidor con getUser().
// Evita que la landing llame a getUser() en el servidor, lo que la volvía dinámica y
// enviaba Cache-Control: no-store (sin caché de CDN ni bfcache).
export function useHaySesion(): boolean {
  const [haySesion, setHaySesion] = useState(false);

  useEffect(() => {
    setHaySesion(/(?:^|;\s*)sb-[^=]+-auth-token(?:\.0)?=/.test(document.cookie));
  }, []);

  return haySesion;
}
