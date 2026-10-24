import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Faça login para salvar favoritos." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { titleId?: number } | null;
  const titleId = Number(body?.titleId);
  if (!titleId) return Response.json({ error: "Título inválido." }, { status: 400 });
  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.profileId, session.profileId), eq(favorites.titleId, titleId)))
    .limit(1);
  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    return Response.json({ favorite: false });
  }
  await db.insert(favorites).values({ profileId: session.profileId, titleId });
  return Response.json({ favorite: true });
}
