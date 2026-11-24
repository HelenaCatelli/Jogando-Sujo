// Minimalist Receipt Validator (bottom-border input + clean dynamic validation feedback)

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState } = React;
  const { sampleReceipts, rewards } = window.CampaignData;

  function ReceiptValidator({ onApplyToScoreboard, compact = false }) {
    const [codeInput, setCodeInput] = useState('');
    const [validatedReceipt, setValidatedReceipt] = useState(null);
    const [appliedCodes, setAppliedCodes] = useState({});
    const [errorMsg, setErrorMsg] = useState('');

    function validateCode(rawCode) {
      const normalized = (rawCode || codeInput).trim().toUpperCase();
      if (!normalized) {
        setErrorMsg('Digite o código impresso no recibo (ex: GUAIBA2026).');
        setValidatedReceipt(null);
        return;
      }

      const preset = sampleReceipts[normalized];
      if (preset) {
        setErrorMsg('');
        setValidatedReceipt(preset);
        return;
      }

      if (normalized.length >= 5) {
        const isInterTarget = normalized.includes('INTER') || normalized.includes('BEIRA');
        setErrorMsg('');
        setValidatedReceipt({
          code: normalized,
          kg: 5.2,
          targetTeam: isInterTarget ? 'inter' : 'gremio',
          targetLabel: isInterTarget ? 'Estádio Beira-Rio' : 'Arena do Grêmio',
          location: 'Orla do Guaíba — Trecho 1 (Usina do Gasômetro)',
          materials: '3,1 kg Plástico PET • 1,4 kg Latas Alumínio • 0,7 kg Papel',
          timestamp: 'Validado agora',
        });
      } else {
        setErrorMsg('Código muito curto. Experimente clicar em GUAIBA2026.');
        setValidatedReceipt(null);
      }
    }

    function handleSubmit(e) {
      e.preventDefault();
      validateCode();
    }

    function handleExampleClick(code) {
      setCodeInput(code);
      validateCode(code);
    }

    const unlockedRewards = validatedReceipt
      ? rewards.filter((r) => r.minKg !== null && validatedReceipt.kg >= r.minKg)
      : [];

    const alreadyApplied = validatedReceipt && appliedCodes[validatedReceipt.code];

    return html`
      <div>
        <form onSubmit=${handleSubmit} className="space-y-4">
          <label
            htmlFor=${compact ? 'receipt-code-modal' : 'receipt-code-inline'}
            className="block text-[11px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]"
          >
            Digite o código do recibo
          </label>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input
              id=${compact ? 'receipt-code-modal' : 'receipt-code-inline'}
              type="text"
              value=${codeInput}
              onInput=${(e) => setCodeInput(e.target.value.toUpperCase())}
              placeholder="GUAIBA2026"
              autoComplete="off"
              className="flex-1 bg-transparent border-0 border-b border-white/25 focus:border-white py-3 text-lg sm:text-xl font-mono tracking-[0.2em] uppercase text-[#F5F7FA] placeholder:text-[#8B95A5]/45 focus:outline-none transition-colors"
            />

            <button
              type="submit"
              className="text-xs font-semibold tracking-[0.16em] uppercase text-[#F5F7FA] border-b border-white/50 hover:border-white pb-2 transition-colors cursor-pointer shrink-0 self-start sm:self-end"
            >
              VALIDAR RECIBO ↗
            </button>
          </div>
        </form>

        <!-- Clickable Sample Receipt Links -->
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8B95A5]">
          <span>Exemplos rápidos:</span>
          ${Object.keys(sampleReceipts).map(
            (sampleKey) => html`
              <button
                key=${sampleKey}
                type="button"
                onClick=${() => handleExampleClick(sampleKey)}
                className="font-mono font-semibold text-[#F5F7FA] border-b border-white/25 hover:border-white pb-0.5 transition-colors cursor-pointer"
              >
                ${sampleKey}
              </button>
            `
          )}
        </div>

        ${errorMsg &&
        html`
          <p className="mt-4 text-xs font-medium text-[#E6192E]" role="alert">
            ${errorMsg}
          </p>
        `}

        <!-- Clean Dynamic Validation Output (No heavy glowing box) -->
        ${validatedReceipt &&
        html`
          <div className="mt-8 pt-6 border-t border-white/[0.16] space-y-5 animate-score-pop">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-emerald-400">
                  RECIBO #${validatedReceipt.code} VALIDADO
                </span>
                <p className="mt-1 text-xs text-[#8B95A5]">${validatedReceipt.location}</p>
              </div>
              <span className="text-[11px] font-mono text-[#8B95A5]">${validatedReceipt.timestamp}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-y border-white/[0.1]">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8B95A5]">Peso Computado</span>
                <div className="mt-1 font-display font-bold text-3xl text-[#F5F7FA] tabular-nums">
                  +${validatedReceipt.kg.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg
                </div>
                <p className="mt-1 text-xs text-[#8B95A5]">${validatedReceipt.materials}</p>
              </div>

              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8B95A5]">Despejado no Rival</span>
                <div
                  className="mt-1 font-display font-bold text-2xl uppercase"
                  style=${{ color: validatedReceipt.targetTeam === 'gremio' ? '#0099FF' : '#E6192E' }}
                >
                  ${validatedReceipt.targetLabel}
                </div>
                <p className="mt-1 text-xs text-[#8B95A5]">Contabilizado no Placar da Vergonha</p>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8B95A5] mb-2.5">
                Prêmios desbloqueados (${unlockedRewards.length})
              </div>
              <ul className="space-y-1.5 text-sm text-[#F5F7FA]">
                ${unlockedRewards.map(
                  (rw) => html`
                    <li key=${rw.id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>${rw.weight} — ${rw.title}</span>
                    </li>
                  `
                )}
              </ul>
            </div>

            ${onApplyToScoreboard &&
            html`
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#8B95A5]">Somar este peso ao placar ao vivo?</span>
                <button
                  type="button"
                  disabled=${alreadyApplied}
                  onClick=${() => {
                    setAppliedCodes((prev) => ({ ...prev, [validatedReceipt.code]: true }));
                    onApplyToScoreboard(validatedReceipt.targetTeam, validatedReceipt.kg);
                  }}
                  className=${`text-xs font-semibold tracking-[0.14em] uppercase pb-0.5 border-b transition-opacity ${
                    alreadyApplied
                      ? 'text-emerald-400 border-emerald-400/40 cursor-default'
                      : 'text-[#F5F7FA] border-white/50 hover:border-white cursor-pointer'
                  }`}
                >
                  ${alreadyApplied ? 'Somado ao placar ✓' : `Somar +${validatedReceipt.kg}kg no placar ↗`}
                </button>
              </div>
            `}
          </div>
        `}
      </div>
    `;
  }

  window.ReceiptValidator = ReceiptValidator;
})();
