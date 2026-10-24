"use client";

import { useRef } from "react";
import type { TitleRow } from "@/lib/data";
import { IconChevron } from "./Icons";
import { TitleCard } from "./TitleCard";

export function TitleRow({
  heading,
  items,
  progressByTitle,
}: {
  heading: string;
  items: TitleRow[];
  progressByTitle?: Record<number, { positionSeconds: number; durationSeconds: number }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 540, behavior: "smooth" });
  };

  return (
    <section className="relative py-4">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-8">
        <h2 className="font-display text-xl tracking-wide text-[#f6f1e8] sm:text-2xl">{heading}</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="grid h-9 w-9 place-items-center rounded-full ghost-btn"
            aria-label="Anterior"
          >
            <IconChevron dir="left" size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="grid h-9 w-9 place-items-center rounded-full ghost-btn"
            aria-label="Próximo"
          >
            <IconChevron dir="right" size={18} />
          </button>
        </div>
      </div>
      <div ref={ref} className="hide-scroll flex gap-3 overflow-x-auto px-4 pb-2 sm:px-8">
        {items.map((item) => (
          <div key={item.id} className="w-[148px] shrink-0 sm:w-[176px]">
            <TitleCard title={item} progress={progressByTitle?.[item.id]} />
          </div>
        ))}
      </div>
    </section>
  );
}
