import { redirect } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";
import BarraUso from "@/components/plan/BarraUso";
import BotonPagarPro from "@/components/plan/BotonPagarPro";
import { EtiquetaPlan } from "@/components/plan/SeccionPlan";
import { PROTECTORES } from "@/lib/protectores";
import { fechaReinicio, LIMITES, textoVigenciaPro, obtenerEstadoPlan, PRECIO_PRO_COP } from "@/lib/plan";

export const metadata = { title: "Planes" };

const INCLUIDO = ["Materias, temas y sesiones sin límite", "Racha, meta semanal e historial", "Notas, parciales y simulador", "Música para concentrarte"];

// Planes Free y Pro. El pago es único (30 días) con Wompi; el webhook (api/pagos/webhook) activa el Pro.
// También se puede dar a mano desde la base de datos (private.admin_dar_pro).
export default async function PlanesPage({ searchParams }: { searchParams: { pago?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const estado = await obtenerEstadoPlan(supabase);
  const esPro = estado?.plan === "pro";
  const precio = PRECIO_PRO_COP.toLocaleString("es-CO");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <EncabezadoPantalla
        etiqueta="Tu plan"
        titulo="Planes"
        descripcion="Lo esencial de studia+ es gratis. Pro amplía cuántas rutas con IA y mensajes al tutor puedes usar cada mes."
      />

      {searchParams.pago && (
        <p role="status" className="apple-card p-4 text-sm text-arctic-slate">
          {esPro
            ? "¡Pago recibido! Tu plan Pro ya está activo."
            : "Estamos confirmando tu pago. Puede tardar un minuto: recarga esta página para ver tu plan."}
        </p>
      )}

      {estado && (
        <section aria-labelledby="uso-titulo" className="apple-card p-5 sm:p-6 space-y-4">
          <h2 id="uso-titulo" className="apple-headline text-arctic-slate flex items-center gap-2">
            Tu uso este mes <EtiquetaPlan plan={estado.plan} />
          </h2>
          <BarraUso etiqueta="Rutas con IA" usados={estado.rutas.usados} limite={estado.rutas.limite} />
          <BarraUso etiqueta="Mensajes al tutor" usados={estado.mensajes.usados} limite={estado.mensajes.limite} />
          <p className="text-xs text-arctic-secondary">Se reinicia el {fechaReinicio(estado.reinicia_el)}.</p>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Free */}
        <section aria-labelledby="free-titulo" className={`apple-card p-6 flex flex-col ${!esPro ? "ring-2 ring-glacier-blue/30" : ""}`}>
          <h2 id="free-titulo" className="apple-title-3 text-arctic-slate">Free</h2>
          <p className="mt-2">
            <span className="text-3xl font-bold tracking-tight text-arctic-slate">Gratis</span>
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-arctic-slate flex-1">
            <li className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" />{LIMITES.free.ruta} rutas con IA al mes</li>
            <li className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" />{LIMITES.free.mensaje} mensajes al tutor al mes</li>
            <li className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" />{PROTECTORES.free} protector de racha al mes</li>
            {INCLUIDO.map((x) => (
              <li key={x} className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" />{x}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-medium text-arctic-secondary">{esPro ? "Incluido siempre" : "Tu plan actual"}</p>
        </section>

        {/* Pro */}
        <section aria-labelledby="pro-titulo" className={`apple-card p-6 flex flex-col border-glacier-blue/30 ${esPro ? "ring-2 ring-glacier-blue/30" : ""}`}>
          <h2 id="pro-titulo" className="apple-title-3 text-arctic-slate flex items-center gap-2">
            Pro <Sparkles size={17} className="text-glacier-blue" aria-hidden="true" />
          </h2>
          <p className="mt-2">
            <span className="text-3xl font-bold tracking-tight text-arctic-slate">{precio} COP</span>
            <span className="text-sm text-arctic-secondary"> / mes</span>
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-arctic-slate flex-1">
            <li className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" /><span><strong>{LIMITES.pro.ruta} rutas con IA</strong> al mes</span></li>
            <li className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" /><span><strong>{LIMITES.pro.mensaje} mensajes al tutor</strong> al mes</span></li>
            <li className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" /><span><strong>{PROTECTORES.pro} protectores de racha</strong> al mes</span></li>
            <li className="flex gap-2"><Check size={17} className="text-glacier-blue shrink-0" aria-hidden="true" />Todo lo del plan Free</li>
          </ul>
          <div className="mt-6">
            {esPro ? (
              <p className="text-sm font-medium text-arctic-slate">
                {textoVigenciaPro(estado?.pro_hasta ?? null)}
              </p>
            ) : (
              <BotonPagarPro />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
