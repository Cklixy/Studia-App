// Estado de carga al navegar entre pantallas con sesión: esqueleto con la forma de las pantallas
// del rediseño (título, tarjeta principal y lista), para que el cambio no «salte» al cargar.
export default function CargandoDashboard() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Cargando…</span>
      <div aria-hidden="true" className="flex flex-col gap-2">
        <div className="esqueleto h-4 w-40" />
        <div className="esqueleto h-10 w-64 max-w-full" />
      </div>
      <div aria-hidden="true" className="esqueleto h-48 rounded-2xl" />
      <div aria-hidden="true" className="flex flex-col gap-2">
        <div className="esqueleto h-16 rounded-2xl" />
        <div className="esqueleto h-16 rounded-2xl" />
      </div>
    </div>
  );
}
