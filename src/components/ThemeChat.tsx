"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";

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
      // Limit history to last 6 messages
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
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-deep-ink border-l border-white/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-deep-surface/50">
        <div>
          <h3 className="font-bold text-electric-periwinkle flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-periwinkle animate-pulse"></div>
            Tutor de studia+
          </h3>
          <p className="text-xs text-text-secondary line-clamp-1">{tema.nombre}</p>
        </div>
        <button onClick={onClose} className="p-2 text-text-secondary hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center text-text-secondary my-auto p-4">
            <p className="mb-2">¿Tienes alguna duda sobre <b>{tema.nombre}</b>?</p>
            <p className="text-xs">Pregúntame para aclarar conceptos o ver ejemplos.</p>
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-electric-periwinkle/20 border border-electric-periwinkle/30 text-white rounded-br-none' 
                : 'bg-white/5 border border-white/10 text-text-primary rounded-bl-none whitespace-pre-wrap'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 size={14} className="animate-spin" /> Pensando...
            </div>
          </div>
        )}
        {error && (
          <div className="border border-warm-coral/30 text-warm-coral bg-warm-coral/5 rounded-lg p-3 text-sm text-center mx-4 my-2">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-deep-surface/30">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu duda aquí..."
            className="flex-1 bg-deep-ink border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-electric-periwinkle transition-colors"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="btn-action p-2 px-3 rounded-lg flex items-center justify-center disabled:opacity-50 shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
