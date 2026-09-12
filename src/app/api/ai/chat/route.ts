import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message, temaNombre, materiaNombre, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "El mensaje es requerido" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ error: "Falta configurar GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: `Eres el tutor de studia+, un asistente académico experto y amigable.
      El estudiante está trabajando en el tema "${temaNombre}" de la materia "${materiaNombre}".
      Tu rol es: 
      - Explicar conceptos de forma clara y con ejemplos prácticos
      - Responder SOLO preguntas relacionadas con el tema académico
      - Ser conciso (máximo 3 párrafos por respuesta)
      - Si el tema es de ciencias exactas, puedes incluir fórmulas en texto plano
      - Hablar siempre en español
      - Si te preguntan algo no académico, redirigir amablemente al tema`
    });

    const chat = model.startChat({
      history: (history || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Error in AI Chat:", error);
    return NextResponse.json({ error: "Hubo un error procesando tu solicitud" }, { status: 500 });
  }
}
