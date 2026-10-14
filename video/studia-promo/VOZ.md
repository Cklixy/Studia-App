# Voz en off · studia+ (video vertical, 43 s)

## Cómo debe sonar
- Voz de **mujer**, en español neutro, estilo Apple: íntima, cálida, **muy cerca del micrófono** (se escucha el aire y la respiración suave, sin gritar).
- Ritmo lento y seguro, con pausas cortas. Nada de tono de "locutora de anuncio".
- Sonrisa leve al final ("Empieza gratis hoy.").
- Sin música fuerte debajo: un fondo suave y, en el segundo 9–11, un sonido que sube de tensión hasta el estallido de la burbuja.

## Líneas y tiempos (segundos del video)

| Inicio | Fin | Texto |
|---|---|---|
| 0,3 | 4,1 | ¿Otra vez scrolleando mientras se acerca el parcial? |
| 4,7 | 8,9 | Talleres, entregas, parciales… todo a la vez. |
| 12,3 | 15,6 | Esto es studia+. |
| 16,8 | 21,0 | Te dice qué estudiar hoy y cuánto te falta para tu parcial. |
| 21,9 | 26,4 | Elige el método que más te funciona y estudia con tu música. |
| 27,1 | 31,3 | ¿Una duda en pleno estudio? Tu tutor con IA responde al momento. |
| 32,0 | 35,3 | Y tu racha te mantiene constante. |
| 36,4 | 39,6 | Y el resultado se nota. |
| 40,7 | 42,9 | Empieza gratis hoy. |

Los subtítulos del video ya coinciden con estos tiempos. Si tu voz dura más o menos, ajusta los tiempos en `index.html` (clip `subs`).

## Cómo conseguir la voz
1. **Generarla con IA** (ElevenLabs, etc.): elige una voz femenina en español, estabilidad media-alta, y pega cada línea por separado para controlar las pausas.
2. **Grabarla tú o una amiga**: celular a unos 10 cm de la boca, cuarto con ropa o cobijas (sin eco), una toma por línea.
3. Exporta una sola pista `voz.mp3` de 43 s con las líneas en los tiempos de la tabla (silencio entre ellas).

## Cómo ponerla en el video
1. Guarda el archivo como `assets/voz.mp3`.
2. En `index.html`, dentro del contenedor raíz, agrega:

```html
<audio id="voz" src="assets/voz.mp3" data-start="0" data-duration="43" data-track-index="1" data-volume="1"></audio>
```

3. `npm run check` y luego `npm run render`.
