// Avisos breves (toasts) sin librería: cualquier componente cliente llama a avisar() y
// <Avisos /> (montado en el layout) los muestra en una región aria-live.
export type TonoAviso = "exito" | "error" | "info";
export interface Aviso {
  id: number;
  texto: string;
  tono: TonoAviso;
}

export const EVENTO_AVISO = "studia:aviso";

export function avisar(texto: string, tono: TonoAviso = "exito") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Omit<Aviso, "id">>(EVENTO_AVISO, { detail: { texto, tono } }));
}
