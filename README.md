# Lume Play

Aplicação web responsiva de descoberta audiovisual, criada com identidade original. O catálogo de demonstração mistura curtas licenciados em Creative Commons com obras fictícias explicitamente marcadas como demonstração. O player só abre títulos que tenham `isAuthorized = true` e uma fonte HTTPS cadastrada.

## Arquitetura

- **Interface:** Next.js App Router, React e CSS responsivo; manifesto PWA para instalação pela tela inicial de Android/iOS.
- **API e servidor:** Route Handlers do Next.js com validação de entrada, cookie de perfil local e sessão administrativa assinada.
- **Banco:** PostgreSQL com Drizzle ORM; catálogo, temporadas, episódios, perfis/preferências e biblioteca (favoritos/progresso).
- **Player:** elemento HTML5 `<video>` com controles nativos do navegador, retomada e salvamento de progresso. O player usa apenas a URL HTTPS cadastrada para um título autorizado.
- **Painel:** `/admin`, protegido por `ADMIN_PASSWORD`; a senha nunca é enviada ao bundle do cliente. A sessão usa cookie HttpOnly e assinatura HMAC.

### Estrutura principal

```text
src/
  app/
    api/                     Route Handlers (catálogo, perfil, biblioteca, admin)
    admin/                   Entrada do painel administrativo
    globals.css              Tema e componentes responsivos
    manifest.ts              Manifesto PWA
    page.tsx                 Aplicação principal
  components/
    studio-app.tsx           Navegação, catálogo, busca, detalhes e player
    admin-panel.tsx          CRUD administrativo
  db/
    index.ts                 Pool PostgreSQL e cliente Drizzle
    schema.ts                Schema do banco
  lib/
    admin-auth.ts            Sessão HMAC do administrador
    admin-content.ts         Validação do CRUD
    app-types.ts             Tipos partilhados
    catalog.ts               Consultas e seed de demonstração
    demo-catalog.ts          Conteúdo inicial autorizado/fictício
    visitor-profile.ts       Perfil visitante por cookie HttpOnly
public/
  images/lume-feature.jpg    Arte original do destaque
  lume-icon.svg              Ícone do manifesto
```

## Executar localmente

1. Use Node.js 20+ e PostgreSQL.
2. Crie um `.env` local (não versionar segredos):

```dotenv
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
ADMIN_EMAIL=djrodriguinhosilva@hotmail.com
ADMIN_PASSWORD=uma-senha-forte-e-unica
ADMIN_SESSION_SECRET=gere-um-segredo-aleatorio-com-openssl-rand-hex-32
```

3. Instale dependências, aplique o schema e inicie:

```bash
npm install
npx drizzle-kit push
npm run dev
```

O e-mail administrativo padrão é `djrodriguinhosilva@hotmail.com`; `ADMIN_EMAIL` pode substituí-lo. O login exige esse e-mail e a senha `ADMIN_PASSWORD`, sempre validados no servidor. O primeiro acesso ao catálogo cria dados iniciais se a tabela estiver vazia. Em produção, use HTTPS, senhas fortes, segredo de sessão dedicado e um PostgreSQL gerenciado com backups.

## Funcionalidades implementadas

- Home editorial, navegação por filmes/séries, catálogo e filtros por gênero.
- Busca no backend por título, sinopse, gênero e ano, com sugestões enquanto digita.
- Detalhes, temporadas/episódios de demonstração e recomendações por gênero.
- Favoritos, histórico/progresso e retomada, salvos no PostgreSQL por perfil local.
- Preferências de perfil: nome, cor de destaque, redução de movimento e preferência por legendas.
- Player HTML5 com controles nativos, tratamento de erro e retomada. O navegador expõe seleção de áudio/legenda/qualidade apenas quando os recursos existem na fonte.
- Painel `/admin`: métricas simples e CRUD de conteúdos. Sem `ADMIN_PASSWORD`, o painel permanece desativado.
- Dados iniciais: *Sintel*, *Big Buck Bunny* e *Tears of Steel* (curtas Blender Foundation em Creative Commons) têm URLs de demonstração; títulos fictícios não têm fonte reproduzível.

## API

- `GET /api/catalog?q=&type=&category=&limit=` — consulta paginada/filtrada do catálogo.
- `GET /api/catalog/:slug` — detalhes e episódios.
- `GET, POST /api/library` — favoritos e progresso.
- `GET, PATCH /api/profile` — perfil local e preferências validadas.
- `GET, POST /api/admin/session`, `DELETE /api/admin/session` — sessão administrativa.
- `GET, POST /api/admin/catalog`, `PATCH, DELETE /api/admin/catalog/:id` — CRUD protegido.
- `GET /api/health` — verificação de conectividade PostgreSQL.

## Verificação rápida

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

Smoke test automatizado, com o servidor em execução:

```bash
BASE_URL=http://localhost:3000 node scripts/smoke-test.mjs
```

Checklist funcional manual: abrir `/`, buscar “2010” e “fantasia”, favoritar um título, abrir os detalhes de *Sintel*, iniciar o player e conferir `Continuar assistindo`; testar que um título fictício não inicia reprodução; abrir `/admin` e validar que fica desabilitado sem a variável de senha, ou testar login/CRUD após configurá-la.

## Instalar no Android e limites

Esta entrega é uma **aplicação web instalável (PWA)**, não um projeto Android Kotlin e não gera um APK. Em um domínio HTTPS, abra o Lume no Chrome para Android e use **Instalar app** / **Adicionar à tela inicial**. A instalação funciona como atalho em modo standalone, mas esta versão depende de conexão e não tem service worker/offline.

Um APK nativo ainda exige um projeto Android separado em Kotlin/Jetpack Compose, Room e AndroidX Media3, integração com a API HTTPS e assinatura de release. Esses artefatos, gerenciamento real de contas/perfis, controle de permissões por usuário, upload de imagens, rate limit distribuído e seleção de faixas dependente do provedor **não fazem parte desta versão**. O identificador de perfil do visitante é uma sessão anônima deste navegador, não autenticação de conta.

## Créditos e direitos

- Curta *Sintel*, *Big Buck Bunny* e *Tears of Steel*: Blender Foundation, Creative Commons Attribution (licenças/créditos exibidos por título; confirmar os termos originais antes de redistribuição em uma oferta comercial).
- Fotografias decorativas dos cards: Pexels, exibidas como arte de catálogo demonstrativo e não como pôster oficial.
- `public/images/lume-feature.jpg`: imagem original criada para este projeto.
- Todo vídeo adicionado pelo painel deve ter autorização documentada e URL HTTPS. Não há DRM bypass nem mecanismo de acesso a fontes restritas.
