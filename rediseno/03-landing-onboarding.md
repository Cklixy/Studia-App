# 03 · Landing y acceso

**Skills:**
- `web-design-guidelines` no está instalada. Revisé contra las reglas de `studia-design-system` (propias), las pautas de UX de `ui-ux-pro-max` y axe.
- `vercel-react-best-practices`:
  - la landing queda como **componentes de servidor**, salvo 3 islas cliente mínimas (`HeroCta`, `EnlaceCuenta`, `CalculaTuRitmo`);
  - se eliminó el menú hamburguesa con estado;
  - los iconos se renderizan en el servidor;
  - las preguntas frecuentes usan `<details>` nativo, sin JavaScript.

Capturas «después» en `rediseno/despues/fase3/` y «antes» en `rediseno/antes/` (sin commitear).

## Landing

| Antes | Después | Por qué |
|---|---|---|
| «Estudia con dirección.» + 9 secciones de maquetas; 8 998 px en móvil | «Estudia **lo que toca** hoy.» + 5 secciones; **5 003 px** en móvil (−44 %) | Propuesta de valor en 5 s: qué hace (plan diario hasta el parcial) y para quién (universitarios) |
| 2 CTA de igual peso en cabecera y hero; menú hamburguesa | **Un** `btn-primario` («Empieza gratis»); «Entrar» secundario en la cabecera; «Ver cómo funciona» como enlace | Principio 1 |
| Maquetas con fechas fijas («18 septiembre», «Hoy · 17:23») | Maqueta de «Hoy» hecha con los estilos reales, **sin fechas absolutas** («Parcial en 6 días»), y descrita como imagen para lectores de pantalla | D-08: la landing es estática, así que una fecha fija caduca |
| Sin «cómo funciona» claro | 3 pasos numerados | Pedido en la Fase 3 |
| No se podía probar nada sin cuenta | **«Pruébalo ahora»**: días y temas → el mismo cálculo del «Plan hasta el parcial» (`calcularPlanParcial`), con reparto por día y repaso | Ver el valor antes de registrarse |
| No decía qué es gratis | Bloque «¿Cuánto cuesta? Nada.» + FAQ con los límites reales de la IA (10 preguntas/min al tutor, 3 planes/h) | Confianza: sin letra pequeña |
| Sin preguntas frecuentes | 6 preguntas: gratis, instalación, IA que puede equivocarse, racha rota sin culpa, privacidad y otros niveles | Principios 6 y 8 |
| Pie con «Privacidad · Términos» que parecían enlaces y no lo eran | Solo enlaces reales + cómo exportar o borrar los datos | Honestidad; hallazgo de la auditoría |
| **Prueba social** | **No añadida.** No hay testimonios ni cifras reales de usuarios, y no los invento | Pendiente: tras la prueba con 5 estudiantes (Fase 6), citas reales con permiso |

## Acceso (login, registro, recuperar, nueva contraseña, 404)

- **Marco nuevo:**
  - en el móvil, sin tarjeta y a pantalla completa, para que el teclado no tape el botón;
  - en pantallas anchas, una hoja centrada;
  - H1 en Fraunces («Crea tu cuenta», «Hola de nuevo»).
- **Registro con 2 campos:** correo y contraseña.
  - La contraseña admite pegar y usa `autocomplete="new-password"`.
  - La ayuda dice «Puedes pegarla desde tu gestor de contraseñas».
  - El subtítulo promete «En un minuto tendrás tu primer plan».
- **`BotonEnviar`** (`useFormStatus`): muestra «Creando tu cuenta…» o «Entrando…» con un indicador y se deshabilita mientras la server action responde. Antes no había ninguna señal, y el doble clic enviaba dos veces.
- Los enlaces secundarios («¿Olvidaste tu contraseña?», «Crea una gratis») van subrayados y con 44 px de alto.
- Primera acción útil en menos de 60 s: el registro lleva a «Hoy», cuyo estado vacío (Fase 4.1) crea la primera materia en la misma pantalla.

## Medición

| Métrica | Antes (prod) | Después | Nota |
|---|---|---|---|
| First Load JS `/` | 107 kB | **99,4 kB** | [VERIFICADO] `npm run build` |
| First Load JS `/login`, `/registro` | 104 kB | **98,5 kB** | ídem |
| Fuentes transferidas | 68 KB | **39 KB** | [VERIFICADO] Lighthouse |
| Lighthouse `/` móvil | 99 · 100 · 100 · 100 | 98 · 100 · 100 · 100 | Local con `next start` (sin CDN): LCP 2,30 s, CLS 0,001. No es comparable con producción (TTFB local de 454 ms). **Se repite en el Preview (Fase 6)** |
| Lighthouse `/` escritorio | 100 · 100 · 100 · 100 | 100 · 100 · 100 · 100 | LCP 0,50 s |
| Lighthouse `/registro` móvil y escritorio | — | 99 / 100 en rendimiento, 100 en el resto | LCP 2,0 s / 0,46 s |
| axe (WCAG 2.2 AA + buenas prácticas) | 0 | **0 violaciones** en 24 comprobaciones (landing, login, registro, recuperar, 404 e Inicio × 390/1440 × claro/oscuro) | [VERIFICADO] |

El elemento LCP en móvil es el párrafo del hero: el 77 % del tiempo es retraso de renderizado, a la espera de la fuente. Si en el Preview supera 2,5 s, la mitigación es acortar el párrafo o usar `display: optional` en Figtree.
