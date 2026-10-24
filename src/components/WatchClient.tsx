"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Player } from "./Player";

type EpisodeLite = {
  id: number;
  title: string;
  episodeNumber: number;
  synopsis: string;
  durationMinutes: number;
  videoUrl: string;
  subtitleUrl: string | null;
};

export function WatchClient({
  titleId,
  titleName,
  src,
  poster,
  subtitleUrl,
  startPosition,
  autoplay,
  playbackSpeed,
  subtitlesOn,
  episodeId,
  episodes,
}: {
  titleId: number;
  titleName: string;
  src: string;
  poster: string;
  subtitleUrl?: string | null;
  startPosition: number;
  autoplay: boolean;
  playbackSpeed: number;
  subtitlesOn: boolean;
  episodeId?: number | null;
  episodes: EpisodeLite[];
}) {
  useEffect(() => {
    void fetch("/api/watch/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titleId }),
    });
  }, [titleId, episodeId]);

  const currentIndex = episodes.findIndex((e) => e.id === episodeId);
  const next = currentIndex >= 0 ? episodes[currentIndex + 1] : undefined;

  return (
    <div>
      <Player
        titleId={titleId}
        episodeId={episodeId}
        src={src}
        poster={poster}
        subtitleUrl={subtitleUrl}
        startPosition={startPosition}
        autoplay={autoplay}
        playbackSpeed={playbackSpeed}
        subtitlesOn={subtitlesOn}
      />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Reproduzindo</p>
          <h1 className="font-display text-3xl">{titleName}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/titulo/${titleId}`} className="ghost-btn rounded-full px-4 py-2 text-sm">
            Detalhes
          </Link>
          {next && (
            <Link
              href={`/assistir/${titleId}?episode=${next.id}`}
              className="accent-btn rounded-full px-4 py-2 text-sm"
            >
              Próximo episódio
            </Link>
          )}
        </div>
      </div>
      {episodes.length > 0 && (
        <div className="mt-8 grid gap-2">
          <h2 className="font-display text-xl">Episódios</h2>
          {episodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/assistir/${titleId}?episode=${episode.id}`}
              className={`rounded-xl px-4 py-3 ring-1 ${
                episode.id === episodeId ? "bg-white/10 ring-[var(--accent)]" : "bg-white/4 ring-white/8"
              }`}
            >
              <p className="text-xs text-[var(--muted)]">
                E{String(episode.episodeNumber).padStart(2, "0")} · {episode.durationMinutes} min
              </p>
              <p>{episode.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
