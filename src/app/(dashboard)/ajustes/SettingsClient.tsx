"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, LogOut, Settings as SettingsIcon } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function SettingsClient({ email }: { email: string }) {
  const [activeTab, setActiveTab] = useState<"perfil" | "notificaciones" | "privacidad" | "facturacion">("perfil");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      
      {/* Left Column: Sidebar menu for settings */}
      <div className="space-y-2">
        <button 
          onClick={() => setActiveTab("perfil")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "perfil" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"
          }`}
        >
          <User size={18} /> Mi Perfil
        </button>
        <button 
          onClick={() => setActiveTab("notificaciones")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "notificaciones" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"
          }`}
        >
          <Bell size={18} /> Notificaciones
        </button>
        <button 
          onClick={() => setActiveTab("privacidad")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "privacidad" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"
          }`}
        >
          <Shield size={18} /> Privacidad
        </button>
        <button 
          onClick={() => setActiveTab("facturacion")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "facturacion" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"
          }`}
        >
          <CreditCard size={18} /> Facturación
        </button>
      </div>

      {/* Right Column: Settings Content */}
      <div className="md:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* ======================= PERFIL ======================= */}
        {activeTab === "perfil" && (
          <>
            <section className="surface-elevated p-8">
              <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <User size={20} className="text-electric-periwinkle" />
                Información Personal
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-text-secondary mb-2">
                    Correo Electrónico
                  </label>
                  <div className="w-full bg-deep-ink border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary">
                    {email}
                  </div>
                  <p className="text-xs text-text-secondary mt-2">
                    Tu correo está vinculado a tu cuenta de Google o Supabase y no puede ser cambiado desde aquí.
                  </p>
                </div>
              </div>
            </section>

            <section className="surface-panel border-warm-coral/20 p-8">
              <h2 className="text-xl font-display font-bold text-warm-coral mb-4 flex items-center gap-2">
                Zona de Peligro
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Cerrar sesión en este dispositivo.
              </p>
              
              <LogoutButton />
            </section>
          </>
        )}

        {/* ======================= NOTIFICACIONES ======================= */}
        {activeTab === "notificaciones" && (
          <section className="surface-elevated p-8">
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Bell size={20} className="text-electric-periwinkle" />
              Preferencias de Notificación
            </h2>
            
            <div className="space-y-6">
              {[
                { title: "Recordatorios de Estudio", desc: "Recibe alertas para mantener tu racha activa.", defaultOn: true },
                { title: "Actualizaciones de IA", desc: "Novedades cuando el modelo Gemini genere nuevas recomendaciones.", defaultOn: true },
                { title: "Ofertas y Novedades", desc: "Nuevas funcionalidades y promociones de studia+.", defaultOn: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <h3 className="text-white text-sm font-medium">{item.title}</h3>
                    <p className="text-text-secondary text-xs mt-1">{item.desc}</p>
                  </div>
                  {/* Custom Toggle Switch */}
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input type="checkbox" defaultChecked={item.defaultOn} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-transparent top-0 bottom-0 m-auto z-10 transition-transform duration-200 ease-in-out peer" />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-deep-ink border border-white/20 cursor-pointer peer-checked:bg-electric-periwinkle/50 peer-checked:border-electric-periwinkle"></label>
                  </div>
                </div>
              ))}
            </div>
            <style jsx>{`
              .toggle-checkbox:checked {
                transform: translateX(100%);
              }
            `}</style>
          </section>
        )}

        {/* ======================= PRIVACIDAD ======================= */}
        {activeTab === "privacidad" && (
          <section className="surface-elevated p-8">
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-electric-periwinkle" />
              Privacidad y Datos
            </h2>
            
            <div className="space-y-6">
              {[
                { title: "Modo Privado (Ghost)", desc: "Oculta tu progreso en las tablas de clasificación globales.", defaultOn: false },
                { title: "Entrenamiento de IA", desc: "Permitir que tus patrones de estudio anónimos mejoren nuestras rutas IA.", defaultOn: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <h3 className="text-white text-sm font-medium">{item.title}</h3>
                    <p className="text-text-secondary text-xs mt-1">{item.desc}</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input type="checkbox" defaultChecked={item.defaultOn} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-transparent top-0 bottom-0 m-auto z-10 transition-transform duration-200 ease-in-out peer" />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-deep-ink border border-white/20 cursor-pointer peer-checked:bg-electric-periwinkle/50 peer-checked:border-electric-periwinkle"></label>
                  </div>
                </div>
              ))}

              <div className="pt-6 border-t border-white/10">
                <button className="text-sm font-medium text-text-secondary hover:text-white transition-colors underline underline-offset-4">
                  Descargar todos mis datos (.json)
                </button>
              </div>
            </div>
            <style jsx>{`
              .toggle-checkbox:checked {
                transform: translateX(100%);
              }
            `}</style>
          </section>
        )}

        {/* ======================= FACTURACIÓN ======================= */}
        {activeTab === "facturacion" && (
          <>
            <section className="surface-panel p-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-signal-lime/20 blur-3xl rounded-full pointer-events-none"></div>
              
              <h2 className="text-xl font-display font-bold text-white mb-2">
                Plan Actual
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-signal-lime/20 text-signal-lime px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  studia+ premium
                </span>
                <span className="text-text-secondary text-sm">$9.99 / mes</span>
              </div>
              
              <p className="text-sm text-text-secondary mb-6">
                Tienes acceso ilimitado a generación de rutas, chat inteligente y estadísticas profundas.
                Próximo cobro: <strong>15 de Octubre, 2026</strong>.
              </p>

              <button className="btn-action w-auto py-2 px-6 text-sm bg-white text-black hover:bg-white/90 shadow-none border-none">
                Administrar Suscripción
              </button>
            </section>

            <section className="surface-elevated p-8">
              <h2 className="text-lg font-display font-bold text-white mb-6">
                Método de Pago
              </h2>
              <div className="flex items-center justify-between p-4 bg-deep-ink border border-white/10 rounded-xl mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">VISA</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Visa terminada en 4242</p>
                    <p className="text-text-secondary text-xs">Expira 12/28</p>
                  </div>
                </div>
                <button className="text-electric-periwinkle hover:text-white text-sm font-medium transition-colors">
                  Editar
                </button>
              </div>
              <p className="text-xs text-text-secondary flex items-center gap-2">
                <Shield size={12} /> Facturación segura gestionada por Stripe.
              </p>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
