import { getSession } from "@/lib/auth";
import { getProfile, listTitles, searchSuggestions } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const suggest = searchParams.get("suggest") === "1";
  const type = searchParams.get("type") as "movie" | "series" | null;
  const yearMin = Number(searchParams.get("yearMin") || 0) || undefined;
  const yearMax = Number(searchParams.get("yearMax") || 0) || undefined;
  const sort = (searchParams.get("sort") as "recent" | "title" | "year" | "popular") || "popular";
  const category = searchParams.get("category") || undefined;
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  if (suggest) {
    const items = await searchSuggestions(q, profile);
    return Response.json({
      items: items.map((t) => ({ id: t.id, title: t.title, year: t.year, type: t.type, posterUrl: t.posterUrl })),
    });
  }
  const items = await listTitles({
    profile,
    query: q || undefined,
    type: type || undefined,
    yearMin,
    yearMax,
    sort,
    categorySlug: category,
    limit: 48,
  });
  return Response.json({ items });
}
