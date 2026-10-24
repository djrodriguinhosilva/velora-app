"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconHeart } from "./Icons";

export function FavoriteButton({
  titleId,
  initial,
  loggedIn,
}: {
  titleId: number;
  initial: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!loggedIn) {
      router.push("/entrar");
      return;
    }
    setBusy(true);
    setOn((v) => !v);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titleId }),
      });
      const data = (await res.json()) as { favorite?: boolean };
      if (typeof data.favorite === "boolean") setOn(data.favorite);
      router.refresh();
    } catch {
      setOn((v) => !v);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm ${
        on ? "accent-btn" : "ghost-btn"
      }`}
    >
      <IconHeart filled={on} size={16} />
      {on ? "Na minha lista" : "Minha lista"}
    </button>
  );
}
