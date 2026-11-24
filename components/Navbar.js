// Ultra-minimalist floating Navbar (left links, centered dot-matrix brand, right editorial arrow CTA)

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState, useEffect } = React;
  const { Icon, DotMatrixIcon } = window.AppIcons;

  const NAV_LINKS = [
    { href: '#calendario', label: 'Calendário' },
    { href: '#lixeiras-3d', label: 'Lixeiras 3D' },
    { href: '#placar', label: 'Placar' },
    { href: '#sobre-o-projeto', label: 'Sobre' },
  ];

  function Navbar({ supporter, onOpenReceipt }) {
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

    const accentHex = supporter === 'colorado' ? '#E6192E' : '#0099FF';

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

            <!-- Center: Dot-Matrix Mark + JOGANDO SUJO -->
            <div className="hidden lg:flex justify-center">
              <a
                href="#topo"
                className="inline-flex items-center gap-2.5 text-[#F5F7FA] hover:opacity-85 transition-opacity"
                aria-label="Jogando Sujo — Voltar ao topo"
              >
                <${DotMatrixIcon} className="w-4 h-4 text-[#F5F7FA]" accent=${accentHex} />
                <span className="font-display font-bold tracking-[0.18em] text-sm uppercase">
                  JOGANDO SUJO
                </span>
              </a>
            </div>

            <!-- Right: Clean Editorial Arrow Link -->
            <div className="flex items-center justify-end gap-4">
              <a
                href="#topo"
                className="lg:hidden inline-flex items-center gap-2 text-[#F5F7FA] mr-auto"
                aria-label="Jogando Sujo"
              >
                <${DotMatrixIcon} className="w-3.5 h-3.5" accent=${accentHex} />
                <span className="font-display font-bold tracking-[0.14em] text-xs uppercase">
                  JOGANDO SUJO
                </span>
              </a>

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
