import Link from "next/link";
import { db } from "@/db";
import { titles } from "@/db/schema";
import { TitleAdminTable } from "@/components/TitleAdminTable";

export const dynamic = "force-dynamic";

export default async function AdminTitlesPage() {
  const items = await db.select().from(titles);

  return (
    <main className="px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Títulos</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Cadastre, edite ou remova conteúdos autorizados.</p>
        </div>
        <Link href="/admin/titulos/novo" className="accent-btn rounded-full px-5 py-2 text-sm">
          Novo título
        </Link>
      </div>
      <TitleAdminTable items={items} />
    </main>
  );
}
