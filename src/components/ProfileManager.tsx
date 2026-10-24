"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProfileRow } from "@/lib/data";

const ACCENTS = ["#e8b86d", "#ff6b6b", "#5eead4", "#c084fc", "#38bdf8", "#f472b6"];

export function ProfileManager({
  profiles,
  currentId,
}: {
  profiles: ProfileRow[];
  currentId: number;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [kids, setKids] = useState(false);
  const [accent, setAccent] = useState("#e8b86d");
  const [error, setError] = useState("");

  async function select(profileId: number) {
    await fetch("/api/profiles/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId }),
    });
    router.refresh();
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, kidsMode: kids, accentColor: accent }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Não foi possível criar.");
      return;
    }
    setName("");
    router.refresh();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => select(p.id)}
            className={`rounded-2xl p-5 text-left ring-1 transition ${
              p.id === currentId ? "ring-[var(--accent)] bg-white/8" : "ring-white/10 bg-white/4"
            }`}
          >
            <span
              className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-[#1a140b]"
              style={{ background: p.accentColor }}
            >
              {p.name.slice(0, 1).toUpperCase()}
            </span>
            <p className="mt-3 font-medium">{p.name}</p>
            <p className="text-xs text-[var(--muted)]">{p.kidsMode ? "Perfil infantil" : "Padrão"}</p>
          </button>
        ))}
      </div>
      <form onSubmit={create} className="mt-8 max-w-lg rounded-2xl panel p-5">
        <h2 className="font-display text-xl">Novo perfil</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="mt-3 w-full rounded-xl bg-black/30 px-4 py-3 ring-1 ring-white/10 outline-none"
        />
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={kids} onChange={(e) => setKids(e.target.checked)} />
          Modo infantil (filtra classificação 14+)
        </label>
        <div className="mt-3 flex gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAccent(c)}
              className={`h-8 w-8 rounded-full ${accent === c ? "ring-2 ring-white" : ""}`}
              style={{ background: c }}
              aria-label={c}
            />
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-[var(--danger)]">{error}</p>}
        <button className="accent-btn mt-4 rounded-full px-5 py-2 text-sm" type="submit">
          Criar perfil
        </button>
      </form>
      <button type="button" onClick={logout} className="mt-6 text-sm text-[var(--muted)] hover:text-white">
        Sair da conta
      </button>
    </div>
  );
}
