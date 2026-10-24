import { eq } from "drizzle-orm";
import { db } from "@/db";
import { watchHistory } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { listHistory } from "@/lib/data";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ items: [] });
  const profile = await getProfile(session);
  const items = await listHistory(session.profileId, profile);
  return Response.json({ items });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  await db.delete(watchHistory).where(eq(watchHistory.profileId, session.profileId));
  return Response.json({ ok: true });
}
