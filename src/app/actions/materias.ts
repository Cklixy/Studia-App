"use server";

import { revalidateMateriasCache } from "@/lib/data/materias";

export async function invalidateMateriasAction(userId?: string) {
  await revalidateMateriasCache(userId);
}
