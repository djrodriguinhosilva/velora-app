import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { SettingsForm } from "@/components/SettingsForm";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await ensureSeeded();
  const session = await getSession();
  if (!session) redirect("/entrar");
  const profile = await getProfile(session);
  if (!profile) redirect("/entrar");

  return (
    <AppShell>
      <main className="px-4 py-10 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Acessibilidade e player</p>
        <h1 className="mt-2 font-display text-4xl">Configurações</h1>
        <SettingsForm profile={profile} />
      </main>
    </AppShell>
  );
}
