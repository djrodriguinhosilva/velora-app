import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contentSources } from "@/db/schema";
import { isSession, requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const items = await db.select().from(contentSources);
  return Response.json({ items });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const body = (await request.json().catch(() => null)) as { id?: number; enabled?: boolean } | null;
  if (!body?.id) return Response.json({ error: "Fonte inválida." }, { status: 400 });
  const [updated] = await db
    .update(contentSources)
    .set({ enabled: Boolean(body.enabled) })
    .where(eq(contentSources.id, body.id))
    .returning();
  return Response.json({ item: updated });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    kind?: string;
    baseUrl?: string;
    notes?: string;
  } | null;
  if (!body?.name || !body.baseUrl) {
    return Response.json({ error: "Informe nome e URL." }, { status: 400 });
  }
  const [created] = await db
    .insert(contentSources)
    .values({
      name: body.name,
      kind: body.kind || "authorized",
      baseUrl: body.baseUrl,
      notes: body.notes,
      enabled: true,
    })
    .returning();
  return Response.json({ item: created });
}
