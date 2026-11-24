// "Como Funciona" — 4 numbered Dark Neon step cards (01 to 04)

(function () {
  const html = window.htm.bind(React.createElement);
  const { Icon } = window.AppIcons;
  const { howItWorks } = window.CampaignData;

  function HowItWorksSection() {
    return html`
      <section id="como-funciona" className="relative py-20 sm:py-28 bg-[#050507] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
            <div>
              <span className="text-xs font-bold tracking-[0.24em] text-[#00C2FF] uppercase">
                REGULAMENTO DA ZOEIRA
              </span>
              <h2 className="mt-2 font-display font-bold uppercase text-3xl sm:text-5xl text-white tracking-tight">
                COMO FUNCIONA O <span className="text-[#FF1E2D]">JOGO SUJO</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-zinc-400 max-w-md">
              Em 4 passos rápidos você limpa Porto Alegre, castiga o placar do rival e ainda sai premiado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            ${howItWorks.map((item, idx) => {
              const hoverClass =
                item.accent === 'blue'
                  ? 'card-hover-blue'
                  : item.accent === 'red'
                  ? 'card-hover-red'
                  : 'card-hover-dual';

              const numberColor =
                item.accent === 'blue'
                  ? 'text-[#00C2FF]'
                  : item.accent === 'red'
                  ? 'text-[#FF1E2D]'
                  : idx === 0
                  ? 'text-white'
                  : 'text-cyan-300';

              return html`
                <article
                  key=${item.step}
                  className=${`card-metallic ${hoverClass} rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className=${`font-display font-bold text-4xl tracking-tight ${numberColor}`}>
                        ${item.step}
                      </span>
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <${Icon} name=${item.icon} className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-display font-bold uppercase text-xl text-white tracking-wide mb-3">
                      ${item.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      ${item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      ${item.tag}
                    </span>
                    <${Icon}
                      name="ChevronRight"
                      className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </article>
              `;
            })}
          </div>
        </div>
      </section>
    `;
  }

  window.HowItWorksSection = HowItWorksSection;
})();
