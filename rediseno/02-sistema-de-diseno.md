# 02 · Sistema de diseño «Cuaderno»

Fuente única: `src/app/globals.css` (tokens y clases de componente) + `tailwind.config.ts` (nombres) + `src/components/ui/*`. La skill `.claude/skills/studia-design-system/SKILL.md` resume estas reglas para futuras sesiones. Contraste: `tokens-contraste.md`.

## 1. Tokens

### Color (roles semánticos, claro · oscuro)

| Rol | Clase | Claro | Oscuro | Uso | Justificación |
|---|---|---|---|---|---|
| Fondo | `bg-fondo` | `#F6F3EC` | `#14161B` | Lienzo de la app | Papel cálido y lámpara: menos fatiga que el blanco o el negro puros en sesiones largas |
| Superficie | `bg-superficie` | `#FFFDF8` | `#1C1F26` | Tarjetas, diálogos, campos | La «hoja» sobre el papel crea jerarquía sin sombras ni vidrio |
| Hundido | `bg-hundido` | `#EFEAE0` | `#252932` | Pistas de barras, chips, controles segmentados, esqueletos | Sustituye las 31 opacidades de negro y blanco (problema 9) |
| Línea | `border-linea` | `#E4DED2` | `#2E323C` | Separadores **decorativos** | — |
| Línea fuerte | `border-linea-fuerte` | `#8C8577` | `#6E7482` | Bordes de **controles** (≥ 3:1) | WCAG 1.4.11 (hallazgo A-05) |
| Tinta | `text-tinta` | `#1C2230` | `#EDE8DE` | Texto principal | 14–15:1 |
| Tinta 2 | `text-tinta-2` | `#4A5160` | `#BDB8AE` | Texto secundario | ≥ 7:1 |
| Tinta 3 | `text-tinta-3` | `#636977` | `#9C978E` | Metadatos, marcadores de posición | ≥ 4,5:1 en todas las superficies (A-10) |
| Acento | `bg-acento` / `text-acento` | `#2743C4` | `#9AABFF` | **Una** acción principal por pantalla, enlaces, foco, estado activo | Tinta azul: reconocible como «acción» y serena (principio 1) |
| Sobre acento | `text-sobre-acento` | `#FFFFFF` | `#10131A` | Texto sobre acento, error o éxito | — |
| Acento suave | `bg-acento-suave` | `#E6EAFB` | `#262C45` | Fondo de elementos seleccionados | — |
| Resaltador | `resaltado` (clase) | `#FFD84D` | `#E8C547` | **Solo** el foco del día (una vez por pantalla) | Firma de marca con significado: el gesto de subrayar lo importante |
| Éxito | `text-exito` / `bg-exito-suave` | `#1F7A4D` | `#6FD39B` | Tema completado, guardado, aprobado | — |
| Error | `text-error` / `bg-error-suave` | `#B3261E` | `#FF8F86` | Errores y acciones destructivas | A-01 (el error ya no puede verse como éxito) |
| Aviso | `text-aviso` / `bg-aviso-suave` | `#855400` | `#EDB95A` | Parcial cercano, pausa, racha en riesgo | — |
| Velo | `bg-velo/45` | tinta | negro | Fondo detrás de los diálogos | — |

El oscuro se activa con `prefers-color-scheme: dark` o con `data-tema="oscuro"` en `<html>` (elegido en Ajustes y aplicado antes de pintar, sin destello). `data-tema="claro"` fuerza el claro.

### Tipografía

2 familias con `next/font` (subconjunto latino, *self-hosted*). Precarga medida: **38 KB** (Fraunces 600: 18 KB; Figtree variable: 20 KB). Antes, Geist variable pesaba 68 KB.

| Clase | Fuente | Tamaño / interlínea | Uso |
|---|---|---|---|
| `titulo-1` | Fraunces 600 | clamp(32→40 px) / 1,1 | El único H1 de cada pantalla |
| `titulo-2` | Fraunces 600 | 24 / 1,2 | Títulos de sección importantes y cifras grandes (`font-display`) |
| `titulo-3` | Figtree 700 | 18 / 1,35 | Títulos de tarjeta |
| `encabezado` | Figtree 700 | 16 / 1,4 | Encabezados menores |
| `cuerpo` | Figtree 400 | 16 / 1,55 | Texto de lectura |
| `subtitulo` | Figtree 400 · tinta-2 | 15 / 1,45 | Descripción bajo un título |
| `antetitulo` | Figtree 700 · MAYÚSCULAS | 13 / 1,2 | Etiqueta de sección (una por sección, nunca dos seguidas) |

Escala de Tailwind redefinida con un **mínimo de 13 px**: `xs` 13 · `sm` 15 · `base` 16 · `lg` 18 · `xl` 20 · `2xl` 24 · `3xl` 30 · `4xl` 36 · `5xl` 44 · `6xl` 56 · `7xl` 68. Los números usan cifras tabulares, para que tiempos y notas no «bailen».

*Justificación:* el 60 % del texto se leía a 12 px (problema 10). El usuario lee en el móvil, a menudo con prisa.

### Espaciado, radios, sombras y movimiento

| Token | Valores | Regla |
|---|---|---|
| Espaciado | Base de 4 px (escala de Tailwind: `1` = 4 px) | Usar 2, 3, 4, 5, 6, 8, 10 y 12. Evitar los medios pasos (`0.5`, `1.5`, `2.5`, `3.5`) salvo para alinear iconos |
| Radios | `md` 8 · `lg` 10 · `xl` 12 (controles) · `2xl` 16 (tarjetas) · `3xl` 20 · `4xl` 24 (hojas y diálogos) · `full` (chips y píldoras) | Un control y su contenedor no comparten radio: el interior es menor |
| Sombras | `shadow-1` (tarjeta en reposo) · `shadow-2` (hover, elementos flotantes) · `shadow-3` (diálogos, dock, avisos) | Variables CSS; en oscuro son más densas. Las 17 sombras arbitrarias pasaron a `shadow-2` |
| Duración | `rapida` 120 ms (pulsación) · `media` 200 ms (aparición, color) · `lenta` 320 ms (barras, resaltador) | Nada supera 320 ms |
| Curva | `salida` `cubic-bezier(.2,.8,.2,1)` · `entrada` `cubic-bezier(.4,0,1,1)` | Sin rebotes: la calma es un principio |
| Movimiento reducido | `prefers-reduced-motion` → duraciones de 0,01 ms | Todo aparece en su sitio y nada se pierde |

## 2. Componentes base

Estados comunes a todo control:
- **hover:** cambio de fondo o de borde, nunca solo de sombra;
- **foco:** anillo de 2 px de `acento` separado 2 px del fondo (`:focus-visible`);
- **pulsado:** `scale(.98)`;
- **deshabilitado:** opacidad al 50 % y `cursor: not-allowed`, sin quitarlo del orden de tabulación si explica por qué está deshabilitado.

Área táctil mínima: 44×44 px.

| Componente | Implementación | Variantes | Estados | Accesibilidad |
|---|---|---|---|---|
| **Botón** | Clases `btn-primario`, `btn-secundario`, `btn-fantasma` y `btn-peligro` | Primario: **uno por pantalla**. Secundario: borde `linea-fuerte`. Fantasma: texto de acento. Peligro: fondo `error-suave` | hover, foco, pulsado, `disabled` / `aria-disabled`, cargando (icono girando + texto «Guardando…») | `<button>` o `<Link>`, nunca un `div`. Si es solo icono, lleva `aria-label` y el icono `aria-hidden`. Alto ≥ 44 px |
| **Campo de texto** | `components/ui/Campo.tsx` + clase `campo` (también para `select` y `textarea`) | Normal, con ayuda, con error, opcional | hover (borde `tinta-2`), foco (borde + halo de acento), error (`aria-invalid`, borde de 2 px en `error` + mensaje), deshabilitado | Etiqueta visible con `htmlFor`; ayuda y error en `aria-describedby`; 16 px para que iOS no haga zoom; `type` y `autocomplete` correctos |
| **Tarjeta** | Clase `tarjeta` (`a.tarjeta` para una tarjeta enlace) | Estática · Enlace (hover con `linea-fuerte` + `shadow-2`) | hover, foco | Si toda la tarjeta es un enlace, no lleva otros controles dentro; el título es un encabezado |
| **Chip** | Clases `chip`, `chip-acento`, `chip-exito`, `chip-aviso` y `chip-error` | Neutro y 4 tonos | — (no interactivo) | El color nunca va solo: siempre lleva texto |
| **Diálogo** | `components/ui/Dialogo.tsx` (`<dialog>` nativo) | Normal · Peligro | abierto o cerrado | Foco atrapado, Escape, foco devuelto, `aria-labelledby` y `aria-describedby` (ya existía, A-02) |
| **Aviso (toast)** | `components/ui/Avisos.tsx` + `avisar(texto, tono)` de `lib/avisos.ts` | Éxito · Error · Info | Aparece 4 s; hasta 3 a la vez | `role="status"` + `aria-live="polite"`. Queda encima del dock, en la zona del pulgar. Los errores que bloquean van en línea, no en un aviso |
| **Navegación (dock)** | `components/SidebarNav.tsx` | 5 destinos con etiqueta visible | activo (`aria-current="page"` + relleno de acento suave + color de acento) | `<nav aria-label>`; cada destino ≥ 44×44; se reserva espacio inferior para que nunca tape contenido |
| **Barra de progreso** | `components/ui/BarraProgreso.tsx` + clase `barra-progreso` | Acento · Éxito · Aviso | — | `role="progressbar"` con `aria-valuenow`/`aria-valuetext`; el valor también aparece como texto visible |
| **Estado vacío** | `components/ui/EstadoVacio.tsx` | Con o sin acción | — | Icono `aria-hidden`; encabezado con el nivel correcto; **siempre** una salida (acción o enlace) |
| **Esqueleto** | Clase `esqueleto` | Bloques del tamaño del contenido final | Brillo de 1,6 s (se detiene con movimiento reducido) | El contenedor lleva `aria-busy="true"` y un texto «Cargando…» `sr-only` |
| **Resaltado** | Clases `resaltado` y `resaltado-animado` | Estático · se pinta al completar algo | — | Decorativo: el significado está en el texto. Una vez por pantalla |

## 3. Qué cambió en el código (Fase 2)

- `tailwind.config.ts` y `globals.css` reescritos con los tokens.
- **Codemod** (`rediseno/scripts/codemod-tokens.mjs`): 1 429 sustituciones en 67 archivos:
  - clases `apple-*` y `btn-apple-*` → nombres del sistema;
  - `arctic-*`, `glacier-blue` y demás → roles;
  - `bg-white` y `border-black/[x]` → `superficie`, `hundido` y `linea`;
  - colores de Tailwind (`emerald`, `amber`, `red`, `sky`…) → `exito`, `aviso`, `error` y `acento`;
  - 17 sombras arbitrarias → `shadow-2`.
- Así **toda la app se tematiza** (claro y oscuro) sin tocar la lógica.
- Fuentes: Geist → Fraunces + Figtree con `next/font/google`. Se desinstaló el paquete `geist`.
- Logotipo: tipográfico, sin imagen.
- Se borraron 6 componentes de la landing que no se usaban (≈ 600 líneas).
- Nuevos componentes: `EstadoVacio`, `BarraProgreso`, `Campo`, `Avisos` + `lib/avisos.ts`.

Pendiente para la Fase 4, pantalla por pantalla: los degradados SVG con colores fijos (`TimerRing` y el anillo de Inicio), y usar los componentes nuevos en lugar del marcado repetido.
