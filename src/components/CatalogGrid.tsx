import type { TitleRow } from "@/lib/data";
import { TitleCard } from "./TitleCard";

export function CatalogGrid({ items }: { items: TitleRow[] }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/4 px-6 py-16 text-center text-[var(--muted)]">
        Nenhum título encontrado com esses filtros.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
            <TitleCard key={item.id} title={item} />
      ))}
    </div>
  );
}
