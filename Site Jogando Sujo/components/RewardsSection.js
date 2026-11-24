// Section 7C — Rewards & Receipt Redemption (Open 2-Column Editorial Layout, Zero Boxes)

(function () {
  const html = window.htm.bind(React.createElement);
  const { rewards } = window.CampaignData;
  const ReceiptValidator = window.ReceiptValidator;

  function RewardsSection({ onApplyToScoreboard }) {
    return html`
      <section id="premios" className="relative py-24 sm:py-32 bg-[#0D1015] border-t border-white/[0.1]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="mb-12">
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]">
              PREMIAÇÃO & RESGATE
            </span>
            <h2 className="mt-3 font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl text-[#F5F7FA]">
              DEPOSITE SEU LIXO E GANHE PRÊMIOS.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <!-- LEFT: Clean Editorial Table of Reward Tiers -->
            <div className="lg:col-span-7 border-b border-white/[0.12]">
              ${rewards.map((item) => {
                const weightColor =
                  item.accent === 'blue'
                    ? '#0099FF'
                    : item.accent === 'red'
                    ? '#E6192E'
                    : '#F5F7FA';

                return html`
                  <div
                    key=${item.id}
                    className="border-t border-white/[0.12] py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
                  >
                    <div
                      className="sm:col-span-4 font-display font-bold text-lg sm:text-xl tracking-tight"
                      style=${{ color: weightColor }}
                    >
                      ${item.weight}
                    </div>
                    <div className="sm:col-span-8">
                      <h3 className="font-display font-semibold text-base sm:text-lg text-[#F5F7FA]">
                        ${item.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#8B95A5] leading-relaxed">
                        ${item.description}
                      </p>
                    </div>
                  </div>
                `;
              })}
            </div>

            <!-- RIGHT: Open Minimalist Receipt Validator -->
            <div className="lg:col-span-5 pt-2 lg:pl-4">
              <div className="mb-6">
                <h3 className="font-display font-bold uppercase text-xl sm:text-2xl text-[#F5F7FA]">
                  RESGATE SEU RECIBO
                </h3>
                <p className="mt-2 text-sm text-[#8B95A5] leading-relaxed">
                  Insira o código emitido pela lixeira após a pesagem para conferir quantos quilos caíram no rival e quais prêmios você desbloqueou.
                </p>
              </div>

              <${ReceiptValidator} onApplyToScoreboard=${onApplyToScoreboard} />
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.RewardsSection = RewardsSection;
})();
