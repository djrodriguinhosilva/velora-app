import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { playbackProgress, watchHistory } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ ok: false, skipped: true });
  const body = (await request.json().catch(() => null)) as {
    titleId?: number;
    episodeId?: number | null;
    positionSeconds?: number;
    durationSeconds?: number;
    completed?: boolean;
  } | null;
  const titleId = Number(body?.titleId);
  if (!titleId) return Response.json({ error: "Título inválido." }, { status: 400 });
  const episodeId = body?.episodeId ? Number(body.episodeId) : null;
  const positionSeconds = Math.max(0, Math.floor(Number(body?.positionSeconds) || 0));
  const durationSeconds = Math.max(0, Math.floor(Number(body?.durationSeconds) || 0));
  const completed =
    Boolean(body?.completed) || (durationSeconds > 0 && positionSeconds / durationSeconds > 0.92);

  const existing = episodeId
    ? await db
        .select()
        .from(playbackProgress)
        .where(
          and(
            eq(playbackProgress.profileId, session.profileId),
            eq(playbackProgress.titleId, titleId),
            eq(playbackProgress.episodeId, episodeId),
          ),
        )
        .limit(1)
    : await db
        .select()
        .from(playbackProgress)
        .where(
          and(
            eq(playbackProgress.profileId, session.profileId),
            eq(playbackProgress.titleId, titleId),
            isNull(playbackProgress.episodeId),
          ),
        )
        .limit(1);

  const payload = {
    profileId: session.profileId,
    titleId,
    episodeId,
    positionSeconds,
    durationSeconds,
    completed,
    updatedAt: new Date(),
  };

  if (existing[0]) {
    await db.update(playbackProgress).set(payload).where(eq(playbackProgress.id, existing[0].id));
  } else {
    await db.insert(playbackProgress).values(payload);
  }

  const [last] = await db
    .select()
    .from(watchHistory)
    .where(and(eq(watchHistory.profileId, session.profileId), eq(watchHistory.titleId, titleId)))
    .orderBy(desc(watchHistory.watchedAt))
    .limit(1);

  const recent = last?.watchedAt && Date.now() - last.watchedAt.getTime() < 2 * 60 * 1000;
  if (recent && last) {
    await db
      .update(watchHistory)
      .set({
        episodeId,
        progressSeconds: positionSeconds,
        durationSeconds,
        watchedAt: new Date(),
      })
      .where(eq(watchHistory.id, last.id));
  } else {
    await db.insert(watchHistory).values({
      profileId: session.profileId,
      titleId,
      episodeId,
      progressSeconds: positionSeconds,
      durationSeconds,
    });
  }

  return Response.json({ ok: true, completed });
}

export async function GET() {
  return Response.json({ ok: true });
}
