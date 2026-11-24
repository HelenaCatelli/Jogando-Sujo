// First Fold (100vh) — Swiss Editorial Sports Hero ("Rivalidade. Sujeira. Guaíba.") + Particles + Compact Countdown + Marquee

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState, useEffect, useRef } = React;

  function getBrasiliaDateParts() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = {};
    formatter.formatToParts(now).forEach((p) => {
      if (p.type !== 'literal') parts[p.type] = Number(p.value);
    });
    if (parts.hour === 24) parts.hour = 0;
    return parts;
  }

  function computeOctoberCountdown() {
    const br = getBrasiliaDateParts();
    const nowUtcMs = Date.UTC(br.year, br.month - 1, br.day, br.hour, br.minute, br.second);
    const isOctober = br.month === 10;

    let targetUtcMs;
    let label;

    if (isOctober) {
      targetUtcMs = Date.UTC(br.year, 9, 31, 23, 59, 59);
      label = 'TEMPORADA ATIVA';
    } else {
      const nextYear = br.month > 10 ? br.year + 1 : br.year;
      targetUtcMs = Date.UTC(nextYear, 9, 1, 0, 0, 0);
      label = 'PRÓXIMA EDIÇÃO • OUTUBRO';
    }

    const diffSec = Math.max(0, Math.floor((targetUtcMs - nowUtcMs) / 1000));
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    return {
      isOctober,
      label,
      formatted: `${String(days).padStart(2, '0')} : ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`,
    };
  }

  function OpeningHeroSection({ supporter }) {
    const [countdown, setCountdown] = useState(computeOctoberCountdown);
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);

    const isColorado = supporter === 'colorado';
    const accentColor = isColorado ? '#E6192E' : '#0099FF';

    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown(computeOctoberCountdown());
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    // Discreet atmospheric suspended dust particles with fluid cursor parallax
    useEffect(() => {
      const canvas = canvasRef.current;
      const section = sectionRef.current;
      if (!canvas || !section) return undefined;

      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;

      const reducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let width = section.clientWidth || window.innerWidth;
      let height = section.clientHeight || window.innerHeight;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);

      const mouse = { x: -9999, y: -9999, normX: 0, normY: 0, active: false };
      let particles = [];
      let rafId = null;

      function createParticles() {
        const count = Math.max(40, Math.min(95, Math.floor((width * height) / 16000)));
        particles = [];
        for (let i = 0; i < count; i++) {
          const roll = Math.random();
          let color = '139, 149, 165';
          let alpha = 0.14 + Math.random() * 0.2;
          if (roll < 0.06) {
            color = '0, 153, 255';
            alpha = 0.22 + Math.random() * 0.18;
          } else if (roll < 0.12) {
            color = '230, 25, 46';
            alpha = 0.22 + Math.random() * 0.18;
          } else if (roll < 0.42) {
            color = '245, 247, 250';
            alpha = 0.08 + Math.random() * 0.16;
          }

          const depth = 0.4 + Math.random() * 0.85;
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.22 * depth,
            vy: (-0.06 - Math.random() * 0.2) * depth,
            radius: (0.8 + Math.random() * 1.6) * (0.7 + depth * 0.3),
            depth,
            color,
            alpha,
          });
        }
      }

      function resizeCanvas() {
        width = section.clientWidth || window.innerWidth;
        height = section.clientHeight || window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        createParticles();
      }

      function handlePointerMove(e) {
        const rect = section.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.normX = (mouse.x / Math.max(width, 1) - 0.5) * 2;
        mouse.normY = (mouse.y / Math.max(height, 1) - 0.5) * 2;
        mouse.active = true;
      }

      function handlePointerLeave() {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }

      resizeCanvas();
      section.addEventListener('pointermove', handlePointerMove, { passive: true });
      section.addEventListener('pointerleave', handlePointerLeave);
      window.addEventListener('resize', resizeCanvas);

      function renderFrame() {
        ctx.clearRect(0, 0, width, height);
        const repulsionRadius = 130;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!reducedMotion) {
            p.x += p.vx;
            p.y += p.vy;

            if (mouse.active) {
              const dx = p.x - mouse.x;
              const dy = p.y - mouse.y;
              const distSq = dx * dx + dy * dy;
              if (distSq > 0 && distSq < repulsionRadius * repulsionRadius) {
                const dist = Math.sqrt(distSq);
                const force = ((repulsionRadius - dist) / repulsionRadius) * 0.55 * p.depth;
                p.x += (dx / dist) * force * 2.2;
                p.y += (dy / dist) * force * 2.2;
              }
            }

            if (p.y < -12) p.y = height + 12;
            if (p.y > height + 12) p.y = -12;
            if (p.x < -12) p.x = width + 12;
            if (p.x > width + 12) p.x = -12;
          }

          const px = mouse.active ? -mouse.normX * 10 * p.depth : 0;
          const py = mouse.active ? -mouse.normY * 8 * p.depth : 0;

          ctx.beginPath();
          ctx.arc(p.x + px, p.y + py, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
          ctx.fill();
        }

        if (!reducedMotion) rafId = requestAnimationFrame(renderFrame);
      }

      renderFrame();

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        section.removeEventListener('pointermove', handlePointerMove);
        section.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('resize', resizeCanvas);
      };
    }, []);

    const marqueeItem = 'JOGANDO SUJO  •  OUTUBRO EM PORTO ALEGRE  •  TIME MAIS SUJO DO ANO  •  ';

    return html`
      <section
        id="topo"
        ref=${sectionRef}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#07080A] pt-28"
      >
        <!-- Subtle Night Stadium Atmospheric Vignette -->
        <div
          className="pointer-events-none absolute inset-0"
          style=${{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,255,255,0.045) 0%, rgba(13,16,21,0.35) 55%, rgba(7,8,10,1) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[160px] opacity-[0.09]"
          style=${{ background: 'radial-gradient(circle, #E6192E 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-24 w-[420px] h-[420px] rounded-full blur-[160px] opacity-[0.09]"
          style=${{ background: 'radial-gradient(circle, #0099FF 0%, transparent 70%)' }}
        />

        <!-- Interactive Particle Canvas -->
        <canvas
          ref=${canvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        <!-- Centerpiece: 3 Giant Horizontal Words ("Motion. Discipline. Result." equivalent) -->
        <div className="relative z-10 flex-1 flex items-center w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start">
            <!-- Word 1 -->
            <div className="text-left">
              <h1 className="font-display font-bold tracking-tight leading-[0.95] text-5xl sm:text-6xl xl:text-[5.25rem] text-[#F5F7FA]">
                Rivalidade.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#8B95A5] leading-relaxed max-w-[260px]">
                Gre-Nal fora das quatro linhas. Onde cada quilo pesa na tabela da zoeira.
              </p>
            </div>

            <!-- Word 2 -->
            <div className="text-left md:text-center">
              <div
                className="font-display font-bold tracking-tight leading-[0.95] text-5xl sm:text-6xl xl:text-[5.25rem] transition-colors duration-300"
                style=${{ color: accentColor }}
              >
                Sujeira.
              </div>
              <p className="mt-4 text-sm sm:text-base text-[#8B95A5] leading-relaxed max-w-[260px] md:mx-auto">
                Lixo não é bonito. Mas fica ótimo no estádio do teu rival.
              </p>
            </div>

            <!-- Word 3 -->
            <div className="text-left md:text-right">
              <div className="font-display font-bold tracking-tight leading-[0.95] text-5xl sm:text-6xl xl:text-[5.25rem] text-[#F5F7FA]">
                Guaíba.
              </div>
              <p className="mt-4 text-sm sm:text-base text-[#8B95A5] leading-relaxed max-w-[260px] md:ml-auto">
                Todo outubro em Porto Alegre. Tire das ruas antes que chegue às águas.
              </p>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Compact Translucent Countdown (Left) + Editorial Arrow CTA (Right) -->
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <!-- Compact Translucent Countdown Widget -->
          <div
            role="timer"
            aria-live="off"
            className="inline-flex flex-col gap-1.5 px-4 py-3 rounded-lg backdrop-blur-md bg-white/[0.04] border border-white/[0.1] self-start"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style=${{ backgroundColor: accentColor }}
              />
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B95A5]">
                ${countdown.label}
              </span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl tracking-[0.12em] text-[#F5F7FA] tabular-nums">
              ${countdown.formatted}
            </div>
            <div className="flex items-center justify-between text-[9px] font-medium tracking-[0.2em] uppercase text-[#8B95A5]/80">
              <span>DD</span>
              <span>HH</span>
              <span>MM</span>
              <span>SS</span>
            </div>
          </div>

          <!-- Editorial Underlined CTA -->
          <a
            href="#lixeiras-3d"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase pb-1 border-b transition-opacity hover:opacity-80 self-start sm:self-end"
            style=${{ color: accentColor, borderColor: accentColor }}
          >
            <span>ESCOLHER MEU RIVAL ↗</span>
          </a>
        </div>

        <!-- Hero Bottom Infinite Translucent Marquee -->
        <div className="relative z-10 border-t border-white/[0.1] bg-white/[0.025] backdrop-blur-sm py-3 overflow-hidden">
          <div className="animate-marquee">
            <span className="text-[11px] sm:text-xs font-medium tracking-[0.24em] uppercase text-[#8B95A5] whitespace-nowrap pr-6">
              ${marqueeItem.repeat(6)}
            </span>
            <span className="text-[11px] sm:text-xs font-medium tracking-[0.24em] uppercase text-[#8B95A5] whitespace-nowrap pr-6" aria-hidden="true">
              ${marqueeItem.repeat(6)}
            </span>
          </div>
        </div>
      </section>
    `;
  }

  window.OpeningHeroSection = OpeningHeroSection;
})();
