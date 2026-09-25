"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ambientePorId,
  ARTISTA_LOFI,
  EVENTO_SESION,
  PISTAS_LOFI,
  type Ambiente,
  type AmbienteId,
  type EstadoSesionEvento,
  type Fuente,
  type PistaLofi,
} from "@/lib/ambientes";

// Reproductor de sonido para estudiar.
// Vive en el layout del dashboard: los <audio> no se cortan al navegar entre pantallas.
// Es independiente del temporizador: la sesión solo emite eventos (EVENTO_SESION) y el reproductor
// decide si pausarse; el temporizador no sabe que existe.
// Nunca suena solo: empezar a reproducir siempre sale de un toque del usuario (así lo exige iOS).
// Tres fuentes: ambientes (bucle), lo-fi (lista con fundido cruzado) y Spotify (reproductor
// incrustado que se registra aquí para poder pausarlo con la sesión).

const CLAVE_PREFERENCIAS = "studia_musica_v1";
const FUNDIDO_MS = 400;
const CRUCE_MS = 2000;

interface Preferencias {
  fuente: Fuente;
  ambienteId: AmbienteId | null;
  pistaIndice: number;
  volumen: number; // 0–1
  pausarConSesion: boolean;
  playlistUrl: string;
}

const PREFERENCIAS_INICIALES: Preferencias = {
  fuente: "ambiente",
  ambienteId: null,
  pistaIndice: 0,
  volumen: 0.6,
  pausarConSesion: true,
  playlistUrl: "",
};

function leerPreferencias(): Preferencias {
  try {
    const crudo = localStorage.getItem(CLAVE_PREFERENCIAS);
    const p = crudo ? { ...PREFERENCIAS_INICIALES, ...JSON.parse(crudo) } : PREFERENCIAS_INICIALES;
    if (!["ambiente", "lofi", "spotify"].includes(p.fuente)) p.fuente = "ambiente";
    p.pistaIndice = Number.isInteger(p.pistaIndice) ? Math.abs(p.pistaIndice) % PISTAS_LOFI.length : 0;
    return p;
  } catch {
    return PREFERENCIAS_INICIALES;
  }
}

/** Lo mínimo del controlador del iFrame API de Spotify que se usa aquí. */
export interface ControladorSpotify {
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
}

interface ReproductorContexto {
  fuente: Fuente;
  ambiente: Ambiente | null;
  pista: PistaLofi;
  pistaIndice: number;
  artistaLofi: string;
  sonando: boolean;
  volumen: number;
  pausarConSesion: boolean;
  playlistUrl: string;
  /** Empieza (o cambia a) un ambiente. Llamar solo desde un gesto del usuario. */
  reproducirAmbiente: (id: AmbienteId) => void;
  /** Empieza la lista lo-fi (en `indice` o donde se quedó). */
  reproducirLofi: (indice?: number) => void;
  siguiente: () => void;
  elegirSpotify: () => void;
  alternar: () => void;
  detener: () => void;
  cambiarVolumen: (v: number) => void;
  cambiarPausarConSesion: (v: boolean) => void;
  cambiarPlaylistUrl: (url: string) => void;
  registrarSpotify: (c: ControladorSpotify | null) => void;
  informarSpotify: (sonando: boolean) => void;
}

const Contexto = createContext<ReproductorContexto | null>(null);

export function useReproductor() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useReproductor debe usarse dentro de ReproductorProvider");
  return ctx;
}

export default function ReproductorProvider({ children }: { children: React.ReactNode }) {
  // Dos <audio> para poder cruzar pistas lo-fi; `activoRef` indica cuál suena
  const audiosRef = useRef<[HTMLAudioElement, HTMLAudioElement] | null>(null);
  const activoRef = useRef(0);
  const fundidosRef = useRef<Map<HTMLAudioElement, number>>(new Map());
  const cruzandoRef = useRef(false);
  const pausadoPorSesionRef = useRef(false);
  const spotifyRef = useRef<ControladorSpotify | null>(null);
  const [prefs, setPrefs] = useState<Preferencias>(PREFERENCIAS_INICIALES);
  const [audioSonando, setAudioSonando] = useState(false);
  const [spotifySonando, setSpotifySonando] = useState(false);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const spotifySonandoRef = useRef(false);
  spotifySonandoRef.current = spotifySonando;

  useEffect(() => {
    setPrefs(leerPreferencias());
  }, []);

  const guardar = useCallback((cambios: Partial<Preferencias>) => {
    setPrefs((p) => {
      const nuevas = { ...p, ...cambios };
      prefsRef.current = nuevas;
      try {
        localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify(nuevas));
      } catch {
        // Modo privado: la preferencia dura lo que la pestaña
      }
      return nuevas;
    });
  }, []);

  const audios = useCallback(() => {
    if (!audiosRef.current) {
      const crear = () => {
        const a = new Audio();
        a.preload = "auto";
        a.addEventListener("play", () => setAudioSonando(true));
        a.addEventListener("pause", () => {
          const [x, y] = audiosRef.current!;
          setAudioSonando(!x.paused || !y.paused);
        });
        return a;
      };
      audiosRef.current = [crear(), crear()];
    }
    return audiosRef.current;
  }, []);

  const activo = useCallback(() => audios()[activoRef.current], [audios]);

  // Fundido de volumen de un <audio>. En iOS el volumen es de solo lectura: allí el cambio es inmediato.
  const fundir = useCallback((a: HTMLAudioElement, hasta: number, ms: number, alTerminar?: () => void) => {
    const previo = fundidosRef.current.get(a);
    if (previo) cancelAnimationFrame(previo);
    const desde = a.volume;
    const inicio = performance.now();
    const paso = (ahora: number) => {
      // La marca del primer cuadro puede ser anterior a `inicio`: t y el volumen se acotan a [0, 1]
      const t = Math.min(1, Math.max(0, (ahora - inicio) / ms));
      a.volume = Math.min(1, Math.max(0, desde + (hasta - desde) * t));
      if (t < 1) fundidosRef.current.set(a, requestAnimationFrame(paso));
      else {
        fundidosRef.current.delete(a);
        alTerminar?.();
      }
    };
    fundidosRef.current.set(a, requestAnimationFrame(paso));
  }, []);

  const pausarAudio = useCallback(() => {
    for (const a of audios()) if (!a.paused) fundir(a, 0, FUNDIDO_MS, () => a.pause());
  }, [audios, fundir]);

  /** Reproduce `src` en el <audio> activo, o cruzándolo con el otro si ya suena algo. */
  const sonar = useCallback(
    (src: string, { bucle, cruzar }: { bucle: boolean; cruzar: boolean }) => {
      const [a, b] = audios();
      const actual = activoRef.current === 0 ? a : b;
      const otro = activoRef.current === 0 ? b : a;
      const destino = cruzar && !actual.paused ? otro : actual;
      if (destino !== actual) activoRef.current = activoRef.current === 0 ? 1 : 0;
      else otro.pause();

      if (!destino.src.endsWith(src)) destino.src = src;
      destino.loop = bucle;
      destino.volume = 0;
      pausadoPorSesionRef.current = false;
      spotifyRef.current?.pause();
      destino
        .play()
        .then(() => {
          fundir(destino, prefsRef.current.volumen, destino === actual ? FUNDIDO_MS : CRUCE_MS);
          if (destino !== actual) {
            cruzandoRef.current = true;
            fundir(actual, 0, CRUCE_MS, () => {
              actual.pause();
              cruzandoRef.current = false;
            });
          }
        })
        .catch(() => setAudioSonando(false));
    },
    [audios, fundir]
  );

  const reproducirAmbiente = useCallback(
    (id: AmbienteId) => {
      const amb = ambientePorId(id);
      if (!amb) return;
      guardar({ fuente: "ambiente", ambienteId: id });
      sonar(amb.src, { bucle: true, cruzar: false });
    },
    [guardar, sonar]
  );

  const reproducirLofi = useCallback(
    (indice?: number) => {
      const i = ((indice ?? prefsRef.current.pistaIndice) + PISTAS_LOFI.length) % PISTAS_LOFI.length;
      const cruzar = prefsRef.current.fuente === "lofi" && indice !== undefined;
      guardar({ fuente: "lofi", pistaIndice: i });
      sonar(PISTAS_LOFI[i].src, { bucle: false, cruzar });
    },
    [guardar, sonar]
  );

  const siguiente = useCallback(() => {
    if (prefsRef.current.fuente !== "lofi") return;
    reproducirLofi(prefsRef.current.pistaIndice + 1);
  }, [reproducirLofi]);

  // Lo-fi: al acercarse el final de una pista, empieza la siguiente con fundido cruzado
  useEffect(() => {
    const [a, b] = audios();
    const alAvanzar = (e: Event) => {
      const el = e.target as HTMLAudioElement;
      if (prefsRef.current.fuente !== "lofi" || el !== activo() || cruzandoRef.current || el.paused) return;
      if (el.duration && el.duration - el.currentTime < CRUCE_MS / 1000) siguiente();
    };
    const alTerminar = (e: Event) => {
      if (prefsRef.current.fuente === "lofi" && e.target === activo() && !cruzandoRef.current) siguiente();
    };
    for (const el of [a, b]) {
      el.addEventListener("timeupdate", alAvanzar);
      el.addEventListener("ended", alTerminar);
    }
    return () => {
      for (const el of [a, b]) {
        el.removeEventListener("timeupdate", alAvanzar);
        el.removeEventListener("ended", alTerminar);
      }
    };
  }, [audios, activo, siguiente]);

  const elegirSpotify = useCallback(() => {
    pausarAudio();
    guardar({ fuente: "spotify" });
  }, [pausarAudio, guardar]);

  const alternar = useCallback(() => {
    const p = prefsRef.current;
    if (p.fuente === "spotify") {
      spotifyRef.current?.togglePlay();
      return;
    }
    const a = activo();
    if (!a.paused) {
      pausarAudio();
      return;
    }
    if (p.fuente === "lofi") reproducirLofi();
    else if (p.ambienteId) reproducirAmbiente(p.ambienteId);
  }, [activo, pausarAudio, reproducirLofi, reproducirAmbiente]);

  const detener = useCallback(() => {
    pausadoPorSesionRef.current = false;
    pausarAudio();
    spotifyRef.current?.pause();
  }, [pausarAudio]);

  const cambiarVolumen = useCallback(
    (v: number) => {
      const volumen = Math.min(1, Math.max(0, v));
      guardar({ volumen });
      // El deslizador responde 1:1, sin fundido (skill apple-design §1)
      const a = activo();
      const f = fundidosRef.current.get(a);
      if (f) cancelAnimationFrame(f);
      fundidosRef.current.delete(a);
      a.volume = volumen;
    },
    [guardar, activo]
  );

  const registrarSpotify = useCallback((c: ControladorSpotify | null) => {
    spotifyRef.current = c;
    if (!c) setSpotifySonando(false);
  }, []);

  const informarSpotify = useCallback(
    (s: boolean) => {
      setSpotifySonando(s);
      // Si Spotify empieza a sonar, se apaga el audio propio para que no se mezclen
      if (s) {
        pausarAudio();
        if (prefsRef.current.fuente !== "spotify") guardar({ fuente: "spotify" });
      }
    },
    [pausarAudio, guardar]
  );

  // La sesión avisa de pausa/reanudación; el sonido la acompaña si así lo prefiere el usuario
  useEffect(() => {
    const alCambiarSesion = (e: Event) => {
      const estado = (e as CustomEvent<EstadoSesionEvento>).detail;
      const p = prefsRef.current;
      if (!p.pausarConSesion) return;
      if (estado === "pausa") {
        if (p.fuente === "spotify" && spotifyRef.current && spotifySonandoRef.current) {
          pausadoPorSesionRef.current = true;
          spotifyRef.current.pause();
        } else if (!activo().paused) {
          pausadoPorSesionRef.current = true;
          pausarAudio();
        }
      } else if (estado === "activa" && pausadoPorSesionRef.current) {
        pausadoPorSesionRef.current = false;
        if (p.fuente === "spotify") spotifyRef.current?.resume();
        else if (p.fuente === "lofi") reproducirLofi();
        else if (p.ambienteId) reproducirAmbiente(p.ambienteId);
      }
    };
    window.addEventListener(EVENTO_SESION, alCambiarSesion);
    return () => window.removeEventListener(EVENTO_SESION, alCambiarSesion);
  }, [activo, pausarAudio, reproducirLofi, reproducirAmbiente]);

  // Controles en la pantalla de bloqueo y en los auriculares (Spotify gestiona los suyos)
  const ambiente = ambientePorId(prefs.ambienteId);
  const pista = PISTAS_LOFI[prefs.pistaIndice] ?? PISTAS_LOFI[0];
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    if (prefs.fuente === "spotify" || (prefs.fuente === "ambiente" && !ambiente)) {
      ms.setActionHandler("nexttrack", null);
      return;
    }
    ms.metadata = new MediaMetadata({
      title: prefs.fuente === "lofi" ? pista.titulo : ambiente!.nombre,
      artist: prefs.fuente === "lofi" ? `${ARTISTA_LOFI} · Lo-fi para estudiar` : "studia+ · Ambiente para estudiar",
      artwork: [{ src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }],
    });
    ms.setActionHandler("play", () => alternar());
    ms.setActionHandler("pause", () => pausarAudio());
    ms.setActionHandler("nexttrack", prefs.fuente === "lofi" ? () => siguiente() : null);
  }, [prefs.fuente, ambiente, pista, alternar, pausarAudio, siguiente]);

  // Al salir de la zona con sesión (cerrar sesión, landing) se detiene el sonido
  useEffect(() => {
    const fundidos = fundidosRef.current;
    return () => {
      audiosRef.current?.forEach((a) => a.pause());
      fundidos.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  const sonando = prefs.fuente === "spotify" ? spotifySonando : audioSonando;

  const valor = useMemo<ReproductorContexto>(
    () => ({
      fuente: prefs.fuente,
      ambiente,
      pista,
      pistaIndice: prefs.pistaIndice,
      artistaLofi: ARTISTA_LOFI,
      sonando,
      volumen: prefs.volumen,
      pausarConSesion: prefs.pausarConSesion,
      playlistUrl: prefs.playlistUrl,
      reproducirAmbiente,
      reproducirLofi,
      siguiente,
      elegirSpotify,
      alternar,
      detener,
      cambiarVolumen,
      cambiarPausarConSesion: (v) => guardar({ pausarConSesion: v }),
      cambiarPlaylistUrl: (url) => guardar({ playlistUrl: url.trim() }),
      registrarSpotify,
      informarSpotify,
    }),
    [
      prefs,
      ambiente,
      pista,
      sonando,
      reproducirAmbiente,
      reproducirLofi,
      siguiente,
      elegirSpotify,
      alternar,
      detener,
      cambiarVolumen,
      guardar,
      registrarSpotify,
      informarSpotify,
    ]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
