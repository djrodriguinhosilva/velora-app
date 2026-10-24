"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProfileRow } from "@/lib/data";

export function SettingsForm({ profile }: { profile: ProfileRow }) {
  const router = useRouter();
  const [state, setState] = useState(profile);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/profiles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        autoplay: state.autoplay,
        autoplayNext: state.autoplayNext,
        subtitlesEnabled: state.subtitlesEnabled,
        subtitleLanguage: state.subtitleLanguage,
        playbackSpeed: state.playbackSpeed,
        language: state.language,
        reduceMotion: state.reduceMotion,
        highContrast: state.highContrast,
        accentColor: state.accentColor,
        kidsMode: state.kidsMode,
      }),
    });
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mt-8 max-w-xl space-y-4 rounded-3xl panel p-6">
      <label className="flex items-center justify-between gap-4">
        Reprodução automática
        <input
          type="checkbox"
          checked={state.autoplay}
          onChange={(e) => setState({ ...state, autoplay: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between gap-4">
        Autoplay do próximo episódio
        <input
          type="checkbox"
          checked={state.autoplayNext}
          onChange={(e) => setState({ ...state, autoplayNext: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between gap-4">
        Legendas ligadas
        <input
          type="checkbox"
          checked={state.subtitlesEnabled}
          onChange={(e) => setState({ ...state, subtitlesEnabled: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between gap-4">
        Modo infantil
        <input
          type="checkbox"
          checked={state.kidsMode}
          onChange={(e) => setState({ ...state, kidsMode: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between gap-4">
        Reduzir movimento
        <input
          type="checkbox"
          checked={state.reduceMotion}
          onChange={(e) => setState({ ...state, reduceMotion: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between gap-4">
        Alto contraste
        <input
          type="checkbox"
          checked={state.highContrast}
          onChange={(e) => setState({ ...state, highContrast: e.target.checked })}
        />
      </label>
      <label className="block text-sm">
        Velocidade padrão
        <select
          value={state.playbackSpeed}
          onChange={(e) => setState({ ...state, playbackSpeed: e.target.value })}
          className="mt-1 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
        >
          {["0.75", "1", "1.25", "1.5"].map((v) => (
            <option key={v} value={v}>
              {v}x
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Idioma da interface
        <select
          value={state.language}
          onChange={(e) => setState({ ...state, language: e.target.value })}
          className="mt-1 w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="pt-PT">Português (Portugal)</option>
          <option value="en">English</option>
        </select>
      </label>
      <label className="block text-sm">
        Cor de destaque
        <input
          type="color"
          value={state.accentColor}
          onChange={(e) => setState({ ...state, accentColor: e.target.value })}
          className="mt-1 h-10 w-full rounded-xl bg-transparent"
        />
      </label>
      <button className="accent-btn rounded-full px-6 py-3 text-sm" type="submit">
        Salvar preferências
      </button>
      {saved && <p className="text-sm text-[var(--accent)]">Preferências atualizadas neste perfil.</p>}
    </form>
  );
}
