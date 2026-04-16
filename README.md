# Paróquia Santa Teresinha — Site Institucional

Site institucional da **Paróquia Santa Teresinha**, publicado em:

- https://paroquiasantateresinha.com

O projeto é um site estático em HTML/CSS/JavaScript, com foco em divulgação pastoral, horários de celebrações, avisos, informações sacramentais, contatos e doações.

---

## Visão geral

Este repositório contém o frontend completo do site da paróquia, com navegação responsiva e carregamento dinâmico de componentes comuns (cabeçalho e rodapé).

Principais características:

- Estrutura simples e leve (sem framework SPA)
- Layout responsivo com utilitários Tailwind CSS (via CDN)
- Fontes Google Fonts (`Julius Sans One` e `Open Sans`)
- Componentização de `header` e `footer` via `fetch`
- Destaque automático da página ativa no menu
- Efeitos visuais (fade, hover, animações de entrada)
- Modal de doação via PIX (na home e na página de doação)

---

## Estrutura do projeto

```text
.
├── index.html
├── celebracoes.html
├── avisos.html
├── confissao.html
├── batismo.html
├── crisma.html
├── teresinha.html
├── doacao.html
├── contatos.html
├── scripts.js
├── styles.css
├── tailwind.config.js
├── components/
│   ├── header.html
│   └── footer.html
└── imgs/
    ├── ... (imagens por seção e ícones)
```

### Páginas

- `index.html` — página inicial com destaque de celebrações, avisos e botão de doação
- `celebracoes.html` — horários e endereços das comunidades
- `avisos.html` — avisos paroquiais e data da última atualização
- `confissao.html` — explicação e orientações sobre confissão
- `batismo.html` — conteúdo e contato para preparação do batismo
- `crisma.html` — conteúdo e contato para preparação da crisma
- `teresinha.html` — biografia e espiritualidade de Santa Teresinha
- `doacao.html` — chamada para contribuição com modal PIX
- `contatos.html` — canais da secretaria, endereço e redes sociais

---

## Tecnologias utilizadas

- **HTML5**
- **CSS3** (`styles.css`)
- **JavaScript (ES6+)** (`scripts.js`)
- **Tailwind CSS** via CDN
- **Google Fonts**

> Observação: embora exista um `tailwind.config.js`, o projeto utiliza Tailwind por CDN nos arquivos HTML.

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

### `styles.css`

Contém estilos e animações complementares:

- Scroll suave
- Transições do menu mobile
- Animações de fade e modal PIX
- Efeitos de hover em links, cards, botões e imagens
- Ajustes de tipografia para títulos e conteúdos

---

## Como executar localmente

Como o projeto usa `fetch` para carregar componentes (`components/header.html` e `components/footer.html`), abra com servidor HTTP local (não use arquivo direto `file://`).

### Opção 1 — Python

No diretório do projeto:

```bash
python -m http.server 5500
```

Acesse:

- http://localhost:5500

### Opção 2 — VS Code Live Server

- Instale a extensão **Live Server**
- Clique com botão direito em `index.html` e selecione **Open with Live Server**

---

## Conteúdo e manutenção

### Atualizar avisos

Arquivo: `avisos.html`

- Atualize o bloco `Última Atualização`
- Edite/adicione cards dentro da seção `#avisos`

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

Por ser estático, pode ser publicado em qualquer hospedagem de arquivos estáticos (cPanel, Netlify, Vercel static, GitHub Pages, servidor próprio etc.), mantendo a estrutura de pastas (`components/`, `imgs/`) e os caminhos relativos.

Checklist rápido antes de publicar:

- Validar links internos de navegação
- Confirmar carregamento do `header` e `footer`
- Testar menu mobile
- Testar modal PIX
- Verificar caminhos das imagens

---

## Melhorias futuras (opcional)

- Centralizar dados de contato/PIX em único arquivo para evitar duplicação
- Padronizar caminhos de imagens (algumas páginas usam `../imgs/...` e outras `imgs/...`)
- Adicionar versionamento de conteúdo dos avisos
- Incluir pipeline simples de deploy automático

---

## Responsabilidade do conteúdo

As informações pastorais, horários e avisos devem ser validadas pela equipe da paróquia antes de cada atualização em produção.