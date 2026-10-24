import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatar: text("avatar").notNull().default("gold"),
  kidsMode: boolean("kids_mode").notNull().default(false),
  accentColor: text("accent_color").notNull().default("#e8b86d"),
  autoplay: boolean("autoplay").notNull().default(true),
  autoplayNext: boolean("autoplay_next").notNull().default(true),
  subtitlesEnabled: boolean("subtitles_enabled").notNull().default(true),
  subtitleLanguage: text("subtitle_language").notNull().default("pt-BR"),
  playbackSpeed: text("playback_speed").notNull().default("1"),
  language: text("language").notNull().default("pt-BR"),
  reduceMotion: boolean("reduce_motion").notNull().default(false),
  highContrast: boolean("high_contrast").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const titles = pgTable("titles", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  originalTitle: text("original_title"),
  synopsis: text("synopsis").notNull(),
  year: integer("year").notNull(),
  rating: text("rating").notNull().default("14"),
  durationMinutes: integer("duration_minutes").notNull().default(90),
  genres: text("genres").notNull(),
  posterUrl: text("poster_url").notNull(),
  backdropUrl: text("backdrop_url").notNull(),
  trailerUrl: text("trailer_url"),
  videoUrl: text("video_url"),
  director: text("director"),
  cast: text("cast"),
  country: text("country").default("Brasil"),
  language: text("language").default("Português"),
  quality: text("quality").default("HD"),
  license: text("license").notNull().default("demo"),
  attribution: text("attribution"),
  featured: boolean("featured").notNull().default(false),
  popular: boolean("popular").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const titleCategories = pgTable(
  "title_categories",
  {
    id: serial("id").primaryKey(),
    titleId: integer("title_id")
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniq: uniqueIndex("title_categories_unique").on(table.titleId, table.categoryId),
  }),
);

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  titleId: integer("title_id")
    .notNull()
    .references(() => titles.id, { onDelete: "cascade" }),
  seasonNumber: integer("season_number").notNull(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id")
    .notNull()
    .references(() => seasons.id, { onDelete: "cascade" }),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  synopsis: text("synopsis").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  subtitleUrl: text("subtitle_url"),
});

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    titleId: integer("title_id")
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniq: uniqueIndex("favorites_unique").on(table.profileId, table.titleId),
  }),
);

export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  titleId: integer("title_id")
    .notNull()
    .references(() => titles.id, { onDelete: "cascade" }),
  episodeId: integer("episode_id"),
  watchedAt: timestamp("watched_at").notNull().defaultNow(),
  progressSeconds: integer("progress_seconds").notNull().default(0),
  durationSeconds: integer("duration_seconds").notNull().default(0),
});

export const playbackProgress = pgTable("playback_progress", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  titleId: integer("title_id")
    .notNull()
    .references(() => titles.id, { onDelete: "cascade" }),
  episodeId: integer("episode_id"),
  positionSeconds: integer("position_seconds").notNull().default(0),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contentSources = pgTable("content_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull(),
  baseUrl: text("base_url").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  notes: text("notes"),
});
