"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AudioLines,
  ChevronDown,
  CloudRain,
  ExternalLink,
  Headphones,
  Music2,
  Pause,
  Play,
  SkipForward,
  Volume1,
  Volume2,
  Waves,
  Wind,
} from "lucide-react";
import { AMBIENTES, esEnlacePlaylistValido, PISTAS_LOFI, uriSpotify, type AmbienteId, type Fuente } from "@/lib/ambientes";
import { fundido, resorte } from "@/lib/movimiento";
import { useReproductor } from "./ReproductorProvider";
import SpotifyMini from "./SpotifyMini";
import Ecualizador from "./Ecualizador";

const ICONOS_AMBIENTE: Record<AmbienteId, React.ElementType> = {
  lluvia: CloudRain,
  oleaje: Waves,
  "ruido-marron": AudioLines,
  "ruido-rosa": Wind,
};

const PESTANAS: { id: Fuente; nombre: string }[] = [
  { id: "ambiente", nombre: "Ambientes" },
  { id: "lofi", nombre: "Lo-fi" },
  { id: "spotify", nombre: "Spotify" },
];

/**
 * Sonido dentro de la tarjeta de enfoque (skill apple-design §16, agrupación): una fila compacta
 * «Sonando» bajo el temporizador que, al tocarla, hace crecer la propia tarjeta con las fuentes
 * (ambientes, lo-fi y Spotify), el volumen y las opciones. Nada flota aparte.
 */
export default function SonidoEnfoque() {
  const r = useReproductor();
  const reducido = useReducedMotion();
  const ids = useId();
  const [abierto, setAbierto] = useState(false);
  const [pestana, setPestana] = useState<Fuente>(r.fuente);
  const [borrador, setBorrador] = useState<string | null>(null);
  const [reproducirAlCargar, setReproducirAlCargar] = useState(false);

  const playlist = borrador ?? r.playlistUrl;
  const uri = uriSpotify(r.playlistUrl);
  const playlistValida = esEnlacePlaylistValido(playlist);
  const spotifyActivo = r.fuente === "spotify" && !!uri;
  const hayEleccion = r.fuente === "lofi" || (r.fuente === "ambiente" && !!r.ambiente) || spotifyActivo;

  const titulo = r.fuente === "lofi" ? r.pista.titulo : r.ambiente?.nombre ?? "";
  const subtitulo =
    r.fuente === "lofi" ? `Lo-fi · ${r.artistaLofi} · ${r.pistaIndice + 1} de ${PISTAS_LOFI.length}` : "Ambiente";
  const IconoActual = r.fuente === "lofi" ? Music2 : r.ambiente ? ICONOS_AMBIENTE[r.ambiente.id] : Music2;

  const usarPlaylist = () => {
    if (!playlistValida) return;
    r.cambiarPlaylistUrl(playlist);
    setBorrador(null);
    if (uriSpotify(playlist)) {
      setReproducirAlCargar(true);
      r.elegirSpotify();
      setAbierto(false);
    }
  };

  const transicion = reducido ? fundido : resorte;

  return (
    <motion.div layout={!reducido} transition={transicion} className="w-full" data-fuente={r.fuente} data-sonando={r.sonando}>
      {/* Fila «Sonando» */}
      {spotifyActivo ? (
        // El reproductor de Spotify necesita todo el ancho (si no, recorta sus controles)
        <div className="flex flex-col items-center gap-1">
          <SpotifyMini uri={uri!} reproducirAlCargar={reproducirAlCargar} />
          <BotonDesplegar abierto={abierto} onClick={() => setAbierto((v) => !v)} idPanel={`${ids}-panel`} />
        </div>
      ) : hayEleccion ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls={`${ids}-panel`}
            className="flex items-center gap-3 flex-1 min-w-0 min-h-12 -ml-1 pl-1 pr-2 rounded-2xl hover:bg-black/[0.03] transition-colors text-left"
          >
            <span
              aria-hidden="true"
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                r.sonando ? "bg-glacier-blue text-white" : "bg-glacier-blue/10 text-glacier-blue"
              }`}
            >
              <IconoActual size={18} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-sm font-semibold text-arctic-slate">
                <span className="truncate">{titulo}</span>
                <Ecualizador activo={r.sonando} className="text-glacier-blue shrink-0" />
              </span>
              <span className="block text-xs text-arctic-secondary truncate">
                {r.sonando ? subtitulo : `En pausa · ${subtitulo}`}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={r.alternar}
            aria-label={r.sonando ? `Pausar ${titulo}` : `Reproducir ${titulo}`}
            className="w-11 h-11 rounded-full flex items-center justify-center text-arctic-slate hover:bg-black/[0.05] apple-tactile shrink-0"
          >
            {r.sonando ? <Pause size={18} fill="currentColor" aria-hidden="true" /> : <Play size={18} fill="currentColor" aria-hidden="true" />}
          </button>
          {r.fuente === "lofi" && (
            <button
              type="button"
              onClick={r.siguiente}
              aria-label="Siguiente pista"
              className="w-11 h-11 rounded-full flex items-center justify-center text-arctic-slate hover:bg-black/[0.05] apple-tactile shrink-0"
            >
              <SkipForward size={18} fill="currentColor" aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls={`${ids}-panel`}
          className="w-full flex items-center justify-center gap-2 min-h-12 rounded-2xl text-sm font-semibold text-glacier-blue hover:bg-glacier-blue/[0.06] transition-colors apple-tactile"
        >
          <Headphones size={17} aria-hidden="true" />
          <span>Añadir sonido</span>
          <ChevronDown size={16} className={`transition-transform ${abierto ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}

      {/* Panel: la tarjeta crece hacia abajo y se pliega por el mismo camino */}
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            id={`${ids}-panel`}
            key="panel"
            initial={reducido ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reducido ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reducido ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={transicion}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-5">
              <div role="tablist" aria-label="Fuente de sonido" className="apple-segmented w-full">
                {PESTANAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    id={`${ids}-tab-${p.id}`}
                    aria-selected={pestana === p.id}
                    aria-controls={`${ids}-tabpanel`}
                    onClick={() => setPestana(p.id)}
                    className={`flex-1 min-h-11 rounded-[10px] text-sm font-medium transition-colors ${
                      pestana === p.id ? "bg-white text-arctic-slate shadow-apple-sm" : "text-arctic-secondary hover:text-arctic-slate"
                    }`}
                  >
                    {p.nombre}
                  </button>
                ))}
              </div>

              <div id={`${ids}-tabpanel`} role="tabpanel" aria-labelledby={`${ids}-tab-${pestana}`}>
                {pestana === "ambiente" && (
                  <div className="grid grid-cols-2 gap-2">
                    {AMBIENTES.map((a) => {
                      const Icono = ICONOS_AMBIENTE[a.id];
                      const activo = r.fuente === "ambiente" && r.sonando && r.ambiente?.id === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          aria-pressed={activo}
                          onClick={() => r.reproducirAmbiente(a.id)}
                          className={`flex items-center gap-2.5 min-h-12 px-3 py-2 rounded-2xl border text-left apple-tactile transition-colors ${
                            activo ? "bg-glacier-blue/[0.08] border-glacier-blue/40" : "bg-white border-black/[0.08] hover:bg-black/[0.03]"
                          }`}
                        >
                          <Icono size={17} className="text-glacier-blue shrink-0" aria-hidden="true" />
                          <span className="text-sm font-semibold text-arctic-slate">{a.nombre}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {pestana === "lofi" && (
                  <ol className="rounded-2xl border border-black/[0.08] bg-white divide-y divide-black/[0.06] overflow-hidden">
                    {PISTAS_LOFI.map((p, i) => {
                      const actual = r.fuente === "lofi" && r.pistaIndice === i;
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            aria-current={actual ? "true" : undefined}
                            onClick={() => r.reproducirLofi(i)}
                            className="w-full flex items-center gap-3 min-h-11 px-3.5 text-left hover:bg-black/[0.03] transition-colors"
                          >
                            <span className="w-5 text-xs tabular-nums text-arctic-secondary text-right shrink-0">
                              {actual ? <Ecualizador activo={r.sonando} className="text-glacier-blue" /> : i + 1}
                            </span>
                            <span className={`text-sm truncate ${actual ? "font-semibold text-glacier-blue" : "text-arctic-slate"}`}>
                              {p.titulo}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                )}

                {pestana === "spotify" && (
                  <div className="space-y-2">
                    <label htmlFor={`${ids}-playlist`} className="block text-sm font-medium text-arctic-slate">
                      Pega el enlace de tu playlist
                    </label>
                    <div className="flex gap-2">
                      <input
                        id={`${ids}-playlist`}
                        type="url"
                        inputMode="url"
                        placeholder="https://open.spotify.com/playlist/…"
                        value={playlist}
                        onChange={(e) => setBorrador(e.target.value)}
                        aria-invalid={playlist !== "" && !playlistValida}
                        aria-describedby={`${ids}-playlist-ayuda`}
                        className="flex-1 min-w-0 rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate"
                      />
                      {playlistValida && uriSpotify(playlist) ? (
                        <button type="button" onClick={usarPlaylist} className="btn-apple-primary text-sm min-h-11 px-4 apple-tactile shrink-0">
                          <Play size={15} fill="currentColor" aria-hidden="true" />
                          <span>Reproducir</span>
                        </button>
                      ) : playlistValida ? (
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
                      ) : null}
                    </div>
                    <p id={`${ids}-playlist-ayuda`} className="text-xs text-arctic-secondary">
                      {playlist !== "" && !playlistValida
                        ? "Pega un enlace https de Spotify, YouTube, Apple Music, Deezer o SoundCloud."
                        : "Spotify suena aquí mismo en un reproductor compacto: canciones completas si tienes sesión de Premium en este navegador; si no, avances de 30 s. Otros servicios se abren en su app y el temporizador sigue corriendo."}
                    </p>
                  </div>
                )}
              </div>

              {r.fuente !== "spotify" && (
                <div className="flex items-center gap-3">
                  <label htmlFor={`${ids}-volumen`} className="sr-only">
                    Volumen
                  </label>
                  <Volume1 size={16} className="text-arctic-secondary shrink-0" aria-hidden="true" />
                  <input
                    id={`${ids}-volumen`}
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
              )}

              <label htmlFor={`${ids}-pausar`} className="flex items-center justify-between gap-4 min-h-11 cursor-pointer">
                <span className="text-sm text-arctic-slate">Pausar el sonido cuando pauso la sesión</span>
                <input
                  id={`${ids}-pausar`}
                  type="checkbox"
                  role="switch"
                  checked={r.pausarConSesion}
                  onChange={(e) => r.cambiarPausarConSesion(e.target.checked)}
                  className="w-5 h-5 accent-glacier-blue shrink-0"
                />
              </label>

              {hayEleccion && (
                <button type="button" onClick={r.detener} className="btn-apple-ghost text-sm min-h-11 -ml-3 apple-tactile">
                  Silenciar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BotonDesplegar({ abierto, onClick, idPanel }: { abierto: boolean; onClick: () => void; idPanel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={abierto}
      aria-controls={idPanel}
      className="btn-apple-ghost text-sm min-h-11 apple-tactile"
    >
      <span>{abierto ? "Ocultar opciones" : "Cambiar sonido"}</span>
      <ChevronDown size={16} className={`transition-transform ${abierto ? "rotate-180" : ""}`} aria-hidden="true" />
    </button>
  );
}
