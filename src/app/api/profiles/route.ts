import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { getUserProfiles } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  const items = await getUserProfiles(session.userId);
  return Response.json({ items });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    kidsMode?: boolean;
    accentColor?: string;
    avatar?: string;
  } | null;
  const name = body?.name?.trim();
  if (!name) return Response.json({ error: "Informe um nome." }, { status: 400 });
  const existing = await getUserProfiles(session.userId);
  if (existing.length >= 5) {
    return Response.json({ error: "Limite de 5 perfis por conta." }, { status: 400 });
  }
  const [created] = await db
    .insert(profiles)
    .values({
      userId: session.userId,
      name,
      kidsMode: Boolean(body?.kidsMode),
      accentColor: body?.accentColor || "#e8b86d",
      avatar: body?.avatar || "gold",
    })
    .returning();
  return Response.json({ profile: created });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Dados inválidos." }, { status: 400 });
  const patch: Partial<typeof profiles.$inferInsert> = {};
  if (typeof body.name === "string") patch.name = body.name;
  if (typeof body.kidsMode === "boolean") patch.kidsMode = body.kidsMode;
  if (typeof body.accentColor === "string") patch.accentColor = body.accentColor;
  if (typeof body.avatar === "string") patch.avatar = body.avatar;
  if (typeof body.autoplay === "boolean") patch.autoplay = body.autoplay;
  if (typeof body.autoplayNext === "boolean") patch.autoplayNext = body.autoplayNext;
  if (typeof body.subtitlesEnabled === "boolean") patch.subtitlesEnabled = body.subtitlesEnabled;
  if (typeof body.subtitleLanguage === "string") patch.subtitleLanguage = body.subtitleLanguage;
  if (typeof body.playbackSpeed === "string") patch.playbackSpeed = body.playbackSpeed;
  if (typeof body.language === "string") patch.language = body.language;
  if (typeof body.reduceMotion === "boolean") patch.reduceMotion = body.reduceMotion;
  if (typeof body.highContrast === "boolean") patch.highContrast = body.highContrast;
  if (!Object.keys(patch).length) return Response.json({ error: "Nada para atualizar." }, { status: 400 });
  const [updated] = await db
    .update(profiles)
    .set(patch)
    .where(and(eq(profiles.id, session.profileId), eq(profiles.userId, session.userId)))
    .returning();
  return Response.json({ profile: updated });
}
