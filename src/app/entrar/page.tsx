"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("walt.e@example.net");
  const [password, setPassword] = useState("demo123");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = (await res.json()) as { error?: string; role?: string };
      if (!res.ok) {
        setError(data.error || "Não foi possível entrar.");
        return;
      }
      router.push(data.role === "admin" ? "/admin" : "/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl panel p-8">
        <Logo />
        <h1 className="mt-6 font-display text-3xl">
          {mode === "login" ? "Entrar na sala" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Contas de demonstração: <strong>walt.e@example.net</strong> / demo123 e{" "}
          <strong>emma.t@example.net</strong> / velora123
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-3">
          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              className="rounded-xl bg-black/30 px-4 py-3 ring-1 ring-white/10 outline-none"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="rounded-xl bg-black/30 px-4 py-3 ring-1 ring-white/10 outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="rounded-xl bg-black/30 px-4 py-3 ring-1 ring-white/10 outline-none"
            required
          />
          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
          <button disabled={busy} className="accent-btn rounded-xl py-3" type="submit">
            {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
        <button
          type="button"
          className="mt-4 text-sm text-[var(--accent)]"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Criar uma conta nova" : "Já tenho conta"}
        </button>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-white">
            Voltar ao início
          </Link>
        </p>
      </div>
    </main>
  );
}
