"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const SORTS = [
  { value: "popular", label: "Populares" },
  { value: "recent", label: "Recentes" },
  { value: "year", label: "Ano" },
  { value: "title", label: "A–Z" },
];

export function FilterBar({
  path,
  categories,
}: {
  path: string;
  categories: { slug: string; name: string }[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, start] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    start(() => router.push(`${path}?${next.toString()}`));
  }

  return (
    <div className={`mb-6 flex flex-wrap gap-3 ${pending ? "opacity-70" : ""}`}>
      <select
        value={params.get("categoria") ?? ""}
        onChange={(e) => update("categoria", e.target.value)}
        className="rounded-full bg-white/8 px-4 py-2 text-sm ring-1 ring-white/10"
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={params.get("ordenar") ?? "popular"}
        onChange={(e) => update("ordenar", e.target.value)}
        className="rounded-full bg-white/8 px-4 py-2 text-sm ring-1 ring-white/10"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        value={params.get("ano") ?? ""}
        onChange={(e) => update("ano", e.target.value)}
        className="rounded-full bg-white/8 px-4 py-2 text-sm ring-1 ring-white/10"
      >
        <option value="">Qualquer ano</option>
        {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2012, 2010, 2008, 2006].map((y) => (
          <option key={y} value={String(y)}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
