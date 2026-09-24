import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { conReintentoGemini, esErrorIaSaturada, RESPUESTA_IA_SATURADA } from "@/lib/ai/gemini";
import { createClient } from "@/utils/supabase/server";
import { LRUCache } from "lru-cache";

// A4: Rate limiter — máximo 10 mensajes por minuto por usuario
const rateLimitCache = new LRUCache<string, number[]>({
  max: 500,
  ttl: 1000 * 60, // 1 minuto TTL
});
const MAX_MESSAGES_PER_MINUTE = 10;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // A4: Rate limiting (ventana deslizante, mismo patrón que recomendacion)
    const userId = user.id;
    const now = Date.now();
    const windowStart = now - 60 * 1000;
    let userRequests = rateLimitCache.get(userId) || [];
    userRequests = userRequests.filter((ts) => ts > windowStart);
    if (userRequests.length >= MAX_MESSAGES_PER_MINUTE) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de mensajes por minuto. Inténtalo más tarde." },
        { status: 429 }
      );
    }
    userRequests.push(now);
    rateLimitCache.set(userId, userRequests);

    const { message, temaNombre, materiaNombre, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "El mensaje es requerido" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ error: "Falta configurar GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = `Eres el tutor de studia+, un asistente académico experto y amigable.
      El estudiante está trabajando en el tema "${temaNombre}" de la materia "${materiaNombre}".
      Tu rol es: 
      - Explicar conceptos de forma clara y con ejemplos prácticos
      - Responder SOLO preguntas relacionadas con el tema académico
      - Ser conciso (máximo 3 párrafos por respuesta)
      - Si el tema es de ciencias exactas, puedes incluir fórmulas en texto plano
      - Hablar siempre en español
      - Si te preguntan algo no académico, redirigir amablemente al tema`;

    const response = await conReintentoGemini(async (modelo) => {
      const model = genAI.getGenerativeModel({ model: modelo, systemInstruction });
      const chat = model.startChat({
        history: (history || []).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        }))
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    });

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Error in AI Chat:", error);
    if (esErrorIaSaturada(error)) return NextResponse.json(RESPUESTA_IA_SATURADA, { status: 503 });
    return NextResponse.json({ error: "No pudimos obtener respuesta del tutor." }, { status: 500 });
  }
}
