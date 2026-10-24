"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { TitleRow } from "@/lib/data";
import { CatalogGrid } from "./CatalogGrid";

type Suggestion = { id: number; title: string; year: number; type: string; posterUrl: string };

export function SearchPanel({
  initialQuery,
  initialItems,
  categories,
}: {
  initialQuery: string;
  initialItems: TitleRow[];
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pending, start] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const handle = window.setTimeout(() => {
      void fetch(`/api/search?suggest=1&q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data: { items?: Suggestion[] }) => setSuggestions(data.items ?? []))
        .catch(() => setSuggestions([]));
    }, 180);
    return () => window.clearTimeout(handle);
  }, [query]);

  function apply(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v) sp.delete(k);
      else sp.set(k, v);
    });
    start(() => router.push(`/busca?${sp.toString()}`));
  }

  const sort = params.get("ordenar") ?? "popular";
  const type = params.get("tipo") ?? "";
  const category = params.get("categoria") ?? "";
  const year = params.get("ano") ?? "";

  const heading = useMemo(
    () => (initialQuery ? `Resultados para “${initialQuery}”` : "Explorar o catálogo"),
    [initialQuery],
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: query.trim() });
        }}
        className="relative"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Título, gênero ou ano"
          className="w-full rounded-2xl bg-white/8 px-5 py-4 text-lg ring-1 ring-white/10 outline-none focus:ring-[var(--accent)]"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl panel">
            {suggestions.map((item) => (
              <Link
                key={item.id}
                href={`/titulo/${item.id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/6"
              >
                <img src={item.posterUrl} alt="" className="h-12 w-8 rounded object-cover" />
                <div>
                  <p>{item.title}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {item.year} · {item.type === "series" ? "Série" : "Filme"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </form>
      <div className="mt-5 flex flex-wrap gap-3">
        <select value={type} onChange={(e) => apply({ tipo: e.target.value, q: query })} className="rounded-full bg-white/8 px-4 py-2 text-sm ring-1 ring-white/10">
          <option value="">Filmes e séries</option>
          <option value="movie">Filmes</option>
          <option value="series">Séries</option>
        </select>
        <select value={category} onChange={(e) => apply({ categoria: e.target.value, q: query })} className="rounded-full bg-white/8 px-4 py-2 text-sm ring-1 ring-white/10">
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => apply({ ano: e.target.value, q: query })} className="rounded-full bg-white/8 px-4 py-2 text-sm ring-1 ring-white/10">
          <option value="">Qualquer ano</option>
          {[2025, 2024, 2023, 2022, 2021, 2020, 2012, 2010, 2008, 2006].map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => apply({ ordenar: e.target.value, q: query })} className="rounded-full bg-white/8 px-4 py-2 text-sm ring-1 ring-white/10">
          <option value="popular">Relevância</option>
          <option value="recent">Recentes</option>
          <option value="year">Ano</option>
          <option value="title">A–Z</option>
        </select>
      </div>
      <h2 className="mb-4 mt-8 font-display text-2xl">{heading}</h2>
      <div className={pending ? "opacity-60" : ""}>
        <CatalogGrid items={initialItems} />
      </div>
    </div>
  );
}
