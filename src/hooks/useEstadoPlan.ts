"use client";

import { useCallback, useEffect, useState } from "react";
import type { EstadoPlan, TipoUso } from "@/lib/plan";

/**
 * Plan y consumo del mes en el cliente (Crear ruta, tutor). null mientras carga o si la migración
 * de suscripciones aún no está aplicada: en ese caso no se muestra ningún contador.
 */
export function useEstadoPlan() {
  const [estado, setEstado] = useState<EstadoPlan | null>(null);

  const recargar = useCallback(async () => {
    try {
      const res = await fetch("/api/plan", { cache: "no-store" });
      if (res.ok) setEstado(await res.json());
    } catch {
      // Sin conexión: se mantiene el último estado conocido
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  /** Actualiza el consumo con el que devuelve la API tras usar la IA (sin otra petición). */
  const actualizarUso = useCallback((tipo: TipoUso, uso: { usados: number; limite: number; plan?: string }) => {
    setEstado((e) => {
      if (!e) return e;
      const clave = tipo === "ruta" ? "rutas" : "mensajes";
      return { ...e, [clave]: { usados: uso.usados, limite: uso.limite } };
    });
  }, []);

  return { estado, recargar, actualizarUso };
}
