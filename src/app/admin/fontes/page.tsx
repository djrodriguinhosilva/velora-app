import { db } from "@/db";
import { contentSources } from "@/db/schema";
import { SourceManager } from "@/components/SourceManager";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const items = await db.select().from(contentSources);
  return (
    <main className="px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl">Fontes autorizadas</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Apenas origens licenciadas, Creative Commons ou buckets de demonstração pública. Não cadastre
        endpoints que exijam bypass de DRM ou autenticação de terceiros.
      </p>
      <SourceManager items={items} />
    </main>
  );
}
