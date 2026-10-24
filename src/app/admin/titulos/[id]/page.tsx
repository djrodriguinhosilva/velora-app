import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TitleForm } from "@/components/TitleForm";
import { db } from "@/db";
import { titles } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function EditTitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item] = await db.select().from(titles).where(eq(titles.id, Number(id))).limit(1);
  if (!item) notFound();
  return (
    <main className="px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl">Editar · {item.title}</h1>
      <TitleForm initial={item} />
    </main>
  );
}
