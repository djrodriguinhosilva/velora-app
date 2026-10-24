import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { titles } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { titleId?: number } | null;
  const titleId = Number(body?.titleId);
  if (!titleId) return Response.json({ error: "Título inválido." }, { status: 400 });
  await db
    .update(titles)
    .set({ views: sql`${titles.views} + 1` })
    .where(eq(titles.id, titleId));
  const session = await getSession();
  return Response.json({ ok: true, tracked: Boolean(session) });
}
