import { db } from "@/db";
import { users } from "@/db/schema";
import { isSession, requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!isSession(auth)) return auth;
  const items = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);
  return Response.json({ items });
}
