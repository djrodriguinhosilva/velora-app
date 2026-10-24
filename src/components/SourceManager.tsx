"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Source = {
  id: number;
  name: string;
  kind: string;
  baseUrl: string;
  enabled: boolean;
  notes: string | null;
};

export function SourceManager({ items }: { items: Source[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [notes, setNotes] = useState("");

  async function toggle(id: number, enabled: boolean) {
    await fetch("/api/admin/sources", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled }),
    });
    router.refresh();
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, baseUrl, notes, kind: "authorized" }),
    });
    setName("");
    setBaseUrl("");
    setNotes("");
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl panel p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-[var(--muted)]">{item.kind}</p>
              <a href={item.baseUrl} className="text-sm text-[var(--accent)]" target="_blank" rel="noreferrer">
                {item.baseUrl}
              </a>
              {item.notes && <p className="mt-2 text-sm text-[var(--muted)]">{item.notes}</p>}
            </div>
            <button
              type="button"
              onClick={() => toggle(item.id, !item.enabled)}
              className={`rounded-full px-4 py-1 text-sm ${item.enabled ? "accent-btn" : "ghost-btn"}`}
            >
              {item.enabled ? "Ativa" : "Inativa"}
            </button>
          </div>
        </div>
      ))}
      <form onSubmit={create} className="rounded-2xl panel p-5">
        <h2 className="font-display text-xl">Cadastrar fonte</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="mt-3 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
          required
        />
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://"
          className="mt-3 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
          required
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas de licença"
          className="mt-3 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
        />
        <button className="accent-btn mt-4 rounded-full px-5 py-2 text-sm" type="submit">
          Adicionar
        </button>
      </form>
    </div>
  );
}
