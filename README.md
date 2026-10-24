# VELORA

Plataforma original de streaming (Next.js + PostgreSQL) com identidade própria. O briefing pedia um app Android inspirado no CineVS 12.5 p; **não havia APK de referência no ambiente** e a stack deste sandbox é web. O Velora entrega o mesmo conjunto funcional em um aplicativo fullstack responsivo, pronto para celular e desktop.

Nenhuma marca, layout proprietário ou acervo fechado foi copiado. Não há bypass de DRM.

## Arquitetura

```
src/
  app/                 # App Router (páginas, APIs, admin)
  components/          # UI (hero, carrosséis, player, admin)
  db/                  # Drizzle + PostgreSQL
  lib/                 # auth HMAC, seed, consultas
public/posters/        # artes originais
public/subtitles/      # VTT de demonstração
```

- **Frontend:** Next.js App Router, tema escuro, destaque configurável por perfil.
- **Backend:** Route Handlers REST com cookies httpOnly.
- **Banco:** PostgreSQL via Drizzle ORM (`src/db/schema.ts`).
- **Auth:** senha com scrypt + sessão HMAC. Papel `admin` no servidor.
- **Player:** HTML5 com play/pause, volume, brilho, salto ±10s, velocidade, legendas, qualidade e retomada.

## O que está funcional

- Início com banners, lançamentos, populares, categorias e continuar assistindo
- Catálogo, filmes, séries, busca com sugestões, filtros e ordenação
- Ficha completa, temporadas, episódios, trailer e recomendações
- Favoritos, histórico e progresso por perfil
- Perfis (incluindo modo infantil), tema e acessibilidade
- Painel admin: métricas, CRUD de títulos, usuários, fontes autorizadas

## Fontes de vídeo autorizadas

- Blender Foundation (CC-BY): Big Buck Bunny, Sintel, Tears of Steel, Elephants Dream
- Google sample video bucket (arquivos públicos de demonstração) para originais Velora
- Imagens de pôster geradas para a marca + acervo Pexels

## Contas de demonstração

| Conta | Senha | Papel |
| --- | --- | --- |
| walt.e@example.net | demo123 | usuário (perfis Ana e Kids) |
| emma.t@example.net | velora123 | administrador |

## Como executar

```bash
npm install
npx drizzle-kit push
npm run dev
```

Variável obrigatória: `DATABASE_URL`.

## Sobre o APK Android

Gerar um APK Kotlin/Compose está fora desta stack. O caminho natural seria um cliente Jetpack Compose consumindo as APIs em `src/app/api`, com Media3 no player e Room para cache. As rotas atuais já separam catálogo, auth, progresso e admin.

## Testes manuais sugeridos

1. Abrir `/` e navegar pelos carrosséis.
2. Buscar “órbita”, filtrar por ano e abrir a ficha.
3. Reproduzir, pausar, alterar volume/brilho, avançar 10s e recarregar a página (retomada).
4. Entrar como `walt.e@example.net`, favoritar um título e conferir `/favoritos`.
5. Entrar como admin e criar/editar um título em `/admin/titulos`.
