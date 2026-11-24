// Minimalist Editorial Modal Dialog for "RESGATAR RECIBO ↗" in Navbar

(function () {
  const html = window.htm.bind(React.createElement);
  const { useEffect } = React;
  const { Icon } = window.AppIcons;
  const ReceiptValidator = window.ReceiptValidator;

  function ReceiptModal({ isOpen, onClose, onApplyToScoreboard }) {
    useEffect(() => {
      if (!isOpen) return undefined;
      function handleKeyDown(e) {
        if (e.key === 'Escape') onClose();
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return html`
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#07080A]/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-receipt-title"
        onClick=${(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative w-full max-w-2xl bg-[#0D1015] border border-white/[0.15] rounded-xl p-6 sm:p-10 max-h-[92vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4 pb-6 mb-6 border-b border-white/[0.12]">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#8B95A5]">
                CENTRAL DE TROCA • JOGANDO SUJO
              </span>
              <h2 id="modal-receipt-title" className="mt-1.5 font-display font-bold uppercase text-2xl sm:text-3xl text-[#F5F7FA]">
                RESGATAR RECIBO DE PESAGEM
              </h2>
            </div>

            <button
              type="button"
              onClick=${onClose}
              aria-label="Fechar janela"
              className="p-2 text-[#8B95A5] hover:text-[#F5F7FA] cursor-pointer transition-colors"
            >
              <${Icon} name="X" className="w-5 h-5" />
            </button>
          </div>

          <${ReceiptValidator} onApplyToScoreboard=${onApplyToScoreboard} compact=${true} />
        </div>
      </div>
    `;
  }

  window.ReceiptModal = ReceiptModal;
})();
