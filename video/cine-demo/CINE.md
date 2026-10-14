# Demostración cinematográfica 3D · celular + mano

Escena de prueba (18 s, 1080×1920) hecha con **Three.js dentro de HyperFrames**. Un celular genérico, una mano articulada que lo sostiene y lo toca, y cinco tomas de cámara distintas.

## Cómo reproducirla
```bash
cd video/cine-demo
npm install                      # solo three (para las pruebas en Node); el render usa vendor/three.min.js
node tests/check.mjs             # comprobaciones objetivas (escala, penetración, contacto, cámara)
node tests/solve_grips.mjs       # (opcional) regenera lib/grips.data.js con el agarre
node tests/shoot.mjs out "12.45" "5.5,2,16,34,1.5,14,3,50"   # fotos de depuración: "t" o "t,px,py,pz,tx,ty,tz,focal"
npm run dev                      # vista previa en HyperFrames
npm run render                   # MP4 final (WebGL por software si no hay GPU; es lento)
```
HyperFrames 0.8.157 · three r149 (`vendor/three.min.js`, UMD) · Chromium con SwiftShader. El 3D es una **función pura del tiempo** (`Cine.*At(t)`), así que `seek` y el render son deterministas.

## Arquitectura (`lib/`)
| Archivo | Contenido reutilizable |
|---|---|
| `units.js` | Unidad de mundo = 1 cm. Dimensiones del teléfono, mano y escritorio; rangos válidos; focal→FOV; curvas de velocidad. |
| `phone.js` | Teléfono con cuerpo extruido y biselado, cristal trasero, pantalla con UV 0..1, reflejo controlado, módulo de cámaras, botones, puerto y altavoces. `phoneSDF` (distancia con signo) para pruebas. |
| `hand.js` | Mano: palma, 4 dedos (MCP/PIP/DIP independientes + abducción), pulgar (CMC de 3 ejes, MCP, IP), muñeca, antebrazo y manga. |
| `grips.js` / `grips.data.js` | Colocación de la mano y poses **resueltas por IK** (`tests/solve_grips.mjs`). |
| `screen.js` | UI dibujada en canvas 1100×2326 (= aspecto físico de la pantalla). |
| `cameras.js` | Trayectorias Catmull-Rom, órbita parcial con cambio de altura, deriva determinista. |
| `scene.js` | Plano de tomas, estado del teléfono/mano/UI y cámara en función de `t`. |

## Plan de tomas y decisiones
| Toma | t (s) | Qué se ve primero → qué se descubre | Cámara | Por qué |
|---|---|---|---|---|
| **A** Rasante con primer plano | 0–3.8 | Un lápiz enorme cruza el encuadre → el celular tumbado, su espesor y su borde → la pantalla | Travelling a 1 cm de la mesa, 50 mm, asciende al final con ligero alabeo | Mostrar espesor y material antes que la UI; el primer plano da escala |
| **B** Contrapicado en arco | 3.8–7.4 | La mano ya sostiene el celular | Arco desde −46° a −14°, elevación −12°→3°, 35→42 mm | Corte *en la acción* de agarrar; el contrapicado da presencia sin recortar el teléfono |
| **C** Órbita parcial | 7.4–11.2 | Pulgar y pantalla → dorso: cámaras, palma y dedos | 16°→150° de azimut, elevación 18°→−4°, r≈35 cm | Verifica el contacto desde ángulos distintos al frontal |
| **D** Macro sobre el hombro izquierdo | 11.2–14.4 | El pulgar llega y toca "Estudiar ahora" | Aproximación en curva, 60→75 mm, entra por el lado opuesto al pulgar | Momento clave: contacto sincronizado con la respuesta de la UI |
| **E** Retirada | 14.4–18.0 | Detalle del cristal → escena completa asimétrica | 75→26 mm, pasa por delante de la planta, espacio negativo a la izquierda | Cierre con escala y contexto |

Registro de decisiones y defectos corregidos durante la construcción:
1. Primer intento de agarre con la palma paralela al dorso: los dedos quedaban separados 1,8 cm del borde y el pulgar no llegaba a la pantalla → **mano girada 35°** y muñeca abajo-derecha.
2. El solucionador "hacía trampa" tocando la cara trasera con la yema → ahora se exige altura > pantalla y orientación de la yema.
3. Dedos sobre la pantalla (garras) → penalización con el teléfono **prolongado hacia delante** (`phoneSDFFwd`).
4. Pulgar flotando 0,78 cm → se resuelve la punta (no un punto de yema); contacto final 0,01 cm.
5. Colores lavados → `ColorManagement` activado y tono ACES con exposición 0,85.
6. Cámaras de D/E atravesaban la mano → comprobación automática de distancia (≥ 2 cm) y recolocación por el lado izquierdo.
7. Plano C recortaba el teléfono → radio 36 cm y focales 42–50 mm.

## Comprobaciones automáticas (`tests/check.mjs`)
Dimensiones y aspecto del teléfono · textura = aspecto de pantalla y UV 0..1 · escala de la mano (19 cm) y relación mano/teléfono · **sin penetración** mano↔teléfono en cada muestra de 0,1 s (tolerancia 0,1 cm) · escala constante · contacto del pulgar durante el toque · sincronía UI↔contacto · cámara nunca dentro de la geometría · focales 24–90 mm · teléfono completo en B/C/E · escala aparente sin exageraciones.

## Limitaciones declaradas
- El teléfono es **genérico**: no replica un modelo comercial (no hay planos verificables incluidos). Dimensiones de la clase 6,1–6,7".
- **Sin profundidad de campo ni *rack focus***: Three.js base no lo trae y `BokehPass` exige el pipeline de postprocesado de `examples/`; se omitió para no añadir dependencias. Los planos macro son nítidos de punta a punta.
- La mano es **procedural estilizada** (cápsulas, tipo arcilla): la anatomía y el contacto son correctos, pero no es un modelo escaneado ni tiene piel realista. Para primeros planos de calidad cinematográfica haría falta un modelo riggeado (Blender/glTF).
- Los dedos del agarre están **estáticos** (solo se anima el pulgar y la muñeca/flotación).
- El render con SwiftShader es lento (varios minutos).

## Evaluación del render real (MP4 1080×1920, 24 fps, 18 s)
Inspección visual de 14 fotogramas del MP4 (t = 0,8 · 2,0 · 3,3 · 4,8 · 6,5 · 8,5 · 10,0 · 12,0 · 12,5 · 13,2 · 14,7 · 15,8 · 16,8 · 17,8 s) más las comprobaciones de `tests/check.mjs` (0 críticos, 0 avisos). **No se revisó fotograma a fotograma ni a velocidad real**; los saltos entre fotogramas no se pueden descartar con solo estas muestras.

| Toma | Originalidad | Composición | Geometría | Contacto | Materiales | Legibilidad | Observaciones |
|---|---|---|---|---|---|---|---|
| A | Alta (lápiz de primer plano, rasante) | Buena; arranque con mucho vacío | Correcta | — | Metal/cristal bien distinguidos | La UI es legible solo al final | El primer segundo es poco informativo |
| B | Media (contrapicado suave) | Teléfono completo, mano a escala | Correcta | Dedos en el borde izquierdo, pulgar flotando a propósito | Piel tipo arcilla | Buena | El pulgar tapa parte de la UI |
| C | Alta (órbita con cambio de altura) | Bien | Correcta; dorso con módulo de cámara | Palma y dedos coherentes | Cristal trasero mate | Buena | La palma parece "manopla" desde atrás |
| D | Alta (macro por el lado opuesto al pulgar) | Recorte intencionado | Correcta | **Yema sobre el botón a 0,01 cm** | Uña ya no es calcomanía | Se lee el botón | UI reacciona en el momento del toque |
| E | Media-alta (retirada con espacio negativo) | Asimétrica, buen contexto | Correcta | — | Manga, planta y mesa legibles | Teléfono pequeño al final | La planta solo asoma en el borde |

Defectos pendientes: sin profundidad de campo; dedos del agarre estáticos; piel y pelo no realistas; escena de bajo contraste (paleta pastel).
