import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";
import { LRUCache } from "lru-cache";

// Rate limiter: máximo 3 rutas por usuario por hora
const rateLimitCache = new LRUCache<string, number[]>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hora TTL
});
const MAX_ROUTES_PER_HOUR = 3;

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Rate limiting
    const userId = user.id;
    const now = Date.now();
    const windowStart = now - 60 * 60 * 1000; // 1 hora
    let userRequests = rateLimitCache.get(userId) || [];
    userRequests = userRequests.filter(ts => ts > windowStart);
    if (userRequests.length >= MAX_ROUTES_PER_HOUR) {
      return NextResponse.json(
        { error: `Has alcanzado el límite de ${MAX_ROUTES_PER_HOUR} rutas por hora. Inténtalo más tarde.` },
        { status: 429 }
      );
    }
    userRequests.push(now);
    rateLimitCache.set(userId, userRequests);

    const body = await request.json();
    const { prompt, nivelEducativo, objetivo, tiempoDiario } = body;

    if (!prompt) {
      return NextResponse.json({ error: "El prompt es obligatorio" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ error: "La API Key de Gemini no está configurada en .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Definir el esquema JSON esperado (Structured Outputs)
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        materia: {
          type: SchemaType.STRING,
          description: "Nombre general de la materia (ej. 'Cálculo Diferencial', 'Historia del Arte')",
        },
        titulo_ruta: {
          type: SchemaType.STRING,
          description: "Un título inspirador para esta ruta de aprendizaje",
        },
        temas: {
          type: SchemaType.ARRAY,
          description: "Lista secuencial de temas a estudiar, desde fundamentos hasta práctica",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              nombre: { type: SchemaType.STRING, description: "Nombre del tema o concepto" },
              descripcion: { type: SchemaType.STRING, description: "Breve descripción de lo que se aprenderá en este tema" },
              dificultad: { type: SchemaType.STRING, description: "Dificultad del tema: 'Básica', 'Intermedia' o 'Avanzada'" },
              minutos_estimados: { type: SchemaType.INTEGER, description: "Tiempo estimado en minutos para aprender y practicar este tema" },
            },
            required: ["nombre", "descripcion", "dificultad", "minutos_estimados"],
          },
        },
      },
      required: ["materia", "titulo_ruta", "temas"],
    };

    // Usar el modelo actualizado de Gemini (3.6-flash o posterior)
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
      },
    });

    const systemInstruction = `
      Eres el motor de inteligencia de "studia+", un Sistema de Navegación Académica.
      Tu objetivo es convertir una petición abierta del usuario en una ruta de estudio perfectamente estructurada.
      Considera lo siguiente:
      - Nivel educativo: ${nivelEducativo || "No especificado"}
      - Objetivo: ${objetivo || "Aprender"}
      - Tiempo diario disponible: ${tiempoDiario || "No especificado"}
      
      Reglas:
      1. Genera una lista de temas hiper-específicos y granulares (por ejemplo, en lugar de un tema general de "Límites", desglósalo en "Límites laterales", "Límites al infinito", "Indeterminaciones", etc).
      2. Orden lógico estricto: Fundamentos -> Conceptos Intermedios -> Práctica -> Avanzado.
      3. No devuelvas más de 12 temas, pero asegúrate de que sean lo suficientemente detallados y accionables.
      4. Ajusta los minutos_estimados basándote en la complejidad real del tema específico.
      5. Todo debe estar en español.
    `;

    const result = await model.generateContent(
      `${systemInstruction}\n\nPetición del usuario: "${prompt}"`
    );

    const textResponse = result.response.text();
    const routeData = JSON.parse(textResponse);

    return NextResponse.json(routeData);
  } catch (error: any) {
    console.error("Error al generar ruta con IA:", error);
    return NextResponse.json({ error: error.message || "Error al conectar con la IA." }, { status: 500 });
  }
}
