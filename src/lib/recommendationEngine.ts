export type StudyContext =
  | "📝 Tengo un examen próximamente"
  | "📚 Necesito aprender un tema desde cero"
  | "🔄 Necesito repasar"
  | "🧠 Necesito memorizar información"
  | "✏️ Necesito practicar ejercicios"
  | "🧩 No entiendo el tema"
  | "⏱️ Tengo poco tiempo"
  | "📈 Quiero mejorar mi rendimiento"
  | "🎯 Preparación para parcial, quiz o evaluación"
  | "🔬 Necesito preparar un laboratorio o proyecto"
  | "📄 Necesito realizar una lectura o trabajo escrito";

export interface Recommendation {
  metodo: string;
  justificacion: string;
  pasos: string[];
}

export function getRecommendation(
  nivel: string,
  materia: string,
  contexto: StudyContext
): Recommendation {
  // Reglas fijas basadas en el contexto y palabras clave de la materia
  const isMath = /matemática|cálculo|álgebra|física|geometría|estadística|ecuaciones/i.test(materia);
  const isProgramming = /programación|algoritmos|datos|software|desarrollo/i.test(materia);
  const isReadingHeavy = /historia|filosofía|derecho|literatura|sociología/i.test(materia);

  if (contexto.includes("memorizar")) {
    return {
      metodo: "Active Recall + Flashcards",
      justificacion: "La evocación activa y la repetición espaciada son las formas comprobadas más efectivas para retener información pura.",
      pasos: [
        "Identifica los conceptos clave.",
        "Crea tarjetas con pregunta de un lado y respuesta del otro.",
        "Ponte a prueba sin mirar la respuesta.",
        "Repite enfocándote en las que fallaste."
      ]
    };
  }

  if (contexto.includes("ejercicios") || isMath) {
    return {
      metodo: "Práctica activa + Ejercicios progresivos",
      justificacion: "Las matemáticas y ciencias exactas se aprenden haciendo. La práctica progresiva construye memoria muscular.",
      pasos: [
        "Revisa brevemente la fórmula o concepto.",
        "Resuelve un ejercicio de ejemplo paso a paso.",
        "Intenta ejercicios similares sin ayuda.",
        "Aumenta la dificultad progresivamente."
      ]
    };
  }

  if (isProgramming) {
    return {
      metodo: "Aprendizaje basado en proyectos + Práctica activa",
      justificacion: "El código se interioriza mejor cuando se aplica para resolver un problema real.",
      pasos: [
        "Entiende el objetivo del concepto.",
        "Escribe un pequeño programa que lo implemente.",
        "Rompe el código intencionalmente para entender los errores.",
        "Intégralo en un proyecto un poco más grande."
      ]
    };
  }

  if (contexto.includes("examen") || contexto.includes("parcial")) {
    return {
      metodo: "Active Recall + Práctica Espaciada",
      justificacion: "Para los exámenes necesitas poder extraer la información de tu memoria rápidamente.",
      pasos: [
        "Haz un examen de prueba (mock exam) sin apuntes.",
        "Identifica tus lagunas de conocimiento.",
        "Repasa específicamente los temas donde fallaste.",
        "Vuelve a evaluarte."
      ]
    };
  }

  if (contexto.includes("No entiendo")) {
    return {
      metodo: "Técnica Feynman + Ejemplos guiados",
      justificacion: "Si no lo puedes explicar de forma sencilla, no lo entiendes lo suficiente.",
      pasos: [
        "Escribe el nombre del concepto.",
        "Explícalo en voz alta como si se lo enseñaras a un niño de 10 años.",
        "Identifica las partes donde te trabas.",
        "Vuelve al material original para llenar esos vacíos."
      ]
    };
  }

  if (contexto.includes("lectura") || isReadingHeavy) {
    return {
      metodo: "Método SQ3R + Active Recall",
      justificacion: "La lectura pasiva no retiene información. SQ3R te obliga a interactuar con el texto.",
      pasos: [
        "Explorar (Survey): Lee títulos y resúmenes.",
        "Preguntar (Question): Formula preguntas sobre lo que leerás.",
        "Leer (Read): Lee buscando responder tus preguntas.",
        "Recitar (Recite): Repite en voz alta lo aprendido.",
        "Repasar (Review): Revisa tus notas al final."
      ]
    };
  }

  if (contexto.includes("poco tiempo")) {
    return {
      metodo: "Pomodoro adaptado + Priorización",
      justificacion: "El tiempo limitado requiere alta intensidad y enfoque en lo más importante (Ley de Pareto).",
      pasos: [
        "Identifica el 20% del contenido que te dará el 80% de los resultados.",
        "Aplica 25 minutos de enfoque absoluto sin distracciones.",
        "Descansa 5 minutos.",
        "Repite hasta que se acabe tu tiempo."
      ]
    };
  }

  // Fallback
  return {
    metodo: "Técnica Pomodoro + Resumen",
    justificacion: "Un método equilibrado para mantener el enfoque y sintetizar información.",
    pasos: [
      "Estudia por 25 minutos enfocado.",
      "Toma 5 minutos de descanso.",
      "Al finalizar tus ciclos, haz un pequeño resumen de lo aprendido."
    ]
  };
}
