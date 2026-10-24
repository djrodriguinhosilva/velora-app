import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { WatchClient } from "@/components/WatchClient";
import { getSession } from "@/lib/auth";
import { getProfile, getTitleById } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ episode?: string; trailer?: string }>;
}) {
  await ensureSeeded();
  const { id } = await params;
  const query = await searchParams;
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  const title = await getTitleById(Number(id), session);
  if (!title) notFound();

  const allEpisodes = title.seasonList.flatMap((s) => s.episodes);
  const episode = query.episode
    ? allEpisodes.find((e) => e.id === Number(query.episode))
    : allEpisodes[0];
  const isTrailer = query.trailer === "1";
  const src = isTrailer
    ? title.trailerUrl || title.videoUrl || episode?.videoUrl
    : episode?.videoUrl || title.videoUrl || title.trailerUrl;
  if (!src) notFound();

  const progress = title.progress;
  const startPosition =
    !isTrailer && progress && (!episode || progress.episodeId === episode.id)
      ? progress.positionSeconds
      : 0;

  return (
    <AppShell>
      <main className="px-4 py-6 sm:px-8">
        <WatchClient
          titleId={title.id}
          titleName={
            isTrailer
              ? `${title.title} — Trailer`
              : episode
                ? `${title.title} · ${episode.title}`
                : title.title
          }
          src={src}
          poster={title.backdropUrl}
          subtitleUrl={episode?.subtitleUrl || "/subtitles/demo.vtt"}
          startPosition={startPosition}
          autoplay={profile?.autoplay ?? true}
          playbackSpeed={Number(profile?.playbackSpeed || 1)}
          subtitlesOn={profile?.subtitlesEnabled ?? true}
          episodeId={isTrailer ? null : episode?.id}
          episodes={isTrailer ? [] : allEpisodes}
        />
      </main>
    </AppShell>
  );
}
