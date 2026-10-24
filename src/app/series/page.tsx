import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { CatalogGrid } from "@/components/CatalogGrid";
import { FilterBar } from "@/components/FilterBar";
import { getSession } from "@/lib/auth";
import { getProfile, listCategories, listTitles } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; ordenar?: string; ano?: string }>;
}) {
  await ensureSeeded();
  const params = await searchParams;
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  const cats = await listCategories();
  const year = Number(params.ano) || undefined;
  const items = await listTitles({
    profile,
    type: "series",
    categorySlug: params.categoria,
    sort: (params.ordenar as "popular" | "recent" | "year" | "title") || "popular",
    yearMin: year,
    yearMax: year,
    limit: 60,
  });

  return (
    <AppShell>
      <main className="px-4 py-10 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Temporadas</p>
        <h1 className="mt-2 font-display text-4xl">Séries</h1>
        <div className="mt-8">
          <Suspense>
            <FilterBar path="/series" categories={cats} />
          </Suspense>
          <CatalogGrid items={items} />
        </div>
      </main>
    </AppShell>
  );
}
