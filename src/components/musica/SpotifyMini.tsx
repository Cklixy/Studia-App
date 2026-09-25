"use client";

import { useEffect, useRef } from "react";
import { useReproductor } from "./ReproductorProvider";

// Reproductor compacto de Spotify (80 px) con la playlist del usuario, dentro de la tarjeta de enfoque.
//
// Se incrusta el <iframe> del embed directamente y se habla con él por postMessage, con el mismo
// protocolo que usa el iFrame API oficial. No se carga el script del iFrame API porque usa eval(),
// que la CSP de producción bloquea (con él, el reproductor nunca aparecía en producción).
// Protocolo (iframe → página): { type: "ready" } y { type: "playback_update", payload: { isPaused } }.
// Protocolo (página → iframe): { command: "load_complete_ack" | "play" | "pause" | "resume" | "toggle" }.
// Spotify decide qué suena completo: con sesión de Premium en el navegador, canciones completas;
// si no, muestras cortas.

const ORIGEN = "https://open.spotify.com";

/** spotify:playlist:ID → https://open.spotify.com/embed/playlist/ID */
function urlEmbed(uri: string): string {
  const [, tipo, id] = uri.split(":");
  return `${ORIGEN}/embed/${tipo}/${id}?utm_source=iframe-api`;
}

export default function SpotifyMini({ uri, reproducirAlCargar }: { uri: string; reproducirAlCargar: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const reproducirRef = useRef(reproducirAlCargar);
  const { registrarSpotify, informarSpotify } = useReproductor();

  useEffect(() => {
    const enviar = (command: string) => iframeRef.current?.contentWindow?.postMessage({ command }, ORIGEN);

    registrarSpotify({
      pause: () => enviar("pause"),
      resume: () => enviar("resume"),
      togglePlay: () => enviar("toggle"),
    });

    const alMensaje = (e: MessageEvent) => {
      if (e.origin !== ORIGEN || e.source !== iframeRef.current?.contentWindow) return;
      const datos = e.data as { type?: string; payload?: { isPaused?: boolean } } | null;
      if (datos?.type === "ready") {
        enviar("load_complete_ack");
        // Viene de un toque en «Reproducir»; si el navegador lo bloquea, basta tocar ▶ en el reproductor
        if (reproducirRef.current) {
          reproducirRef.current = false;
          enviar("play");
        }
      } else if (datos?.type === "playback_update") {
        informarSpotify(datos.payload?.isPaused === false);
      }
    };

    window.addEventListener("message", alMensaje);
    return () => {
      window.removeEventListener("message", alMensaje);
      registrarSpotify(null);
    };
  }, [registrarSpotify, informarSpotify]);

  // Cambiar de playlist viene de pulsar «Reproducir»: se carga la nueva y se reproduce al estar lista
  const uriPrevio = useRef(uri);
  useEffect(() => {
    if (uri === uriPrevio.current) return;
    uriPrevio.current = uri;
    reproducirRef.current = true;
  }, [uri]);

  return (
    <iframe
      ref={iframeRef}
      key={uri}
      src={urlEmbed(uri)}
      title="Reproductor de Spotify"
      width="100%"
      height={80}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="block w-full h-20 rounded-xl border-0 bg-black/[0.04]"
    />
  );
}
