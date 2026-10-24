import { eq } from "drizzle-orm";
import { db } from "@/db";
import { titles } from "@/db/schema";
import { isSession, requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const { id } = await ctx.params;
  const titleId = Number(id);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Dados inválidos." }, { status: 400 });
  const patch: Partial<typeof titles.$inferInsert> = {};
  if (typeof body.type === "string") patch.type = body.type;
  if (typeof body.title === "string") patch.title = body.title;
  if (typeof body.originalTitle === "string") patch.originalTitle = body.originalTitle;
  if (typeof body.synopsis === "string") patch.synopsis = body.synopsis;
  if (body.year !== undefined) patch.year = Number(body.year);
  if (typeof body.rating === "string") patch.rating = body.rating;
  if (body.durationMinutes !== undefined) patch.durationMinutes = Number(body.durationMinutes);
  if (typeof body.genres === "string") patch.genres = body.genres;
  if (typeof body.posterUrl === "string") patch.posterUrl = body.posterUrl;
  if (typeof body.backdropUrl === "string") patch.backdropUrl = body.backdropUrl;
  if (body.trailerUrl !== undefined) patch.trailerUrl = body.trailerUrl ? String(body.trailerUrl) : null;
  if (body.videoUrl !== undefined) patch.videoUrl = body.videoUrl ? String(body.videoUrl) : null;
  if (body.director !== undefined) patch.director = body.director ? String(body.director) : null;
  if (body.cast !== undefined) patch.cast = body.cast ? String(body.cast) : null;
  if (typeof body.country === "string") patch.country = body.country;
  if (typeof body.language === "string") patch.language = body.language;
  if (typeof body.quality === "string") patch.quality = body.quality;
  if (typeof body.license === "string") patch.license = body.license;
  if (body.attribution !== undefined) patch.attribution = body.attribution ? String(body.attribution) : null;
  if (typeof body.featured === "boolean") patch.featured = body.featured;
  if (typeof body.popular === "boolean") patch.popular = body.popular;
  if (typeof body.isNew === "boolean") patch.isNew = body.isNew;
  const [updated] = await db.update(titles).set(patch).where(eq(titles.id, titleId)).returning();
  if (!updated) return Response.json({ error: "Título não encontrado." }, { status: 404 });
  return Response.json({ item: updated });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const { id } = await ctx.params;
  await db.delete(titles).where(eq(titles.id, Number(id)));
  return Response.json({ ok: true });
}
