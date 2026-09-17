import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateMateriasCache } from "@/lib/data/materias";
import { z } from "zod";

const updateMateriaSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(500).optional(),
  fecha_parcial: z.string().nullable().optional(), // ISO date string
});

// PATCH — Actualizar materia
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const validated = updateMateriaSchema.parse(body);

  const { data, error } = await supabase
    .from("materias")
    .update(validated)
    .eq("id", params.id)
    .eq("user_id", user.id) // RLS extra check
    .select("id, nombre, descripcion, fecha_parcial")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await revalidateMateriasCache(user.id);
  return NextResponse.json(data);
}

// DELETE — Eliminar materia (CASCADE elimina temas y sesiones relacionadas)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("materias")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await revalidateMateriasCache(user.id);
  return NextResponse.json({ success: true });
}
