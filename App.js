// Root React Application — Swiss Editorial Sports Layout

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState, useRef } = React;

  const { initialScores } = window.CampaignData;
  const Navbar = window.Navbar;
  const OpeningHeroSection = window.OpeningHeroSection;
  const ScrollTrashSection = window.ScrollTrashSection;
  const HeroSection = window.HeroSection;
  const ScoreboardSection = window.ScoreboardSection;
  const CalendarSection = window.CalendarSection;
  const LocationsSection = window.LocationsSection;
  const RewardsSection = window.RewardsSection;
  const ImpactSection = window.ImpactSection;
  const FinalBannerSection = window.FinalBannerSection;
  const ReceiptModal = window.ReceiptModal;

  function App() {
    const [supporter, setSupporter] = useState('colorado');
    const [scores, setScores] = useState(initialScores);
    const [lastBump, setLastBump] = useState(null);
    const [toast, setToast] = useState(null);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const toastTimerRef = useRef(null);

    function handleAddKg(team, amount = 1) {
      const bumpId = Date.now() + Math.random();
      setScores((prev) => ({
        ...prev,
        [team]: Number((prev[team] + amount).toFixed(1)),
      }));
      setLastBump({ team, amount, id: bumpId });

      const teamLabel = team === 'gremio' ? 'Arena do Grêmio' : 'Estádio Beira-Rio';
      setToast({
        id: bumpId,
        team,
        message: `+${amount.toLocaleString('pt-BR')} kg despejado na lixeira do ${teamLabel}`,
      });

      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
      }, 2600);
    }

    const totalKg = scores.gremio + scores.inter;

    return html`
      <div className="min-h-screen bg-[#07080A] text-[#F5F7FA] selection:bg-[#0099FF] selection:text-[#07080A]">
        <${Navbar}
          supporter=${supporter}
          onToggleSupporter=${() =>
            setSupporter((prev) => (prev === 'colorado' ? 'tricolor' : 'colorado'))
          }
          onOpenReceipt=${() => setReceiptModalOpen(true)}
        />

        <main>
          <${OpeningHeroSection}
            supporter=${supporter}
            onChangeSupporter=${setSupporter}
          />

          <${ScrollTrashSection} supporter=${supporter} />

          <${HeroSection}
            supporter=${supporter}
            scores=${scores}
            onChangeSupporter=${setSupporter}
            onQuickThrow=${(team) => handleAddKg(team, 1)}
          />

          <${ScoreboardSection}
            supporter=${supporter}
            scores=${scores}
            lastBump=${lastBump}
            onAddKg=${handleAddKg}
          />

          <${CalendarSection} supporter=${supporter} />

          <${LocationsSection} supporter=${supporter} />

          <${RewardsSection} onApplyToScoreboard=${handleAddKg} />

          <${ImpactSection} totalKg=${totalKg} />
        </main>

        <${FinalBannerSection} onOpenReceipt=${() => setReceiptModalOpen(true)} />

        <${ReceiptModal}
          isOpen=${receiptModalOpen}
          onClose=${() => setReceiptModalOpen(false)}
          onApplyToScoreboard=${handleAddKg}
        />

        <!-- Minimalist Editorial Score Feedback Toast -->
        ${toast &&
        html`
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0D1015]/95 border border-white/[0.16] backdrop-blur-md"
          >
            <span
              className="w-2 h-2 rounded-full"
              style=${{ backgroundColor: toast.team === 'gremio' ? '#0099FF' : '#E6192E' }}
            />
            <span className="text-xs font-semibold tracking-[0.06em] uppercase text-[#F5F7FA]">
              ${toast.message}
            </span>
          </div>
        `}
      </div>
    `;
  }

  const rootElement = document.getElementById('root');
  if (ReactDOM.createRoot) {
    ReactDOM.createRoot(rootElement).render(html`<${App} />`);
  } else {
    ReactDOM.render(html`<${App} />`, rootElement);
  }
})();
