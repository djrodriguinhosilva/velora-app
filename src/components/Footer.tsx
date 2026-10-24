import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 px-4 py-10 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
            Experiência cinematográfica original. Catálogo de demonstração com obras criativas originais Velora. Sem DRM invertido, sem fontes não autorizadas.
          </p>
        </div>

        <nav aria-label="Navegação do Rodapé" className="grid grid-cols-2 gap-8 text-sm">
          <div className="grid gap-2">
            <Link 
              href="/catalogo" 
              className="text-[var(--muted)] transition-colors hover:text-white"
            >
              Catálogo
            </Link>
            <Link 
              href="/busca" 
              className="text-[var(--muted)] transition-colors hover:text-white"
            >
              Busca
            </Link>
            <Link 
              href="/favoritos" 
              className="text-[var(--muted)] transition-colors hover:text-white"
            >
              Minha lista
            </Link>
          </div>
          <div className="grid gap-2">
            <Link 
              href="/sobre" 
              className="text-[var(--muted)] transition-colors hover:text-white"
            >
              Sobre
            </Link>
            <Link 
              href="/configuracoes" 
              className="text-[var(--muted)] transition-colors hover:text-white"
            >
              Configurações
            </Link>
            <Link 
              href="/entrar" 
              className="text-[var(--muted)] transition-colors hover:text-white"
            >
              Conta
            </Link>
          </div>
        </nav>
      </div>

      {/* Linha de separação personalizada */}
      <div className="gold-line my-8" />

      <div className="flex flex-col gap-2 text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between text-xs">
        <p>
          © {currentYear} Velora. Big Buck Bunny, Sintel, Tears of Steel e Elephants Dream licenciados sob Creative Commons Attribution.
        </p>
        <p className="text-sm">
          Contato:{" "}
          <a 
            href="mailto:djrodriguinhosilva@hotmail.com" 
            className="underline hover:text-white transition-colors"
          >
            djrodriguinhosilva@hotmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
