"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Send, Loader2, Sparkles, RotateCcw, Flag, Lightbulb, ListChecks, Baby } from "lucide-react";
import TextoTutor from "./TextoTutor";

interface ThemeChatProps {
  tema: any;
  materiaNombre: string;
  onClose: () => void;
}

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  /** Marcada por el estudiante como posiblemente incorrecta (solo en esta conversación) */
  dudosa?: boolean;
}

// Acciones rápidas (rediseño 4.4): son mensajes normales del estudiante; no cambian el prompt ni la API.
const ACCIONES = [
  { etiqueta: "Más simple", icono: Baby, texto: "Explícamelo más simple, como si fuera la primera vez que lo veo." },
  { etiqueta: "Dame un ejemplo", icono: Lightbulb, texto: "Dame un ejemplo resuelto paso a paso." },
  { etiqueta: "Hazme un quiz", icono: ListChecks, texto: "Hazme un quiz de 3 preguntas cortas sobre esto y espera mis respuestas antes de corregirlas." },
];

export default function ThemeChat({ tema, materiaNombre, onClose }: ThemeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  // Copia siempre actualizada: «¿Algo está mal?» marca un mensaje y envía otro en el mismo clic
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [montado, setMontado] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tituloId = useId();
  const inputId = useId();
  const avisoId = useId();
  // Ref para no volver a ejecutar el efecto del diálogo cuando el padre recrea onClose
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Diálogo modal: foco inicial, Escape, foco atrapado, scroll del fondo bloqueado
  // y devolución del foco al elemento que lo abrió.
  useEffect(() => {
    setMontado(true);
    const anterior = document.activeElement as HTMLElement | null;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 50);

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const enfocables = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (enfocables.length === 0) return;
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", alTeclear);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = overflowAnterior;
      anterior?.focus?.();
    };
  }, []);

  const enviar = useCallback(async (texto: string) => {
    const userMessage = texto.trim();
    if (!userMessage || loading) return;

    setInput("");
    setError("");

    const newMessages: Message[] = [
      ...messagesRef.current,
      { id: Date.now().toString(), role: "user", text: userMessage },
    ];
    messagesRef.current = newMessages;
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(-7, -1).map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          temaNombre: tema.nombre,
          materiaNombre: materiaNombre,
          history,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || "Error al enviar mensaje") as Error & { codigo?: string };
        err.codigo = data.codigo;
        throw err;
      }

      setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "model", text: data.response }]);
    } catch (err: any) {
      // Se quita la pregunta del historial y se devuelve al campo para poder reintentar sin reescribirla
      setMessages((m) => m.filter((x) => x.id !== newMessages[newMessages.length - 1].id));
      setInput(userMessage);
      setError(
        err.codigo === "IA_SATURADA"
          ? "La IA está saturada en este momento. Tu pregunta se conservó: reintenta en unos segundos."
          : res429(err.message)
            ? err.message
            : "No pudimos obtener respuesta. Revisa tu conexión y vuelve a intentarlo."
      );
    } finally {
      setLoading(false);
    }
  }, [loading, tema.nombre, materiaNombre]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(input);
  };

  if (!montado) return null;

  // Portal a <body>: dentro de una tarjeta con backdrop-filter, `position: fixed` quedaba
  // relativo a la tarjeta y el panel se pintaba fuera de la pantalla.
  return createPortal(
    <>
      {/* Fondo: en escritorio el panel ocupa solo la derecha; clic fuera = cerrar */}
      <div className="fixed inset-0 z-[60] bg-velo/40" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={avisoId}
        className="fixed inset-y-0 right-0 z-[61] w-full max-w-md bg-superficie border-l border-linea shadow-3 flex flex-col duration-300 motion-reduce:animate-none"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Cabecera */}
        <div className="p-4 border-b border-linea flex justify-between items-center gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-acento/10 text-acento flex items-center justify-center shrink-0" aria-hidden="true">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <h2 id={tituloId} className="encabezado">
                Tutor con IA
              </h2>
              <p className="text-sm text-tinta-2 truncate">{materiaNombre} · {tema.nombre}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar tutor"
            className="w-11 h-11 rounded-full bg-hundido hover:bg-hundido flex items-center justify-center text-tinta-2 hover:text-tinta transition-colors tactil shrink-0"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 && !loading && (
            <div className="my-auto p-2">
              <p className="titulo-3">¿Qué quieres saber de «{tema.nombre}»?</p>
              <p className="text-sm text-tinta-2 mt-1">Escribe tu duda o empieza con una de estas:</p>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  `Explícame «${tema.nombre}» en pocas palabras.`,
                  "Dame un ejercicio resuelto paso a paso.",
                  "Hazme un quiz de 3 preguntas cortas y espera mis respuestas.",
                ].map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => enviar(s)} className="tactil w-full rounded-2xl border border-linea bg-fondo px-4 py-3 text-left text-sm font-semibold text-tinta hover:border-linea-fuerte">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* role="log": el lector de pantalla anuncia cada mensaje nuevo sin interrumpir */}
          <div role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversación con el tutor" className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[88%] px-4 py-3 text-[0.9375rem] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-acento text-sobre-acento rounded-2xl rounded-br-md"
                      : `bg-hundido text-tinta rounded-2xl rounded-bl-md ${msg.dudosa ? "ring-2 ring-aviso" : ""}`
                  }`}
                >
                  <span className="sr-only">{msg.role === "user" ? "Tú: " : "Tutor: "}</span>
                  {msg.role === "model" ? <TextoTutor texto={msg.text} /> : msg.text}
                </div>
                {msg.role === "model" && (
                  <div className="mt-1.5 flex max-w-[88%] flex-col gap-1.5">
                    {msg.dudosa ? (
                      <p className="text-xs font-semibold text-aviso">Marcaste esta respuesta como dudosa. Compárala con tus apuntes o con tu profesor.</p>
                    ) : (
                      <p className="text-xs text-tinta-2">Respuesta generada por IA: puede tener errores.</p>
                    )}
                    {i === messages.length - 1 && !loading && (
                      <div className="flex flex-wrap gap-1.5">
                        {ACCIONES.map(({ etiqueta, icono: Icono, texto }) => (
                          <button key={etiqueta} type="button" onClick={() => enviar(texto)} className="tactil inline-flex min-h-11 items-center gap-1.5 rounded-full border border-linea-fuerte bg-superficie px-3 text-sm font-semibold text-tinta hover:bg-hundido">
                            <Icono aria-hidden="true" size={15} className="text-acento" />
                            {etiqueta}
                          </button>
                        ))}
                        {!msg.dudosa && (
                          <button
                            type="button"
                            onClick={() => {
                              const marcados = messagesRef.current.map((x) => (x.id === msg.id ? { ...x, dudosa: true } : x));
                              messagesRef.current = marcados;
                              setMessages(marcados);
                              enviar("Creo que tu respuesta anterior puede tener un error. ¿Puedes verificarla paso a paso y corregirla si hace falta?");
                            }}
                            className="tactil inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-tinta-2 hover:text-aviso"
                          >
                            <Flag aria-hidden="true" size={15} />
                            ¿Algo está mal?
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex justify-start" role="status">
              <div className="bg-hundido rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 text-sm text-tinta">
                <Loader2 size={13} className="animate-spin text-acento" aria-hidden="true" />
                <span>Pensando la respuesta…</span>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-xl bg-error-suave text-error p-3 text-sm space-y-2">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => enviar(input)}
                disabled={!input.trim() || loading}
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold underline underline-offset-2 disabled:opacity-50"
              >
                <RotateCcw size={12} aria-hidden="true" /> Reintentar
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Entrada */}
        <div className="p-3.5 border-t border-linea bg-superficie space-y-2">
          <p id={avisoId} className="text-xs text-tinta-2 text-center">
            La IA puede equivocarse: verifica fórmulas y resultados con tu material antes del parcial.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <label htmlFor={inputId} className="sr-only">
              Tu pregunta sobre {tema.nombre}
            </label>
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta lo que sea sobre este tema…"
              className="campo flex-1 min-w-0 rounded-full"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Enviar pregunta"
              className="w-12 h-12 rounded-full bg-acento text-sobre-acento flex items-center justify-center disabled:opacity-40 shrink-0 tactil"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}

// Los mensajes de límite de uso (429) ya vienen redactados para el usuario desde la API
function res429(mensaje: string) {
  return /límite/i.test(mensaje || "");
}
