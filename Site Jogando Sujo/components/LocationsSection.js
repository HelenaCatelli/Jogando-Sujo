// Section 7B — "Onde Descartar em Porto Alegre" in Minimalist Hairline List

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState } = React;
  const { locations } = window.CampaignData;

  const EDITORIAL_FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: '3d', label: 'Lixeiras 3D' },
    { id: 'stadiums', label: 'Estádios' },
    { id: 'orla', label: 'Orla & Zona Sul' },
  ];

  function LocationsSection({ supporter }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedId, setSelectedId] = useState(locations[0].id);

    const accentColor = supporter === 'colorado' ? '#E6192E' : '#0099FF';

    const filtered =
      activeFilter === 'all'
        ? locations
        : locations.filter((loc) => loc.categories.includes(activeFilter));

    return html`
      <section id="onde-jogar" className="relative py-24 sm:py-32 bg-[#07080A] border-t border-white/[0.1]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <!-- Header & Minimalist Text Filter Links -->
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]">
                PONTOS DE COLETA • PORTO ALEGRE
              </span>
              <h2 className="mt-3 font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl text-[#F5F7FA]">
                ONDE DESCARTAR E PONTUAR.
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Filtrar pontos de descarte"
              className="flex flex-wrap items-center gap-6"
            >
              ${EDITORIAL_FILTERS.map((tab) => {
                const isActive = activeFilter === tab.id;
                return html`
                  <button
                    key=${tab.id}
                    type="button"
                    role="tab"
                    aria-selected=${isActive}
                    onClick=${() => setActiveFilter(tab.id)}
                    className=${`relative pb-1.5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                      isActive ? 'text-[#F5F7FA]' : 'text-[#8B95A5] hover:text-[#F5F7FA]'
                    }`}
                  >
                    <span>${tab.label}</span>
                    ${isActive &&
                    html`
                      <span
                        className="absolute left-0 right-0 bottom-0 h-[1.5px]"
                        style=${{ backgroundColor: accentColor }}
                      />
                    `}
                  </button>
                `;
              })}
            </div>
          </div>

          <!-- Interactive Thin Hairline Rows -->
          <div className="border-b border-white/[0.12]">
            ${filtered.map((loc, idx) => {
              const isSelected = selectedId === loc.id;
              return html`
                <button
                  key=${loc.id}
                  type="button"
                  onClick=${() => setSelectedId(loc.id)}
                  className=${`w-full text-left border-t border-white/[0.12] py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center transition-colors cursor-pointer ${
                    isSelected ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="md:col-span-5 flex items-baseline gap-4">
                    <span className="text-xs font-mono text-[#8B95A5]/70">0${idx + 1}</span>
                    <div>
                      <h3 className="font-display font-semibold text-lg sm:text-xl text-[#F5F7FA] tracking-tight">
                        ${loc.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#8B95A5]">
                        ${loc.neighborhood} — ${loc.highlight}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-3 text-xs font-medium tracking-[0.06em] text-[#8B95A5]">
                    ${loc.typeLabel}
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2 text-xs text-[#F5F7FA]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>${loc.status}</span>
                  </div>

                  <div className="md:col-span-2 flex md:justify-end items-baseline gap-3 text-xs tabular-nums">
                    <span className="text-[#8B95A5]">${loc.distance}</span>
                    <span className="text-[#F5F7FA] font-semibold">
                      ${loc.todayKg.toLocaleString('pt-BR')} kg hoje
                    </span>
                  </div>
                </button>
              `;
            })}
          </div>
        </div>
      </section>
    `;
  }

  window.LocationsSection = LocationsSection;
})();
