/** Barra de consumo del mes («3 de 5 rutas con IA»). Sin rojo: quedarse sin cupo no es un error. */
export default function BarraUso({ etiqueta, usados, limite }: { etiqueta: string; usados: number; limite: number }) {
  const pct = limite > 0 ? Math.min(100, Math.round((usados / limite) * 100)) : 0;
  const lleno = usados >= limite;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-arctic-slate font-medium">{etiqueta}</span>
        <span className="text-arctic-secondary tabular-nums">
          {usados} de {limite}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${etiqueta}: ${usados} de ${limite} usados este mes`}
        aria-valuemin={0}
        aria-valuemax={limite}
        aria-valuenow={Math.min(usados, limite)}
        className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden mt-1.5"
      >
        <div className={`h-full rounded-full ${lleno ? "bg-arctic-tertiary" : "bg-glacier-blue"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
