import { AppShell } from "@/components/AppShell";
import { Hero } from "@/components/Hero";
import { TitleRow } from "@/components/TitleRow";
import { getSession } from "@/lib/auth";
import { continueWatching, getProfile, homeRows } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  const { featured, popular, isNew, movies, series, byCategory } = await homeRows(profile);
  const watching = session ? await continueWatching(session.profileId, profile) : [];
  const progressByTitle = Object.fromEntries(
    watching.map((row) => [
      row.title.id,
      {
        positionSeconds: row.progress.positionSeconds,
        durationSeconds: row.progress.durationSeconds,
      },
    ]),
  );

  return (
    <AppShell>
      <Hero titles={featured.length ? featured : popular.slice(0, 5)} />
      {watching.length > 0 && (
        <TitleRow
          heading="Continuar assistindo"
          items={watching.map((row) => row.title)}
          progressByTitle={progressByTitle}
        />
      )}
      <TitleRow heading="Lançamentos" items={isNew} />
      <TitleRow heading="Em alta" items={popular} />
      <TitleRow heading="Filmes" items={movies} />
      <TitleRow heading="Séries" items={series} />
      {byCategory.map((row) => (
        <TitleRow key={row.category.id} heading={row.category.name} items={row.items} />
      ))}
    </AppShell>
  );
}
