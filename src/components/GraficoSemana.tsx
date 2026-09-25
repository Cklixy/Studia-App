// Gráfico de minutos por día (rediseño 4.6): legible sin depender del color — cada barra lleva su
// valor escrito y el día debajo; para lectores de pantalla, una tabla con los mismos datos.
export default function GraficoSemana({ dias }: { dias: { etiqueta: string; nombre: string; minutos: number; esHoy: boolean }[] }) {
  const max = Math.max(30, ...dias.map((d) => d.minutos));
  const total = dias.reduce((s, d) => s + d.minutos, 0);

  return (
    <figure className="tarjeta p-4 sm:p-5">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="encabezado">Últimos 7 días</span>
        <span className="text-sm text-tinta-2 tabular-nums">{total} min en total</span>
      </figcaption>

      <div aria-hidden="true" className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-3 items-end h-40">
        {dias.map((d) => (
          <div key={d.nombre} className="flex h-full flex-col items-center justify-end gap-1">
            <span className={`text-xs font-semibold tabular-nums ${d.minutos ? "text-tinta" : "text-tinta-3"}`}>{d.minutos}</span>
            <div
              className={`w-full max-w-10 rounded-t-lg ${d.minutos ? (d.esHoy ? "bg-acento" : "bg-acento/60") : "bg-hundido"}`}
              style={{ height: `${Math.max(4, (d.minutos / max) * 100)}%` }}
            />
            <span className={`text-xs font-semibold ${d.esHoy ? "text-acento" : "text-tinta-2"}`}>{d.etiqueta}</span>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>Minutos de estudio de los últimos 7 días</caption>
        <thead>
          <tr><th scope="col">Día</th><th scope="col">Minutos</th></tr>
        </thead>
        <tbody>
          {dias.map((d) => (
            <tr key={d.nombre}><th scope="row">{d.nombre}{d.esHoy ? " (hoy)" : ""}</th><td>{d.minutos}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
