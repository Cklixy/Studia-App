import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir inmediatamente al dashboard de materias
  redirect('/materias');
}
