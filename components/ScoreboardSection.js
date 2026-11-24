// Section 6 — "PLACAR DA VERGONHA" 3D Perspective Focus Stage (Clean Editorial Cards)

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState, useEffect } = React;
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
        className="pointer-events-none absolute inset-0 w-full h-full opacity-50"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id=${`panelGlow-${type}`} cx="72%" cy="35%" r="65%">
            <stop offset="0%" stopColor=${type === 'gremio' ? '#0099FF' : '#E6192E'} stopOpacity="0.16" />
            <stop offset="70%" stopColor="#0D1015" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill=${`url(#panelGlow-${type})`} />
        ${type === 'gremio'
          ? html`
              <ellipse cx="360" cy="210" rx="220" ry="125" fill="none" stroke=${strokeColor} strokeWidth="1.5" />
              <ellipse cx="360" cy="210" rx="165" ry="88" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            `
          : html`
              <circle cx="360" cy="210" r="165" fill="none" stroke=${strokeColor} strokeWidth="1.5" />
              <circle cx="360" cy="210" r="105" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ${Array.from({ length: 14 }).map((_, idx) => {
                const a = (idx / 14) * Math.PI * 2;
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

  function ScoreboardSection({ supporter = 'colorado', scores, lastBump, onAddKg }) {
    const userTeam = supporter; // Global user team ('colorado' | 'tricolor')
    const defaultStadium = userTeam === 'colorado' ? 'beira-rio' : 'arena';
    const [focusedStadium, setFocusedStadium] = useState(defaultStadium);

    // Sync focusedStadium only when the global userTeam selection changes
    useEffect(() => {
      setFocusedStadium(userTeam === 'colorado' ? 'beira-rio' : 'arena');
    }, [userTeam]);

    const total = scores.gremio + scores.inter;
    const gremioPct = total > 0 ? (scores.gremio / total) * 100 : 50;
    const interPct = 100 - gremioPct;

    const isTied = Math.abs(scores.gremio - scores.inter) < 0.01;
    const gremioDirtier = scores.gremio > scores.inter;
    const interDirtier = scores.inter > scores.gremio;

    const isColorado = supporter === 'colorado';
    const supporterAccent = isColorado ? '#E6192E' : '#0099FF';

    const userWinning = isColorado ? gremioDirtier : interDirtier;
    const userLosing = isColorado ? interDirtier : gremioDirtier;

    let pillLabel = 'EMPATE';
    let pillClasses = 'bg-white/[0.06] border-white/20 text-[#F5F7FA]';
    let pillDot = '#8B95A5';

    if (!isTied && userWinning) {
      pillLabel = 'SEU TIME ESTÁ VENCENDO';
      pillClasses =
        'bg-emerald-500/15 border-emerald-400/55 text-emerald-300 shadow-[0_0_28px_-4px_rgba(16,185,129,0.55)]';
      pillDot = '#10B981';
    } else if (!isTied && userLosing) {
      pillLabel = 'SEU TIME ESTÁ PERDENDO';
      pillClasses =
        'bg-[#E6222C]/15 border-[#FF3B4E]/60 text-[#FF5E6C] shadow-[0_0_28px_-4px_rgba(230,34,44,0.6)]';
      pillDot = '#FF3B4E';
    }

    const panels = [
      {
        key: 'gremio',
        stadiumId: 'arena',
        club: 'Arena do Grêmio',
        accent: '#0099FF',
        glowShadow: '0 24px 70px -24px rgba(0, 153, 255, 0.35)',
        borderFocused: 'rgba(0, 153, 255, 0.45)',
        weight: scores.gremio,
        pct: gremioPct,
        isDirtiest: gremioDirtier,
        side: 'left',
        plasticKg: Math.round(scores.gremio * 0.54),
        cansKg: Math.round(scores.gremio * 0.28),
        paperKg: Math.round(scores.gremio * 0.18),
      },
      {
        key: 'inter',
        stadiumId: 'beira-rio',
        club: 'Estádio Beira-Rio',
        accent: '#E6192E',
        glowShadow: '0 24px 70px -24px rgba(230, 25, 46, 0.35)',
        borderFocused: 'rgba(230, 25, 46, 0.45)',
        weight: scores.inter,
        pct: interPct,
        isDirtiest: interDirtier,
        side: 'right',
        plasticKg: Math.round(scores.inter * 0.52),
        cansKg: Math.round(scores.inter * 0.31),
        paperKg: Math.round(scores.inter * 0.17),
      },
    ];

    return html`
      <section id="placar" className="relative py-24 sm:py-32 bg-[#07080A] border-t border-white/[0.1] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <!-- Minimalist Top Bar: Title + Single Winning/Losing Pill -->
          <div className="mb-10 sm:mb-12 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.1]">
            <h2 className="font-display font-bold uppercase text-xl sm:text-2xl tracking-[0.04em] text-[#F5F7FA]">
              PLACAR DA VERGONHA
            </h2>

            <div
              className=${`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border text-sm sm:text-base font-bold tracking-[0.14em] uppercase transition-all ${pillClasses}`}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style=${{ backgroundColor: pillDot }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style=${{ backgroundColor: pillDot }}
                />
              </span>
              <span>${pillLabel}</span>
            </div>
          </div>

          <!-- 3D Perspective Focus Stage (~62% Primary / ~38% Secondary Tilted) -->
          <div className="scoreboard-stage-3d flex flex-col lg:flex-row items-stretch gap-5 lg:gap-4">
            ${panels.map((panel) => {
              const isPrimary = focusedStadium === panel.stadiumId;
              const statusTag = isTied ? 'EMPATE' : panel.isDirtiest ? 'MAIS SUJO' : 'MAIS LIMPO';
              const tagColor = isTied
                ? 'text-[#8B95A5]'
                : panel.isDirtiest
                ? 'text-amber-300'
                : 'text-emerald-300';

              const cardPositionClass = isPrimary
                ? 'scoreboard-card-primary'
                : panel.side === 'right'
                ? 'scoreboard-card-secondary-right cursor-pointer'
                : 'scoreboard-card-secondary-left cursor-pointer';

              return html`
                <article
                  key=${panel.key}
                  onClick=${() => {
                    if (!isPrimary) setFocusedStadium(panel.stadiumId);
                  }}
                  role=${!isPrimary ? 'button' : undefined}
                  tabIndex=${!isPrimary ? 0 : undefined}
                  onKeyDown=${(e) => {
                    if (!isPrimary && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      setFocusedStadium(panel.stadiumId);
                    }
                  }}
                  aria-label=${!isPrimary ? `Colocar ${panel.club} em destaque` : undefined}
                  className=${`scoreboard-card-3d relative rounded-xl bg-[#0D1015] border overflow-hidden flex flex-col justify-between pointer-events-auto ${
                    isPrimary ? 'p-6 sm:p-9 min-h-[340px] sm:min-h-[390px]' : 'p-6 sm:p-7 min-h-[260px] lg:min-h-[390px]'
                  } ${cardPositionClass}`}
                  style=${{
                    borderColor: isPrimary ? panel.borderFocused : 'rgba(255,255,255,0.1)',
                    boxShadow: isPrimary ? panel.glowShadow : 'none',
                  }}
                >
                  <${StadiumPanelBackdrop} type=${panel.key} />

                  <!-- Top Row: Tag & Percentage + Action -->
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <${DotMatrixIcon} className="w-3.5 h-3.5 text-[#F5F7FA]" accent=${panel.accent} />
                      <span className=${`text-[11px] font-bold tracking-[0.18em] uppercase ${tagColor}`}>
                        ${statusTag}
                      </span>
                      ${isPrimary &&
                      html`
                        <span className="text-[11px] font-medium text-[#8B95A5] tabular-nums">
                          • ${panel.pct.toFixed(1)}%
                        </span>
                      `}
                    </div>

                    ${isPrimary
                      ? html`
                          <button
                            type="button"
                            onClick=${(e) => {
                              e.stopPropagation();
                              onAddKg(panel.key, 1);
                            }}
                            className="text-xs font-bold tracking-[0.14em] uppercase pb-0.5 border-b transition-opacity hover:opacity-80 cursor-pointer"
                            style=${{ color: panel.accent, borderColor: panel.accent }}
                          >
                            +1KG ↗
                          </button>
                        `
                      : html`
                          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#8B95A5]">
                            VER EM DESTAQUE
                          </span>
                        `}
                  </div>

                  <!-- Center: Club Name + Giant KG -->
                  <div className="relative z-10 my-6 sm:my-8 flex flex-col justify-center">
                    <h3
                      className=${`font-display font-bold tracking-tight text-[#F5F7FA] ${
                        isPrimary ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'
                      }`}
                    >
                      ${panel.club}
                    </h3>

                    <div
                      key=${`${panel.key}-${panel.weight}`}
                      className=${`mt-3 font-display font-bold tracking-tight text-[#F5F7FA] tabular-nums leading-none ${
                        isPrimary ? 'text-5xl sm:text-7xl' : 'text-4xl sm:text-5xl'
                      } ${lastBump && lastBump.team === panel.key ? 'animate-score-pop' : ''}`}
                    >
                      ${formatKg(panel.weight)}
                      <span
                        className=${`${isPrimary ? 'text-2xl sm:text-3xl' : 'text-xl'} font-semibold ml-1.5`}
                        style=${{ color: panel.accent }}
                      >
                        kg
                      </span>
                    </div>
                  </div>

                  <!-- Bottom Row: Discreet Materials Line ONLY on Focused Primary Card -->
                  ${isPrimary
                    ? html`
                        <div className="relative z-10 pt-4 border-t border-white/[0.1] flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] tracking-[0.12em] uppercase text-[#8B95A5] tabular-nums">
                          <span>PLÁSTICO <strong className="text-[#F5F7FA] ml-1">${panel.plasticKg.toLocaleString('pt-BR')} kg</strong></span>
                          <span className="text-white/20">/</span>
                          <span>LATAS <strong className="text-[#F5F7FA] ml-1">${panel.cansKg.toLocaleString('pt-BR')} kg</strong></span>
                          <span className="text-white/20">/</span>
                          <span>PAPEL <strong className="text-[#F5F7FA] ml-1">${panel.paperKg.toLocaleString('pt-BR')} kg</strong></span>
                        </div>
                      `
                    : html`
                        <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#8B95A5] tabular-nums">
                          <span>${panel.pct.toFixed(1)}%</span>
                          <button
                            type="button"
                            onClick=${(e) => {
                              e.stopPropagation();
                              onAddKg(panel.key, 1);
                            }}
                            className="font-semibold tracking-[0.12em] uppercase hover:text-[#F5F7FA] transition-colors cursor-pointer"
                          >
                            +1KG
                          </button>
                        </div>
                      `}
                </article>
              `;
            })}
          </div>

          <!-- Thin Tug-of-War Progress Hairline (Arena vs Beira-Rio) -->
          <div className="mt-10">
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
          </div>

          <!-- Prominent Editorial "+3 PONTOS*" Hero Callout + Immediate Asterisk Disclaimer -->
          <div className="mt-12 pt-10 border-t border-white/[0.1] text-center max-w-4xl mx-auto">
            <p className="font-display font-extrabold uppercase tracking-tight leading-[1.08] text-2xl sm:text-4xl lg:text-[2.75rem] text-[#F5F7FA]">
              <span>O time que mais recolher lixo ganha </span>
              <span className="inline-block" style=${{ color: supporterAccent }}>
                +3 PONTOS*
              </span>
              <span> na tabela</span>
            </p>
            <p className="mt-2.5 text-xs sm:text-sm text-[#8B95A5]">
              *Essa é uma afirmação humorística e não verídica.
            </p>
          </div>
        </div>
      </section>
    `;
  }

  window.ScoreboardSection = ScoreboardSection;
})();
