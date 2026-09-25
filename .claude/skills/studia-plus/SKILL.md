---
name: studia-plus
description: Contexto completo de studia+ (app de estudio para universitarios en Colombia): qué es el producto, arquitectura Next.js 14 + Supabase + Gemini, modelo de datos, sistema de diseño "Apple Frosted White", reglas de accesibilidad, tono de los textos en español y convenciones de código y commits. Cárgala ANTES de tocar cualquier cosa del proyecto Studia+ — pantallas, componentes, estilos, rutas de API, migraciones, IA o textos — o cuando necesites entender cómo está construida la app.
---

# studia+ — guía del proyecto

studia+ es una app web (PWA) que ayuda a estudiantes universitarios a **organizar lo que tienen que estudiar y a sentarse a estudiarlo**. El usuario crea materias con sus temas, fija la fecha del parcial, inicia sesiones de estudio cronometradas con un método recomendado, registra notas de evaluaciones y ve su progreso (racha, XP, niveles, logros). Un tutor con IA (Gemini) responde dudas por tema y la IA también genera rutas de estudio.

- Público: estudiantes en Colombia. **Todo en español** (UI, código de dominio, commits). Zona horaria `America/Bogota`, locale `es_CO`.
- Producción: Vercel (`https://studia-app-one.vercel.app`). Repo: `Cklixy/Studia-App`, rama `main`.
- El diseño actual (tema claro "Apple Frosted White") es **el aprobado**. Un rediseño alternativo (rama `rediseno`) fue rechazado por el autor por no ir acorde a la app: no importes su estética; extiende la existente.

## Lee según la tarea

| Vas a… | Lee |
|---|---|
| Crear o cambiar UI, estilos, animaciones, textos | [references/diseno.md](references/diseno.md) |
| Tocar rutas de API, datos, Supabase, IA, PWA | [references/arquitectura.md](references/arquitectura.md) |
| Escribir código o hacer commits | [references/convenciones.md](references/convenciones.md) |

Skills complementarias instaladas en el proyecto: `supabase` y `supabase-postgres-best-practices` (BD/migraciones/RLS), `gemini-api-dev` (IA), `nextjs-app-router-patterns`, `vercel-react-best-practices`, `web-design-guidelines` (auditar UI), `apple-design` y `review-animations` (movimiento). Si una de ellas contradice esta guía en temas de estilo del proyecto, **manda esta guía**.

## Mapa rápido

```
src/app/
  page.tsx                 landing pública (estática) + components/landing/*
  login, registro, recuperar, nueva-contrasena, auth/   autenticación Supabase
  (dashboard)/             zona con sesión (layout verifica usuario, header de vidrio + dock inferior)
    materias/              "Inicio": saludo, racha, plan de parciales, materias y temas
    materias/[id]/         detalle de materia (temas, evaluaciones, tutor)
    sesion/nueva → iniciar/[id] → activa/[id] → resumen/[id]   flujo de sesión de estudio
    evaluaciones/          "Parciales"
    historial/, logros/    "Progreso"
    rutas/ (crear, preview) rutas de estudio generadas con IA
    ajustes/               notificaciones, exportar datos, eliminar cuenta, cerrar sesión
  api/                     route handlers REST (materias, temas, sesiones, evaluaciones, rutas, ai/*, cron, cuenta)
src/components/            componentes (ui/Dialogo.tsx = modal base)
src/lib/                   dominio: racha.ts, planParcial.ts, recommendationEngine.ts, texto.ts, ai/gemini.ts, validations/*
src/utils/supabase/        clientes server / client / middleware
supabase/migrations/       SQL numerado 000NN_descripcion.sql
public/                    manifest.json, sw.js (push), iconos
```

## Reglas que no se negocian

1. **Español correcto** en toda la UI: tildes, `¿?`/`¡!`, plurales con `plural()` de `lib/texto.ts`. Nada de "1 días".
2. **Accesibilidad AA**: contraste ≥ 4.5:1 en texto, objetivos táctiles ≥ 44 px, `aria-*` en controles, respetar `prefers-reduced-motion`, `prefers-reduced-transparency` y `prefers-contrast`. La app ha pasado auditorías; no retrocedas.
3. **Usa los tokens y clases del sistema** (`apple-card`, `btn-apple-*`, `text-arctic-*`, `glacier-blue`…). No inventes paletas, fuentes ni radios nuevos.
4. **Seguridad**: siempre `supabase.auth.getUser()` en servidor, validar con Zod (+ `xss`) en cada POST/PATCH, RLS en toda tabla nueva, secretos solo en servidor.
5. **Fechas del día en hora de Colombia** con `fechaLocal()` de `lib/racha.ts`, nunca `new Date().toISOString().slice(0,10)`.
6. Mobile-first: se usa sobre todo en el celular (PWA). Verifica a 320–390 px y que el dock inferior no tape contenido ni el foco.
