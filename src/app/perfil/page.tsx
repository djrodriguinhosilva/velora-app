import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProfileManager } from "@/components/ProfileManager";
import { getSession } from "@/lib/auth";
import { getProfile, getUserProfiles } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  await ensureSeeded();
  const session = await getSession();
  if (!session) redirect("/entrar");
  const profile = await getProfile(session);
  const all = await getUserProfiles(session.userId);

  return (
    <AppShell>
      <main className="px-4 py-10 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">{session.email}</p>
        <h1 className="mt-2 font-display text-4xl">Perfis</h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          Troque de perfil, crie um espaço infantil ou ajuste o destaque visual. Cada perfil tem lista,
          histórico e progresso próprios.
        </p>
        <ProfileManager profiles={all} currentId={session.profileId} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/configuracoes" className="ghost-btn rounded-full px-5 py-2 text-sm">
            Configurações de reprodução
          </Link>
          {session.role === "admin" && (
            <Link href="/admin" className="accent-btn rounded-full px-5 py-2 text-sm">
              Painel administrativo
            </Link>
          )}
        </div>
      </main>
    </AppShell>
  );
}
