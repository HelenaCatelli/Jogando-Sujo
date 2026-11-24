// Ultra-minimalist floating Navbar (left links, centered dot-matrix brand, right editorial arrow CTA)

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState, useEffect } = React;
  const { Icon } = window.AppIcons;

  const NAV_LINKS = [
    { href: '#calendario', label: 'Calendário' },
    { href: '#lixeiras-3d', label: 'Lixeiras 3D' },
    { href: '#placar', label: 'Placar' },
    { href: '#sobre-o-projeto', label: 'Sobre' },
  ];

  function Navbar({ supporter, onToggleSupporter, onOpenReceipt }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      function onScroll() {
        setScrolled(window.scrollY > 24);
      }
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isColorado = supporter === 'colorado';
    const accentHex = isColorado ? '#E6222C' : '#0095FF';

    return html`
      <header
        className=${`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#07080A]/75 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="py-5 grid grid-cols-2 lg:grid-cols-3 items-center gap-4">
            <!-- Left: Minimalist Nav Links (Desktop) + Mobile Trigger -->
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick=${() => setMobileOpen((prev) => !prev)}
                className="lg:hidden p-1.5 text-[#8B95A5] hover:text-[#F5F7FA] cursor-pointer"
                aria-expanded=${mobileOpen}
                aria-label=${mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                <${Icon} name=${mobileOpen ? 'X' : 'Menu'} className="w-5 h-5" />
              </button>

              <nav className="hidden lg:flex items-center gap-6" aria-label="Navegação principal">
                ${NAV_LINKS.map(
                  (item) => html`
                    <a
                      key=${item.href}
                      href=${item.href}
                      className="text-xs font-medium tracking-[0.08em] uppercase text-[#8B95A5] hover:text-[#F5F7FA] transition-colors"
                    >
                      ${item.label}
                    </a>
                  `
                )}
              </nav>
            </div>

            <!-- Center: Brand Logo + JOGANDO SUJO -->
            <div className="hidden lg:flex justify-center">
              <a
                href="#topo"
                className="inline-flex items-center gap-2.5 text-[#F5F7FA] hover:opacity-85 transition-opacity"
                aria-label="Jogando Sujo — Voltar ao topo"
              >
                <img
                  src="./logo-jogando-sujo.png"
                  alt="Logo Jogando Sujo"
                  className="h-7 w-auto object-contain brightness-125 drop-shadow-[0_0_6px_rgba(255,255,255,0.18)]"
                />
                <span className="font-display font-bold tracking-[0.18em] text-sm uppercase">
                  JOGANDO SUJO
                </span>
              </a>
            </div>

            <!-- Right: Quick Supporter Toggle Pill + Clean Editorial Arrow Link -->
            <div className="flex items-center justify-end gap-3 sm:gap-4">
              <a
                href="#topo"
                className="lg:hidden inline-flex items-center gap-2.5 text-[#F5F7FA] mr-auto"
                aria-label="Jogando Sujo"
              >
                <img
                  src="./logo-jogando-sujo.png"
                  alt="Logo Jogando Sujo"
                  className="h-7 w-auto object-contain brightness-125 drop-shadow-[0_0_6px_rgba(255,255,255,0.18)]"
                />
                <span className="font-display font-bold tracking-[0.14em] text-xs uppercase hidden sm:inline">
                  JOGANDO SUJO
                </span>
              </a>

              <button
                type="button"
                onClick=${onToggleSupporter}
                aria-label="Alternar torcida entre Grêmio e Internacional"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-[#F5F7FA] transition-all cursor-pointer whitespace-nowrap"
                style=${{
                  borderColor: isColorado ? 'rgba(230, 34, 44, 0.55)' : 'rgba(0, 149, 255, 0.55)',
                  boxShadow: isColorado
                    ? '0 0 16px -6px rgba(230, 34, 44, 0.45)'
                    : '0 0 16px -6px rgba(0, 149, 255, 0.45)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style=${{ backgroundColor: accentHex }}
                />
                <span>${isColorado ? 'SOU COLORADO' : 'SOU GREMISTA'}</span>
                <span className="text-[#8B95A5] text-xs leading-none" aria-hidden="true">⇄</span>
              </button>

              <button
                type="button"
                onClick=${onOpenReceipt}
                className="text-xs font-semibold tracking-[0.12em] uppercase text-[#F5F7FA] border-b border-white/40 hover:border-white pb-0.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                RESGATAR RECIBO ↗
              </button>
            </div>
          </div>
        </div>

        <!-- Minimalist Mobile Drawer -->
        ${mobileOpen &&
        html`
          <div className="lg:hidden bg-[#07080A]/95 backdrop-blur-xl border-t border-white/10 px-6 py-5 space-y-3">
            ${NAV_LINKS.map(
              (item) => html`
                <a
                  key=${item.href}
                  href=${item.href}
                  onClick=${() => setMobileOpen(false)}
                  className="block py-2 text-xs font-semibold tracking-[0.16em] uppercase text-[#8B95A5] hover:text-[#F5F7FA] border-b border-white/[0.06]"
                >
                  ${item.label}
                </a>
              `
            )}
          </div>
        `}
      </header>
    `;
  }

  window.Navbar = Navbar;
})();
