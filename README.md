# JOGANDO SUJO

Site oficial da campanha **Jogando Sujo** — evento anual realizado todo mês de outubro em Porto Alegre (RS) que transforma a rivalidade Gre-Nal em coleta urbana de resíduos para proteger o Lago Guaíba.

Em vez de premiar o clube mais limpo, a dinâmica inverte a lógica: torcedores depositam lixo nas réplicas inteligentes da **Arena do Grêmio** e do **Estádio Beira-Rio** para aumentar o peso da lixeira do rival no **Placar da Vergonha**.

---

## Principais Funcionalidades

- **Seletor global de torcida (`SOU COLORADO` / `SOU GREMISTA`)**: sincroniza cores, textos, destaque de estádio e iluminação atmosférica em toda a página pela Navbar e pelo Hero.
- **Hero com placar mecânico Split-Flap**: contagem regressiva 3D para a próxima edição de outubro em Porto Alegre, com animação individual de dígitos e brilho reativo ao time selecionado.
- **Seção de manifesto com vídeo (`lixo-scroll.mp4`)**: narrativa visual sincronizada à rolagem com o slogan oficial da campanha.
- **Visualizador 3D interativo de estádios**:
  - Modelos procedurais da **Lixeira Arena do Grêmio** e **Lixeira Estádio Beira-Rio** construídos em **Three.js** (`OrbitControls`, `RoomEnvironment`, luzes LED e visor digital em `CanvasTexture`).
  - Simulação de descarte (`+ JOGAR 1KG NA LIXEIRA`) com queda do resíduo, enquadramento automático da câmera, flash no bocal e impressão térmica animada de recibo (`JOGANDO SUJO / +1,00 kg / +10 PONTOS`).
  - Exportação direta dos modelos 3D em **`.GLB`** e **`.STL`** (CAD / impressão 3D).
- **Placar da Vergonha em perspectiva 3D**: cards interativos com alternância independente de foco entre Arena e Beira-Rio, detalhamento de materiais (plástico, latas e papel) e barra comparativa em tempo real.
- **Calendário, pontos inteligentes e central de recibos**: marcos de outubro em Porto Alegre, locais na Orla e entorno dos estádios, simulador de código de recibo e catálogo de recompensas.

---

## Stack Tecnológica

O projeto utiliza arquitetura **estática zero-build** (sem necessidade de bundler ou etapa de compilação):

- **React 18** (UMD) + **[HTM](https://github.com/developit/htm)** (templates ES em JS modular)
- **Tailwind CSS** (Play CDN) + CSS customizado em `styles/theme.css`
- **Three.js `0.170.0`** via `<script type="importmap">` (`OrbitControls`, `RoomEnvironment`, `GLTFExporter`, `STLExporter`)
- **Tipografia**: `Plus Jakarta Sans`, `Inter` e `Barlow Condensed` (Google Fonts)

---

## Estrutura do Projeto

```text
.
├── index.html                   # Entrada principal, importmap do Three.js e carregamento dos módulos
├── App.js                       # Componente raiz, estado global (supporter, scores, toast, modal)
├── logo-jogando-sujo.png        # Marca oficial usada na Navbar, rodapé e favicon
├── lixo-scroll.mp4              # Vídeo de fundo da seção editorial com scroll
├── styles/
│   └── theme.css                # Animações split-flap, cards 3D do placar e estilos customizados
├── data/
│   └── campaignData.js          # Dados iniciais do placar, marcos do calendário, pontos e recompensas
├── utils/
│   ├── threeLoader.js           # Bridge ES Module para Three.js e addons
│   └── binModels3D.js           # Geometrias procedurais, texturas e animação do recibo térmico
└── components/
    ├── Icons.js                 # Ícones SVG e emblemas
    ├── Navbar.js                # Barra superior fixa com alternador de torcida e acesso ao recibo
    ├── OpeningHeroSection.js    # Hero inicial com placar split-flap e botões de torcida
    ├── ScrollTrashSection.js    # Seção de vídeo reativa ao scroll
    ├── HeroSection.js           # Seção das lixeiras 3D, simulação +1KG e download GLB/STL
    ├── StadiumBinVisual.js      # Canvas WebGL Three.js, iluminação e exportação 3D
    ├── ScoreboardSection.js     # Placar da Vergonha com perspectiva 3D
    ├── CalendarSection.js       # Cronograma da edição de outubro
    ├── LocationsSection.js      # Pontos de coleta em Porto Alegre
    ├── ReceiptValidator.js      # Validação e troca de recibos por pontos/prêmios
    ├── RewardsSection.js        # Recompensas e central de troca
    ├── ReceiptModal.js          # Modal rápido de resgate de recibo
    ├── ImpactSection.js         # Seção "Sobre" e proposta da iniciativa
    └── FinalBannerSection.js    # Banner final com QR Code, apoiadores e rodapé
```

---

## Como Rodar Localmente

Como o navegador exige protocolo HTTP/HTTPS para resolver `<script type="module">` e `<script type="importmap">` (não funciona abrindo `index.html` via `file://`), inicie qualquer servidor estático na raiz do projeto:

**Com Python 3:**
```bash
python -m http.server 4173
```

**Ou com a extensão Live Server (VS Code):** clique em **Go Live** na raiz do projeto.

Depois, acesse: `http://127.0.0.1:4173/` (ou a porta exibida no terminal).

---

## Deploy (Vercel / Hospedagem Estática)

Como não há backend nem build step, o deploy pode ser feito diretamente como site estático:

- **Framework Preset:** `Other`
- **Build Command:** *(vazio)*
- **Output Directory:** `.` *(raiz do repositório)*

> Certifique-se de enviar todos os arquivos e pastas na raiz do repositório (`index.html`, `App.js`, `components/`, `data/`, `styles/`, `utils/`, `logo-jogando-sujo.png` e `lixo-scroll.mp4`).

---

## Iniciativa

Idealizada em Porto Alegre por **Gabriela de Moraes**, **Helena Catelli**, **José Pedro Schury** e **Paulo Kreitchmann**.
