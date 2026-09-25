# 00 · Línea base del rediseño de studia+

- **Fecha:** 2026-09-24 (las capturas muestran «Viernes, 25 de septiembre» porque la app usa la hora de Colombia y la ejecución cruzó la medianoche UTC; no afecta a nada).
- **Rama:** `rediseno`, creada desde `mejoras-ux-a11y` (= `main` = `b92202e`). No se ha tocado código.
- **Medido contra:** producción `https://studia-app-one.vercel.app` (commit `816ec4e` en la app; `b92202e` solo añade SQL).
- **Cuenta:** la de prueba, en modo solo lectura: 0 filas en las 9 tablas. Por eso, las pantallas con sesión muestran **estados vacíos**. Para ver estados con datos hay capturas de la verificación anterior en `auditoria/capturas/flujos/verif-*` (Preview `cbdb065`, el mismo código).

## 0. Skills

| Skill pedida | ¿Disponible? | Uso |
|---|---|---|
| `frontend-design` | ❌ No instalada | En la Fase 1 la sustituyo por `ui-ux-pro-max` (catálogo de estilos, paletas y parejas tipográficas) y por criterio propio. No diré que usé `frontend-design`. |
| `web-design-guidelines` | ❌ No instalada | En las Fases 3 a 6 reviso con las reglas de `ui-ux-pro-max` (119 pautas de UX y accesibilidad), `apple-design`, axe-core y Lighthouse. Salida en formato archivo:línea. |
| `react-best-practices` | ✅ como `vercel-react-best-practices` | En las Fases 3 a 5, al escribir componentes. |
| `studia-design-system` | ❌ No existe | La creo en la Fase 2, en `.claude/skills/studia-design-system/`. |
| Otras útiles | `apple-design` (el estándar actual del proyecto), `ui-ux-pro-max`, `verification-before-completion` | `ui-ux-pro-max` trae scripts en Python y Python no está instalado. Leo directamente sus CSV, así que no hace falta instalar nada. |

**Herramientas** (fuera del repo, en el scratchpad): `playwright-core` + `axe-core` + `lighthouse` con el Chrome instalado. No añaden dependencias al proyecto.

## 1. Los 10 problemas que el rediseño debe resolver

Los hallazgos 🔴 y 🟠 de `auditoria/03-RESUMEN` **ya están corregidos y desplegados** (`auditoria/04-implementacion-ux-a11y.md`): tutor fuera de pantalla, temporizador, recuperación de contraseña, diálogos, etiquetas y demás. Por eso esta lista reúne lo que sigue abierto en la auditoría **más** lo que muestran hoy las capturas. Todo lo que queda es de diseño y estructura, no de funciones rotas.

| # | Problema | Evidencia | Origen | Sev. |
|---|---|---|---|---|
| 1 | **Inicio no es «Hoy».** Lo primero que ves es una racha a 0 y dos botones de igual peso («Crear ruta IA», «Nueva materia»). La siguiente mejor acción no destaca, y en 390×844 el botón del estado vacío queda **debajo del dock** al cargar. | `antes/inicio__390x844__claro.jpg` (el CTA está a la altura del dock, y=770–826) | nuevo, [VERIFICADO] en la captura | 🟠 |
| 2 | **Los CTA principales quedan tapados por el dock.** Pasa en «Generar ruta» (`/rutas/crear`) y en el estado vacío de Inicio. Falta reservar espacio inferior de forma sistemática. | `antes/rutas-crear__390x844__claro.jpg` | nuevo, [VERIFICADO] en la captura; falta comprobar que al hacer scroll quede libre | 🟠 |
| 3 | **Sin modo oscuro:** `prefers-color-scheme` se ignora. Pesa en una app que se usa de noche antes de un parcial. | Capturas `__oscuro` idénticas a las `__claro`; 0 usos de `dark:` en `src/` | D-11, [VERIFICADO] | 🟠 |
| 4 | **Estados vacíos sin acción o con un texto equivocado.** Parciales: «Crea una materia primero desde la sección principal», sin botón. Historial: «No hay sesiones que coincidan con los filtros», cuando nunca ha habido sesiones, y encima muestra «0 MIN · 0 % · Ninguno». | `antes/parciales__390x844`, `antes/progreso-historial__390x844` | nuevo, [VERIFICADO] | 🟠 |
| 5 | **Progreso que presiona desde el día 0.** «0 días», «+0 XP», «0 XP acumulados» y 6 insignias con candado es lo primero que ve alguien que acaba de registrarse. No hay día de gracia. | `antes/inicio__*`, `antes/progreso-logros__390x844` | U-13 (gracia pendiente) + principio 6 | 🟡 |
| 6 | **La landing es larga y le falta lo básico:** 8 998 px en móvil (≈ 10,7 pantallas) y 9 secciones de mockups con datos inventados. No tiene FAQ, no dice qué es gratis y no hay capturas reales ni prueba social. | `antes/landing__390x844__claro.jpg`, `src/app/page.tsx:1-13` | pedido en la Fase 3 + D-08 | 🟡 |
| 7 | **Iniciar una sesión cuesta 5 pasos**, y el primero («¿En qué nivel te encuentras?») se repite en cada sesión, aunque la respuesta casi nunca cambia. | `antes/sesion-nueva__390x844__claro.jpg`, `SessionWizard.tsx` | U-14 + principio 1 | 🟡 |
| 8 | **Nombres y encabezados incoherentes:** el dock dice «Parciales» y la página «Evaluaciones»; hay antetítulos dobles («GAMIFICACIÓN Y METAS / RECONOCIMIENTOS / Mis Logros»); «Inteligencia de Ruta» frente a «Crear ruta IA»; en `/rutas/crear` el dock marca «Inicio». Mayúsculas de título («Racha de Estudio», «Cerrar Sesión»). | capturas de `parciales`, `progreso-logros` y `rutas-crear` | D-10 + nuevo, [VERIFICADO] | 🟡 |
| 9 | **Deuda del sistema visual:** 31 opacidades distintas de negro y blanco para bordes y fondos, 17 sombras arbitrarias, 3 pares de tokens duplicados, ~80 usos de colores de Tailwind fuera de los tokens y 2 sistemas de botón. Consecuencia: no se puede tematizar (lo que bloquea el punto 3) y cada pantalla se ve «casi igual». | §3 de este documento | D-02/D-03 (sombras pendientes) | 🟡 |
| 10 | **Aspecto de plantilla genérica y densidad pequeña.** El estilo «Apple frost» es limpio pero impersonal. `text-xs` aparece 306 veces, frente a 143 de `text-sm`, así que la mayor parte de la interfaz se lee en 12 px. Ajustes: pestañas cortadas a 390 px («Privacida…»), un icono decorativo en el H1 y «Cerrar sesión» pintado como acción destructiva. | `antes/ajustes__390x844__claro.jpg`, inventario §3 | D-09 + nuevo | 🟡 |

También siguen abiertos y los recogen las fases correspondientes:
- tutor: indicación de confianza mejorable, 👍/👎 y reportar (U-10 parcial);
- 6 componentes de la landing sin usar (§3).

## 2. Capturas «antes»

Están en `rediseno/antes/`: **48 capturas**, 12 pantallas × 2 viewports (390×844 y 1440×900) × 2 esquemas (claro y oscuro), página completa, JPEG, 3,0 MB. El índice (URL final, número de H1, alto) está en `rediseno/antes/_indice.json`.

| Pantalla | Ruta | Alto 390 | Alto 1440 | H1 |
|---|---|---|---|---|
| Landing | `/` | 8 998 | 6 887 | 1 |
| Login / Registro / Recuperar / 404 | `/login`… | 844 | 900 | 1 |
| Inicio (vacío) | `/materias` | 1 212 | 900 | 1 |
| Nueva sesión (paso 1) | `/sesion/nueva` | 844 | 900 | 1 |
| Parciales (vacío) | `/evaluaciones` | 844 | 900 | 1 |
| Progreso · Historial (vacío) | `/historial` | 1 252 | 1 035 | 1 |
| Progreso · Logros | `/logros` | 1 666 | 1 326 | 1 |
| Ruta IA | `/rutas/crear` | 932 | 900 | 1 |
| Ajustes | `/ajustes` | 844 | 900 | 1 |

Notas:
- `/sesion/activa` sin sesión redirige a Inicio, y `/rutas` redirige a `/rutas/crear`. Borré esas capturas porque salían duplicadas.
- Detalle de materia, sesión activa, resumen y tutor necesitan datos. Su «antes» es `auditoria/capturas/flujos/verif-2-*`, `verif-3-*` y `verif-7-*`.
- En las capturas de página completa, el dock `fixed` aparece a media página. Es un efecto de la captura y no un fallo, salvo en los puntos 1 y 2, donde sí tapa el CTA en la primera vista.
- El tour de bienvenida se marcó como visto en el navegador de prueba (solo `localStorage`) para que no tapara las pantallas.

## 3. Inventario

### 3.1 Componentes (51 archivos `.tsx` en `src/components`)

| Grupo | Componentes | Observación |
|---|---|---|
| Base / UI | `ui/Dialogo`, `BrandLogo`, `MensajeAuth`, `auth/MarcoAuth`, `auth/CampoContrasena` | `Dialogo` es el único componente base real. No hay `Boton`, `Campo`, `Tarjeta`, `Chip`, `Toast` ni `EstadoVacio`: son clases CSS o se escriben a mano |
| Navegación | `SidebarNav` (dock), `NavProgreso` (selector Historial/Logros), `LandingNavbar` | Usan `motion` (con `OnboardingTour`, son los únicos 2 archivos que lo importan) |
| Materias y temas | `CreateMateriaModal`, `CreateMateriaForm`, `EditMateriaModal`, `CreateTemaForm`, `TemaItem`, `LearningMap`, `LearningMapItemActions`, `StudyTrailWidget` | |
| Sesión | `SessionWizard` (488 líneas, 5 pasos), `ActiveSessionTimer`, `TimerRing`, `TimerDisplay`, `SessionFeedbackForm` | |
| Parciales | `EvaluacionesPanel`, `EvaluacionesGlobal`, `TarjetaPlanParcial` | |
| Progreso | `StatsPanel`, `HistoryFilters` | |
| IA | `ThemeChat` (tutor), `TextoTutor` | |
| Otros | `OnboardingTour`, `PushNotificationManager` | |
| Landing (18) | 12 en uso | **6 sin uso**: `AiAssistanceSection`, `BentoFeatures`, `HeroInteractiveMockup`, `HeroPreviewCard`, `ProgressAndHabitsSection`, `WhyStudiaSection`, ≈ 600 líneas muertas (no afectan al bundle, pero sí al mantenimiento) |

Clases utilitarias en `globals.css`:
- botones: `btn-apple-primary` (31 usos, alias de `btn-action`, 5), `btn-apple-secondary` (14), `btn-apple-ghost` (6), `btn-apple-destructive` (4), **más 8 botones primarios escritos a mano** (`bg-glacier-blue … text-white`);
- tarjeta: `apple-card` (52);
- `apple-tactile` (68), `apple-glass`/`-ultra` y `apple-segmented`;
- tipografía: `apple-large-title`, `apple-title-2`/`-3`, `apple-headline`, `apple-body`, `apple-subhead`, `apple-caption`, `fluid-h1`/`-h2`. Se usan poco: 22 veces en total, frente a más de 600 tamaños sueltos de Tailwind.

### 3.2 Valores de estilo duplicados

Comandos `grep` sobre `src/` (salida en esta sesión):

| Dimensión | Hallazgo |
|---|---|
| **Colores de marca duplicados** | `glacier-blue` = `apple-blue` = `#0066CC`; `cool-berry` = `apple-red` = `#C10A2B`; `cool-amber` = `apple-orange` = `#F59E0B`; `ice-mint` = `apple-teal`. Definidos **dos veces**: en `tailwind.config.ts` y en `globals.css :root` |
| **Colores fuera de tokens** | ~80 usos de la paleta de Tailwind: `emerald-500/700/800`, `amber-500/600/700/800`, `red-500/600/700/800`, `sky-700`, `blue-500/600`, `cyan`, `violet`, `indigo`, `teal`, `rose`, `slate-200`. Además, 7 hex en TSX (`#0071E3` ×3, `#E9E9EB` ×2…) |
| **Grises por opacidad** | **31 variantes**: `border-black/[0.03 · 0.04 · 0.05 · 0.06 · 0.07 · 0.08 · 0.1 · 0.12 · 0.14]`, `border-black/20`, `bg-black/[0.02 … 0.24]`, `bg-white/60 · 70 · 80 · 85 · 90 · 95`… Solo `border-black/[0.06]` (49) y `/[0.08]` (33) dominan. No funcionan en modo oscuro |
| **Sombras** | 5 tokens `apple-*` (`sm`, 58 usos) + `shadow-sm` (6) + **17 sombras arbitrarias** `shadow-[…]` distintas |
| **Radios** | `rounded-full` (100), `xl` (80), `2xl` (51), `3xl` (27), `lg` (17), `4xl` (11), `md` (3) y sin sufijo (5): 8 valores |
| **Tamaños de texto** | `text-xs` 306 · `sm` 143 · `base` 39 · `lg` 21 · `xl` 25 · `2xl` 35 · `3xl` 22 · `4xl` 17 · `5xl` 10 · `6xl`–`9xl` 7 · `text-[13px]` 4 · `text-[15px]` 1. **13 tamaños** y escala tipográfica semántica casi sin uso |
| **Pesos** | `semibold` 165 · `bold` 134 · `medium` 75 · `normal` 3 · `extrabold` 1 |
| **Espaciado** | 25 valores de la escala (0 a 40); valores fuera de la rejilla de 4 px frecuentes: `0.5` (58), `1.5` (65), `2.5` (95), `3.5` (44) |
| **Tipografía** | 1 familia: Geist Sans (variable, vía `geist/font`). `font-display` apunta a `-apple-system`/SF Pro, así que en Windows y Android el «display» cambia según la plataforma |
| **Movimiento** | `motion` en 2 componentes; `--ease-apple-spring` definido; el resto son transiciones de Tailwind |

## 4. Rendimiento base (presupuesto del rediseño)

**[VERIFICADO] `npm run build`** en `rediseno` (= producción), First Load JS:

| Ruta | First Load JS |
|---|---|
| **`/` (landing)** | **107 kB** ← techo: no puede crecer |
| `/login`, `/registro`, `/nueva-contrasena` | 104 kB |
| `/materias` (Inicio) | 100 kB |
| `/materias/[id]` | 105 kB |
| `/sesion/activa/[id]` | 92 kB |
| Compartido por todas | 87,4 kB |

**[VERIFICADO] Lighthouse 12** contra producción, Chrome local sin sesión, mediana de 3 ejecuciones. Informes en `rediseno/antes/lighthouse/`.

| Página | Modo | Rend. | A11y | Buenas prácticas | SEO | LCP | CLS | TBT | JS transferido | Fuentes | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | móvil | 99 | 100 | 100 | 100 | 1,89 s | 0 | 45 ms | 164 KB | 68 KB | 308 KB |
| `/` | escritorio | 100 | 100 | 100 | 100 | 0,50 s | 0 | 0 ms | 166 KB | 68 KB | 313 KB |
| `/login` | móvil | 100 | 100 | 100 | 100 | 1,90 s | 0 | 0 ms | 165 KB | 68 KB | 308 KB |
| `/login` | escritorio | 100 | 100 | 100 | 100 | 0,50 s | 0 | 0 ms | 165 KB | 68 KB | 308 KB |

**Presupuesto que heredamos:** landing ≤ 107 kB de First Load JS, fuentes ≤ 68 KB, LCP móvil < 2,5 s (hoy 1,89 s), CLS 0. Si el rediseño añade una segunda familia tipográfica, tendrá que caber quitando pesos o *subsetting* (latin). No mido Lighthouse con sesión en esta fase: las pantallas vacías no son representativas.

«JS transferido» incluye lo que Next precarga para los enlaces visibles, por eso es mayor que el First Load. Las fuentes son Geist variable.

## 5. Qué necesito que decidas

1. **Datos de ejemplo para las capturas.** Para enseñar «Hoy», la sesión y los parciales **con contenido** en las fases 1 a 6 necesito datos. Propongo crear en la cuenta de prueba 2 materias, 5 temas, 1 parcial y 2 sesiones cortas, y **borrarlos al terminar** cada ronda de capturas, como en la auditoría. La alternativa es usar solo maquetas HTML con datos ficticios y los estados vacíos reales.
2. **¿Commiteo `rediseno/`?** El repo es público. Los documentos y maquetas no tienen secretos, pero las capturas de Ajustes muestran el correo de la cuenta de prueba. Propongo commitear los `.md` y las maquetas, y dejar las capturas fuera con `.gitignore`.
