"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Send, Loader2, Sparkles, MessageCircle, RotateCcw } from "lucide-react";
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
}

export default function ThemeChat({ tema, materiaNombre, onClose }: ThemeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
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
      ...messages,
      { id: Date.now().toString(), role: "user", text: userMessage },
    ];
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

      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "model", text: data.response }]);
    } catch (err: any) {
      // Se quita la pregunta del historial y se devuelve al campo para poder reintentar sin reescribirla
      setMessages(messages);
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
  }, [loading, messages, tema.nombre, materiaNombre]);

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
      <div className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={avisoId}
        className="fixed inset-y-0 right-0 z-[61] w-full max-w-md bg-white border-l border-black/[0.08] shadow-apple-lg flex flex-col duration-300 motion-reduce:animate-none"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Cabecera */}
        <div className="p-4 border-b border-black/[0.06] flex justify-between items-center gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center shrink-0" aria-hidden="true">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <h2 id={tituloId} className="font-semibold text-sm text-arctic-slate tracking-tight">
                Tutor IA
              </h2>
              <p className="text-xs text-arctic-secondary truncate">{tema.nombre}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar tutor"
            className="w-11 h-11 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 && !loading && (
            <div className="text-center text-arctic-secondary my-auto p-6">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center mx-auto mb-3 text-glacier-blue" aria-hidden="true">
                <MessageCircle size={22} />
              </div>
              <p className="text-sm font-semibold text-arctic-slate mb-1">¿Dudas sobre {tema.nombre}?</p>
              <p className="text-xs text-arctic-secondary max-w-xs mx-auto">
                Pregúntame para simplificar conceptos, pedir analogías o solicitar ejercicios resueltos paso a paso.
              </p>
            </div>
          )}

          {/* role="log": el lector de pantalla anuncia cada mensaje nuevo sin interrumpir */}
          <div role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversación con el tutor" className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-glacier-blue text-white rounded-2xl rounded-br-sm shadow-apple-sm"
                      : "bg-[#E9E9EB] text-arctic-slate rounded-2xl rounded-bl-sm"
                  }`}
                >
                  <span className="sr-only">{msg.role === "user" ? "Tú: " : "Tutor: "}</span>
                  {msg.role === "model" ? <TextoTutor texto={msg.text} /> : msg.text}
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex justify-start" role="status">
              <div className="bg-[#E9E9EB] rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2 text-xs text-arctic-slate">
                <Loader2 size={13} className="animate-spin text-glacier-blue" aria-hidden="true" />
                <span>Generando explicación…</span>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="border border-cool-berry/30 bg-cool-berry/10 text-cool-berry rounded-xl p-3 text-xs mx-2 my-1 space-y-2">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => enviar(input)}
                disabled={!input.trim() || loading}
                className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2 disabled:opacity-50"
              >
                <RotateCcw size={12} aria-hidden="true" /> Reintentar
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Entrada */}
        <div className="p-3.5 border-t border-black/[0.06] bg-white space-y-2">
          <p id={avisoId} className="text-xs text-arctic-secondary text-center">
            La IA puede equivocarse. Verifica fórmulas y resultados antes de tu parcial.
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
              className="flex-1 min-w-0 bg-frost-base border border-black/[0.12] rounded-full px-4 py-2.5 text-sm text-arctic-slate placeholder:text-arctic-secondary focus:outline-none focus:border-glacier-blue transition-all"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Enviar pregunta"
              className="w-11 h-11 rounded-full bg-glacier-blue text-white flex items-center justify-center disabled:opacity-40 shrink-0 apple-tactile shadow-apple-sm"
            >
              <Send size={15} aria-hidden="true" />
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
