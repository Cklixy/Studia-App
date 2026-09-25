// Contenido compartido de la landing (plan de la landing, fase B).
// La FAQ la usan la sección visible y los datos estructurados (FAQPage): Google exige que el texto
// del JSON-LD coincida con lo que se ve en la página, así que ambos salen de aquí.
// Todo lo que se afirma aquí debe existir en la app: no se anuncian funciones ni planes futuros.

export const CTA_PRINCIPAL = "Crear mi cuenta gratis";
export const CTA_CON_SESION = "Ir a mis materias";
export const CTA_SECUNDARIO = "Ver cómo funciona";

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export const PREGUNTAS_FRECUENTES: PreguntaFrecuente[] = [
  {
    pregunta: "¿studia+ es gratis?",
    respuesta:
      "Sí. Puedes crear tus materias y temas, hacer sesiones de estudio y llevar tus notas y parciales gratis, sin tarjeta de crédito.",
  },
  {
    pregunta: "¿Funciona en el celular?",
    respuesta:
      "Sí. studia+ funciona en el navegador del celular y del computador, y puedes instalarla en la pantalla de inicio como una app. En iPhone: Compartir → Añadir a pantalla de inicio.",
  },
  {
    pregunta: "¿Qué técnicas de estudio recomienda?",
    respuesta:
      "Según tu tema y tu situación, studia+ te recomienda técnicas como Active Recall, el método Pomodoro, la técnica Feynman, la práctica espaciada, el método SQ3R o la práctica con ejercicios, y te da los pasos para aplicarla en la sesión.",
  },
  {
    pregunta: "¿Cómo me ayuda a preparar un parcial?",
    respuesta:
      "Con la fecha del parcial y tus temas pendientes, studia+ calcula cuántos temas estudiar por día y te deja el día anterior para repasar. Con tus notas y porcentajes, calcula cuánto necesitas sacar en lo que falta para aprobar.",
  },
  {
    pregunta: "¿Puedo escuchar música mientras estudio?",
    respuesta:
      "Sí. Durante la sesión puedes poner lluvia, oleaje, ruido de fondo, música lo-fi o tu playlist de Spotify, sin que el temporizador se desincronice. Con Spotify Premium y la sesión iniciada en el navegador suenan las canciones completas; si no, Spotify solo reproduce fragmentos.",
  },
  {
    pregunta: "¿Qué hace la IA con mis datos?",
    respuesta:
      "Para recomendarte un método, crear rutas de estudio y responder al tutor, studia+ envía a la IA el nombre de la materia, el tema y tu pregunta. Las conversaciones con el tutor no se guardan en tu cuenta, y desde Ajustes puedes exportar o eliminar todos tus datos.",
  },
];
