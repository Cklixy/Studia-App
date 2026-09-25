import { Fragment, type ReactNode } from "react";

// Renderizado mínimo y seguro del Markdown que devuelve el tutor: títulos, listas, **negrita**,
// *cursiva* y `código`. Se construyen elementos React (nunca HTML crudo), así que no hay riesgo
// de inyección. Antes la respuesta se mostraba en texto plano, con los ** y # a la vista.

function enLinea(texto: string, clave: string): ReactNode[] {
  const partes: ReactNode[] = [];
  const patron = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = patron.exec(texto))) {
    if (m.index > ultimo) partes.push(texto.slice(ultimo, m.index));
    const t = m[0];
    const k = `${clave}-${i++}`;
    if (t.startsWith("**")) partes.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) partes.push(<code key={k} className="px-1 py-0.5 rounded bg-hundido font-mono text-[0.92em]">{t.slice(1, -1)}</code>);
    else partes.push(<em key={k}>{t.slice(1, -1)}</em>);
    ultimo = m.index + t.length;
  }
  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return partes;
}

export default function TextoTutor({ texto }: { texto: string }) {
  const lineas = texto.replace(/\r\n/g, "\n").split("\n");
  const bloques: ReactNode[] = [];
  let lista: { ordenada: boolean; items: string[] } | null = null;

  const cerrarLista = () => {
    if (!lista) return;
    const k = `l-${bloques.length}`;
    const items = lista.items.map((it, j) => <li key={j}>{enLinea(it, `${k}-${j}`)}</li>);
    bloques.push(
      lista.ordenada ? (
        <ol key={k} className="list-decimal pl-5 space-y-1">{items}</ol>
      ) : (
        <ul key={k} className="list-disc pl-5 space-y-1">{items}</ul>
      )
    );
    lista = null;
  };

  lineas.forEach((linea, idx) => {
    const vineta = linea.match(/^\s*[-*•]\s+(.*)$/);
    const numerada = linea.match(/^\s*\d+[.)]\s+(.*)$/);
    const titulo = linea.match(/^\s*#{1,6}\s+(.*)$/);

    if (vineta || numerada) {
      const ordenada = !!numerada;
      if (!lista || lista.ordenada !== ordenada) {
        cerrarLista();
        lista = { ordenada, items: [] };
      }
      lista.items.push((vineta || numerada)![1]);
      return;
    }
    cerrarLista();
    if (titulo) {
      bloques.push(<p key={`t-${idx}`} className="font-semibold">{enLinea(titulo[1], `t-${idx}`)}</p>);
    } else if (linea.trim() === "") {
      bloques.push(<Fragment key={`e-${idx}`} />);
    } else {
      bloques.push(<p key={`p-${idx}`}>{enLinea(linea, `p-${idx}`)}</p>);
    }
  });
  cerrarLista();

  return <div className="space-y-2">{bloques}</div>;
}
