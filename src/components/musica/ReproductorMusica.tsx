"use client";

import { useId, useState } from "react";
import { Music2, Pause, Play, ExternalLink, Volume1, Volume2 } from "lucide-react";
import Hoja from "@/components/ui/Hoja";
import { esEnlacePlaylistValido } from "@/lib/ambientes";
import { useReproductor } from "./ReproductorProvider";
import SelectorAmbientes from "./SelectorAmbientes";

/**
 * Píldora de vidrio flotante con el ambiente actual; al tocarla se abre la hoja con los ambientes,
 * el volumen y el enlace a la playlist propia. La hoja nace de la parte inferior, donde está la
 * píldora, y vuelve por el mismo camino.
 */
export default function ReproductorMusica() {
  const r = useReproductor();
  const [abierta, setAbierta] = useState(false);
  const idVolumen = useId();
  const idPlaylist = useId();
  const idPausar = useId();
  const [borrador, setBorrador] = useState<string | null>(null);
  const playlist = borrador ?? r.playlistUrl;
  const playlistValida = esEnlacePlaylistValido(playlist);

  return (
    <>
      <div className="apple-glass rounded-full flex items-center gap-1 p-1 pl-1.5 max-w-full">
        <button
          type="button"
          onClick={() => setAbierta(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-2.5 min-h-11 pl-1.5 pr-3 rounded-full hover:bg-black/[0.04] transition-colors apple-tactile min-w-0"
        >
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              r.sonando ? "bg-glacier-blue text-white" : "bg-glacier-blue/10 text-glacier-blue"
            }`}
          >
            <Music2 size={15} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-arctic-slate truncate">
            {r.sonando && r.ambiente ? r.ambiente.nombre : "Añadir sonido"}
          </span>
        </button>
        {r.ambiente && (
          <button
            type="button"
            onClick={r.alternar}
            aria-label={r.sonando ? `Pausar ${r.ambiente.nombre}` : `Reproducir ${r.ambiente.nombre}`}
            className="w-11 h-11 rounded-full flex items-center justify-center text-arctic-slate hover:bg-black/[0.05] transition-colors apple-tactile shrink-0"
          >
            {r.sonando ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
        )}
      </div>

      <Hoja
        abierto={abierta}
        onCerrar={() => setAbierta(false)}
        titulo="Sonido para concentrarte"
        descripcion="Suena de fondo sin afectar el temporizador."
      >
        <div className="space-y-6">
          <SelectorAmbientes />

          <div>
            <label htmlFor={idVolumen} className="block text-sm font-medium text-arctic-slate mb-2">
              Volumen
            </label>
            <div className="flex items-center gap-3">
              <Volume1 size={16} className="text-arctic-secondary shrink-0" aria-hidden="true" />
              <input
                id={idVolumen}
                type="range"
                min={0}
                max={100}
                value={Math.round(r.volumen * 100)}
                onChange={(e) => r.cambiarVolumen(Number(e.target.value) / 100)}
                aria-valuetext={`${Math.round(r.volumen * 100)} %`}
                className="flex-1 accent-glacier-blue h-11"
              />
              <Volume2 size={16} className="text-arctic-secondary shrink-0" aria-hidden="true" />
            </div>
          </div>

          <label htmlFor={idPausar} className="flex items-center justify-between gap-4 min-h-11 cursor-pointer">
            <span className="text-sm text-arctic-slate">Pausar el sonido cuando pauso la sesión</span>
            <input
              id={idPausar}
              type="checkbox"
              role="switch"
              checked={r.pausarConSesion}
              onChange={(e) => r.cambiarPausarConSesion(e.target.checked)}
              className="w-5 h-5 accent-glacier-blue shrink-0"
            />
          </label>

          <div className="pt-4 border-t border-black/[0.06]">
            <label htmlFor={idPlaylist} className="block text-sm font-medium text-arctic-slate mb-1.5">
              Tu playlist (Spotify, YouTube, Apple Music…)
            </label>
            <div className="flex gap-2">
              <input
                id={idPlaylist}
                type="url"
                inputMode="url"
                placeholder="https://open.spotify.com/playlist/…"
                value={playlist}
                onChange={(e) => setBorrador(e.target.value)}
                onBlur={() => {
                  if (borrador !== null && (borrador === "" || esEnlacePlaylistValido(borrador))) {
                    r.cambiarPlaylistUrl(borrador);
                    setBorrador(null);
                  }
                }}
                aria-invalid={playlist !== "" && !playlistValida}
                aria-describedby={`${idPlaylist}-ayuda`}
                className="flex-1 min-w-0 rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate"
              />
              {playlistValida && (
                <a
                  href={playlist}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => r.cambiarPlaylistUrl(playlist)}
                  className="btn-apple-secondary text-sm min-h-11 px-4 apple-tactile shrink-0"
                >
                  <ExternalLink size={15} aria-hidden="true" />
                  <span>Abrir</span>
                </a>
              )}
            </div>
            <p id={`${idPlaylist}-ayuda`} className="text-xs text-arctic-secondary mt-1.5">
              {playlist !== "" && !playlistValida
                ? "Pega un enlace https de Spotify, YouTube, Apple Music, Deezer o SoundCloud."
                : "Se abre en su app; el temporizador sigue corriendo aquí."}
            </p>
          </div>
        </div>
      </Hoja>
    </>
  );
}
