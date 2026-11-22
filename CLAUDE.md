# SpaceHub

Dashboard de exploração espacial em HTML, CSS e JavaScript puro (sem build, sem frameworks). Abre-se diretamente o `index.html` no browser.

Tem quatro vistas, escolhidas pelo endereço (`#home`, `#launches`, `#guide`, `#guide/<tópico>`, `#intelligence`). Os botões da sidebar mudam o `location.hash` e `handleRoute()` em `app.js` mostra a vista certa com `showView()`. Um endereço vazio ou desconhecido abre a Overview.

- **Overview** (página inicial) — próximo lançamento em destaque com contagem decrescente, os 4 seguintes, a ISS ao vivo (só satellite.js, sem Cesium) e 3 tópicos do Rocket Guide (cópias dos cartões do guia).
- **Launches** — lista os próximos lançamentos da API The Space Devs (`ll.thespacedevs.com/2.3.0`, guardados 15 min no `localStorage`), com pesquisa, filtro por agência, contagem decrescente e um `<dialog>` com os detalhes de cada missão. O botão "Add to calendar" (`createCalendarControl()`) abre o Calendário do iPhone no Safari do iOS, o Google Calendar no Android e noutros browsers do iOS, e no computador mostra um menu com Google Calendar ou ficheiro `.ics`.
- **Rocket Guide** — grelha de cartões com tópicos sobre foguetões. Cada botão abre `#guide/<data-topic>`, e o artigo é montado em `#guide-content` a partir de `GUIDE_TOPICS`.
- **Space Intelligence** — globo 3D com CesiumJS com:
  - marcadores laranja nas plataformas dos próximos lançamentos (clicar abre o modal do próximo lançamento);
  - ISS, Tiangong e Hubble em tempo real (lista `SATELLITES` em `app.js`), com seletor no painel e a órbita prevista do satélite escolhido. As posições são calculadas com satellite.js a partir dos TLE da CelesTrak, guardados 2 h no `localStorage`.

## Estrutura dos ficheiros

```
index.html   Estrutura das quatro vistas (#view-overview, #view-launches, #view-guide, #view-intelligence), sidebar e modal de detalhes
style.css    Todos os estilos; variáveis de cor em :root; media queries a 850px e 600px
guide-topics.js  Só dados: o texto dos artigos do Rocket Guide (GUIDE_TOPICS), indexado pelo data-topic dos cartões
app.js       Toda a lógica: navegação por endereço, fetch e render dos lançamentos, filtros, countdown, modal, calendário, artigos do guia, globo Cesium e tracking da ISS
README.md    Descrição curta do projeto
assets/      favicon.svg (logótipo), apple-touch-icon.png (180x180), icon-192/512.png e icon-maskable-512.png (app instalável) e og-image.png (1200x630, pré-visualização ao partilhar)
manifest.webmanifest  Dados da app instalável (nome, cores, ícones, ecrã inteiro)
sw.js        Service worker: guarda o site para abrir sem internet (ficheiros do site primeiro da rede, satellite.js e fontes primeiro da cópia guardada)
```

**App instalável (PWA):** ao acrescentar um ficheiro novo ao site, juntá-lo à lista `APP_FILES` em `sw.js`, senão não fica disponível offline. O service worker só funciona num endereço `http(s)`, não ao abrir o `index.html` diretamente.

O site está publicado em https://ansil28.github.io/SpaceHub/ (GitHub Pages). As etiquetas `og:` e `twitter:` no `<head>` usam este endereço completo.

Dependências externas (via CDN, carregadas no `<head>` do `index.html`): CesiumJS 1.146, satellite.js 6.0.1, Google Fonts (Inter e Space Grotesk).

## Regras

1. **A interface é em inglês.** Todo o texto visível ao utilizador (títulos, botões, mensagens de estado e de erro) tem de estar em inglês.
2. **Manter o tema azul escuro.** Usar as variáveis de `:root` em `style.css` (`--bg`, `--surface`, `--accent`, etc.) em vez de cores novas soltas. Componentes novos devem seguir o visual dos existentes.
3. **Não reescrever código que funciona.** Fazer alterações pequenas e localizadas; não refatorar, renomear ou reorganizar código que não faz parte do pedido.
4. **Explicar antes de alterar.** Antes de editar ficheiros, descrever o que vai mudar, em que ficheiro e porquê, e esperar pela confirmação.
