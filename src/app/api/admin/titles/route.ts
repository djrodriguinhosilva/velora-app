import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, titleCategories, titles } from "@/db/schema";
import { isSession, requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const items = await db.select().from(titles).orderBy(titles.title);
  return Response.json({ items });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.title || !body?.synopsis || !body?.posterUrl || !body?.backdropUrl) {
    return Response.json({ error: "Preencha título, sinopse, pôster e capa." }, { status: 400 });
  }
  const [created] = await db
    .insert(titles)
    .values({
      type: String(body.type || "movie") === "series" ? "series" : "movie",
      title: String(body.title),
      originalTitle: String(body.originalTitle || body.title),
      synopsis: String(body.synopsis),
      year: Number(body.year) || new Date().getFullYear(),
      rating: String(body.rating || "14"),
      durationMinutes: Number(body.durationMinutes) || 90,
      genres: String(body.genres || "Drama"),
      posterUrl: String(body.posterUrl),
      backdropUrl: String(body.backdropUrl),
      trailerUrl: body.trailerUrl ? String(body.trailerUrl) : null,
      videoUrl: body.videoUrl ? String(body.videoUrl) : null,
      director: body.director ? String(body.director) : null,
      cast: body.cast ? String(body.cast) : null,
      country: String(body.country || "Brasil"),
      language: String(body.language || "Português"),
      quality: String(body.quality || "HD"),
      license: String(body.license || "demo"),
      attribution: body.attribution ? String(body.attribution) : null,
      featured: Boolean(body.featured),
      popular: Boolean(body.popular),
      isNew: Boolean(body.isNew),
    })
    .returning();

  if (typeof body.categorySlug === "string" && body.categorySlug) {
    const [cat] = await db.select().from(categories).where(eq(categories.slug, body.categorySlug)).limit(1);
    if (cat) {
      await db.insert(titleCategories).values({ titleId: created.id, categoryId: cat.id });
    }
  }

  return Response.json({ item: created });
}
