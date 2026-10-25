import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/8 px-4 py-10 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
            Experiência cinematográfica original. Catálogo de demonstração com obras Creative Commons e
            originais Velora. Sem DRM invertido, sem fontes não autorizadas.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="grid gap-2">
            <Link href="/catalogo" className="text-[var(--muted)] hover:text-white">
              Catálogo
            </Link>
            <Link href="/busca" className="text-[var(--muted)] hover:text-white">
              Busca
            </Link>
            <Link href="/favoritos" className="text-[var(--muted)] hover:text-white">
              Minha lista
            </Link>
          </div>
          <div className="grid gap-2">
            <Link href="/sobre" className="text-[var(--muted)] hover:text-white">
              Sobre
            </Link>
            <Link href="/configuracoes" className="text-[var(--muted)] hover:text-white">
              Configurações
            </Link>
            <Link href="/entrar" className="text-[var(--muted)] hover:text-white">
              Conta
            </Link>
          </div>
        </div>
      </div>
      <div className="gold-line my-8" />
      <p className="text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} Velora. Big Buck Bunny, Sintel, Tears of Steel e Elephants Dream pertencem
        à Blender Foundation e são exibidos sob Creative Commons Attribution.
      </p>
    </footer>
  );
}
