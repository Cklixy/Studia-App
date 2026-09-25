// Catálogo de sonido para estudiar (licencias en /public/audio/LICENCIAS.md).
// - Ambientes: generados con ffmpeg (ruido filtrado), bucles de 60 s, sin derechos de terceros.
// - Lo-fi: 8 pistas CC0 de HoliznaCC0 («Public Domain Lofi»), normalizadas a −20 LUFS, AAC 96 kbps.
// - Spotify: reproductor incrustado de Spotify con la playlist del usuario (no usa la Web API).

export type AmbienteId = "lluvia" | "oleaje" | "ruido-marron" | "ruido-rosa";
export type Fuente = "ambiente" | "lofi" | "spotify";

export interface Ambiente {
  id: AmbienteId;
  nombre: string;
  descripcion: string;
  src: string;
}

export interface PistaLofi {
  id: string;
  titulo: string;
  src: string;
}

export const AMBIENTES: Ambiente[] = [
  { id: "lluvia", nombre: "Lluvia", descripcion: "Lluvia suave y constante", src: "/audio/ambientes/lluvia.m4a" },
  { id: "oleaje", nombre: "Oleaje", descripcion: "Olas lentas, cada 10 s", src: "/audio/ambientes/oleaje.m4a" },
  { id: "ruido-marron", nombre: "Ruido marrón", descripcion: "Grave y envolvente", src: "/audio/ambientes/ruido-marron.m4a" },
  { id: "ruido-rosa", nombre: "Ruido rosa", descripcion: "Tapa voces y ruido de fondo", src: "/audio/ambientes/ruido-rosa.m4a" },
];

export const ARTISTA_LOFI = "HoliznaCC0";

export const PISTAS_LOFI: PistaLofi[] = [
  { id: "calm-currents", titulo: "Calm Currents", src: "/audio/lofi/calm-currents.m4a" },
  { id: "tokyo-sunset", titulo: "Tokyo Sunset", src: "/audio/lofi/tokyo-sunset.m4a" },
  { id: "still-life", titulo: "Still Life", src: "/audio/lofi/still-life.m4a" },
  { id: "down-time", titulo: "Down Time", src: "/audio/lofi/down-time.m4a" },
  { id: "birds", titulo: "Birds", src: "/audio/lofi/birds.m4a" },
  { id: "peaceful-drift", titulo: "Peaceful Drift", src: "/audio/lofi/peaceful-drift.m4a" },
  { id: "walking-away", titulo: "Walking Away", src: "/audio/lofi/walking-away.m4a" },
  { id: "waiting-around", titulo: "Waiting Around", src: "/audio/lofi/waiting-around.m4a" },
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

/**
 * Convierte un enlace de Spotify (open.spotify.com/…/playlist/ID?si=…) en su URI
 * (spotify:playlist:ID) para el reproductor incrustado. Admite playlist, álbum, pista, programa y
 * episodio; devuelve null para cualquier otra cosa.
 */
export function uriSpotify(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "https:" || u.hostname !== "open.spotify.com") return null;
    const partes = u.pathname.split("/").filter(Boolean).filter((p) => !p.startsWith("intl-"));
    const [tipo, id] = partes;
    if (!["playlist", "album", "track", "show", "episode"].includes(tipo) || !/^[A-Za-z0-9]{10,40}$/.test(id || "")) return null;
    return `spotify:${tipo}:${id}`;
  } catch {
    return null;
  }
}
