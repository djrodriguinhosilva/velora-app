import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <span className="relative grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-[#f4d7a1] to-[#c48a3a] text-[#1a140b] shadow-[0_0_24px_rgba(232,184,109,0.35)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M4 5.5 12 3l8 2.5v7.2c0 4.4-3.4 7.6-8 9.3-4.6-1.7-8-4.9-8-9.3V5.5Zm8 2.2-4.2 6.3h2.5l1.7-2.6 1.7 2.6H16L12 7.7Z" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-xl tracking-[0.22em] text-[#f6f1e8] group-hover:text-[var(--accent)]">
          VELORA
        </span>
      )}
    </Link>
  );
}
