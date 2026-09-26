import Link from "next/link";
import { Sparkles } from "lucide-react";
import BarraUso from "./BarraUso";
import { fechaReinicio, textoVigenciaPro, type EstadoPlan } from "@/lib/plan";

/** Ajustes → pestaña «Plan y suscripción»: plan actual, consumo del mes y acceso a los planes. */
export default function SeccionPlan({ estado }: { estado: EstadoPlan | null }) {
  if (!estado) return null;
  const esPro = estado.plan === "pro";
  return (
    <section aria-labelledby="plan-titulo" className="apple-card p-6 md:p-8 shadow-apple-sm space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="plan-titulo" className="apple-title-3 text-arctic-slate flex items-center gap-2">
            Plan y uso <EtiquetaPlan plan={estado.plan} />
          </h2>
          <p className="text-sm text-arctic-secondary mt-1">
            {esPro && estado.pro_hasta
              ? textoVigenciaPro(estado.pro_hasta)
              : "Estás en el plan gratuito."}{" "}
            El uso se reinicia el {fechaReinicio(estado.reinicia_el)}.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <BarraUso etiqueta="Rutas con IA este mes" usados={estado.rutas.usados} limite={estado.rutas.limite} />
        <BarraUso etiqueta="Mensajes al tutor este mes" usados={estado.mensajes.usados} limite={estado.mensajes.limite} />
      </div>
      <Link href="/planes" className={`${esPro ? "btn-apple-secondary" : "btn-apple-primary"} text-sm min-h-11 px-5 apple-tactile`}>
        {!esPro && <Sparkles size={15} aria-hidden="true" />}
        <span>{esPro ? "Ver mi plan" : "Ver el plan Pro"}</span>
      </Link>
      <p className="text-xs text-arctic-secondary">
        El pago en línea llegará pronto. Mientras tanto, el equipo de studia+ activa y renueva el Pro.
      </p>
    </section>
  );
}

/** Etiqueta discreta del plan («Pro» en azul; «Free» en gris). */
export function EtiquetaPlan({ plan }: { plan: EstadoPlan["plan"] }) {
  return plan === "pro" ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-white bg-glacier-blue px-2 py-0.5 rounded-full">
      <Sparkles size={11} aria-hidden="true" /> Pro
    </span>
  ) : (
    <span className="text-xs font-semibold tracking-wide text-arctic-secondary bg-black/[0.05] px-2 py-0.5 rounded-full">Free</span>
  );
}
