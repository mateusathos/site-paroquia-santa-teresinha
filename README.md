# Paróquia Santa Teresinha — Site Institucional

Site institucional da **Paróquia Santa Teresinha**, publicado em:

- https://paroquiasantateresinha.com

O projeto é um site em HTML/CSS/JavaScript hospedado na Vercel, com foco em divulgação pastoral, horários de celebrações, avisos, informações sacramentais, contatos e doações.

Além das páginas públicas, o projeto possui um painel administrativo para gerenciar avisos paroquiais usando Turso DB e Vercel Functions.

---

## Visão geral

Este repositório contém o site da paróquia, com navegação responsiva, carregamento dinâmico de componentes comuns (cabeçalho e rodapé), painel administrativo e APIs serverless para avisos paroquiais.

Principais características:

- Estrutura simples e leve (sem framework SPA)
- Layout responsivo com utilitários Tailwind CSS (via CDN)
- Fontes Google Fonts (`Julius Sans One` e `Open Sans`)
- Componentização de `header` e `footer` via `fetch`
- Destaque automático da página ativa no menu
- Efeitos visuais (fade, hover, animações de entrada)
- Modal de doação via PIX (na home e na página de doação)
- URLs limpas na Vercel, como `/avisos`, `/admin` e `/celebracoes`
- Painel administrativo com login e sessão persistente
- CRUD de avisos paroquiais com Turso DB

---

## Estrutura do projeto

```text
.
├── index.html
├── admin.html
├── admin.js
├── celebracoes.html
├── avisos.html
├── avisos.js
├── confissao.html
├── batismo.html
├── crisma.html
├── teresinha.html
├── doacao.html
├── contatos.html
├── scripts.js
├── styles.css
├── tailwind.config.js
├── vercel.json
├── package.json
├── ADMIN_SETUP.md
├── api/
│   ├── avisos.js
│   ├── _lib/
│   │   ├── auth.js
│   │   ├── db.js
│   │   └── http.js
│   └── admin/
│       ├── avisos.js
│       ├── login.js
│       ├── logout.js
│       └── session.js
├── components/
│   ├── header.html
│   └── footer.html
└── imgs/
    ├── ... (imagens por seção e ícones)
```

### Páginas

- `/` (`index.html`) — página inicial com destaque de celebrações, avisos e botão de doação
- `/admin` (`admin.html`) — painel administrativo para gerenciar avisos
- `/avisos` (`avisos.html`) — avisos paroquiais carregados pela API
- `/celebracoes` (`celebracoes.html`) — horários e endereços das comunidades
- `/confissao` (`confissao.html`) — explicação e orientações sobre confissão
- `/batismo` (`batismo.html`) — conteúdo e contato para preparação do batismo
- `/crisma` (`crisma.html`) — conteúdo e contato para preparação da crisma
- `/teresinha` (`teresinha.html`) — biografia e espiritualidade de Santa Teresinha
- `/doacao` (`doacao.html`) — chamada para contribuição com modal PIX
- `/contatos` (`contatos.html`) — canais da secretaria, endereço e redes sociais

---

## Tecnologias utilizadas

- **HTML5**
- **CSS3** (`styles.css`)
- **JavaScript (ES6+)** (`scripts.js`)
- **Tailwind CSS** via CDN
- **Google Fonts**
- **Vercel Functions** em `api/`
- **Turso DB** via `@libsql/client`

> Observação: embora exista um `tailwind.config.js`, o projeto utiliza Tailwind por CDN nos arquivos HTML.

---

## URLs limpas

O arquivo `vercel.json` habilita URLs sem `.html`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

Com isso, as rotas devem ser acessadas como `/avisos`, `/admin`, `/celebracoes`, etc. Essa configuração é aplicada pela Vercel e pelo `vercel dev`.

---

## Componentes e comportamento global

### `components/header.html`

- Menu desktop e menu mobile
- Botão hambúrguer no mobile
- Links de navegação para todas as páginas principais

### `components/footer.html`

- Informações de secretaria
- Endereço
- Link para Instagram

### `scripts.js`

Responsável por comportamentos globais:

- Carregar `header.html` e `footer.html` nos elementos `#header` e `#footer`
- Marcar item ativo no menu conforme URL atual
- Abrir/fechar menu mobile
- Alternar imagens da home em intervalo automático
- Aplicar animações com `IntersectionObserver`

### `avisos.js`

Responsável pela página pública de avisos:

- Buscar avisos ativos em `/api/avisos`
- Renderizar os cards dinamicamente
- Exibir data da última atualização
- Mostrar estado vazio ou mensagem de erro quando necessário

### `admin.js`

Responsável pelo painel administrativo:

- Verificar sessão do administrador
- Exibir tela de login quando não houver sessão válida
- Mostrar/ocultar senha com botão de ícone de olho
- Listar avisos atuais
- Criar, editar e excluir avisos
- Encerrar sessão com o botão `Sair`

### `styles.css`

Contém estilos e animações complementares:

- Scroll suave
- Transições do menu mobile
- Animações de fade e modal PIX
- Efeitos de hover em links, cards, botões e imagens
- Ajustes de tipografia para títulos e conteúdos

---

## Como executar localmente

Como o projeto usa `fetch` para carregar componentes (`components/header.html` e `components/footer.html`) e APIs em `api/`, abra com servidor HTTP local (não use arquivo direto `file://`).

### Opção 1 — Vercel Dev com APIs

Instale as dependências:

```bash
npm install
```

Crie um `.env.local` com as variáveis abaixo e rode:

```bash
npm run dev
```

Variáveis necessárias:

```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
ADMIN_SESSION_DAYS=90
```

Acesse:

- http://localhost:3000
- http://localhost:3000/admin

Essa é a opção recomendada, pois executa as Vercel Functions e respeita as URLs limpas configuradas em `vercel.json`.

### Opção 2 — Python ou Live Server

Use apenas para prévia visual das páginas estáticas, sem APIs e sem simular as URLs limpas da Vercel.

No diretório do projeto:

```bash
python -m http.server 5500
```

Acesse os arquivos diretamente quando necessário:

- http://localhost:5500/index.html
- http://localhost:5500/avisos.html

No VS Code, também é possível usar a extensão **Live Server** abrindo `index.html`.

---

## Conteúdo e manutenção

### Atualizar avisos

Página: `/admin`

O administrador deve acessar o painel, fazer login e usar as ações disponíveis:

- Criar novo aviso
- Editar aviso existente
- Excluir aviso

Cada aviso usa apenas:

- Título
- Descrição

Os dados são salvos no Turso DB e exibidos automaticamente em `/avisos`.

Consulte `ADMIN_SETUP.md` para detalhes de configuração do banco, variáveis de ambiente e sessão administrativa.

### Atualizar horários/comunidades

Arquivo: `celebracoes.html`

- Ajuste textos de dias/horários
- Atualize endereços por comunidade

### Atualizar dados de contato e redes

Arquivos:

- `components/footer.html`
- `contatos.html`

### Atualizar chave PIX ou QR Code

Arquivos:

- `index.html`
- `doacao.html`
- imagem em `imgs/qr-code.jpg`

---

## Publicação (produção)

O site está em produção em https://paroquiasantateresinha.com.

O deploy principal é feito na Vercel. O projeto depende de Vercel Functions e Turso DB para o painel administrativo e para a página dinâmica de avisos.

Variáveis de ambiente exigidas na Vercel:

```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
ADMIN_SESSION_DAYS=90
```

Depois de configurar ou alterar variáveis de ambiente, faça um redeploy do projeto na Vercel.

Checklist rápido antes de publicar:

- Validar links internos de navegação
- Confirmar carregamento do `header` e `footer`
- Testar menu mobile
- Testar modal PIX
- Verificar caminhos das imagens
- Testar login em `/admin`
- Criar um aviso de teste e confirmar exibição em `/avisos`

---

## Melhorias futuras (opcional)

- Centralizar dados de contato/PIX em único arquivo para evitar duplicação
- Padronizar caminhos de imagens (algumas páginas usam `../imgs/...` e outras `imgs/...`)
- Adicionar opção de ativar/desativar avisos sem excluir
- Adicionar upload de imagem para avisos
- Adicionar auditoria simples de alterações administrativas
