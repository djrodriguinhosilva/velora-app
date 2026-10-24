import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CatalogGrid } from "@/components/CatalogGrid";
import { getSession } from "@/lib/auth";
import { getProfile, listFavorites } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  await ensureSeeded();
  const session = await getSession();
  if (!session) {
    return (
      <AppShell>
        <main className="px-4 py-20 text-center sm:px-8">
          <h1 className="font-display text-4xl">Minha lista</h1>
          <p className="mt-3 text-[var(--muted)]">Entre para salvar títulos favoritos neste perfil.</p>
          <Link href="/entrar" className="accent-btn mt-6 inline-block rounded-full px-6 py-3">
            Entrar
          </Link>
        </main>
      </AppShell>
    );
  }
  const profile = await getProfile(session);
  const rows = await listFavorites(session.profileId, profile);

  return (
    <AppShell>
      <main className="px-4 py-10 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Perfil {profile?.name}</p>
        <h1 className="mt-2 font-display text-4xl">Minha lista</h1>
        <div className="mt-8">
          <CatalogGrid items={rows.map((r) => r.title)} />
        </div>
      </main>
    </AppShell>
  );
}
