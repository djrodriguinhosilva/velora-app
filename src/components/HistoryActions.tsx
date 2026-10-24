"use client";

import { useRouter } from "next/navigation";

export function HistoryActions() {
  const router = useRouter();
  async function clear() {
    await fetch("/api/history", { method: "DELETE" });
    router.refresh();
  }
  return (
    <button type="button" onClick={clear} className="ghost-btn rounded-full px-4 py-2 text-sm">
      Limpar histórico
    </button>
  );
}
