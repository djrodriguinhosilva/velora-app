import { AppShell } from "@/components/AppShell";

export default function AboutPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Identidade</p>
        <h1 className="mt-2 font-display text-4xl">Sobre o Velora</h1>
        <p className="mt-4 leading-relaxed text-[#ddd6c8]">
          O Velora é uma plataforma original de streaming inspirada na fluidez dos aplicativos de
          catálogo contemporâneos. Não é um clone de marca, não reproduz acervos proprietários e não
          implementa qualquer mecanismo para contornar DRM.
        </p>
        <h2 className="mt-8 font-display text-2xl">O que está funcional</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--muted)]">
          <li>Início com destaques, lançamentos, categorias e continuar assistindo.</li>
          <li>Catálogo, filmes, séries, busca com sugestões, filtros e ordenação.</li>
          <li>Ficha do título, temporadas, episódios, trailers e recomendações.</li>
          <li>Player com play/pause, volume, brilho, salto, legendas, qualidade e retomada.</li>
          <li>Favoritos, histórico e progresso por perfil.</li>
          <li>Perfis, tema, acessibilidade e painel administrativo protegido.</li>
        </ul>
        <h2 className="mt-8 font-display text-2xl">Fontes autorizadas</h2>
        <p className="mt-3 text-[var(--muted)]">
          Big Buck Bunny, Sintel, Tears of Steel e Elephants Dream são obras da Blender Foundation
          (Creative Commons Attribution). Os originais Velora usam arquivos públicos de demonstração
          do Google sample bucket apenas para testes de reprodução.
        </p>
        <h2 className="mt-8 font-display text-2xl">Arquitetura</h2>
        <p className="mt-3 text-[var(--muted)]">
          Next.js App Router, PostgreSQL via Drizzle ORM, autenticação por cookie HMAC, painel admin
          com role no servidor. Este é um aplicativo web responsivo — a experiência mobile cobre o
          fluxo de um app de streaming, sem APK de terceiros.
        </p>
      </main>
    </AppShell>
  );
}
