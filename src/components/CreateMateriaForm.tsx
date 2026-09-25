"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

const CreateMateriaModal = dynamic(() => import("./CreateMateriaModal"), {
  ssr: false,
});

export default function CreateMateriaForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-secundario text-xs font-semibold py-2 px-3.5 tactil inline-flex items-center gap-1.5"
      >
        <Plus size={14} className="text-acento" />
        <span>Nueva materia</span>
      </button>

      {isOpen && (
        <CreateMateriaModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

