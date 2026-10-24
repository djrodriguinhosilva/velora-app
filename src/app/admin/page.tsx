import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites, playbackProgress, titles, users, watchHistory } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [userCount] = await db.select({ total: count() }).from(users);
  const [titleCount] = await db.select({ total: count() }).from(titles);
  const [movieCount] = await db.select({ total: count() }).from(titles).where(eq(titles.type, "movie"));
  const [seriesCount] = await db.select({ total: count() }).from(titles).where(eq(titles.type, "series"));
  const [favCount] = await db.select({ total: count() }).from(favorites);
  const [histCount] = await db.select({ total: count() }).from(watchHistory);
  const [progCount] = await db.select({ total: count() }).from(playbackProgress);
  const top = await db.select().from(titles).orderBy(desc(titles.views)).limit(6);

  const cards = [
    { label: "Usuários", value: userCount.total },
    { label: "Títulos", value: titleCount.total },
    { label: "Filmes", value: movieCount.total },
    { label: "Séries", value: seriesCount.total },
    { label: "Favoritos", value: favCount.total },
    { label: "Eventos de histórico", value: histCount.total },
    { label: "Progressos ativos", value: progCount.total },
  ];

  return (
    <main className="px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl">Métricas de uso</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Visão geral do catálogo e da atividade dos perfis.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl panel p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 font-display text-3xl">{card.value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Mais assistidos</h2>
      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/8">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th>Tipo</th>
              <th>Ano</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {top.map((t) => (
              <tr key={t.id} className="border-t border-white/8">
                <td className="px-4 py-3">{t.title}</td>
                <td>{t.type === "series" ? "Série" : "Filme"}</td>
                <td>{t.year}</td>
                <td>{t.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
