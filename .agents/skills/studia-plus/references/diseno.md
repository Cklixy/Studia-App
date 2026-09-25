# Sistema de diseño — "Apple Frosted White"

Estética inspirada en iOS/macOS: fondo gris azulado muy claro, tarjetas de vidrio blanco translúcido, un solo azul de acento, tipografía con tracking negativo, esquinas redondeadas generosas, sombras suaves y frías, movimiento con resortes. **Solo tema claro, siempre** (decisión del autor: nunca modo oscuro, ni completo ni parcial, tampoco en la sesión activa; los tokens del oscuro se eliminaron a propósito). Si una guía sugiere oscurecer para enfocar, logra el efecto dentro de la paleta clara. Tranquilo, limpio, sin estridencias: es una app para concentrarse.

Fuentes de verdad: `tailwind.config.ts` y `src/app/globals.css`. Si necesitas algo nuevo, añádelo ahí como token, no como valor suelto.

## Color

| Rol | Token Tailwind | Valor | Uso |
|---|---|---|---|
| Fondo de la app | `bg-frost-base` | `#F4F6FB` | `body`, layouts. Con degradados radiales sutiles (ya en `body`). |
| Superficie tarjeta | `apple-card` / `bg-white` | blanco 78 % + blur | Tarjetas y paneles. Los diálogos usan `bg-white` opaco. |
| Texto principal | `text-arctic-slate` | `#1D1D1F` | Títulos y cuerpo. |
| Texto secundario | `text-arctic-secondary` | `#636366` | Descripciones, metadatos. |
| Texto terciario | `text-arctic-tertiary` | `#6E6E73` | Captions. No bajar de este gris (contraste AA). |
| Borde de campos | `border-arctic-borde` | `#8A8A8E` | Inputs (3.5:1, WCAG 1.4.11). |
| Bordes sutiles | `border-black/[0.06]`–`[0.08]` | | Separadores y tarjetas. |
| **Acento / acción** | `glacier-blue` (= `apple-blue`) | `#0066CC` | Botón primario, pestaña activa del dock, foco, enlaces, anillos de progreso. |
| Secundarios fríos | `polar-cyan` `#0EA5E9`, `ice-mint` `#06B6D4`, `cool-iris` `#4F46E5` | | Degradados de progreso, iconos, detalles. Con moderación. |
| Error / racha | `cool-berry` (= `apple-red`) | `#C10A2B` | Errores (`bg-cool-berry/10 border-cool-berry/20 text-cool-berry`), llama de la racha. |
| Aviso | `cool-amber` | `#F59E0B` | Solo fondos/iconos; para **texto** ámbar usa `text-amber-700`. |
| Éxito | `apple-green` / `emerald-500` | | Fondos e iconos; para texto `text-emerald-700`. |

Reglas: un único color de acción (azul). Colores de Tailwind por defecto solo en tonos que pasen AA como texto (`*-700`). No uses negro puro, morados neón ni degradados llamativos de fondo.

## Tipografía

Fuente: Geist Sans (`font-sans`, variable `--font-geist-sans`) con fallback al sistema Apple. `body` lleva `letter-spacing: -0.01em` y antialiasing.

Clases semánticas en `globals.css` — úsalas en lugar de armar tamaños a mano:

| Clase | Tamaño | Uso |
|---|---|---|
| `apple-large-title` | clamp(1.75–2.25rem), 700, -0.035em | `h1` de cada pantalla |
| `apple-title-2` | 1.35rem, 600 | Títulos de sección |
| `apple-title-3` | 1.15rem, 600 | Títulos de tarjeta y de diálogo |
| `apple-headline` | 0.9375rem, 600 | Encabezados pequeños |
| `apple-body` | 0.9375rem | Texto |
| `apple-subhead` | 0.8125rem, gris | Texto secundario |
| `apple-caption` | 0.6875rem, 600, MAYÚSCULAS, tracking +0.04em | Etiquetas pequeñas |

En Tailwind lo habitual es `text-xs`/`text-sm` para UI densa. **Mínimo 12 px** (`text-xs`); no uses `text-[10px]`/`text-[11px]` para texto informativo. Inputs con `text-base` (evita el zoom de iOS). Un solo `h1` por pantalla, encabezados en orden.

## Forma, sombra, profundidad

- Radios: `rounded-full` (botones, pastillas), `rounded-xl` (inputs, avisos), `rounded-2xl` = 16 px (diálogos, ítems), `rounded-3xl` = 22 px (dock), `.apple-card` = 20 px. `rounded-4xl` = 28 px para contenedores grandes.
- Sombras frías y difusas: `shadow-apple-sm|md|lg`, `shadow-apple-glow` para el elemento activo azul. Nunca sombras negras duras.
- Vidrio: `apple-glass` (hojas), `apple-glass-ultra` (header), `apple-card` (tarjetas, con hover que resalta borde azul). **Ojo:** `backdrop-filter` rompe `position: fixed` de los hijos → los modales van en portal (ver `Dialogo`).

## Componentes y patrones

- **Botones**: `btn-apple-primary` (azul, pastilla, sombra azul), `btn-apple-secondary` (gris translúcido), `btn-apple-ghost` (texto), `btn-apple-destructive` (rojo suave). Añade `apple-tactile` (escala 0.97 al pulsar) y `min-h-11`. Iconos lucide a 14–18 px con `gap-2`.
- **Inputs**: `w-full rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate`. Siempre con `<label htmlFor>`; obligatorio con `*` `aria-hidden`.
- **Errores**: `<div role="alert" className="p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-sm">`.
- **Hojas inferiores**: `components/ui/Hoja.tsx` (bottom sheet sobre `<dialog>`, se arrastra hacia abajo para cerrar) para confirmaciones rápidas y paneles como el de música.
- **Modales**: usa siempre `components/ui/Dialogo.tsx` (`<dialog>` nativo + portal, `tono="peligro"` para destructivos, `data-autofocus` en el campo principal). No crees modales propios.
- **Navegación**: dock flotante inferior (`SidebarNav.tsx`) con 5 destinos con etiqueta visible: Inicio, Estudiar, Parciales, Progreso, Ajustes. No añadas un sexto; los destinos nuevos cuelgan de uno existente (p. ej. Logros dentro de Progreso). El `main` lleva `pb-32+` para que el dock no tape nada.
- **Header**: vidrio `apple-glass-ultra`, sticky, 64/72 px, solo logo.
- **Cabecera de pantalla**: usa siempre `components/ui/EncabezadoPantalla.tsx` (`etiqueta`, `titulo`, `descripcion`, `acciones`, `junto`, `centrado`). No armes `h1` a mano ni pongas línea divisoria debajo.
- **Fechas AAAA-MM-DD** (p. ej. `fecha_parcial`): `formatearFechaLocal()` de `lib/texto.ts`; `new Date('AAAA-MM-DD')` muestra el día anterior en Colombia.
- **Iconos**: `lucide-react`, `strokeWidth={2}`, `aria-hidden="true"` si son decorativos. Iconos de materias en `lib/subject-icons.tsx`.
- **Carga**: `apple-shimmer` para esqueletos; `loading.tsx` en español.
- **Estados vacíos**: uno solo por pantalla, con texto que diga qué hacer y un botón.
- Layout: contenedor `max-w-[1280px]`, `px-3 sm:px-6 lg:px-10`, rejillas que colapsan a una columna en móvil, `gap-4 sm:gap-5`, secciones con `gap-9`.

## Movimiento

- Librería: `motion` (`import { motion, useReducedMotion } from "motion/react"`), no `framer-motion`.
- Transiciones de la casa en `lib/movimiento.ts`: `resorte` (bounce 0, 0,4 s) por defecto, `resorteHoja` solo para hojas arrastrables, `fundido` para movimiento reducido. Entradas con `components/ui/Aparecer.tsx` y listas con `components/ui/ListaEscalonada.tsx`.
- Sin animaciones en bucle (`animate-pulse`) salvo en esqueletos de carga.
- Resortes (`type: "spring", damping ~28, stiffness ~380`) para cambios de posición; CSS `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-apple-spring`) de 120–200 ms para hover/pulsación.
- Siempre respeta reduced motion (`useReducedMotion()` → sin `layoutId` y `duration: 0`); el CSS global ya anula animaciones.
- Animaciones cortas y con propósito (feedback, continuidad). Nada de rebotes largos, parallax ni animaciones en bucle salvo el shimmer.

- **Sonido**: vive en `components/musica/`. `ReproductorProvider` (layout del dashboard) maneja tres fuentes: ambientes (bucle), lo-fi CC0 (lista con fundido cruzado de 2 s) y Spotify (reproductor compacto del iFrame API, `SpotifyMini`, que se registra en el proveedor). En la sesión, todo el sonido va dentro de la tarjeta de enfoque (`SonidoEnfoque`), nunca flotando aparte. Nunca suena solo; la sesión solo emite `emitirEstadoSesion()`. Licencias en `public/audio/LICENCIAS.md`: solo CC0 o dominio público.
- **Modo concentración**: la sesión activa pone `data-enfoque` en `<body>` y oculta header y dock (`.ocultar-en-enfoque`); sigue en tema claro.

## Voz y textos

- Tuteo, cercano y motivador pero sin presión ni culpa ("Una sesión hoy empieza una nueva racha", no "¡Perdiste tu racha!").
- Frases cortas y concretas; botones con verbo ("Crear materia", "Empezar sesión").
- Fechas con `Intl.DateTimeFormat("es-ES", …)` + `capitalizarInicio()`. Plurales con `plural()`.
- Emojis: solo donde ya existen (contextos de estudio del asistente de sesión); no los añadas a la UI general.

## Antes de dar por terminado un cambio visual

- [ ] Se ve bien a 320 px, 390 px y escritorio; sin scroll horizontal.
- [ ] Contraste AA; foco visible (anillo azul global) y no tapado por el dock.
- [ ] Objetivos táctiles ≥ 44 px; controles con nombre accesible.
- [ ] Usa tokens/clases existentes; no hay colores ni tamaños sueltos nuevos.
- [ ] Funciona con reduced motion / reduced transparency / more contrast.
