# 01 · Dirección creativa

**Fecha:** 2026-09-24 · **Maquetas:** `rediseno/direcciones/*.html` (ábrelas en el navegador) y `*.png` (capturas) · **Skills:** `frontend-design` no está instalada. Usé `ui-ux-pro-max` (catálogo de paletas y parejas tipográficas) y `apple-design` como referencia del punto de partida. Los contrastes están [VERIFICADO] con `contraste.mjs` (fórmula WCAG 2.x).

Las tres maquetas muestran la **misma pantalla «Hoy»** con los mismos datos de ejemplo, para comparar solo la dirección visual:
- siguiente paso: «Límites al infinito», Cálculo I, tema 4 de 7;
- semana con 3 días de racha;
- parcial en 6 días;
- 2 materias.

La estructura de «Hoy» es común a las tres y resuelve los problemas 1, 2 y 5 de `00-linea-base.md`:
1. Una sola acción principal arriba y al alcance del pulgar.
2. La racha como **semana** y no como contador que cae a 0.
3. El próximo parcial con cuenta atrás y avance.
4. Las materias como lista compacta.
5. Dock de 5 destinos: **Hoy · Materias · Parciales · Progreso · Ajustes**. «Estudiar» deja de ser un destino y pasa a ser la acción principal de «Hoy» y de cada materia.

## Las tres direcciones

| | **A · Cuaderno** | **B · Biblioteca de noche** | **C · Frost 2.0** |
|---|---|---|---|
| Concepto | Tu cuaderno de estudio bien llevado: papel cálido, tinta azul y un resaltador que marca lo de hoy | La sala de estudio a las 11 p. m.: oscura, silenciosa, con una luz lima que señala qué hacer | La estética actual, ordenada en un sistema y con modo oscuro |
| Personalidad | Serena, cercana, ordenada | Enfocada, nocturna, con energía | Pulida, técnica, conocida |
| Paleta clara | papel `#F6F3EC`, tinta `#1C2230`, acento `#2743C4`, resaltador `#FFD84D` | `#F3F5F0`, `#0D1014`, lima `#C6F16B` solo como relleno y acento de texto `#3D5C0C` | `#F4F6FB`, `#1D1D1F`, `#0066CC` |
| Paleta oscura | lámpara `#14161B`, texto `#EDE8DE`, acento `#9AABFF` | **principal**: `#0D1014`, `#E8EDF2`, lima `#C6F16B`, violeta `#B69CFF` | `#0B0D12`, `#F5F5F7`, `#4DA3FF` |
| Tipografía | **Fraunces 600** (titulares y cifras) + **Figtree** 400–700 (interfaz) | Space Grotesk 500/700 + DM Sans | Geist (una sola familia) |
| Formas | Radios de 14–16 px, líneas finas, casi sin sombra ni vidrio | Bento, radio de 20 px, píldoras, dock flotante | Vidrio (`backdrop-filter`), radio de 22 px, sombras suaves |
| Movimiento | El resaltador «se pinta» al completar algo (200 ms); aparición sin rebote | Contadores y anillos que se llenan (300 ms) | Resortes de `motion` |
| Landing | Titular con una palabra resaltada, captura real de «Hoy», 3 pasos como libreta, qué es gratis y FAQ | Fondo oscuro, «Hoy» encendido en lima y cifras grandes | La actual, más corta, con FAQ |
| Riesgo | Una serif es una apuesta de marca: hay que usarla con disciplina, solo en titulares | Oscuro por defecto de día; la lima puede leerse como «gamer» | Poco memorable; el vidrio cuesta GPU y ya causó U-01 |

### Contraste verificado (62 pares, 0 fallos)

Los pares marcados como «ui» miden 3:1 (bordes de control); el resto, 4,5:1. Hubo que oscurecer dos bordes, uno en B y otro en C (`#5A6573` → `#65717F` y `#636366` → `#707075`), porque daban 2,9:1.

#### A · Cuaderno (claro)

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `texto` #1C2230 | `fondo` #F6F3EC | texto | 14.35:1 | 4.5:1 | ✅ |
| `texto` #1C2230 | `superficie` #FFFDF8 | texto | 15.64:1 | 4.5:1 | ✅ |
| `texto2` #4A5160 | `superficie` #FFFDF8 | texto | 7.83:1 | 4.5:1 | ✅ |
| `texto3` #636977 | `superficie` #FFFDF8 | texto | 5.41:1 | 4.5:1 | ✅ |
| `texto3` #636977 | `fondo` #F6F3EC | texto | 4.96:1 | 4.5:1 | ✅ |
| `acento` #2743C4 | `superficie` #FFFDF8 | texto | 7.69:1 | 4.5:1 | ✅ |
| `sobreAcento` #FFFFFF | `acento` #2743C4 | texto | 7.82:1 | 4.5:1 | ✅ |
| `texto` #1C2230 | `resaltador` #FFD84D | texto | 11.49:1 | 4.5:1 | ✅ |
| `lineaFuerte` #8C8577 | `superficie` #FFFDF8 | ui | 3.60:1 | 3:1 | ✅ |
| `exito` #1F7A4D | `superficie` #FFFDF8 | texto | 5.23:1 | 4.5:1 | ✅ |
| `error` #B3261E | `superficie` #FFFDF8 | texto | 6.43:1 | 4.5:1 | ✅ |
| `aviso` #855400 | `superficie` #FFFDF8 | texto | 6.33:1 | 4.5:1 | ✅ |

#### A · Cuaderno (oscuro)

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `texto` #EDE8DE | `fondo` #14161B | texto | 14.82:1 | 4.5:1 | ✅ |
| `texto` #EDE8DE | `superficie` #1C1F26 | texto | 13.51:1 | 4.5:1 | ✅ |
| `texto2` #BDB8AE | `superficie` #1C1F26 | texto | 8.35:1 | 4.5:1 | ✅ |
| `texto3` #9C978E | `superficie` #1C1F26 | texto | 5.68:1 | 4.5:1 | ✅ |
| `acento` #9AABFF | `superficie` #1C1F26 | texto | 7.57:1 | 4.5:1 | ✅ |
| `sobreAcento` #10131A | `acento` #9AABFF | texto | 8.53:1 | 4.5:1 | ✅ |
| `sobreResaltador` #14161B | `resaltador` #E8C547 | texto | 10.78:1 | 4.5:1 | ✅ |
| `lineaFuerte` #6E7482 | `superficie` #1C1F26 | ui | 3.52:1 | 3:1 | ✅ |
| `exito` #6FD39B | `superficie` #1C1F26 | texto | 9.01:1 | 4.5:1 | ✅ |
| `error` #FF8F86 | `superficie` #1C1F26 | texto | 7.48:1 | 4.5:1 | ✅ |
| `aviso` #EDB95A | `superficie` #1C1F26 | texto | 9.18:1 | 4.5:1 | ✅ |

#### B · Biblioteca de noche (oscuro, principal)

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `texto` #E8EDF2 | `fondo` #0D1014 | texto | 16.19:1 | 4.5:1 | ✅ |
| `texto2` #A3AEBA | `superficie` #161B22 | texto | 7.68:1 | 4.5:1 | ✅ |
| `texto3` #8592A0 | `superficie` #161B22 | texto | 5.45:1 | 4.5:1 | ✅ |
| `acento` #C6F16B | `superficie` #161B22 | texto | 13.34:1 | 4.5:1 | ✅ |
| `sobreAcento` #0D1014 | `acento` #C6F16B | texto | 14.71:1 | 4.5:1 | ✅ |
| `violeta` #B69CFF | `superficie` #161B22 | texto | 7.57:1 | 4.5:1 | ✅ |
| `lineaFuerte` #65717F | `superficie` #161B22 | ui | 3.48:1 | 3:1 | ✅ |
| `exito` #6FE0A6 | `superficie` #161B22 | texto | 10.62:1 | 4.5:1 | ✅ |
| `error` #FF8A8A | `superficie` #161B22 | texto | 7.62:1 | 4.5:1 | ✅ |
| `aviso` #FFC766 | `superficie` #161B22 | texto | 11.21:1 | 4.5:1 | ✅ |

#### B · Biblioteca de noche (claro)

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `texto` #0D1014 | `fondo` #F3F5F0 | texto | 17.37:1 | 4.5:1 | ✅ |
| `texto2` #4B5563 | `superficie` #FFFFFF | texto | 7.56:1 | 4.5:1 | ✅ |
| `texto3` #5F6875 | `superficie` #FFFFFF | texto | 5.64:1 | 4.5:1 | ✅ |
| `acentoTexto` #3D5C0C | `superficie` #FFFFFF | texto | 7.68:1 | 4.5:1 | ✅ |
| `sobreAcento` #0D1014 | `acentoRelleno` #C6F16B | texto | 14.71:1 | 4.5:1 | ✅ |
| `violeta` #6D4BD8 | `superficie` #FFFFFF | texto | 5.76:1 | 4.5:1 | ✅ |
| `lineaFuerte` #868E96 | `superficie` #FFFFFF | ui | 3.32:1 | 3:1 | ✅ |
| `exito` #1B7A4B | `superficie` #FFFFFF | texto | 5.34:1 | 4.5:1 | ✅ |
| `error` #B42318 | `superficie` #FFFFFF | texto | 6.57:1 | 4.5:1 | ✅ |
| `aviso` #8A5300 | `superficie` #FFFFFF | texto | 6.33:1 | 4.5:1 | ✅ |

#### C · Frost 2.0 (claro)

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `texto` #1D1D1F | `fondo` #F4F6FB | texto | 15.57:1 | 4.5:1 | ✅ |
| `texto2` #515154 | `superficie` #FFFFFF | texto | 7.91:1 | 4.5:1 | ✅ |
| `texto3` #636366 | `superficie` #FFFFFF | texto | 5.99:1 | 4.5:1 | ✅ |
| `texto3` #636366 | `fondo` #F4F6FB | texto | 5.54:1 | 4.5:1 | ✅ |
| `acento` #0066CC | `superficie` #FFFFFF | texto | 5.57:1 | 4.5:1 | ✅ |
| `sobreAcento` #FFFFFF | `acento` #0066CC | texto | 5.57:1 | 4.5:1 | ✅ |
| `lineaFuerte` #8A8A8E | `superficie` #FFFFFF | ui | 3.44:1 | 3:1 | ✅ |
| `exito` #1A7F37 | `superficie` #FFFFFF | texto | 5.08:1 | 4.5:1 | ✅ |
| `error` #C10A2B | `superficie` #FFFFFF | texto | 6.28:1 | 4.5:1 | ✅ |
| `aviso` #8A5300 | `superficie` #FFFFFF | texto | 6.33:1 | 4.5:1 | ✅ |

#### C · Frost 2.0 (oscuro)

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `texto` #F5F5F7 | `fondo` #0B0D12 | texto | 17.85:1 | 4.5:1 | ✅ |
| `texto2` #AEAEB2 | `superficie` #161922 | texto | 7.94:1 | 4.5:1 | ✅ |
| `texto3` #8E8E93 | `superficie` #161922 | texto | 5.38:1 | 4.5:1 | ✅ |
| `acento` #4DA3FF | `superficie` #161922 | texto | 6.69:1 | 4.5:1 | ✅ |
| `sobreAcento` #0B0D12 | `acento` #4DA3FF | texto | 7.40:1 | 4.5:1 | ✅ |
| `lineaFuerte` #707075 | `superficie` #161922 | ui | 3.56:1 | 3:1 | ✅ |
| `exito` #4ADE80 | `superficie` #161922 | texto | 10.07:1 | 4.5:1 | ✅ |
| `error` #FF6B81 | `superficie` #161922 | texto | 6.41:1 | 4.5:1 | ✅ |
| `aviso` #FBBF24 | `superficie` #161922 | texto | 10.52:1 | 4.5:1 | ✅ |

## Recomendación: **A · Cuaderno**

1. **Calma bajo estrés.** El usuario llega agobiado por un parcial. El papel cálido y la tinta bajan la tensión visual, mientras que el negro con lima (B) activa. Principio 5.
2. **Es memorable sin ser ruidosa.** El resaltador es un gesto propio del estudiante: subrayar lo importante. Aquí es la única decoración, y **siempre tiene significado**: marca el foco de hoy. Ninguna app de estudio popular en español usa este lenguaje. C se confunde con cualquier app de iOS (problema 10).
3. **Oscuro de verdad y cálido.** El modo «lámpara de escritorio» resuelve el problema 3 sin el azul frío que molesta de noche.
4. **Encaja en el presupuesto.** Figtree variable (subconjunto latino) + Fraunces con un solo peso deberían pesar lo mismo o menos que Geist variable (68 KB). Lo mido en la Fase 2 y, si se pasa, Fraunces se queda solo en los titulares de la landing.
5. **Menos riesgo técnico.** Quita el vidrio (`backdrop-filter`), que es causa de U-01 y caro en Android de gama media, el móvil típico del usuario en Colombia [INFERIDO].
6. **Legibilidad.** Texto base de 16 px (hoy la mayoría es de 12 px) y cifras claras de Figtree para notas y tiempos.

**Decisión:** el usuario delegó la elección («siempre te doy el ok de todo»), así que se adopta **A · Cuaderno**. Si prefieres B o C, la Fase 2 deja los tokens separados de los componentes: cambiar de paleta y de fuentes es tocar un archivo.
