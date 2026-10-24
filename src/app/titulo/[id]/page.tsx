import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FavoriteButton } from "@/components/FavoriteButton";
import { TitleRow } from "@/components/TitleRow";
import { getSession } from "@/lib/auth";
import { getProfile, getTitleById, relatedTitles } from "@/lib/data";
import { formatDuration, progressPercent, ratingLabel } from "@/lib/format";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  await ensureSeeded();
  const { id } = await params;
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  const title = await getTitleById(Number(id), session);
  if (!title) notFound();
  const related = await relatedTitles(title, profile);
  const watchHref =
    title.type === "series" && title.seasonList[0]?.episodes[0]
      ? `/assistir/${title.id}?episode=${title.seasonList[0].episodes[0].id}`
      : `/assistir/${title.id}`;
  const pct = title.progress
    ? progressPercent(title.progress.positionSeconds, title.progress.durationSeconds)
    : 0;

  return (
    <AppShell>
      <section className="relative min-h-[52vh] overflow-hidden">
        <img src={title.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-mask absolute inset-0" />
      </section>
      <main className="relative z-10 -mt-40 px-4 pb-8 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <img
            src={title.posterUrl}
            alt={title.title}
            className="w-48 shrink-0 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 sm:w-56"
          />
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
              {title.type === "series" ? "Série" : "Filme"} · {title.quality}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{title.title}</h1>
            {title.originalTitle && title.originalTitle !== title.title && (
              <p className="mt-1 text-sm text-[var(--muted)]">{title.originalTitle}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span className="rating-chip">{ratingLabel(title.rating)}</span>
              <span>{title.year}</span>
              <span>{formatDuration(title.durationMinutes)}</span>
              <span>{title.genres}</span>
              <span>{title.language}</span>
            </div>
            <p className="mt-5 max-w-2xl leading-relaxed text-[#ddd6c8]">{title.synopsis}</p>
            <dl className="mt-5 grid gap-1 text-sm text-[var(--muted)]">
              {title.director && (
                <div>
                  <span className="text-white/80">Direção: </span>
                  {title.director}
                </div>
              )}
              {title.cast && (
                <div>
                  <span className="text-white/80">Elenco: </span>
                  {title.cast}
                </div>
              )}
              {title.attribution && (
                <div>
                  <span className="text-white/80">Licença: </span>
                  {title.attribution}
                </div>
              )}
            </dl>
            {pct > 0 && (
              <div className="mt-5 max-w-md">
                <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
                  <span>Progresso</span>
                  <span>{Math.round(pct)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={watchHref} className="accent-btn rounded-full px-6 py-3 text-sm">
                {pct > 3 ? "Continuar" : "Assistir"}
              </Link>
              {title.trailerUrl && (
                <Link href={`/assistir/${title.id}?trailer=1`} className="ghost-btn rounded-full px-6 py-3 text-sm">
                  Trailer
                </Link>
              )}
              <FavoriteButton titleId={title.id} initial={title.favorite} loggedIn={Boolean(session)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {title.categoryList.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="rounded-full bg-white/8 px-3 py-1 text-xs ring-1 ring-white/10"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {title.seasonList.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl">Temporadas e episódios</h2>
            <div className="mt-5 space-y-8">
              {title.seasonList.map((season) => (
                <div key={season.id}>
                  <h3 className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">{season.name}</h3>
                  <div className="mt-3 grid gap-3">
                    {season.episodes.map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/assistir/${title.id}?episode=${episode.id}`}
                        className="flex gap-4 overflow-hidden rounded-2xl bg-white/4 ring-1 ring-white/8 transition hover:bg-white/8"
                      >
                        <img src={episode.thumbnailUrl} alt="" className="h-24 w-40 object-cover sm:h-28 sm:w-48" />
                        <div className="py-3 pr-4">
                          <p className="text-sm text-[var(--muted)]">
                            E{String(episode.episodeNumber).padStart(2, "0")} · {episode.durationMinutes} min
                          </p>
                          <p className="font-medium">{episode.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{episode.synopsis}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <TitleRow heading="Porque você viu este título" items={related} />
    </AppShell>
  );
}
