# Tokens de color · contraste verificado

- **Sistema:** «Cuaderno». Los tokens están en `src/app/globals.css` (`:root` y oscuro) y los nombres de Tailwind en `tailwind.config.ts`.
- **Método:** [VERIFICADO] con `rediseno/scripts/contraste.mjs`, que aplica la fórmula de luminancia relativa de WCAG 2.x, sobre los pares de `rediseno/scripts/paletas-f2.json`.
- **Mínimos:** texto normal 4,5:1 (1.4.3) y componentes de interfaz o texto grande 3:1 (1.4.11).
- **Resultado:** **68 pares, 0 fallos.**

## Reglas que se derivan de la tabla

- `tinta-3` es texto válido (≥ 4,5:1) sobre **todas** las superficies, incluida `hundido`, en ambos temas. No existe un gris «decorativo» para texto.
- `linea` (#E4DED2 / #2E323C) es **solo decorativa**: separa tarjetas y secciones. Los bordes de controles (campos, botones secundarios, casillas) usan `linea-fuerte` (≥ 3:1).
- `resaltador` **nunca** es color de texto: es un fondo para `tinta` (11,5:1) o `sobre-resaltador`.
- `acento` sirve como texto (enlaces), relleno (`sobre-acento` encima) y anillo de foco (≥ 3:1 contra `fondo`).
- Estados: `exito`, `error` y `aviso` son legibles como texto sobre `superficie`, `fondo` y su propio `*-suave`. Nunca se usan solos para comunicar: van con icono o texto (1.4.1).
- Con `prefers-contrast: more`, `tinta-2` y `tinta-3` pasan a valer `tinta`, y `linea` pasa a valer `linea-fuerte`.

#### Claro · papel

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `tinta` #1C2230 | `fondo` #F6F3EC | texto | 14.35:1 | 4.5:1 | ✅ |
| `tinta` #1C2230 | `superficie` #FFFDF8 | texto | 15.64:1 | 4.5:1 | ✅ |
| `tinta` #1C2230 | `hundido` #EFEAE0 | texto | 13.26:1 | 4.5:1 | ✅ |
| `tinta-2` #4A5160 | `fondo` #F6F3EC | texto | 7.19:1 | 4.5:1 | ✅ |
| `tinta-2` #4A5160 | `superficie` #FFFDF8 | texto | 7.83:1 | 4.5:1 | ✅ |
| `tinta-2` #4A5160 | `hundido` #EFEAE0 | texto | 6.64:1 | 4.5:1 | ✅ |
| `tinta-3` #636977 | `fondo` #F6F3EC | texto | 4.96:1 | 4.5:1 | ✅ |
| `tinta-3` #636977 | `superficie` #FFFDF8 | texto | 5.41:1 | 4.5:1 | ✅ |
| `tinta-3` #636977 | `hundido` #EFEAE0 | texto | 4.59:1 | 4.5:1 | ✅ |
| `acento` #2743C4 | `fondo` #F6F3EC | texto | 7.05:1 | 4.5:1 | ✅ |
| `acento` #2743C4 | `superficie` #FFFDF8 | texto | 7.69:1 | 4.5:1 | ✅ |
| `acento` #2743C4 | `hundido` #EFEAE0 | texto | 6.52:1 | 4.5:1 | ✅ |
| `acento` #2743C4 | `acento-suave` #E6EAFB | texto | 6.52:1 | 4.5:1 | ✅ |
| `sobre-acento` #FFFFFF | `acento` #2743C4 | texto | 7.82:1 | 4.5:1 | ✅ |
| `sobre-acento` #FFFFFF | `acento-hover` #1F37A6 | texto | 9.74:1 | 4.5:1 | ✅ |
| `sobre-acento` #FFFFFF | `error` #B3261E | texto | 6.54:1 | 4.5:1 | ✅ |
| `sobre-acento` #FFFFFF | `exito` #1F7A4D | texto | 5.32:1 | 4.5:1 | ✅ |
| `tinta` #1C2230 | `resaltador` #FFD84D | texto | 11.49:1 | 4.5:1 | ✅ |
| `exito` #1F7A4D | `superficie` #FFFDF8 | texto | 5.23:1 | 4.5:1 | ✅ |
| `exito` #1F7A4D | `exito-suave` #E3F1E8 | texto | 4.56:1 | 4.5:1 | ✅ |
| `exito` #1F7A4D | `fondo` #F6F3EC | texto | 4.80:1 | 4.5:1 | ✅ |
| `error` #B3261E | `superficie` #FFFDF8 | texto | 6.43:1 | 4.5:1 | ✅ |
| `error` #B3261E | `error-suave` #F9E5E3 | texto | 5.40:1 | 4.5:1 | ✅ |
| `error` #B3261E | `fondo` #F6F3EC | texto | 5.90:1 | 4.5:1 | ✅ |
| `aviso` #855400 | `superficie` #FFFDF8 | texto | 6.33:1 | 4.5:1 | ✅ |
| `aviso` #855400 | `aviso-suave` #FBEFD5 | texto | 5.64:1 | 4.5:1 | ✅ |
| `aviso` #855400 | `fondo` #F6F3EC | texto | 5.80:1 | 4.5:1 | ✅ |
| `linea-fuerte` #8C8577 | `superficie` #FFFDF8 | ui | 3.60:1 | 3:1 | ✅ |
| `linea-fuerte` #8C8577 | `fondo` #F6F3EC | ui | 3.30:1 | 3:1 | ✅ |
| `acento` #2743C4 | `fondo` #F6F3EC | ui | 7.05:1 | 3:1 | ✅ |
| `exito` #1F7A4D | `hundido` #EFEAE0 | ui | 4.44:1 | 3:1 | ✅ |
| `acento` #2743C4 | `hundido` #EFEAE0 | ui | 6.52:1 | 3:1 | ✅ |
| `aviso` #855400 | `hundido` #EFEAE0 | ui | 5.36:1 | 3:1 | ✅ |
| `error` #B3261E | `hundido` #EFEAE0 | ui | 5.45:1 | 3:1 | ✅ |

#### Oscuro · lámpara

| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |
|---|---|---|---|---|---|
| `tinta` #EDE8DE | `fondo` #14161B | texto | 14.82:1 | 4.5:1 | ✅ |
| `tinta` #EDE8DE | `superficie` #1C1F26 | texto | 13.51:1 | 4.5:1 | ✅ |
| `tinta` #EDE8DE | `hundido` #252932 | texto | 11.93:1 | 4.5:1 | ✅ |
| `tinta-2` #BDB8AE | `fondo` #14161B | texto | 9.16:1 | 4.5:1 | ✅ |
| `tinta-2` #BDB8AE | `superficie` #1C1F26 | texto | 8.35:1 | 4.5:1 | ✅ |
| `tinta-2` #BDB8AE | `hundido` #252932 | texto | 7.37:1 | 4.5:1 | ✅ |
| `tinta-3` #9C978E | `fondo` #14161B | texto | 6.23:1 | 4.5:1 | ✅ |
| `tinta-3` #9C978E | `superficie` #1C1F26 | texto | 5.68:1 | 4.5:1 | ✅ |
| `tinta-3` #9C978E | `hundido` #252932 | texto | 5.01:1 | 4.5:1 | ✅ |
| `acento` #9AABFF | `fondo` #14161B | texto | 8.31:1 | 4.5:1 | ✅ |
| `acento` #9AABFF | `superficie` #1C1F26 | texto | 7.57:1 | 4.5:1 | ✅ |
| `acento` #9AABFF | `hundido` #252932 | texto | 6.69:1 | 4.5:1 | ✅ |
| `acento` #9AABFF | `acento-suave` #262C45 | texto | 6.31:1 | 4.5:1 | ✅ |
| `sobre-acento` #10131A | `acento` #9AABFF | texto | 8.53:1 | 4.5:1 | ✅ |
| `sobre-acento` #10131A | `acento-hover` #B3C0FF | texto | 10.53:1 | 4.5:1 | ✅ |
| `sobre-acento` #10131A | `error` #FF8F86 | texto | 8.43:1 | 4.5:1 | ✅ |
| `sobre-acento` #10131A | `exito` #6FD39B | texto | 10.15:1 | 4.5:1 | ✅ |
| `sobre-resaltador` #14161B | `resaltador` #E8C547 | texto | 10.78:1 | 4.5:1 | ✅ |
| `exito` #6FD39B | `superficie` #1C1F26 | texto | 9.01:1 | 4.5:1 | ✅ |
| `exito` #6FD39B | `exito-suave` #1C3328 | texto | 7.38:1 | 4.5:1 | ✅ |
| `exito` #6FD39B | `fondo` #14161B | texto | 9.88:1 | 4.5:1 | ✅ |
| `error` #FF8F86 | `superficie` #1C1F26 | texto | 7.48:1 | 4.5:1 | ✅ |
| `error` #FF8F86 | `error-suave` #3D2224 | texto | 6.56:1 | 4.5:1 | ✅ |
| `error` #FF8F86 | `fondo` #14161B | texto | 8.21:1 | 4.5:1 | ✅ |
| `aviso` #EDB95A | `superficie` #1C1F26 | texto | 9.18:1 | 4.5:1 | ✅ |
| `aviso` #EDB95A | `aviso-suave` #3A2F1A | texto | 7.30:1 | 4.5:1 | ✅ |
| `aviso` #EDB95A | `fondo` #14161B | texto | 10.07:1 | 4.5:1 | ✅ |
| `linea-fuerte` #6E7482 | `superficie` #1C1F26 | ui | 3.52:1 | 3:1 | ✅ |
| `linea-fuerte` #6E7482 | `fondo` #14161B | ui | 3.86:1 | 3:1 | ✅ |
| `acento` #9AABFF | `fondo` #14161B | ui | 8.31:1 | 3:1 | ✅ |
| `exito` #6FD39B | `hundido` #252932 | ui | 7.95:1 | 3:1 | ✅ |
| `acento` #9AABFF | `hundido` #252932 | ui | 6.69:1 | 3:1 | ✅ |
| `aviso` #EDB95A | `hundido` #252932 | ui | 8.11:1 | 3:1 | ✅ |
| `error` #FF8F86 | `hundido` #252932 | ui | 6.61:1 | 3:1 | ✅ |
