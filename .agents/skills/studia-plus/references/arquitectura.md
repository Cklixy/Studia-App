# Arquitectura

## Stack

Next.js 14.2 (App Router, React 18, TypeScript) · Supabase (Postgres + Auth, `@supabase/ssr`) · Gemini (`@google/generative-ai`) · Tailwind 3 · `motion` · `zod` 4 + `xss` · `web-push` · `lru-cache` · Vercel (hosting + cron). Sin librería de componentes (no shadcn): los componentes son propios.

## Autenticación y clientes Supabase

- `src/utils/supabase/server.ts` → `createClient()` para Server Components, route handlers y server actions (cookies).
- `src/utils/supabase/client.ts` → cliente de navegador.
- `src/middleware.ts` → `updateSession` refresca la sesión en cada petición.
- `(dashboard)/layout.tsx` hace `getUser()` y redirige a `/login` si no hay usuario. Cada página y cada route handler vuelve a comprobarlo.
- Usa `getUser()` (valida el JWT) para autorizar; `getSession()` solo para obtener el access token (p. ej. para la caché).
- Service role solo en el cron (`api/cron/reminders`, protegido con `CRON_SECRET`).

## Modelo de datos (Postgres, RLS en todas las tablas)

Todas las tablas tienen `user_id → auth.users ON DELETE CASCADE` y políticas `auth.uid() = user_id` (con `(select auth.uid())` por rendimiento, migración 00012).

| Tabla | Qué guarda | Columnas clave |
|---|---|---|
| `materias` | Asignaturas | `nombre`, `descripcion`, `fecha_parcial` |
| `temas` | Temas de una materia | `materia_id`, `nombre`, `estado` (`pendiente`/`completado`…), `orden`, `dificultad`, `minutos_estimados`, `route_id`, `ai_generated` |
| `sesiones` | Sesiones de estudio | `materia_id`, `tema_id`, `contexto`, `metodo_recomendado/utilizado`, `duracion_planificada_minutos`, `hora_inicio/finalizacion`, `tiempo_efectivo_segundos`, `pausas_count`, `estado` (`activa`/`finalizada`), `resultado_logro` (`Sí`/`Parcialmente`/`No`), `calificacion_productividad` 1–5 |
| `evaluaciones` | Notas de parciales/quices por materia | (ver 00004) |
| `rachas` | Una fila por usuario | `dias`, `ultima_actividad`, `xp_total`, `nivel_actual` |
| `recompensas` | Logros | `descripcion`, `desbloqueado` |
| `study_routes` | Rutas generadas por IA | `title`, `estado` (`DRAFT`/`ACTIVE`/…), `materia_id` |
| `topic_dependencies` | Prerrequisitos entre temas | `tema_id`, `depende_de_tema_id` |
| `push_subscriptions` | Suscripciones Web Push | `endpoint`, `p256dh`, `auth` |

Migraciones en `supabase/migrations/000NN_descripcion_en_espanol.sql`, numeradas y aplicadas en producción; **nunca edites una ya aplicada**, crea una nueva. Funciones `SECURITY DEFINER` con `search_path` fijo y sin `EXECUTE` para `anon`.

## Lógica de dominio (`src/lib`)

- `racha.ts` — día local de Colombia (`fechaLocal`, `restarDias`), `calcularNuevaRacha`, `rachaVigente` (solo cuenta si la última actividad fue hoy o ayer), XP = 10 por minuto efectivo, nivel = ⌊√(XP/100)⌋ + 1.
- `siguientePaso.ts` — qué estudiar hoy: materia con el parcial más cercano (≤ 21 días), luego la más avanzada; dentro de ella el tema por `orden`, con una frase de motivo.
- Semana: `inicioSemanaLocal()` (lunes 00:00 en Colombia). Meta semanal en `user_metadata.meta_semanal_minutos` (sin migración).
- Fechas y horas mostradas desde el servidor: siempre con `ZONA_HORARIA` (`formatNaturalDate`, `formatearFechaLocal`); el servidor corre en UTC.
- `planParcial.ts` — plan hasta el parcial: días restantes, temas pendientes, temas por día (deja el día anterior para repasar).
- `recommendationEngine.ts` — recomendación de método por reglas (contexto + tipo de materia) como respaldo de la IA.
- `data/materias.ts` — `getCachedMaterias` (fetch a PostgREST con `next: { revalidate: 180, tags }`) y `revalidateMateriasCache(userId)`; llámala tras mutar materias/temas.
- `validations/*.ts` — esquemas Zod por recurso; los strings se pasan por `xss`.
- `texto.ts` — `plural`, `capitalizarInicio`. `format-session.ts` — formateo de duraciones.

## Rutas de API

Patrón de un route handler (ver `api/materias/route.ts`):

1. `createClient()` → `getUser()`; sin usuario → `401`.
2. `schema.parse(await request.json())`; `ZodError` → `400` con `error.issues`.
3. Consulta Supabase seleccionando columnas explícitas (no `*`).
4. `revalidateMateriasCache(user.id)` si cambian datos cacheados.
5. Respuesta `NextResponse.json(data, { status })`; mensajes de error al usuario en español.

Los componentes cliente llaman a estas APIs con `fetch`, muestran el error en un `role="alert"` y hacen `router.refresh()`.

## IA (Gemini)

- `src/lib/ai/gemini.ts`: modelo `MODELO_GEMINI` (env `GEMINI_MODEL`) y respaldo `MODELO_GEMINI_RESPALDO`; envuelve toda llamada en `conReintentoGemini()` (reintento + modelo de respaldo ante 429/500/503) y responde `RESPUESTA_IA_SATURADA` (503) si falla.
- Rutas: `api/ai/chat` (tutor por tema, rate limit 10/min con LRU), `api/ai/generar-ruta` (ruta de estudio), `api/sesiones/recomendacion` (método de estudio).
- El tutor responde en español, máx. 3 párrafos, fórmulas en Unicode (no LaTeX), solo negrita y listas; el cliente lo pinta de forma segura con `TextoTutor.tsx` (no uses `dangerouslySetInnerHTML`).
- La clave `GEMINI_API_KEY` solo se usa en el servidor.

## PWA, notificaciones y cron

- `public/manifest.json` + `public/sw.js` (push). `PushNotificationManager` (cliente, `ssr: false`) gestiona la suscripción.
- `vercel.json`: cron diario `0 20 * * *` (UTC = 15:00 Colombia) → `api/cron/reminders` avisa a quien no estudió hoy.

## Seguridad y rendimiento

- `next.config.mjs` define CSP estricta y cabeceras (HSTS, X-Frame-Options, Permissions-Policy). Si añades un origen externo, actualiza la CSP.
- `/`, `/login` y `/registro` son estáticas: no metas lecturas de cookies ahí.
- Páginas con sesión: `robots: noindex`. `lib/sitio.ts` lista rutas privadas para `robots.ts`/`sitemap.ts`.
- Componentes que dependen de `window`/`localStorage` se cargan con `dynamic(..., { ssr: false })`.
- Consultas del servidor en paralelo con `Promise.all`.

## Variables de entorno

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_MODEL_FALLBACK`, `CRON_SECRET`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `ALLOWED_PUSH_HOSTS`, `NEXT_PUBLIC_SITE_URL`. Están en `.env.local` (no versionado); nunca las imprimas ni las subas.

## Landing y SEO

- La home (`src/app/page.tsx`) es **estática** (○ en el build): no leas cookies ni la sesión en el servidor; los botones que dependen de la sesión usan `useHaySesion` en el cliente.
- Estructura en `components/landing/Secciones.tsx` (8 secciones, un solo `h1` en el hero, un `h2` por sección y sus puntos como `h3`). Los mockups (`Mockups.tsx`) son HTML decorativo (`aria-hidden`), sin encabezados y renderizados en el servidor; las piezas interactivas viven en `Interactivos.tsx`.
- Textos de SEO en `lib/sitio.ts` (`TITULO_HOME`, `DESCRIPCION_SITIO`); la home tiene su propia metadata y canonical. Las demás páginas ponen solo su nombre: la plantilla del layout añade «· studia+».
- JSON-LD en `components/landing/DatosEstructurados.tsx`. La FAQ sale de `lib/landing.ts` y la usan la sección visible y `FAQPage`: deben decir lo mismo. No anuncies funciones ni planes que no existan (el plan Pro se añade cuando se pueda comprar).
- Imagen para compartir: `app/opengraph-image.tsx` (runtime edge, fuentes Geist en `app/fuentes-og/`).
- Movimiento: `data-revelar` + `Revelador` (un solo IntersectionObserver, solo transform/opacity; el hero no se anima porque es el LCP).
