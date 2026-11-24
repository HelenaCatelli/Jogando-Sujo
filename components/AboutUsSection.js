// Editorial Section — "SOBRE NÓS" (Independent Urban Initiative in Porto Alegre)

(function () {
  const html = window.htm.bind(React.createElement);
  const { founders } = window.CampaignData;

  function AboutUsSection() {
    return html`
      <section
        id="sobre-nos"
        className="relative py-20 sm:py-28 bg-[#080A0F] border-t border-white/10 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <!-- Left Manifesto Copy -->
            <div className="lg:col-span-6">
              <span className="font-display font-bold text-xs tracking-[0.26em] uppercase text-zinc-400">
                REALIZAÇÃO & OPERAÇÃO INDEPENDENTE
              </span>
              <h2 className="mt-2 font-display font-bold uppercase text-3xl sm:text-5xl text-white tracking-tight">
                SOBRE NÓS
              </h2>

              <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed">
                <span>O </span>
                <strong className="text-white">Jogando Sujo</strong>
                <span> é uma iniciativa independente de intervenção urbana, estratégia e impacto ambiental nascida em Porto Alegre, idealizada e conduzida por </span>
                <strong className="text-white">
                  Gabriela de Moraes, Helena Catelli, José Pedro Schury e Paulo Kreitchmann
                </strong>.
              </p>

              <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                Cansados de ver o Guaíba acumular resíduos mesmo em áreas revitalizadas, unimos design urbano, tecnologia de pesagem inteligente e a maior rivalidade do Sul para criar um movimento anual fixo no calendário da cidade — provando que, às vezes, o jeito mais eficiente de limpar Porto Alegre é jogando sujo.
              </p>
            </div>

            <!-- Right Minimalist Founders Grid -->
            <div className="lg:col-span-6">
              <div className="text-[11px] font-bold tracking-[0.24em] uppercase text-zinc-500 mb-4">
                IDEALIZAÇÃO E CONDUÇÃO
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${founders.map((person, idx) => {
                  const hoverClass = idx % 2 === 0 ? 'card-hover-blue' : 'card-hover-red';
                  const dotClass = idx % 2 === 0 ? 'bg-[#00A8FF]' : 'bg-[#FF1E2D]';
                  return html`
                    <div
                      key=${person.name}
                      className=${`card-metallic ${hoverClass} rounded-2xl p-5 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[11px] text-zinc-500">0${idx + 1}</span>
                        <span className=${`w-2 h-2 rounded-full ${dotClass}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold uppercase text-lg text-white tracking-wide">
                          ${person.name}
                        </h3>
                        <p className="mt-1 text-xs text-zinc-400">
                          ${person.role}
                        </p>
                      </div>
                    </div>
                  `;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.AboutUsSection = AboutUsSection;
})();
