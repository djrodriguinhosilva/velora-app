import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { SearchPanel } from "@/components/SearchPanel";
import { getSession } from "@/lib/auth";
import { getProfile, listCategories, listTitles } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string; categoria?: string; ano?: string; ordenar?: string }>;
}) {
  await ensureSeeded();
  const params = await searchParams;
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  const cats = await listCategories();
  const year = Number(params.ano) || undefined;
  const items = await listTitles({
    profile,
    query: params.q,
    type: params.tipo === "series" || params.tipo === "movie" ? params.tipo : undefined,
    categorySlug: params.categoria,
    yearMin: year,
    yearMax: year,
    sort: (params.ordenar as "popular" | "recent" | "year" | "title") || "popular",
    limit: 60,
  });

  return (
    <AppShell>
      <main className="px-4 py-10 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Pesquisa</p>
        <h1 className="mt-2 font-display text-4xl">Encontre um título</h1>
        <div className="mt-6">
          <Suspense>
            <SearchPanel initialQuery={params.q ?? ""} initialItems={items} categories={cats} />
          </Suspense>
        </div>
      </main>
    </AppShell>
  );
}
