import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { CatalogGrid } from "@/components/CatalogGrid";
import { FilterBar } from "@/components/FilterBar";
import { getSession } from "@/lib/auth";
import { getProfile, listCategories, listTitles } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; ordenar?: string; ano?: string; tipo?: string }>;
}) {
  await ensureSeeded();
  const params = await searchParams;
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  const cats = await listCategories();
  const year = Number(params.ano) || undefined;
  const items = await listTitles({
    profile,
    categorySlug: params.categoria,
    sort: (params.ordenar as "popular" | "recent" | "year" | "title") || "popular",
    yearMin: year,
    yearMax: year,
    type: params.tipo === "series" || params.tipo === "movie" ? params.tipo : undefined,
    limit: 60,
  });

  return (
    <AppShell>
      <main className="px-4 py-10 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Navegar</p>
        <h1 className="mt-2 font-display text-4xl">Catálogo</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Filmes, séries e temporadas organizados por categoria. Use os filtros para refinar por ano e
          relevância.
        </p>
        <div className="mt-8">
          <Suspense>
            <FilterBar path="/catalogo" categories={cats} />
          </Suspense>
          <CatalogGrid items={items} />
        </div>
      </main>
    </AppShell>
  );
}
