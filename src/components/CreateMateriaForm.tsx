"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

const CreateMateriaModal = dynamic(() => import("./CreateMateriaModal"), {
  ssr: false,
});

// Botón «Nueva materia»: primario cuando es la acción principal de la pantalla (Materias), secundario en el resto.
export default function CreateMateriaForm({ variante = "secundario", className = "" }: { variante?: "primario" | "secundario"; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={`${variante === "primario" ? "btn-primario" : "btn-secundario"} ${className}`}>
        <Plus aria-hidden="true" size={18} />
        <span>Nueva materia</span>
      </button>

      {isOpen && <CreateMateriaModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
