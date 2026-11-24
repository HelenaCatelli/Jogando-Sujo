// Section 7A — Annual Calendar ("OUTUBRO É MÊS DE JOGAR SUJO") in Clean Editorial Hairline Rows

(function () {
  const html = window.htm.bind(React.createElement);
  const { DotMatrixIcon } = window.AppIcons;
  const { calendarMilestones } = window.CampaignData;

  function CalendarSection({ supporter }) {
    const accentColor = supporter === 'colorado' ? '#E6192E' : '#0099FF';

    return html`
      <section id="calendario" className="relative py-24 sm:py-32 bg-[#0D1015] border-t border-white/[0.1]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <!-- Editorial Header -->
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <${DotMatrixIcon} className="w-4 h-4 text-[#F5F7FA]" accent=${accentColor} />
                <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]">
                  01 A 31 DE OUTUBRO • TODOS OS ANOS EM PORTO ALEGRE
                </span>
              </div>
              <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl text-[#F5F7FA]">
                OUTUBRO É MÊS DE JOGAR SUJO.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#8B95A5] max-w-md">
              Um mês fixo no calendário da cidade. Trinta e um dias de pesagem contínua para limpar as ruas e humilhar o estádio adversário.
            </p>
          </div>

          <!-- Editorial Horizontal Rows (No Box Cards) -->
          <div className="border-b border-white/[0.12]">
            ${calendarMilestones.map((item, idx) => {
              const rowAccent =
                item.accent === 'blue'
                  ? '#0099FF'
                  : item.accent === 'red'
                  ? '#E6192E'
                  : '#F5F7FA';

              return html`
                <div
                  key=${item.title}
                  className="border-t border-white/[0.12] py-7 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline hover:bg-white/[0.015] transition-colors"
                >
                  <div className="md:col-span-3 flex items-baseline gap-4">
                    <span className="text-xs font-mono text-[#8B95A5]/70">0${idx + 1}</span>
                    <span
                      className="font-display font-bold text-sm sm:text-base tracking-[0.12em] uppercase"
                      style=${{ color: rowAccent }}
                    >
                      ${item.date}
                    </span>
                  </div>

                  <div className="md:col-span-4">
                    <h3 className="font-display font-bold uppercase text-xl sm:text-2xl text-[#F5F7FA] tracking-tight">
                      ${item.title}
                    </h3>
                  </div>

                  <div className="md:col-span-5">
                    <p className="text-sm sm:text-base text-[#8B95A5] leading-relaxed">
                      ${item.description}
                    </p>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>
      </section>
    `;
  }

  window.CalendarSection = CalendarSection;
})();
