"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function SettingsClient({ email }: { email: string }) {
  const [activeTab, setActiveTab] = useState<"perfil" | "notificaciones" | "privacidad" | "facturacion">("perfil");

  return (
    <div className="space-y-6 mt-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
      
      {/* Mobile: horizontal scrollable pill tabs | Desktop: left column */}
      <div className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 shrink-0">
        {[
          { key: "perfil" as const, label: "Mi Perfil", icon: <User size={16} /> },
          { key: "notificaciones" as const, label: "Notificaciones", icon: <Bell size={16} /> },
          { key: "privacidad" as const, label: "Privacidad", icon: <Shield size={16} /> },
          { key: "facturacion" as const, label: "Facturación", icon: <CreditCard size={16} /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all apple-tactile whitespace-nowrap shrink-0 md:w-full ${
              activeTab === key
                ? "bg-white text-arctic-slate shadow-apple-sm border border-black/[0.06]"
                : "text-arctic-secondary hover:bg-black/[0.03] hover:text-arctic-slate"
            }`}
          >
            <span className={activeTab === key ? "text-glacier-blue" : ""}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Right Column: Settings Content */}
      <div className="md:col-span-2 space-y-6 animate-in fade-in duration-300">
        
        {/* ======================= PERFIL ======================= */}
        {activeTab === "perfil" && (
          <>
            <section className="apple-card p-6 md:p-8 bg-white/95 border border-black/[0.08] shadow-apple-sm">
              <h2 className="text-lg font-bold text-arctic-slate mb-4 flex items-center gap-2">
                <User size={18} className="text-glacier-blue" />
                <span>Información Personal</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-arctic-secondary mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="w-full bg-frost-base border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs font-medium text-arctic-slate font-mono">
                    {email}
                  </div>
                  <p className="text-[11px] text-arctic-tertiary mt-1.5">
                    Tu correo está vinculado a tu cuenta de autenticación de Studia+.
                  </p>
                </div>
              </div>
            </section>

            <section className="apple-card p-6 md:p-8 bg-white/95 border border-cool-berry/20 shadow-apple-sm">
              <h2 className="text-base font-bold text-cool-berry mb-2 flex items-center gap-2">
                <span>Zona de Seguridad</span>
              </h2>
              <p className="text-xs text-arctic-secondary mb-5">
                Cerrar sesión en este navegador y desconectar credenciales locales.
              </p>
              
              <LogoutButton />
            </section>
          </>
        )}

        {/* ======================= NOTIFICACIONES ======================= */}
        {activeTab === "notificaciones" && (
          <section className="apple-card p-6 md:p-8 bg-white/95 border border-black/[0.08] shadow-apple-sm">
            <h2 className="text-lg font-bold text-arctic-slate mb-4 flex items-center gap-2">
              <Bell size={18} className="text-glacier-blue" />
              <span>Preferencias de Notificación</span>
            </h2>
            
            <div className="space-y-3">
              {[
                { title: "Recordatorios de Estudio", desc: "Recibe alertas para mantener tu racha activa.", defaultOn: true },
                { title: "Actualizaciones de IA", desc: "Novedades cuando el modelo Gemini genere nuevas recomendaciones.", defaultOn: true },
                { title: "Novedades de la Plataforma", desc: "Nuevas funcionalidades y avisos de actualización.", defaultOn: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-frost-base/60 border border-black/[0.06] rounded-xl">
                  <div>
                    <h3 className="text-arctic-slate text-xs font-semibold">{item.title}</h3>
                    <p className="text-arctic-secondary text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  {/* Apple Switch */}
                  <div className="relative inline-block w-11 h-6 align-middle select-none shrink-0 ml-3">
                    <input type="checkbox" defaultChecked={item.defaultOn} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white shadow-sm border border-black/10 cursor-pointer top-0.5 left-0.5 z-10 transition-transform duration-200 ease-in-out peer" />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-black/10 cursor-pointer peer-checked:bg-glacier-blue transition-colors"></label>
                  </div>
                </div>
              ))}
            </div>
            <style jsx>{`
              .toggle-checkbox:checked {
                transform: translateX(20px);
              }
            `}</style>
          </section>
        )}

        {/* ======================= PRIVACIDAD ======================= */}
        {activeTab === "privacidad" && (
          <section className="apple-card p-6 md:p-8 bg-white/95 border border-black/[0.08] shadow-apple-sm">
            <h2 className="text-lg font-bold text-arctic-slate mb-4 flex items-center gap-2">
              <Shield size={18} className="text-glacier-blue" />
              <span>Privacidad y Datos</span>
            </h2>
            
            <div className="space-y-3">
              {[
                { title: "Modo Silencioso", desc: "Oculta tu actividad en resúmenes públicos.", defaultOn: false },
                { title: "Mejora de Modelos Cognitivos", desc: "Patrones anónimos de estudio para optimizar las rutas curriculares.", defaultOn: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-frost-base/60 border border-black/[0.06] rounded-xl">
                  <div>
                    <h3 className="text-arctic-slate text-xs font-semibold">{item.title}</h3>
                    <p className="text-arctic-secondary text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  <div className="relative inline-block w-11 h-6 align-middle select-none shrink-0 ml-3">
                    <input type="checkbox" defaultChecked={item.defaultOn} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white shadow-sm border border-black/10 cursor-pointer top-0.5 left-0.5 z-10 transition-transform duration-200 ease-in-out peer" />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-black/10 cursor-pointer peer-checked:bg-glacier-blue transition-colors"></label>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-black/[0.06]">
                <button className="text-xs font-medium text-glacier-blue hover:underline">
                  Descargar mis registros de estudio (.json)
                </button>
              </div>
            </div>
            <style jsx>{`
              .toggle-checkbox:checked {
                transform: translateX(20px);
              }
            `}</style>
          </section>
        )}

        {/* ======================= FACTURACIÓN ======================= */}
        {activeTab === "facturacion" && (
          <>
            <section className="apple-card p-6 md:p-8 relative overflow-hidden bg-white/95 border border-black/[0.08] shadow-apple-sm">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-glacier-blue/10 blur-3xl rounded-full pointer-events-none"></div>
              
              <h2 className="text-lg font-bold text-arctic-slate mb-1">
                Plan Actual
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-glacier-blue/10 text-glacier-blue border border-glacier-blue/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  studia+ activo
                </span>
                <span className="text-arctic-secondary text-xs font-medium">Plan Estudiantil</span>
              </div>
              
              <p className="text-xs text-arctic-secondary mb-5 max-w-md leading-relaxed">
                Dispones de acceso ilimitado a generación de rutas curriculares, tutor inteligente y cronometría de concentración.
              </p>

              <button className="btn-apple-secondary text-xs py-2 px-4.5 apple-tactile">
                Gestionar plan
              </button>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
