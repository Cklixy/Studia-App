import { redirect } from "next/navigation";

export default function RutasPage() {
  // Redirect to the AI route generation wizard
  redirect("/rutas/crear");
}
