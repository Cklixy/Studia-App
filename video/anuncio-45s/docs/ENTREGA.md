# studia+ · Anuncio vertical 45 s (9:16, 1080×1920, 30 fps, 1350 fotogramas)

## Línea de tiempo
| Tiempo | Acto | Contenido | Texto en pantalla |
|---|---|---|---|
| 0:00–0:03 | A · Gancho | Primer plano del examen con 5.0 y estudiante que baja la hoja sonriendo. Sin logo. | «Hace unos días no entendía NADA…» |
| 0:03–0:08 | B · Conflicto | Macro de hoja y lápiz nervioso, reloj 11:57, rostro frustrado. | «Y el parcial era de cálculo…» |
| 0:08–0:14 | C · Descubrimiento | Celular en mano, pantallas reales de studia+ (inicio → materias → ruta → sesión). Cámara en arco. | «Elige la materia y el tema.» |
| 0:14–0:23 | D · Demostración | Visualización holográfica de la derivada (secante → tangente, f′(x)=2x), paneles de método y racha. | «Entenderlo. Practicarlo. Recordarlo.» |
| 0:23–0:30 | E · Transformación | Práctica con lápiz, tutor IA, cambio de luz fría→cálida, plano cenital del paso del tiempo. | «Cada día, un poco más claro.» |
| 0:30–0:37 | F · Expectación | Última línea del examen, el profesor entra, se acerca y entrega la hoja; música baja. | «Y llegó el día del examen…» |
| 0:37–0:41 | G · Recompensa | Revelación del 5.0, reacción de alegría, aprobación del profesor. | «Y sí… sacó 5.0» |
| 0:41–0:45 | H · Cierre | App real en el celular, logo studia+. | «Estudia para entender» · «Descubre studia+» |

## Cómo se produjo
- Motor 3D propio (Three.js r149) con post-proceso: profundidad de campo con lente fina, grading, viñeta y grano determinista.
- Personajes estilizados con rig FK + IK de brazos, cara procedural; manos articuladas con agarres resueltos por IK (celular, hoja A4, lápiz).
- Cada acto es una composición de HyperFrames (`act-A.html` … `act-H.html`, generadas por `tools/make-acts.mjs` desde `story/captions.json`). Cada fotograma es función pura del tiempo.
- Render: `render_all.sh` (calidad `draft`, 30 fps). Ensamblado con ffmpeg (`tools/assemble.sh`).
- Audio: música CC0 de HoliznaCC0 (`public/audio/lofi/tokyo-sunset.m4a`, dominio público, ver `public/audio/LICENCIAS.md`) + efectos sintetizados por `tools/make-audio.mjs` (reloj, lápiz, toques de UI, whooshes, chime del «aha», riser de tensión, impacto del 5.0, pop del logo). La música baja a 10 % en la expectación (30–37,5 s).

## Recursos y licencias
- Música: HoliznaCC0 · CC0 1.0. Efectos: generados por código (sin terceros).
- UI: componentes reales de la landing de studia+ (`src/components/landing/Mockups.tsx`) renderizados con el CSS de la app. Ícono: `public/icon.svg`.
- Tipografía: Geist (la de la app).

## Limitaciones verificadas (honestas)
- Las pantallas privadas del dashboard no eran accesibles sin sesión: «Mis materias» es una recreación con los tokens de la app; inicio/ruta/tutor/método/hábitos usan los bloques reales de la landing.
- Teléfono genérico (no es un modelo comercial). Personajes estilizados, no fotorrealistas; el profesor es el modelo más tosco.
- El video no promete notas: es una historia ilustrativa; studia+ no garantiza resultados académicos.
- Render en CPU (SwiftShader), calidad `draft`: el DOF y la iluminación son aproximados, sin trazado de rayos.
