import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <Logo />
        <h1 className="mt-8 font-display text-4xl">Título não encontrado</h1>
        <p className="mt-3 text-[var(--muted)]">Este conteúdo não existe ou foi filtrado pelo perfil infantil.</p>
        <Link href="/" className="accent-btn mt-6 inline-block rounded-full px-6 py-3 text-sm">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
