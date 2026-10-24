import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  contentSources,
  episodes,
  profiles,
  seasons,
  titleCategories,
  titles,
  users,
} from "@/db/schema";
import { hashPassword } from "./auth";
import { CATEGORY_SEED, SOURCE_SEED, TITLE_SEED } from "./catalog-data";

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  try {
    const [row] = await db.select({ total: count() }).from(titles);
    if (row && row.total > 0) {
      seeded = true;
      return;
    }
    await seedDatabase();
    seeded = true;
  } catch (error) {
    console.error("VELORA seed skipped:", error);
  }
}

export async function seedDatabase() {
  const adminHash = await hashPassword("velora123");
  const demoHash = await hashPassword("demo123");

  const [admin] = await db
    .insert(users)
    .values({
      email: "emma.t@example.net",
      passwordHash: adminHash,
      name: "Administrador Velora",
      role: "admin",
    })
    .onConflictDoNothing()
    .returning();

  const [demo] = await db
    .insert(users)
    .values({
      email: "walt.e@example.net",
      passwordHash: demoHash,
      name: "Ana Souza",
      role: "user",
    })
    .onConflictDoNothing()
    .returning();

  const adminUser =
    admin ??
    (await db.select().from(users).where(eq(users.email, "emma.t@example.net")))[0];
  const demoUser =
    demo ??
    (await db.select().from(users).where(eq(users.email, "walt.e@example.net")))[0];

  if (adminUser) {
    await db
      .insert(profiles)
      .values({
        userId: adminUser.id,
        name: "Admin",
        avatar: "gold",
        accentColor: "#e8b86d",
      })
      .onConflictDoNothing();
  }

  if (demoUser) {
    await db.insert(profiles).values([
      {
        userId: demoUser.id,
        name: "Ana",
        avatar: "gold",
        accentColor: "#e8b86d",
        autoplay: true,
        subtitlesEnabled: true,
      },
      {
        userId: demoUser.id,
        name: "Kids",
        avatar: "teal",
        accentColor: "#5eead4",
        kidsMode: true,
        autoplay: false,
      },
    ]);
  }

  const insertedCategories = await db.insert(categories).values(CATEGORY_SEED).returning();
  const categoryBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));

  for (const item of TITLE_SEED) {
    const [created] = await db
      .insert(titles)
      .values({
        type: item.type,
        title: item.title,
        originalTitle: item.originalTitle ?? item.title,
        synopsis: item.synopsis,
        year: item.year,
        rating: item.rating,
        durationMinutes: item.durationMinutes,
        genres: item.genres,
        posterUrl: item.posterUrl,
        backdropUrl: item.backdropUrl,
        trailerUrl: item.trailerUrl,
        videoUrl: item.videoUrl,
        director: item.director,
        cast: item.cast,
        country: item.country ?? "Brasil",
        language: item.language ?? "Português",
        quality: item.quality ?? "HD",
        license: item.license,
        attribution: item.attribution,
        featured: item.featured ?? false,
        popular: item.popular ?? false,
        isNew: item.isNew ?? false,
        views: item.views ?? 0,
      })
      .returning();

    const links = item.categories
      .map((slug) => categoryBySlug.get(slug))
      .filter((id): id is number => Boolean(id))
      .map((categoryId) => ({ titleId: created.id, categoryId }));

    if (links.length) {
      await db.insert(titleCategories).values(links);
    }

    if (item.seasons) {
      for (const season of item.seasons) {
        const [createdSeason] = await db
          .insert(seasons)
          .values({
            titleId: created.id,
            seasonNumber: season.seasonNumber,
            name: season.name,
            year: season.year,
          })
          .returning();

        await db.insert(episodes).values(
          season.episodes.map((episode) => ({
            seasonId: createdSeason.id,
            episodeNumber: episode.episodeNumber,
            title: episode.title,
            synopsis: episode.synopsis,
            durationMinutes: episode.durationMinutes,
            thumbnailUrl: episode.thumbnailUrl,
            videoUrl: episode.videoUrl,
            subtitleUrl: episode.subtitleUrl,
          })),
        );
      }
    }
  }

  await db.insert(contentSources).values(SOURCE_SEED);
}
