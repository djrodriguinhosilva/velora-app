"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import {
  IconClose,
  IconFullscreen,
  IconGear,
  IconPause,
  IconPlay,
  IconSkip,
  IconSun,
  IconVolume,
} from "./Icons";

type Props = {
  titleId: number;
  episodeId?: number | null;
  src: string;
  poster?: string;
  subtitleUrl?: string | null;
  startPosition?: number;
  autoplay?: boolean;
  playbackSpeed?: number;
  subtitlesOn?: boolean;
  onEnded?: () => void;
};

export function Player({
  titleId,
  episodeId,
  src,
  poster,
  subtitleUrl,
  startPosition = 0,
  autoplay = true,
  playbackSpeed = 1,
  subtitlesOn = true,
  onEnded,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [rate, setRate] = useState(playbackSpeed);
  const [controls, setControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<"none" | "settings" | "audio" | "subs" | "quality">("none");
  const [quality, setQuality] = useState("1080p");
  const [audio, setAudio] = useState("Padrão (PT)");
  const [subs, setSubs] = useState(subtitlesOn ? "Português" : "Desligadas");
  const [resume, setResume] = useState(startPosition > 12);
  const [buffering, setBuffering] = useState(false);

  const saveProgress = useCallback(
    async (position: number, total: number, completed = false) => {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleId,
            episodeId: episodeId ?? null,
            positionSeconds: Math.floor(position),
            durationSeconds: Math.floor(total),
            completed,
          }),
        });
      } catch {
        /* offline / unauthenticated */
      }
    },
    [titleId, episodeId],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    video.volume = volume;
    video.muted = muted;
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i += 1) {
      tracks[i].mode = subs === "Português" ? "showing" : "hidden";
    }
  }, [rate, volume, muted, subs]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => setTime(video.currentTime);
    const onMeta = () => setDuration(video.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWait = () => setBuffering(true);
    const onPlaying = () => {
      setBuffering(false);
      setError(null);
    };
    const onErr = () =>
      setError("Não foi possível carregar o vídeo. Verifique a conexão e tente novamente.");
    const onEnd = () => {
      setPlaying(false);
      saveProgress(video.duration || 0, video.duration || 0, true);
      onEnded?.();
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWait);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onErr);
    video.addEventListener("ended", onEnd);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWait);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onErr);
      video.removeEventListener("ended", onEnd);
    };
  }, [onEnded, saveProgress, src]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused) return;
      saveProgress(video.currentTime, video.duration || 0, false);
    }, 5000);
    return () => window.clearInterval(id);
  }, [saveProgress]);

  function showControls() {
    setControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControls(false);
    }, 2800);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function seek(delta: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min((video.duration || 0) - 0.4, video.currentTime + delta));
  }

  function applyResume(fromStart: boolean) {
    const video = videoRef.current;
    setResume(false);
    if (!video) return;
    video.currentTime = fromStart ? 0 : startPosition;
    void video.play();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") seek(10);
      else if (e.code === "ArrowLeft") seek(-10);
      else if (e.code === "KeyF") void wrapRef.current?.requestFullscreen?.();
      else if (e.code === "KeyM") setMuted((v) => !v);
      else if (e.code === "ArrowUp") setVolume((v) => Math.min(1, v + 0.05));
      else if (e.code === "ArrowDown") setVolume((v) => Math.max(0, v - 0.05));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
      onMouseMove={showControls}
      onClick={() => {
        showControls();
      }}
    >
      <video
        ref={videoRef}
        className="aspect-video w-full bg-black"
        style={{ filter: `brightness(${brightness}%)` }}
        poster={poster}
        src={src}
        autoPlay={autoplay && !resume}
        playsInline
        crossOrigin="anonymous"
      >
        {subtitleUrl ? (
          <track kind="subtitles" srcLang="pt" label="Português" src={subtitleUrl} default={subtitlesOn} />
        ) : null}
      </video>

      {buffering && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent)]" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/70 p-6 text-center">
          <div>
            <p className="font-display text-2xl">Falha na reprodução</p>
            <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{error}</p>
            <button
              type="button"
              className="accent-btn mt-5 rounded-full px-5 py-2 text-sm"
              onClick={() => {
                setError(null);
                void videoRef.current?.load();
                void videoRef.current?.play();
              }}
            >
              Tentar de novo
            </button>
          </div>
        </div>
      )}

      {resume && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/65 p-6">
          <div className="panel max-w-md rounded-2xl p-6 text-center">
            <p className="font-display text-2xl">Continuar assistindo?</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Você parou em {formatClock(startPosition)}.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" className="accent-btn rounded-full px-5 py-2 text-sm" onClick={() => applyResume(false)}>
                Continuar
              </button>
              <button type="button" className="ghost-btn rounded-full px-5 py-2 text-sm" onClick={() => applyResume(true)}>
                Do início
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 transition ${
          controls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          className="absolute inset-0"
          aria-label={playing ? "Pausar" : "Reproduzir"}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        />
        <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-4">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (videoRef.current) videoRef.current.currentTime = value;
              setTime(value);
            }}
            className="w-full"
            aria-label="Progresso"
          />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" onClick={togglePlay}>
              {playing ? <IconPause /> : <IconPlay />}
            </button>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" onClick={() => seek(-10)} aria-label="Voltar 10s">
              <IconSkip dir="back" />
            </button>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" onClick={() => seek(10)} aria-label="Avançar 10s">
              <IconSkip dir="fwd" />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
              onClick={() => setMuted((v) => !v)}
            >
              <IconVolume muted={muted || volume === 0} />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setMuted(false);
                setVolume(Number(e.target.value));
              }}
              className="w-24"
              aria-label="Volume"
            />
            <span className="text-[var(--muted)]">
              {formatClock(time)} / {formatClock(duration)}
            </span>
            <span className="ml-auto hidden items-center gap-2 sm:flex">
              <IconSun size={16} />
              <input
                type="range"
                min={60}
                max={140}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-20"
                aria-label="Brilho"
              />
            </span>
            <button
              type="button"
              className="rounded-full px-3 py-1 text-xs ghost-btn"
              onClick={() => setMenu(menu === "settings" ? "none" : "settings")}
            >
              <span className="inline-flex items-center gap-1">
                <IconGear size={14} /> {quality}
              </span>
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
              onClick={() => {
                if (document.fullscreenElement) void document.exitFullscreen();
                else void wrapRef.current?.requestFullscreen();
              }}
              aria-label="Tela cheia"
            >
              <IconFullscreen />
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute left-4 top-4 text-xs text-[var(--muted)]">{Math.round(pct)}%</div>
      </div>

      {menu !== "none" && (
        <div className="absolute bottom-24 right-4 z-20 w-64 rounded-2xl panel p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium">Reprodução</p>
            <button type="button" onClick={() => setMenu("none")} aria-label="Fechar">
              <IconClose size={16} />
            </button>
          </div>
          <label className="mt-2 block text-xs text-[var(--muted)]">Velocidade</label>
          <select
            value={String(rate)}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-1 w-full rounded-lg bg-black/40 px-2 py-1 ring-1 ring-white/10"
          >
            {["0.5", "0.75", "1", "1.25", "1.5", "2"].map((v) => (
              <option key={v} value={v}>
                {v}x
              </option>
            ))}
          </select>
          <label className="mt-3 block text-xs text-[var(--muted)]">Qualidade</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="mt-1 w-full rounded-lg bg-black/40 px-2 py-1 ring-1 ring-white/10"
          >
            {["4K", "1080p", "720p", "480p"].map((v) => (
              <option key={v} value={v}>
                {v} {v !== "1080p" && v !== "4K" ? "(simulada)" : ""}
              </option>
            ))}
          </select>
          <label className="mt-3 block text-xs text-[var(--muted)]">Áudio</label>
          <select
            value={audio}
            onChange={(e) => setAudio(e.target.value)}
            className="mt-1 w-full rounded-lg bg-black/40 px-2 py-1 ring-1 ring-white/10"
          >
            <option>Padrão (PT)</option>
            <option>Original</option>
          </select>
          <label className="mt-3 block text-xs text-[var(--muted)]">Legendas</label>
          <select
            value={subs}
            onChange={(e) => setSubs(e.target.value)}
            className="mt-1 w-full rounded-lg bg-black/40 px-2 py-1 ring-1 ring-white/10"
          >
            <option>Português</option>
            <option>Desligadas</option>
          </select>
        </div>
      )}
    </div>
  );
}
