// Section 8A — Asymmetric 2-Column Editorial: "SOBRE O PROJETO" (ODS 6) & "SOBRE NÓS"

(function () {
  const html = window.htm.bind(React.createElement);
  const { DotMatrixIcon } = window.AppIcons;
  const { founders } = window.CampaignData;

  function ImpactSection({ totalKg }) {
    const tons = (totalKg / 1000).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    const metrics = [
      { value: `${tons} t`, label: 'Toneladas impedidas de chegar ao Guaíba' },
      { value: '24', label: 'Pontos inteligentes em Porto Alegre' },
      { value: '98%', label: 'Destinados a cooperativas e reciclagem' },
    ];

    return html`
      <section
        id="sobre-o-projeto"
        className="relative py-24 sm:py-32 bg-[#07080A] border-t border-white/[0.1]"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
            <!-- LEFT COLUMN: Manifesto Sobre o Projeto + ODS 6 -->
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2.5 mb-4">
                <${DotMatrixIcon} className="w-4 h-4 text-[#F5F7FA]" accent="#0099FF" />
                <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]">
                  SOBRE O PROJETO • ODS 6 (ÁGUA POTÁVEL E SANEAMENTO)
                </span>
              </div>

              <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl text-[#F5F7FA] leading-[0.98]">
                NÃO PRECISAMOS DE MAIS UM PROJETO DE CONSCIENTIZAÇÃO.
              </h2>

              <div className="mt-8 space-y-5 text-base sm:text-lg text-[#8B95A5] leading-relaxed">
                <p>
                  Todo mundo em Porto Alegre já sabe que o lixo largado nas ruas termina nos bueiros e deságua no Lago Guaíba — da Orla até a Praia de Ipanema e o Extremo Sul. O problema nunca foi falta de discurso bonito. Romantizar o lixo e pedir educação por culpa não muda o hábito de ninguém.
                </p>
                <p>
                  O Jogando Sujo parte de uma verdade crua: <span className="text-[#F5F7FA] font-medium">lixo é sujo, ninguém quer por perto e ninguém aguenta ver espalhado pela cidade.</span> Por isso, em vez de premiar o clube “mais limpo”, viramos o jogo do avesso. Todo mês de outubro, colocamos réplicas inteligentes da Arena e do Beira-Rio nas ruas para que cada torcida tire o lixo do chão e despeje no estádio rival.
                </p>
                <p className="text-[#F5F7FA]">
                  No final do mês, o clube com a lixeira mais cheia leva o título de Time Mais Sujo do Ano. A rivalidade faz o trabalho pesado; os sensores garantem a transparência; e o único vencedor real — com toneladas de resíduos impedidas de chegar às águas — é o Lago Guaíba.
                </p>
              </div>

              <!-- 3 ODS 6 Metrics in Open Hairline Strip -->
              <div className="mt-12 pt-8 border-t border-white/[0.12] grid grid-cols-1 sm:grid-cols-3 gap-8">
                ${metrics.map(
                  (m) => html`
                    <div key=${m.label}>
                      <div className="font-display font-bold text-3xl sm:text-4xl text-[#F5F7FA] tabular-nums">
                        ${m.value}
                      </div>
                      <p className="mt-1.5 text-xs text-[#8B95A5] leading-snug">
                        ${m.label}
                      </p>
                    </div>
                  `
                )}
              </div>
            </div>

            <!-- RIGHT COLUMN: Sobre Nós + 4 Founders Editorial List -->
            <div id="sobre-nos" className="lg:col-span-5 lg:border-l lg:border-white/[0.12] lg:pl-12">
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]">
                SOBRE NÓS • INICIATIVA INDEPENDENTE
              </span>
              <h3 className="mt-3 font-display font-bold uppercase tracking-tight text-2xl sm:text-4xl text-[#F5F7FA]">
                FEITO EM PORTO ALEGRE.
              </h3>

              <p className="mt-6 text-sm sm:text-base text-[#8B95A5] leading-relaxed">
                O <span className="text-[#F5F7FA] font-medium">Jogando Sujo</span> é uma iniciativa independente de intervenção urbana e impacto ambiental nascida em Porto Alegre, idealizada e conduzida por Gabriela de Moraes, Helena Catelli, José Pedro Schury e Paulo Kreitchmann. Cansados de ver o Guaíba acumular resíduos mesmo em áreas revitalizadas, unimos design urbano, pesagem inteligente e a maior rivalidade do Sul para criar um movimento anual fixo no calendário da cidade.
              </p>

              <div className="mt-10 border-b border-white/[0.12]">
                <div className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#8B95A5] pb-3">
                  IDEALIZAÇÃO E REALIZAÇÃO
                </div>
                ${founders.map(
                  (person, idx) => html`
                    <div
                      key=${person.name}
                      className="border-t border-white/[0.12] py-4 flex items-baseline justify-between gap-4"
                    >
                      <span className="font-display font-semibold text-base sm:text-lg text-[#F5F7FA]">
                        ${person.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#8B95A5]">
                        0${idx + 1}
                      </span>
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.ImpactSection = ImpactSection;
})();
