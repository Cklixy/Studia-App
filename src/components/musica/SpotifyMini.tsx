"use client";

import { useEffect, useRef } from "react";
import { useReproductor } from "./ReproductorProvider";

// Reproductor compacto de Spotify (80 px) con la playlist del usuario, dentro de la tarjeta de enfoque.
// Usa el iFrame API de los embeds de Spotify (no la Web API): no requiere registrar la app ni
// OAuth y no tiene el límite de 5 usuarios del modo desarrollo. Spotify decide qué suena completo:
// con una sesión de Premium en el navegador suenan las canciones completas; si no, avances de 30 s.
// https://developer.spotify.com/documentation/embeds/references/iframe-api

const SCRIPT = "https://open.spotify.com/embed/iframe-api/v1";

type Controlador = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  addListener: (evento: string, fn: (e: { data: { isPaused?: boolean } }) => void) => void;
  destroy?: () => void;
};
type ApiSpotify = {
  createController: (
    el: HTMLElement,
    opciones: { uri: string; width?: string | number; height?: number },
    listo: (c: Controlador) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: ApiSpotify) => void;
    __studiaApiSpotify?: Promise<ApiSpotify>;
  }
}

/** Carga el script del iFrame API una sola vez por página. */
function cargarApi(): Promise<ApiSpotify> {
  if (!window.__studiaApiSpotify) {
    window.__studiaApiSpotify = new Promise((resolver) => {
      window.onSpotifyIframeApiReady = (api) => resolver(api);
      const s = document.createElement("script");
      s.src = SCRIPT;
      s.async = true;
      document.body.appendChild(s);
    });
  }
  return window.__studiaApiSpotify;
}

export default function SpotifyMini({ uri, reproducirAlCargar }: { uri: string; reproducirAlCargar: boolean }) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const controladorRef = useRef<Controlador | null>(null);
  const uriRef = useRef(uri);
  const { registrarSpotify, informarSpotify } = useReproductor();

  // Crear el reproductor una vez; el iFrame API reemplaza el elemento destino por un <iframe>
  useEffect(() => {
    let cancelado = false;
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    const destino = document.createElement("div");
    contenedor.appendChild(destino);

    cargarApi().then((api) => {
      if (cancelado) return;
      api.createController(destino, { uri: uriRef.current, width: "100%", height: 80 }, (c) => {
        if (cancelado) {
          c.destroy?.();
          return;
        }
        controladorRef.current = c;
        registrarSpotify(c);
        c.addListener("playback_update", (e) => informarSpotify(e.data.isPaused === false));
        // Viene de un toque en «Reproducir en Spotify»; Safari puede exigir tocar el propio reproductor
        if (reproducirAlCargar) c.addListener("ready", () => c.play());
      });
    });

    return () => {
      cancelado = true;
      controladorRef.current?.destroy?.();
      controladorRef.current = null;
      registrarSpotify(null);
      contenedor.replaceChildren();
    };
    // Solo al montar: los cambios de playlist se cargan con loadUri
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uri === uriRef.current) return;
    uriRef.current = uri;
    // El cambio de playlist viene de pulsar «Reproducir»: se carga y se reproduce
    const c = controladorRef.current;
    if (c) {
      c.loadUri(uri);
      c.play();
    }
  }, [uri]);

  return (
    <div
      ref={contenedorRef}
      className="w-full h-20 rounded-xl overflow-hidden bg-black/[0.04] [&_iframe]:block [&_iframe]:border-0"
      aria-label="Reproductor de Spotify"
    />
  );
}
