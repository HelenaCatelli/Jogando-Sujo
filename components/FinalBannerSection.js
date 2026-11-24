// Section 8B — Closing Banner Signature (QR Code + White Vertical Divider) + Monochrome Partners + Real Event Footer

(function () {
  const html = window.htm.bind(React.createElement);
  const { StylizedQRCode } = window.AppIcons;
  const { partners } = window.CampaignData;

  function FinalBannerSection({ onOpenReceipt }) {
    return html`
      <footer className="relative bg-[#07080A] border-t border-white/[0.1]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-12">
          <!-- Clean Campaign Banner Signature (No heavy outer box) -->
          <div className="pb-16 border-b border-white/[0.12] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <!-- Left: Crisp Vector QR Code -->
            <button
              type="button"
              onClick=${onOpenReceipt}
              className="p-2.5 bg-white hover:scale-[1.03] transition-transform cursor-pointer shrink-0"
              title="Clique para validar um recibo agora"
            >
              <${StylizedQRCode} className="w-24 h-24 sm:w-28 sm:h-28" />
            </button>

            <!-- Thin Vertical White Divider Line -->
            <div className="hidden md:block w-px h-24 bg-white/80" aria-hidden="true" />
            <div className="md:hidden h-px w-24 bg-white/80" aria-hidden="true" />

            <!-- Right: Uppercase Banner Callout -->
            <div className="text-center md:text-left max-w-xl">
              <h2 className="font-display font-bold uppercase text-2xl sm:text-4xl text-[#F5F7FA] leading-[1.04] tracking-tight">
                DEPOSITE SEU LIXO E GANHE PRÊMIOS.
              </h2>
              <p className="mt-2.5 text-sm sm:text-lg tracking-[0.04em] text-[#8B95A5]">
                acesse o site
                <a
                  href="#topo"
                  className="ml-1.5 text-[#F5F7FA] underline decoration-white/35 underline-offset-4 hover:decoration-white transition-colors"
                >
                  www.jogandosujo.com
                </a>
              </p>
            </div>
          </div>

          <!-- Discreet Monochrome Supporters Strip -->
          <div className="py-10 border-b border-white/[0.1]">
            <p className="text-center text-[10px] font-semibold tracking-[0.26em] uppercase text-[#8B95A5]/75 mb-7">
              APOIADORES E PARCEIROS
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 opacity-50 hover:opacity-80 transition-opacity">
              ${partners.map(
                (partner) => html`
                  <span
                    key=${partner.name}
                    className="font-display font-semibold text-xs sm:text-sm tracking-[0.14em] uppercase text-[#F5F7FA]"
                  >
                    ${partner.name}
                  </span>
                `
              )}
            </div>
          </div>

          <!-- Official Real Event Footer -->
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <img
                src="./logo-jogando-sujo.PNG"
                alt="Logo Jogando Sujo"
                className="h-7 w-auto object-contain brightness-125 drop-shadow-[0_0_6px_rgba(255,255,255,0.18)]"
              />
              <span className="font-display font-bold text-xs tracking-[0.18em] uppercase text-[#F5F7FA]">
                JOGANDO SUJO • WWW.JOGANDOSUJO.COM
              </span>
            </div>

            <p className="text-xs text-[#8B95A5]">
              © Jogando Sujo • Porto Alegre, RS — Todo mês de Outubro
            </p>
          </div>
        </div>
      </footer>
    `;
  }

  window.FinalBannerSection = FinalBannerSection;
})();
