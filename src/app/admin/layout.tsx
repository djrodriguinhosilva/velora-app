import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/entrar");
  if (session.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-[#07070b]">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-white/8 bg-black/30 p-5 md:block">
          <Logo />
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Admin</p>
          <nav className="mt-3 grid gap-1 text-sm">
            <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-white/8">
              Métricas
            </Link>
            <Link href="/admin/titulos" className="rounded-lg px-3 py-2 hover:bg-white/8">
              Títulos
            </Link>
            <Link href="/admin/usuarios" className="rounded-lg px-3 py-2 hover:bg-white/8">
              Usuários
            </Link>
            <Link href="/admin/fontes" className="rounded-lg px-3 py-2 hover:bg-white/8">
              Fontes
            </Link>
            <Link href="/" className="rounded-lg px-3 py-2 text-[var(--muted)] hover:bg-white/8">
              Voltar ao app
            </Link>
          </nav>
        </aside>
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-white/8 px-4 py-4 md:px-8">
            <div className="md:hidden">
              <Logo compact />
            </div>
            <p className="text-sm text-[var(--muted)]">{session.email}</p>
            <nav className="flex gap-3 text-sm md:hidden">
              <Link href="/admin">Métricas</Link>
              <Link href="/admin/titulos">Títulos</Link>
            </nav>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
