// Estado de carga al navegar entre pantallas con sesión. Antes no había ninguno:
// con red lenta la pantalla anterior se quedaba quieta sin señal de que algo pasaba.
export default function CargandoDashboard() {
  return (
    <div role="status" aria-live="polite" className="space-y-4 max-w-4xl mx-auto">
      <span className="sr-only">Cargando…</span>
      <div aria-hidden="true" className="h-8 w-56 rounded-xl bg-hundido motion-safe:animate-pulse" />
      <div aria-hidden="true" className="h-4 w-80 max-w-full rounded-lg bg-hundido motion-safe:animate-pulse" />
      <div aria-hidden="true" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="h-40 rounded-3xl bg-superficie border border-linea motion-safe:animate-pulse" />
        <div className="h-40 rounded-3xl bg-superficie border border-linea motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
