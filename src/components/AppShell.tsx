import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  return (
    <div className="min-h-screen">
      <NavBar session={session} profile={profile} />
      {children}
      <Footer />
    </div>
  );
}
