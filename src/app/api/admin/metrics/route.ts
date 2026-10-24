import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites, playbackProgress, titles, users, watchHistory } from "@/db/schema";
import { isSession, requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;

  const [userCount] = await db.select({ total: count() }).from(users);
  const [titleCount] = await db.select({ total: count() }).from(titles);
  const [movieCount] = await db.select({ total: count() }).from(titles).where(eq(titles.type, "movie"));
  const [seriesCount] = await db.select({ total: count() }).from(titles).where(eq(titles.type, "series"));
  const [favCount] = await db.select({ total: count() }).from(favorites);
  const [histCount] = await db.select({ total: count() }).from(watchHistory);
  const [progCount] = await db.select({ total: count() }).from(playbackProgress);

  const top = await db
    .select({
      id: titles.id,
      title: titles.title,
      views: titles.views,
      type: titles.type,
    })
    .from(titles)
    .orderBy(desc(titles.views))
    .limit(8);

  return Response.json({
    users: userCount.total,
    titles: titleCount.total,
    movies: movieCount.total,
    series: seriesCount.total,
    favorites: favCount.total,
    historyEvents: histCount.total,
    activeProgress: progCount.total,
    top,
    generatedAt: new Date().toISOString(),
  });
}
