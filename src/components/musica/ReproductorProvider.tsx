"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ambientePorId,
  EVENTO_SESION,
  type Ambiente,
  type AmbienteId,
  type EstadoSesionEvento,
} from "@/lib/ambientes";

// Reproductor de ambientes para estudiar.
// Vive en el layout del dashboard: un único <audio> que no se corta al navegar entre pantallas
// (iniciar → sesión activa → resumen). Es independiente del temporizador: la sesión solo emite
// eventos (EVENTO_SESION) y el reproductor decide si pausarse; el temporizador no sabe que existe.
// Nunca suena solo: empezar a reproducir siempre sale de un toque del usuario (y así lo exige iOS).

const CLAVE_PREFERENCIAS = "studia_musica_v1";
const FUNDIDO_MS = 400;

interface Preferencias {
  ambienteId: AmbienteId | null;
  volumen: number; // 0–1
  pausarConSesion: boolean;
  playlistUrl: string;
}

const PREFERENCIAS_INICIALES: Preferencias = {
  ambienteId: null,
  volumen: 0.6,
  pausarConSesion: true,
  playlistUrl: "",
};

function leerPreferencias(): Preferencias {
  try {
    const crudo = localStorage.getItem(CLAVE_PREFERENCIAS);
    return crudo ? { ...PREFERENCIAS_INICIALES, ...JSON.parse(crudo) } : PREFERENCIAS_INICIALES;
  } catch {
    return PREFERENCIAS_INICIALES;
  }
}

interface ReproductorContexto {
  ambiente: Ambiente | null;
  sonando: boolean;
  volumen: number;
  pausarConSesion: boolean;
  playlistUrl: string;
  /** Empieza (o cambia a) un ambiente. Llamar solo desde un gesto del usuario. */
  reproducir: (id: AmbienteId) => void;
  alternar: () => void;
  detener: () => void;
  cambiarVolumen: (v: number) => void;
  cambiarPausarConSesion: (v: boolean) => void;
  cambiarPlaylistUrl: (url: string) => void;
}

const Contexto = createContext<ReproductorContexto | null>(null);

export function useReproductor() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useReproductor debe usarse dentro de ReproductorProvider");
  return ctx;
}

export default function ReproductorProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fundidoRef = useRef<number | null>(null);
  const pausadoPorSesionRef = useRef(false);
  const [prefs, setPrefs] = useState<Preferencias>(PREFERENCIAS_INICIALES);
  const [sonando, setSonando] = useState(false);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // Preferencias guardadas (solo en el cliente)
  useEffect(() => {
    setPrefs(leerPreferencias());
  }, []);

  const guardar = useCallback((cambios: Partial<Preferencias>) => {
    setPrefs((p) => {
      const nuevas = { ...p, ...cambios };
      try {
        localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify(nuevas));
      } catch {
        // Modo privado: la preferencia dura lo que la pestaña
      }
      return nuevas;
    });
  }, []);

  const obtenerAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop = true;
      a.preload = "auto";
      a.addEventListener("play", () => setSonando(true));
      a.addEventListener("pause", () => setSonando(false));
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  // Fundido de volumen para que el sonido no entre ni salga de golpe.
  // En iOS el volumen de <audio> es de solo lectura: allí el cambio es inmediato.
  const fundir = useCallback((hasta: number, alTerminar?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    if (fundidoRef.current) cancelAnimationFrame(fundidoRef.current);
    const desde = a.volume;
    const inicio = performance.now();
    const paso = (ahora: number) => {
      // La marca del primer cuadro puede ser anterior a `inicio`: t y el volumen se acotan a [0, 1]
      const t = Math.min(1, Math.max(0, (ahora - inicio) / FUNDIDO_MS));
      a.volume = Math.min(1, Math.max(0, desde + (hasta - desde) * t));
      if (t < 1) fundidoRef.current = requestAnimationFrame(paso);
      else {
        fundidoRef.current = null;
        alTerminar?.();
      }
    };
    fundidoRef.current = requestAnimationFrame(paso);
  }, []);

  const empezar = useCallback(
    (amb: Ambiente) => {
      const a = obtenerAudio();
      if (!a.src.endsWith(amb.src)) a.src = amb.src;
      a.volume = 0;
      pausadoPorSesionRef.current = false;
      a.play()
        .then(() => fundir(prefsRef.current.volumen))
        .catch(() => setSonando(false));
    },
    [obtenerAudio, fundir]
  );

  const pausar = useCallback(() => {
    const a = audioRef.current;
    if (!a || a.paused) return;
    fundir(0, () => a.pause());
  }, [fundir]);

  const reproducir = useCallback(
    (id: AmbienteId) => {
      const amb = ambientePorId(id);
      if (!amb) return;
      guardar({ ambienteId: id });
      empezar(amb);
    },
    [guardar, empezar]
  );

  const alternar = useCallback(() => {
    const amb = ambientePorId(prefsRef.current.ambienteId);
    if (!amb) return;
    if (audioRef.current && !audioRef.current.paused) pausar();
    else empezar(amb);
  }, [pausar, empezar]);

  const detener = useCallback(() => {
    pausadoPorSesionRef.current = false;
    pausar();
  }, [pausar]);

  const cambiarVolumen = useCallback(
    (v: number) => {
      const volumen = Math.min(1, Math.max(0, v));
      guardar({ volumen });
      // El deslizador responde 1:1, sin fundido (skill apple-design §1)
      if (fundidoRef.current) cancelAnimationFrame(fundidoRef.current);
      if (audioRef.current) audioRef.current.volume = volumen;
    },
    [guardar]
  );

  // La sesión avisa de pausa/reanudación; el reproductor la acompaña si así lo prefiere el usuario
  useEffect(() => {
    const alCambiarSesion = (e: Event) => {
      const estado = (e as CustomEvent<EstadoSesionEvento>).detail;
      const a = audioRef.current;
      if (!a || !prefsRef.current.pausarConSesion) return;
      if (estado === "pausa" && !a.paused) {
        pausadoPorSesionRef.current = true;
        pausar();
      } else if (estado === "activa" && pausadoPorSesionRef.current) {
        const amb = ambientePorId(prefsRef.current.ambienteId);
        if (amb) empezar(amb);
      }
    };
    window.addEventListener(EVENTO_SESION, alCambiarSesion);
    return () => window.removeEventListener(EVENTO_SESION, alCambiarSesion);
  }, [pausar, empezar]);

  // Controles en la pantalla de bloqueo y en los auriculares
  const ambiente = ambientePorId(prefs.ambienteId);
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !ambiente) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: ambiente.nombre,
      artist: "studia+ · Ambiente para estudiar",
      artwork: [{ src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }],
    });
    navigator.mediaSession.setActionHandler("play", () => empezar(ambiente));
    navigator.mediaSession.setActionHandler("pause", () => pausar());
  }, [ambiente, empezar, pausar]);

  // Al salir de la zona con sesión (cerrar sesión, landing) se detiene el sonido
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (fundidoRef.current) cancelAnimationFrame(fundidoRef.current);
    };
  }, []);

  const valor = useMemo<ReproductorContexto>(
    () => ({
      ambiente,
      sonando,
      volumen: prefs.volumen,
      pausarConSesion: prefs.pausarConSesion,
      playlistUrl: prefs.playlistUrl,
      reproducir,
      alternar,
      detener,
      cambiarVolumen,
      cambiarPausarConSesion: (v) => guardar({ pausarConSesion: v }),
      cambiarPlaylistUrl: (url) => guardar({ playlistUrl: url.trim() }),
    }),
    [ambiente, sonando, prefs, reproducir, alternar, detener, cambiarVolumen, guardar]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
