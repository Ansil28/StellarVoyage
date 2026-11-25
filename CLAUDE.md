# StellarVoyage

Dashboard de exploração espacial em HTML, CSS e JavaScript puro (sem build, sem frameworks). Abre-se diretamente o `index.html` no browser, mas o mapa do globo (Cesium) só carrega no site publicado ou com o Live Server do VS Code (`127.0.0.1:5500`), porque a chave do Cesium está limitada a esses endereços.

Tem quatro vistas, escolhidas pelo endereço (`#home`, `#launches`, `#launches/<id>`, `#guide`, `#guide/<tópico>`, `#intelligence`). Os botões da sidebar mudam o `location.hash` e `handleRoute()` em `app.js` mostra a vista certa com `showView()`. Um endereço vazio ou desconhecido abre a Overview.

- **Overview** (página inicial) — próximo lançamento em destaque com contagem decrescente, os 4 seguintes, a ISS ao vivo (só satellite.js, sem Cesium) e 3 tópicos do Rocket Guide (cópias dos cartões do guia).
- **Launches** — lista os próximos lançamentos da API The Space Devs (`ll.thespacedevs.com/2.3.0`, guardados 15 min no `localStorage`), com pesquisa, filtro por agência, contagem decrescente e uma página de detalhes para cada missão: `showLaunchDetails()` abre `#launches/<id>` e `showLaunchPage()` monta-a em `#launch-content` (imagem, contagem decrescente, detalhes, link, calendário e botão "Share" de `createShareButton()`, que abre a partilha do telemóvel ou copia o link), com o mesmo visual dos artigos do Rocket Guide. A contagem e o calendário só aparecem quando `hasConfirmedLaunchTime()` considera a hora exata (precisão "second", "minute" ou "hour" e não à meia-noite). Os lançamentos voltam a carregar quando a app volta a ficar visível (no máximo de 15 em 15 min), mantendo a pesquisa e o filtro; a API desiste ao fim de 10 s e usa os dados guardados. O botão "Add to calendar" (`createCalendarControl()`) abre o Calendário do iPhone no Safari do iOS e na app instalada (através do endereço `launch.ics?event=...`, que o `sw.js` devolve como ficheiro de calendário, porque o Safari recusa links `data:`; sem service worker usa o Google Calendar), o Google Calendar no Android e noutros browsers do iOS, e no computador mostra um menu com Google Calendar ou ficheiro `.ics`.
- **Rocket Guide** — grelha de cartões com tópicos sobre foguetões. Cada botão abre `#guide/<data-topic>`, e o artigo é montado em `#guide-content` a partir de `GUIDE_TOPICS`. Além de `paragraphs`, `list` e `after`, um artigo aceita (só com dados, sem mexer no `app.js`): `image` no tópico (mostrada a seguir à introdução) ou numa secção (a seguir ao título), `table` (`{ headers, rows }`, montada como `<table>` a sério com scroll lateral no telemóvel) e `subheading: true` (título da secção como `<h4>`, parte da secção anterior). Tocar numa imagem abre-a em tamanho real no visualizador em ecrã inteiro (`#image-viewer`).
- **Space Intelligence** — globo 3D com CesiumJS (a chave em `Cesium.Ion.defaultAccessToken` só tem o scope `assets:read` e está limitada no Cesium ion a `https://ansil28.github.io`, `http://127.0.0.1:5500` e `http://localhost:5500`; uma chave nova tem de ter os mesmos endereços) com:
  - marcadores laranja nas plataformas dos próximos lançamentos (clicar abre a página do próximo lançamento);
  - ISS, Tiangong e Hubble em tempo real (lista `SATELLITES` em `app.js`), com seletor no painel e a órbita prevista do satélite escolhido. As posições são calculadas com satellite.js a partir dos TLE da CelesTrak, guardados 2 h no `localStorage`.

## Estrutura dos ficheiros

```
index.html   Estrutura das quatro vistas (#view-overview, #view-launches, #view-guide, #view-intelligence), sidebar, página de detalhes dos lançamentos (#launch-content) e visualizador de imagens (#image-viewer)
style.css    Todos os estilos; variáveis de cor em :root; media queries a 850px e 600px
guide-topics.js  Só dados: o texto dos artigos do Rocket Guide (GUIDE_TOPICS), indexado pelo data-topic dos cartões
app.js       Toda a lógica: navegação por endereço, fetch e render dos lançamentos, filtros, countdown, página de detalhes, calendário, artigos do guia, globo Cesium e tracking da ISS
README.md    Descrição curta do projeto
assets/      favicon.svg (logótipo), apple-touch-icon.png (180x180), icon-192/512.png e icon-maskable-512.png (app instalável), og-image.png (1200x630, pré-visualização ao partilhar) e guide/ (fotos dos cartões do Rocket Guide, NASA e SpaceX, uma por tópico com o nome do data-topic, e diagramas SVG dos artigos: rocket-forces.svg e rocket-types.svg)
manifest.webmanifest  Dados da app instalável (nome, cores, ícones, modo app "standalone", sem a barra do browser)
sw.js        Service worker: guarda o site para abrir sem internet (ficheiros do site primeiro da rede, satellite.js e fontes primeiro da cópia guardada) e gera o `launch.ics` do "Add to calendar" no iPhone
```

**App instalável (PWA):** ao acrescentar um ficheiro novo ao site, juntá-lo à lista `APP_FILES` em `sw.js`, senão não fica disponível offline. O service worker só funciona num endereço `http(s)`, não ao abrir o `index.html` diretamente.

O site está publicado em https://ansil28.github.io/StellarVoyage/ (GitHub Pages). As etiquetas `og:` e `twitter:` no `<head>` usam este endereço completo.

Dependências externas (via CDN, carregadas no `<head>` do `index.html`): CesiumJS 1.146, satellite.js 6.0.1, Google Fonts (Inter e Space Grotesk).

## Regras

1. **A interface é em inglês.** Todo o texto visível ao utilizador (títulos, botões, mensagens de estado e de erro) tem de estar em inglês.
2. **Manter o tema azul escuro.** Usar as variáveis de `:root` em `style.css` (`--bg`, `--surface`, `--accent`, etc.) em vez de cores novas soltas. Componentes novos devem seguir o visual dos existentes.
3. **Não reescrever código que funciona.** Fazer alterações pequenas e localizadas; não refatorar, renomear ou reorganizar código que não faz parte do pedido.
4. **Explicar antes de alterar.** Antes de editar ficheiros, descrever o que vai mudar, em que ficheiro e porquê, e esperar pela confirmação.
