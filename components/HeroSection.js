// Section 5 — Open Asymmetric 3D Stadium Bin Section (Zero Boxes Around 3D)

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState, useEffect, useRef } = React;
  const { DotMatrixIcon } = window.AppIcons;
  const StadiumBinVisual = window.StadiumBinVisual;

  function HeroSection({ supporter, scores, onChangeSupporter, onQuickThrow }) {
    const isColorado = supporter === 'colorado';
    // Colorado targets Grêmio bin ('gremio'); Tricolor targets Inter bin ('inter')
    const targetClub = isColorado ? 'gremio' : 'inter';

    const [activeBin, setActiveBin] = useState(targetClub);
    const [dropTrigger, setDropTrigger] = useState(0);
    const [exportStatus, setExportStatus] = useState(null);
    const liveGroupRef = useRef(null);

    useEffect(() => {
      setActiveBin(targetClub);
    }, [targetClub]);

    function handleThrow() {
      setDropTrigger((n) => n + 1);
      onQuickThrow(activeBin);
    }

    function handleDownload(modelKey, format) {
      if (!window.exportStadiumBin3D) return;
      const modelWeight = scores ? scores[modelKey] : undefined;
      window.exportStadiumBin3D(modelKey, format, liveGroupRef.current, activeBin, modelWeight, (msg) => {
        setExportStatus(msg);
        if (msg.startsWith('Baixado:')) {
          setTimeout(() => setExportStatus(null), 2600);
        }
      });
    }

    const rivalName = isColorado ? 'GRÊMIO.' : 'INTER.';
    const rivalColor = isColorado ? '#0099FF' : '#E6192E';

    return html`
      <section
        id="lixeiras-3d"
        className="relative py-24 sm:py-32 bg-[#07080A] border-t border-white/[0.1] overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[78vh]">
            <!-- LEFT (5 Cols): Open Editorial Copy & Controls Directly on Background -->
            <div className="lg:col-span-5 relative z-20">
              <!-- Editorial Dot-Matrix Signature -->
              <div className="flex items-center gap-2.5 mb-5">
                <${DotMatrixIcon} className="w-4 h-4 text-[#F5F7FA]" accent=${rivalColor} />
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#8B95A5]">
                  LIXEIRA INTELIGENTE 3D • PORTO ALEGRE
                </span>
              </div>

              <!-- Giant Editorial Headline -->
              <h2 className="font-display font-bold uppercase tracking-tight leading-[0.94] text-4xl sm:text-5xl xl:text-[3.75rem] text-[#F5F7FA]">
                TIRE DAS RUAS,
                <br />
                <span>JOGUE NO LIXO DO </span>
                <span className="transition-colors duration-300" style=${{ color: rivalColor }}>
                  ${rivalName}
                </span>
              </h2>

              <p className="mt-6 text-base sm:text-lg text-[#8B95A5] leading-relaxed max-w-lg">
                <span>Já que não dá pra tirar o jogador lixo do teu time, </span>
                <span className="text-[#F5F7FA] font-medium">
                  pelo menos jogue lixo no estádio rival.
                </span>
              </p>

              <!-- Loose Hairline Technical Specs -->
              <div className="mt-7 pt-5 border-t border-white/[0.12] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.06em] text-[#8B95A5]">
                <span>Sensores IoT de peso</span>
                <span className="text-white/25">—</span>
                <span>Recibo na hora</span>
                <span className="text-white/25">—</span>
                <span>Orla & Estádios</span>
              </div>

              <!-- Primary Action (+1kg 3D drop + scoreboard) -->
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick=${handleThrow}
                  className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.14em] uppercase pb-1.5 border-b-2 transition-opacity hover:opacity-80 cursor-pointer"
                  style=${{ color: rivalColor, borderColor: rivalColor }}
                >
                  <span>+ JOGAR 1KG NA LIXEIRA ↗</span>
                </button>

                <a
                  href="#placar"
                  className="text-xs font-semibold tracking-[0.14em] uppercase text-[#8B95A5] hover:text-[#F5F7FA] transition-colors"
                >
                  Ver placar ao vivo →
                </a>
              </div>

              <!-- Clean Hairline Section for Real 3D Exports (.GLB & .STL) -->
              <div className="mt-10 pt-5 border-t border-white/[0.12]">
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]">
                    MODELOS 3D PARA DOWNLOAD
                  </span>
                  ${exportStatus &&
                  html`
                    <span className="text-[11px] font-medium text-[#F5F7FA]">${exportStatus}</span>
                  `}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick=${() => handleDownload('gremio', 'glb')}
                    className="text-[#F5F7FA] hover:text-[#0099FF] transition-colors cursor-pointer"
                  >
                    ↓ Arena do Grêmio (.GLB)
                  </button>
                  <button
                    type="button"
                    onClick=${() => handleDownload('inter', 'glb')}
                    className="text-[#F5F7FA] hover:text-[#E6192E] transition-colors cursor-pointer"
                  >
                    ↓ Beira-Rio (.GLB)
                  </button>
                  <button
                    type="button"
                    onClick=${() => handleDownload(activeBin, 'stl')}
                    className="text-[#8B95A5] hover:text-[#F5F7FA] transition-colors cursor-pointer"
                  >
                    ↓ Modelo Ativo em .STL (CAD / Impressão 3D)
                  </button>
                </div>
              </div>
            </div>

            <!-- RIGHT (7 Cols): Giant Free-Floating 3D Bin (ZERO box/border) -->
            <div className="lg:col-span-7 relative">
              <${StadiumBinVisual}
                activeBin=${activeBin}
                scores=${scores}
                onSelectBin=${setActiveBin}
                dropTrigger=${dropTrigger}
                liveGroupRef=${liveGroupRef}
              />
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.HeroSection = HeroSection;
})();
