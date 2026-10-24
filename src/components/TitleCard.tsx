import Link from "next/link";
import type { TitleRow } from "@/lib/data";
import { formatDuration, progressPercent, ratingLabel } from "@/lib/format";

export function TitleCard({
  title,
  progress,
}: {
  title: TitleRow;
  progress?: { positionSeconds: number; durationSeconds: number } | null;
}) {
  const pct = progress ? progressPercent(progress.positionSeconds, progress.durationSeconds) : 0;

  return (
    <Link
      href={`/titulo/${title.id}`}
      className="poster-card group relative block w-full overflow-hidden rounded-xl bg-[#14141c]"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={title.posterUrl}
          alt={title.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />
        <span className="rating-chip absolute left-2 top-2 bg-black/50 backdrop-blur-sm">{ratingLabel(title.rating)}</span>
        {title.isNew && (
          <span className="absolute right-2 top-2 rounded bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1a140b]">
            Novo
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="line-clamp-2 font-display text-sm leading-tight">{title.title}</p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            {title.year} · {title.type === "series" ? "Série" : formatDuration(title.durationMinutes)}
          </p>
        </div>
        {pct > 0 && (
          <div className="absolute inset-x-2 bottom-1 h-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
}
