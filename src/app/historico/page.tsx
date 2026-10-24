import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { HistoryActions } from "@/components/HistoryActions";
import { getSession } from "@/lib/auth";
import { getProfile, listHistory } from "@/lib/data";
import { formatClock } from "@/lib/format";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  await ensureSeeded();
  const session = await getSession();
  if (!session) {
    return (
      <AppShell>
        <main className="px-4 py-20 text-center sm:px-8">
          <h1 className="font-display text-4xl">Histórico</h1>
          <p className="mt-3 text-[var(--muted)]">O progresso de reprodução é salvo na sua conta.</p>
          <Link href="/entrar" className="accent-btn mt-6 inline-block rounded-full px-6 py-3">
            Entrar
          </Link>
        </main>
      </AppShell>
    );
  }
  const profile = await getProfile(session);
  const rows = await listHistory(session.profileId, profile);

  return (
    <AppShell>
      <main className="px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Continuar de onde parou</p>
            <h1 className="mt-2 font-display text-4xl">Histórico</h1>
          </div>
          <HistoryActions />
        </div>
        <div className="mt-8 grid gap-3">
          {rows.length === 0 && <p className="text-[var(--muted)]">Nenhuma reprodução ainda.</p>}
          {rows.map((row) => (
            <Link
              key={row.history.id}
              href={`/assistir/${row.title.id}`}
              className="flex gap-4 rounded-2xl bg-white/4 p-3 ring-1 ring-white/8 hover:bg-white/8"
            >
              <img src={row.title.posterUrl} alt="" className="h-24 w-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{row.title.title}</p>
                <p className="text-sm text-[var(--muted)]">
                  {row.history.watchedAt.toLocaleString("pt-BR")} · {formatClock(row.history.progressSeconds)} de{" "}
                  {formatClock(row.history.durationSeconds)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
