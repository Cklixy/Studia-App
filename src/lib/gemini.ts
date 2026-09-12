import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is available in your environment variables (.env.local)
// GEMINI_API_KEY=your_api_key_here
const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("GEMINI_API_KEY no está configurada en las variables de entorno.");
}

export const genAI = new GoogleGenerativeAI(apiKey);
