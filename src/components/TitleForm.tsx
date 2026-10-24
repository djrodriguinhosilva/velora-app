"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TitleRow } from "@/lib/data";

const empty = {
  type: "movie",
  title: "",
  originalTitle: "",
  synopsis: "",
  year: new Date().getFullYear(),
  rating: "14",
  durationMinutes: 90,
  genres: "Drama",
  posterUrl: "",
  backdropUrl: "",
  trailerUrl: "",
  videoUrl: "",
  director: "",
  cast: "",
  country: "Brasil",
  language: "Português",
  quality: "HD",
  license: "demo",
  attribution: "",
  featured: false,
  popular: false,
  isNew: false,
};

export function TitleForm({ initial }: { initial?: TitleRow }) {
  const router = useRouter();
  const [state, setState] = useState({ ...empty, ...initial });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof typeof state>(key: K, value: (typeof state)[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      ...state,
      year: Number(state.year),
      durationMinutes: Number(state.durationMinutes),
    };
    const res = await fetch(initial ? `/api/admin/titles/${initial.id}` : "/api/admin/titles", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Falha ao salvar.");
      return;
    }
    router.push("/admin/titulos");
    router.refresh();
  }

  const fields: [keyof typeof empty, string, string][] = [
    ["title", "Título", "text"],
    ["originalTitle", "Título original", "text"],
    ["year", "Ano", "number"],
    ["durationMinutes", "Duração (min)", "number"],
    ["genres", "Gêneros", "text"],
    ["posterUrl", "URL do pôster", "text"],
    ["backdropUrl", "URL da capa", "text"],
    ["videoUrl", "URL do vídeo (autorizada)", "text"],
    ["trailerUrl", "URL do trailer", "text"],
    ["director", "Direção", "text"],
    ["cast", "Elenco", "text"],
    ["country", "País", "text"],
    ["language", "Idioma", "text"],
    ["quality", "Qualidade", "text"],
    ["license", "Licença", "text"],
    ["attribution", "Atribuição", "text"],
  ];

  return (
    <form onSubmit={submit} className="mt-6 grid max-w-3xl gap-3">
      <label className="text-sm">
        Tipo
        <select
          value={state.type}
          onChange={(e) => set("type", e.target.value)}
          className="mt-1 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
        >
          <option value="movie">Filme</option>
          <option value="series">Série</option>
        </select>
      </label>
      <label className="text-sm">
        Classificação
        <select
          value={state.rating}
          onChange={(e) => set("rating", e.target.value)}
          className="mt-1 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
        >
          {["L", "10", "12", "14", "16", "18"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      {fields.map(([key, label, type]) => (
        <label key={key} className="text-sm">
          {label}
          <input
            type={type}
            value={String(state[key] ?? "")}
            onChange={(e) => set(key, (type === "number" ? Number(e.target.value) : e.target.value) as never)}
            className="mt-1 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
          />
        </label>
      ))}
      <label className="text-sm">
        Sinopse
        <textarea
          value={state.synopsis}
          onChange={(e) => set("synopsis", e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
        />
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" checked={Boolean(state.featured)} onChange={(e) => set("featured", e.target.checked)} />
        Destaque
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" checked={Boolean(state.popular)} onChange={(e) => set("popular", e.target.checked)} />
        Popular
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" checked={Boolean(state.isNew)} onChange={(e) => set("isNew", e.target.checked)} />
        Lançamento
      </label>
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <button disabled={busy} className="accent-btn max-w-xs rounded-full py-3" type="submit">
        {busy ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
