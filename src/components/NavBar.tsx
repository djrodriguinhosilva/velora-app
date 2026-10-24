"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@/lib/auth";
import type { ProfileRow } from "@/lib/data";
import { IconClose, IconHeart, IconHistory, IconMenu, IconSearch, IconUser } from "./Icons";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/filmes", label: "Filmes" },
  { href: "/series", label: "Séries" },
];

export function NavBar({
  session,
  profile,
}: {
  session: Session | null;
  profile: ProfileRow | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/busca?q=${encodeURIComponent(query)}` : "/busca");
  }

  return (
    <header
      className={`sticky top-0 z-40 transition ${
        scrolled ? "bg-[#07070b]/90 backdrop-blur-xl border-b border-white/5" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="flex items-center gap-4 px-4 py-3 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm ${
                pathname === link.href ? "bg-white/10 text-[var(--accent)]" : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden min-w-[220px] max-w-sm flex-1 items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 ring-1 ring-white/10 md:flex">
          <IconSearch size={16} className="text-[var(--muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar título, gênero ou ano"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </form>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href="/busca" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/8 md:hidden" aria-label="Buscar">
            <IconSearch size={18} />
          </Link>
          <Link href="/favoritos" className="hidden h-10 w-10 place-items-center rounded-full hover:bg-white/8 sm:grid" aria-label="Minha lista">
            <IconHeart size={18} />
          </Link>
          <Link href="/historico" className="hidden h-10 w-10 place-items-center rounded-full hover:bg-white/8 sm:grid" aria-label="Histórico">
            <IconHistory size={18} />
          </Link>
          {session ? (
            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-full bg-white/8 px-2 py-1 pr-3 ring-1 ring-white/10"
            >
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-[#1a140b]"
                style={{ background: profile?.accentColor || "#e8b86d" }}
              >
                {(profile?.name || session.name).slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden text-sm sm:block">{profile?.name || session.name}</span>
            </Link>
          ) : (
            <Link href="/entrar" className="accent-btn rounded-full px-4 py-2 text-sm">
              Entrar
            </Link>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/8 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/8 bg-[#07070b] px-4 py-4 lg:hidden">
          <form onSubmit={submit} className="mb-3 flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 ring-1 ring-white/10 md:hidden">
            <IconSearch size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-transparent outline-none"
            />
          </form>
          <div className="grid gap-1">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-white/8">
                {link.label}
              </Link>
            ))}
            <Link href="/favoritos" className="rounded-lg px-3 py-2 hover:bg-white/8">
              Minha lista
            </Link>
            <Link href="/historico" className="rounded-lg px-3 py-2 hover:bg-white/8">
              Histórico
            </Link>
            <Link href="/configuracoes" className="rounded-lg px-3 py-2 hover:bg-white/8">
              Configurações
            </Link>
            {session?.role === "admin" && (
              <Link href="/admin" className="rounded-lg px-3 py-2 text-[var(--accent)]">
                Painel admin
              </Link>
            )}
            <Link href="/sobre" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/8">
              <IconUser size={16} /> Sobre o Velora
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
