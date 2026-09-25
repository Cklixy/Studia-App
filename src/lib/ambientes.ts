// Catálogo de ambientes para estudiar. Los sonidos se generan con ffmpeg (anoisesrc) a partir de
// ruido filtrado: no tienen derechos de terceros. Bucles de 60 s, AAC mono 96 kbps, ~0,7 MB,
// con el volumen igualado a unos −20 dB de media para que al cambiar de ambiente no haya saltos.
// Para añadir música (p. ej. lo-fi) basta con dejar el archivo en /public/audio y sumarlo aquí,
// siempre con una licencia que permita su uso (CC0 o similar) anotada en el comentario.

export type AmbienteId = "lluvia" | "oleaje" | "ruido-marron" | "ruido-rosa";

export interface Ambiente {
  id: AmbienteId;
  nombre: string;
  descripcion: string;
  src: string;
}

export const AMBIENTES: Ambiente[] = [
  { id: "lluvia", nombre: "Lluvia", descripcion: "Lluvia suave y constante", src: "/audio/ambientes/lluvia.m4a" },
  { id: "oleaje", nombre: "Oleaje", descripcion: "Olas lentas, cada 10 s", src: "/audio/ambientes/oleaje.m4a" },
  { id: "ruido-marron", nombre: "Ruido marrón", descripcion: "Grave y envolvente", src: "/audio/ambientes/ruido-marron.m4a" },
  { id: "ruido-rosa", nombre: "Ruido rosa", descripcion: "Tapa voces y ruido de fondo", src: "/audio/ambientes/ruido-rosa.m4a" },
];

export function ambientePorId(id: string | null | undefined): Ambiente | null {
  return AMBIENTES.find((a) => a.id === id) ?? null;
}

/** Evento que emite la sesión activa para que el reproductor la acompañe sin depender de ella. */
export const EVENTO_SESION = "studia:sesion";
export type EstadoSesionEvento = "activa" | "pausa" | "fin";

export function emitirEstadoSesion(estado: EstadoSesionEvento) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<EstadoSesionEvento>(EVENTO_SESION, { detail: estado }));
}

/** Solo enlaces https a servicios de música conocidos (se abren en otra pestaña o en su app). */
export function esEnlacePlaylistValido(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return (
      u.protocol === "https:" &&
      /(^|\.)(spotify\.com|youtube\.com|youtu\.be|music\.apple\.com|deezer\.com|soundcloud\.com)$/.test(u.hostname)
    );
  } catch {
    return false;
  }
}
