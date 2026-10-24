import { getSession, type Session } from "./auth";

export async function requireAdmin(): Promise<Session | Response> {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  if (session.role !== "admin") return Response.json({ error: "Acesso restrito." }, { status: 403 });
  return session;
}

export function isSession(value: Session | Response): value is Session {
  return !(value instanceof Response);
}
