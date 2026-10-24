export function formatDuration(minutes: number) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return `${h} h ${m.toString().padStart(2, "0")} min`;
}

export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = h ? m.toString().padStart(2, "0") : String(m);
  const ss = r.toString().padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function ratingLabel(rating: string) {
  if (rating === "L") return "Livre";
  return `${rating}+`;
}

export function progressPercent(position: number, duration: number) {
  if (!duration) return 0;
  return Math.min(100, Math.max(0, (position / duration) * 100));
}
