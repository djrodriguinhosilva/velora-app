import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { ensureSeeded } from "@/lib/seed";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "VELORA — Cinema em qualquer tela",
    template: "%s · VELORA",
  },
  description:
    "Plataforma original de streaming com filmes, séries, continua assistindo, favoritos e player cinematográfico. Catálogo de demonstração com obras Creative Commons e originais Velora.",
  applicationName: "VELORA",
  manifest: "/manifest.json",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const session = await getSession();
  const profile = session ? await getProfile(session) : null;
  const accent = profile?.accentColor || "#e8b86d";

  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${fraunces.variable}`}
      data-contrast={profile?.highContrast ? "high" : "normal"}
      style={{ ["--accent" as string]: accent }}
    >
      <body className={`${outfit.className} antialiased ${profile?.reduceMotion ? "motion-reduce" : ""}`}>
        {children}
      </body>
    </html>
  );
}
