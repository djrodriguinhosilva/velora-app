import { getSession } from "@/lib/auth";
import { getProfile, getUserProfiles } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ session: null });
  const profile = await getProfile(session);
  const all = await getUserProfiles(session.userId);
  return Response.json({ session, profile, profiles: all });
}
