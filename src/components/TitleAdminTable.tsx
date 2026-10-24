"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TitleRow } from "@/lib/data";

export function TitleAdminTable({ items }: { items: TitleRow[] }) {
  const router = useRouter();

  async function remove(id: number) {
    if (!confirm("Remover este título?")) return;
    await fetch(`/api/admin/titles/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/8">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-white/5 text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3">Título</th>
            <th>Tipo</th>
            <th>Ano</th>
            <th>Classificação</th>
            <th>Licença</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-white/8">
              <td className="px-4 py-3">{item.title}</td>
              <td>{item.type}</td>
              <td>{item.year}</td>
              <td>{item.rating}</td>
              <td>{item.license}</td>
              <td className="space-x-3 px-4 py-3 text-right">
                <Link href={`/admin/titulos/${item.id}`} className="text-[var(--accent)]">
                  Editar
                </Link>
                <button type="button" onClick={() => remove(item.id)} className="text-[var(--danger)]">
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
