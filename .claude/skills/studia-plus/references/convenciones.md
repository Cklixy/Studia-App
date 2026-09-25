# Convenciones de trabajo

## Código

- **Idioma**: nombres de dominio y comentarios en español (`materias`, `fechaLocal`, `calcularPlanParcial`, `Dialogo`, `abierto`, `onCerrar`). Algunos componentes antiguos tienen nombres en inglés (`CreateMateriaForm`, `SidebarNav`); no los renombres sin motivo, pero lo nuevo va en español.
- Comentarios que explican el **porqué** (a menudo citan el hallazgo de auditoría: `U-11`, `A-15`), no el qué.
- Alias `@/` → `src/`. Server Components por defecto; `"use client"` solo cuando haga falta estado, efectos o APIs del navegador.
- Tipos explícitos para datos de Supabase; evita añadir más `any`.
- Estilos solo con Tailwind + clases de `globals.css`. Estilos inline únicamente para `env(safe-area-inset-*)`.
- Reutiliza antes de crear: `Dialogo`, `lib/texto.ts`, `lib/racha.ts`, esquemas de `lib/validations`.
- No hay tests automatizados todavía; verifica con `npm run lint`, `npm run build` y probando en el navegador (móvil y escritorio).

## Commits

Conventional Commits **en español**, en minúsculas, describiendo el resultado para el usuario:

```
tipo(ámbito): descripción corta en español
```

- Tipos: `feat`, `fix`, `perf`, `refactor`, `chore`.
- Ámbitos habituales: `sesion`, `parciales`, `tutor`, `ia`, `racha`, `a11y`, `ux`, `estilos`, `navegacion`, `auth`, `ajustes`, `notificaciones`, `db`, `csp`, `seguridad`, `pwa`, `seo`, `skills`.
- Ejemplos reales: `fix(racha): día en hora de Colombia, racha vigente y progreso explicado` · `feat(navegacion): dock de 5 destinos con etiqueta visible` · `fix(a11y): el diálogo enfoca el campo principal al abrirse`.
- Un cambio lógico por commit. El autor trabaja directamente sobre `main`; no hagas push ni reescribas historia remota sin que lo pida (prefiere `git revert`).

## Cómo trabaja el autor

- Prioriza calidad percibida y accesibilidad: la app se ha auditado (UX, a11y, seguridad, rendimiento) y los arreglos se hicieron hallazgo por hallazgo.
- Quiere coherencia con el diseño existente; propuestas visuales radicalmente distintas se han descartado.
- Escribe y espera respuestas en español.
