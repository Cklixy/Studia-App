import React from "react";
import {
  Calculator,
  Cpu,
  Code2,
  Network,
  Atom,
  FlaskConical,
  BookOpen,
  Sparkles,
  Sigma,
  LucideIcon,
} from "lucide-react";

interface SubjectVisualConfig {
  Icon: LucideIcon;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

/**
 * Heurística para determinar el icono y colores sutiles de la materia según su nombre.
 * Sin emojis, usando iconos vectoriales limpios de Lucide con tonalidades suaves y profesionales.
 */
export function getSubjectVisualConfig(subjectName?: string | null): SubjectVisualConfig {
  if (!subjectName) {
    return {
      Icon: BookOpen,
      bgClass: "bg-black/[0.04]",
      textClass: "text-arctic-secondary",
      borderClass: "border-black/[0.05]",
    };
  }

  // Normalizar: minúsculas y sin acentos
  const normalized = subjectName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Matemáticas / Cálculo / Álgebra
  if (
    normalized.includes("calculo") ||
    normalized.includes("diferencial") ||
    normalized.includes("integral") ||
    normalized.includes("algebra") ||
    normalized.includes("matematica") ||
    normalized.includes("estadistica") ||
    normalized.includes("geometria")
  ) {
    return {
      Icon: normalized.includes("integral") || normalized.includes("calculo") ? Sigma : Calculator,
      bgClass: "bg-blue-500/[0.08]",
      textClass: "text-blue-600",
      borderClass: "border-blue-500/15",
    };
  }

  // Arquitectura / Hardware / Sistemas computacionales
  if (
    normalized.includes("arquitectura") ||
    normalized.includes("hardware") ||
    normalized.includes("computador") ||
    normalized.includes("sistema operativo") ||
    normalized.includes("microprocesador")
  ) {
    return {
      Icon: Cpu,
      bgClass: "bg-indigo-500/[0.08]",
      textClass: "text-indigo-600",
      borderClass: "border-indigo-500/15",
    };
  }

  // Programación / Software / Algoritmos / Web
  if (
    normalized.includes("programacion") ||
    normalized.includes("codigo") ||
    normalized.includes("software") ||
    normalized.includes("algoritmo") ||
    normalized.includes("desarrollo") ||
    normalized.includes("web") ||
    normalized.includes("datos")
  ) {
    return {
      Icon: Code2,
      bgClass: "bg-cyan-500/[0.08]",
      textClass: "text-cyan-700",
      borderClass: "border-cyan-500/15",
    };
  }

  // Redes / Telecomunicaciones
  if (
    normalized.includes("red") ||
    normalized.includes("telecomunicaci") ||
    normalized.includes("cisco") ||
    normalized.includes("comunicacion")
  ) {
    return {
      Icon: Network,
      bgClass: "bg-teal-500/[0.08]",
      textClass: "text-teal-700",
      borderClass: "border-teal-500/15",
    };
  }

  // Física
  if (
    normalized.includes("fisica") ||
    normalized.includes("mecanica") ||
    normalized.includes("cuantica") ||
    normalized.includes("termodinamica")
  ) {
    return {
      Icon: Atom,
      bgClass: "bg-violet-500/[0.08]",
      textClass: "text-violet-600",
      borderClass: "border-violet-500/15",
    };
  }

  // Química / Biología / Ciencias Naturales
  if (
    normalized.includes("quimica") ||
    normalized.includes("bioquimica") ||
    normalized.includes("biologia") ||
    normalized.includes("laboratorio") ||
    normalized.includes("organica")
  ) {
    return {
      Icon: FlaskConical,
      bgClass: "bg-emerald-500/[0.08]",
      textClass: "text-emerald-700",
      borderClass: "border-emerald-500/15",
    };
  }

  // Sesión libre / Creatividad / Repaso
  if (
    normalized.includes("libre") ||
    normalized.includes("repaso") ||
    normalized.includes("general") ||
    normalized.includes("estudio")
  ) {
    return {
      Icon: Sparkles,
      bgClass: "bg-amber-500/[0.08]",
      textClass: "text-amber-700",
      borderClass: "border-amber-500/15",
    };
  }

  // Fallback por defecto
  return {
    Icon: BookOpen,
    bgClass: "bg-black/[0.04]",
    textClass: "text-arctic-secondary",
    borderClass: "border-black/[0.06]",
  };
}

interface SubjectIconContainerProps {
  subjectName?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SubjectIconContainer({
  subjectName,
  size = "md",
  className = "",
}: SubjectIconContainerProps) {
  const { Icon, bgClass, textClass, borderClass } = getSubjectVisualConfig(subjectName);

  const sizeClasses = {
    sm: "w-9 h-9 rounded-xl",
    md: "w-11 h-11 rounded-2xl",
    lg: "w-12 h-12 rounded-2xl",
  };

  const iconSizes = {
    sm: 16,
    md: 19,
    lg: 22,
  };

  return (
    <div
      className={`shrink-0 flex items-center justify-center border transition-colors ${sizeClasses[size]} ${bgClass} ${textClass} ${borderClass} ${className}`}
      aria-hidden="true"
    >
      <Icon size={iconSizes[size]} strokeWidth={1.85} />
    </div>
  );
}
