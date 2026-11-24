// Section 6 — "PLACAR DA VERGONHA" Side-by-Side Editorial Panels (Mirroring "TRAIN LIKE A PRO")

(function () {
  const html = window.htm.bind(React.createElement);
  const { DotMatrixIcon } = window.AppIcons;

  function formatKg(value) {
    return Number(value).toLocaleString('pt-BR', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  function StadiumPanelBackdrop({ type }) {
    const strokeColor = type === 'gremio' ? 'rgba(0, 153, 255, 0.14)' : 'rgba(230, 25, 46, 0.14)';
    return html`
      <svg
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-55"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id=${`panelGlow-${type}`} cx="72%" cy="35%" r="65%">
            <stop offset="0%" stopColor=${type === 'gremio' ? '#0099FF' : '#E6192E'} stopOpacity="0.18" />
            <stop offset="70%" stopColor="#0D1015" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill=${`url(#panelGlow-${type})`} />
        ${type === 'gremio'
          ? html`
              <!-- Arena do Grêmio architectural oval roof lines -->
              <ellipse cx="360" cy="210" rx="220" ry="125" fill="none" stroke=${strokeColor} strokeWidth="1.5" />
              <ellipse cx="360" cy="210" rx="165" ry="88" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="140" y1="210" x2="580" y2="210" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="360" y1="85" x2="360" y2="335" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            `
          : html`
              <!-- Beira-Rio iconic radial membrane arches -->
              <circle cx="360" cy="210" r="165" fill="none" stroke=${strokeColor} strokeWidth="1.5" />
              <circle cx="360" cy="210" r="105" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ${Array.from({ length: 16 }).map((_, idx) => {
                const a = (idx / 16) * Math.PI * 2;
                const x1 = 360 + Math.cos(a) * 105;
                const y1 = 210 + Math.sin(a) * 105;
                const x2 = 360 + Math.cos(a) * 182;
                const y2 = 210 + Math.sin(a) * 182;
                return html`<line key=${idx} x1=${x1} y1=${y1} x2=${x2} y2=${y2} stroke=${strokeColor} strokeWidth="1" />`;
              })}
            `}
      </svg>
    `;
  }

  function ScoreboardSection({ scores, lastBump, onAddKg }) {
    const total = scores.gremio + scores.inter;
    const gremioPct = total > 0 ? (scores.gremio / total) * 100 : 50;
    const interPct = 100 - gremioPct;

    const gremioLeading = scores.gremio >= scores.inter;

    const panels = [
      {
        key: 'gremio',
        club: 'Arena do Grêmio',
        accent: '#0099FF',
        weight: scores.gremio,
        pct: gremioPct,
        isLeading: gremioLeading,
        plasticKg: Math.round(scores.gremio * 0.54),
        cansKg: Math.round(scores.gremio * 0.28),
        paperKg: Math.round(scores.gremio * 0.18),
      },
      {
        key: 'inter',
        club: 'Estádio Beira-Rio',
        accent: '#E6192E',
        weight: scores.inter,
        pct: interPct,
        isLeading: !gremioLeading,
        plasticKg: Math.round(scores.inter * 0.52),
        cansKg: Math.round(scores.inter * 0.31),
        paperKg: Math.round(scores.inter * 0.17),
      },
    ];

    return html`
      <section id="placar" className="relative py-24 sm:py-32 bg-[#07080A] border-t border-white/[0.1]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <!-- Editorial Header Connected by Thin 1px Line -->
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10 sm:mb-12">
            <h2 className="font-display font-bold uppercase text-xl sm:text-2xl tracking-[0.04em] text-[#F5F7FA] shrink-0">
              PLACAR DA VERGONHA — AO VIVO
            </h2>
            <div className="hidden sm:block flex-1 h-px bg-white/[0.12]" />
            <span className="text-xs font-medium tracking-[0.08em] text-[#8B95A5] shrink-0">
              Liderar aqui é motivo de vergonha →
            </span>
          </div>

          <!-- Two Wide Side-by-Side Editorial Stadium Panels -->
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            ${panels.map(
              (panel) => html`
                <article
                  key=${panel.key}
                  className="relative min-h-[380px] sm:min-h-[430px] rounded-xl bg-[#0D1015] border border-white/[0.1] overflow-hidden p-6 sm:p-8 flex flex-col justify-between group"
                >
                  <${StadiumPanelBackdrop} type=${panel.key} />

                  <!-- Top Row: Dot-Matrix + "+1kg de lixo ↗" -->
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <${DotMatrixIcon} className="w-4 h-4 text-[#F5F7FA]" accent=${panel.accent} />
                      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B95A5]">
                        ${panel.isLeading ? 'LIDERANDO A VERGONHA' : 'NA DISPUTA'} • ${panel.pct.toFixed(1)}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick=${() => onAddKg(panel.key, 1)}
                      className="text-xs font-semibold tracking-[0.14em] uppercase pb-0.5 border-b transition-opacity hover:opacity-80 cursor-pointer"
                      style=${{ color: panel.accent, borderColor: panel.accent }}
                    >
                      +1kg de lixo ↗
                    </button>
                  </div>

                  <!-- Middle Row: Vertical Micro-Metrics Left + Giant Weight Number -->
                  <div className="relative z-10 my-8 flex items-end justify-between gap-6">
                    <!-- Vertical Micro-Metrics -->
                    <div className="space-y-2.5 text-[11px] tracking-[0.12em] uppercase text-[#8B95A5] border-l border-white/[0.14] pl-3.5">
                      <div>
                        <span className="block text-[9px] text-[#8B95A5]/70">PLÁSTICO</span>
                        <span className="font-semibold text-[#F5F7FA] tabular-nums">
                          ${panel.plasticKg.toLocaleString('pt-BR')} kg
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-[#8B95A5]/70">LATAS</span>
                        <span className="font-semibold text-[#F5F7FA] tabular-nums">
                          ${panel.cansKg.toLocaleString('pt-BR')} kg
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-[#8B95A5]/70">PAPEL</span>
                        <span className="font-semibold text-[#F5F7FA] tabular-nums">
                          ${panel.paperKg.toLocaleString('pt-BR')} kg
                        </span>
                      </div>
                    </div>

                    <!-- Giant Tabular Score -->
                    <div className="text-right">
                      <div
                        key=${`${panel.key}-${panel.weight}`}
                        className=${`font-display font-bold tracking-tight text-4xl sm:text-6xl text-[#F5F7FA] tabular-nums leading-none ${
                          lastBump && lastBump.team === panel.key ? 'animate-score-pop' : ''
                        }`}
                      >
                        ${formatKg(panel.weight)}
                        <span className="text-xl sm:text-2xl font-semibold ml-1.5" style=${{ color: panel.accent }}>
                          kg
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[#8B95A5]">
                        despejados na lixeira rival
                      </p>
                    </div>
                  </div>

                  <!-- Bottom Left: Large Club / Stadium Name -->
                  <div className="relative z-10 pt-5 border-t border-white/[0.1] flex items-end justify-between gap-4">
                    <h3 className="font-display font-bold tracking-tight text-2xl sm:text-3xl text-[#F5F7FA]">
                      ${panel.club}
                    </h3>
                    <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#8B95A5]">
                      ${panel.isLeading ? 'Mais Sujo do Ano (parcial)' : 'Menos lixo acumulado'}
                    </span>
                  </div>
                </article>
              `
            )}
          </div>

          <!-- Thin Tug-of-War Progress Hairline + Combined Total + Humor Disclaimer -->
          <div className="mt-8">
            <div className="flex items-center justify-between text-[11px] tracking-[0.16em] uppercase text-[#8B95A5] mb-2.5">
              <span>${gremioPct.toFixed(1)}% ARENA</span>
              <span className="text-[#F5F7FA] tabular-nums">
                ${formatKg(total)} kg retirados das ruas
              </span>
              <span>${interPct.toFixed(1)}% BEIRA-RIO</span>
            </div>

            <div
              className="relative h-[3px] w-full bg-white/[0.08] overflow-hidden"
              role="progressbar"
              aria-label="Comparativo de lixo acumulado entre Arena do Grêmio e Beira-Rio"
              aria-valuenow=${Math.round(gremioPct)}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-[#0099FF] transition-all duration-500"
                style=${{ width: `${gremioPct}%` }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 bg-[#E6192E] transition-all duration-500"
                style=${{ width: `${interPct}%` }}
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="text-[#F5F7FA] font-medium">
                “O time que mais acumular lixo ganha +3 pontos na tabela*”
              </p>
              <p className="text-[11px] text-[#8B95A5]">
                *Essa é uma afirmação humorística e não verídica.
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.ScoreboardSection = ScoreboardSection;
})();
