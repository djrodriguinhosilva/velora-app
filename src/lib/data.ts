import { and, desc, eq, ilike, inArray, or, sql, gte, lte, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  episodes,
  favorites,
  playbackProgress,
  profiles,
  seasons,
  titleCategories,
  titles,
  watchHistory,
} from "@/db/schema";
import { kidsAllowed, type Session } from "./auth";

export type TitleRow = typeof titles.$inferSelect;
export type ProfileRow = typeof profiles.$inferSelect;
export type EpisodeRow = typeof episodes.$inferSelect;
export type SeasonRow = typeof seasons.$inferSelect;

export type ProgressRow = typeof playbackProgress.$inferSelect;

export type SeasonWithEpisodes = SeasonRow & { episodes: EpisodeRow[] };

export type TitleDetails = TitleRow & {
  categoryList: { id: number; name: string; slug: string }[];
  seasonList: SeasonWithEpisodes[];
  favorite: boolean;
  progress: ProgressRow | null;
};

const KIDS_RATINGS = ["L", "10", "12"];

export async function getProfile(session: Session | null) {
  if (!session) return null;
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.profileId))
    .limit(1);
  return profile ?? null;
}

export async function getUserProfiles(userId: number) {
  return db.select().from(profiles).where(eq(profiles.userId, userId));
}

function kidsFilter(profile: ProfileRow | null): SQL | undefined {
  if (profile?.kidsMode) {
    return inArray(titles.rating, KIDS_RATINGS);
  }
  return undefined;
}

export async function listCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function listTitles(options: {
  profile?: ProfileRow | null;
  type?: "movie" | "series";
  categorySlug?: string;
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
  yearMin?: number;
  yearMax?: number;
  query?: string;
  sort?: "recent" | "title" | "year" | "popular";
  limit?: number;
  offset?: number;
}) {
  const filters: SQL[] = [];
  const kids = kidsFilter(options.profile ?? null);
  if (kids) filters.push(kids);
  if (options.type) filters.push(eq(titles.type, options.type));
  if (options.featured) filters.push(eq(titles.featured, true));
  if (options.popular) filters.push(eq(titles.popular, true));
  if (options.isNew) filters.push(eq(titles.isNew, true));
  if (options.yearMin) filters.push(gte(titles.year, options.yearMin));
  if (options.yearMax) filters.push(lte(titles.year, options.yearMax));
  if (options.query) {
    const q = `%${options.query.trim()}%`;
    const yearNum = Number(options.query.trim());
    const search = Number.isInteger(yearNum)
      ? or(ilike(titles.title, q), ilike(titles.genres, q), eq(titles.year, yearNum))
      : or(ilike(titles.title, q), ilike(titles.genres, q), ilike(titles.synopsis, q));
    if (search) filters.push(search);
  }

  let categoryTitleIds: number[] | null = null;
  if (options.categorySlug) {
    const [cat] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, options.categorySlug))
      .limit(1);
    if (!cat) return [];
    const links = await db
      .select({ titleId: titleCategories.titleId })
      .from(titleCategories)
      .where(eq(titleCategories.categoryId, cat.id));
    categoryTitleIds = links.map((l) => l.titleId);
    if (!categoryTitleIds.length) return [];
    filters.push(inArray(titles.id, categoryTitleIds));
  }

  const where = filters.length ? and(...filters) : undefined;
  const sort = options.sort ?? "popular";
  const order =
    sort === "title"
      ? titles.title
      : sort === "year"
        ? desc(titles.year)
        : sort === "recent"
          ? desc(titles.createdAt)
          : desc(titles.views);

  return db
    .select()
    .from(titles)
    .where(where)
    .orderBy(order, titles.title)
    .limit(options.limit ?? 48)
    .offset(options.offset ?? 0);
}

export async function getTitleById(id: number, session: Session | null): Promise<TitleDetails | null> {
  const [title] = await db.select().from(titles).where(eq(titles.id, id)).limit(1);
  if (!title) return null;
  const profile = await getProfile(session);
  if (profile?.kidsMode && !kidsAllowed(title.rating)) return null;

  const catRows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(titleCategories)
    .innerJoin(categories, eq(titleCategories.categoryId, categories.id))
    .where(eq(titleCategories.titleId, title.id));

  const seasonRows = await db
    .select()
    .from(seasons)
    .where(eq(seasons.titleId, title.id))
    .orderBy(seasons.seasonNumber);

  const seasonList: SeasonWithEpisodes[] = [];
  for (const season of seasonRows) {
    const eps = await db
      .select()
      .from(episodes)
      .where(eq(episodes.seasonId, season.id))
      .orderBy(episodes.episodeNumber);
    seasonList.push({ ...season, episodes: eps });
  }

  let favorite = false;
  let progress: ProgressRow | null = null;
  if (session) {
    const [fav] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.profileId, session.profileId), eq(favorites.titleId, title.id)))
      .limit(1);
    favorite = Boolean(fav);

    const prog = await db
      .select()
      .from(playbackProgress)
      .where(
        and(eq(playbackProgress.profileId, session.profileId), eq(playbackProgress.titleId, title.id)),
      )
      .orderBy(desc(playbackProgress.updatedAt))
      .limit(1);
    progress = prog[0] ?? null;
  }

  return { ...title, categoryList: catRows, seasonList, favorite, progress };
}

export async function relatedTitles(title: TitleRow, profile: ProfileRow | null, limit = 12) {
  const genre = title.genres.split(",")[0]?.trim() ?? "";
  const rows = await listTitles({
    profile,
    query: genre,
    limit: limit + 4,
  });
  return rows.filter((t) => t.id !== title.id).slice(0, limit);
}

export async function continueWatching(profileId: number, profile: ProfileRow | null) {
  const rows = await db
    .select({
      progress: playbackProgress,
      title: titles,
    })
    .from(playbackProgress)
    .innerJoin(titles, eq(playbackProgress.titleId, titles.id))
    .where(
      and(
        eq(playbackProgress.profileId, profileId),
        eq(playbackProgress.completed, false),
        sql`${playbackProgress.positionSeconds} > 8`,
      ),
    )
    .orderBy(desc(playbackProgress.updatedAt))
    .limit(18);

  return rows.filter((row) => !profile?.kidsMode || kidsAllowed(row.title.rating));
}

export async function listFavorites(profileId: number, profile: ProfileRow | null) {
  const rows = await db
    .select({ title: titles, favoriteId: favorites.id, createdAt: favorites.createdAt })
    .from(favorites)
    .innerJoin(titles, eq(favorites.titleId, titles.id))
    .where(eq(favorites.profileId, profileId))
    .orderBy(desc(favorites.createdAt));
  return rows.filter((row) => !profile?.kidsMode || kidsAllowed(row.title.rating));
}

export async function listHistory(profileId: number, profile: ProfileRow | null) {
  const rows = await db
    .select({
      history: watchHistory,
      title: titles,
    })
    .from(watchHistory)
    .innerJoin(titles, eq(watchHistory.titleId, titles.id))
    .where(eq(watchHistory.profileId, profileId))
    .orderBy(desc(watchHistory.watchedAt))
    .limit(40);
  return rows.filter((row) => !profile?.kidsMode || kidsAllowed(row.title.rating));
}

export async function searchSuggestions(query: string, profile: ProfileRow | null) {
  if (!query.trim()) return [];
  return listTitles({ profile, query, limit: 8, sort: "popular" });
}

export async function homeRows(profile: ProfileRow | null) {
  const [featured, popular, isNew, movies, series, cats] = await Promise.all([
    listTitles({ profile, featured: true, limit: 8 }),
    listTitles({ profile, popular: true, limit: 18 }),
    listTitles({ profile, isNew: true, limit: 18 }),
    listTitles({ profile, type: "movie", limit: 18, sort: "popular" }),
    listTitles({ profile, type: "series", limit: 18, sort: "popular" }),
    listCategories(),
  ]);

  const byCategory = [];
  for (const cat of cats) {
    const items = await listTitles({ profile, categorySlug: cat.slug, limit: 16, sort: "popular" });
    if (items.length) byCategory.push({ category: cat, items });
  }

  return { featured, popular, isNew, movies, series, byCategory };
}
