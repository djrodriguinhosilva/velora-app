"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TitleRow } from "@/lib/data";
import { formatDuration, ratingLabel } from "@/lib/format";
import { IconInfo, IconPlay } from "./Icons";

export function Hero({ titles }: { titles: TitleRow[] }) {
  const [index, setIndex] = useState(0);
  const item = titles[index];

  useEffect(() => {
    if (titles.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % titles.length), 7500);
    return () => clearInterval(timer);
  }, [titles.length]);

  if (!item) return null;

  return (
    <section className="relative min-h-[78vh] overflow-hidden">
      {titles.map((title, i) => (
        <div
          key={title.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <img src={title.backdropUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
      <div className="hero-mask absolute inset-0" />
      <div className="relative z-10 flex min-h-[78vh] max-w-3xl flex-col justify-end px-4 pb-16 pt-28 sm:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Em destaque</p>
        <h1 className="font-display text-4xl leading-[0.95] sm:text-6xl">{item.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <span className="rating-chip">{ratingLabel(item.rating)}</span>
          <span>{item.year}</span>
          <span>{item.type === "series" ? "Série" : formatDuration(item.durationMinutes)}</span>
          <span>{item.quality}</span>
          <span>{item.genres}</span>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#ddd6c8] sm:text-base">{item.synopsis}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={`/assistir/${item.id}`}
            className="accent-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
          >
            <IconPlay size={16} /> Assistir agora
          </Link>
          <Link
            href={`/titulo/${item.id}`}
            className="ghost-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
          >
            <IconInfo size={16} /> Mais informações
          </Link>
        </div>
        <div className="mt-8 flex gap-2">
          {titles.map((title, i) => (
            <button
              key={title.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-10 bg-[var(--accent)]" : "w-4 bg-white/30"}`}
              aria-label={`Destaque ${title.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
