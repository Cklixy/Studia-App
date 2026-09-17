"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles, MessageCircle } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    
    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", text: userMessage }
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(-7, -1).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          temaNombre: tema.nombre,
          materiaNombre: materiaNombre,
          history
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar mensaje");

      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: "model", text: data.response }
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white/95 backdrop-blur-2xl border-l border-black/[0.08] shadow-apple-lg flex flex-col z-50 animate-in slide-in-from-right duration-300">
      
      {/* Header with Apple translucent chrome */}
      <div className="p-4 border-b border-black/[0.06] flex justify-between items-center bg-white/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-arctic-slate tracking-tight flex items-center gap-1.5">
              <span>Tutor IA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-glacier-blue animate-pulse" />
            </h3>
            <p className="text-[11px] text-arctic-secondary line-clamp-1">{tema.nombre}</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-7 h-7 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages area styled like Apple iMessage */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center text-arctic-secondary my-auto p-6">
            <div className="w-12 h-12 rounded-2xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center mx-auto mb-3 text-glacier-blue">
              <MessageCircle size={22} />
            </div>
            <p className="text-sm font-semibold text-arctic-slate mb-1">¿Dudas sobre {tema.nombre}?</p>
            <p className="text-xs text-arctic-secondary max-w-xs mx-auto">
              Pregúntame para simplificar conceptos, pedir analogías o solicitar ejercicios resueltos paso a paso.
            </p>
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 text-xs md:text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-glacier-blue text-white rounded-2xl rounded-br-sm shadow-apple-sm' 
                : 'bg-[#E9E9EB] text-arctic-slate rounded-2xl rounded-bl-sm whitespace-pre-wrap'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#E9E9EB] rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2 text-xs text-arctic-secondary">
              <Loader2 size={13} className="animate-spin text-glacier-blue" />
              <span>Generando explicación...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="border border-cool-berry/30 bg-cool-berry/10 text-cool-berry rounded-xl p-3 text-xs text-center mx-2 my-1">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3.5 border-t border-black/[0.06] bg-white/80">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pregunta lo que sea sobre este tema..."
            className="flex-1 bg-frost-base border border-black/[0.08] rounded-full px-4 py-2 text-xs text-arctic-slate placeholder:text-arctic-tertiary focus:outline-none focus:border-glacier-blue transition-all"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full bg-glacier-blue text-white flex items-center justify-center disabled:opacity-40 shrink-0 apple-tactile shadow-apple-sm"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
