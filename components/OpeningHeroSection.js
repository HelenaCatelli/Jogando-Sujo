// First Fold (100vh) — Giant Centered Stadium Scoreboard Countdown + Subtle Gre-Nal Split Glow + Particles + Marquee

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
    let eyebrow;

    if (isOctober) {
      targetUtcMs = Date.UTC(br.year, 9, 31, 23, 59, 59);
      eyebrow = 'TEMPORADA ATIVA • OUTUBRO EM PORTO ALEGRE';
    } else {
      const nextYear = br.month > 10 ? br.year + 1 : br.year;
      targetUtcMs = Date.UTC(nextYear, 9, 1, 0, 0, 0);
      eyebrow = 'PRÓXIMA EDIÇÃO • OUTUBRO EM PORTO ALEGRE';
    }

    const diffSec = Math.max(0, Math.floor((targetUtcMs - nowUtcMs) / 1000));
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    return {
      isOctober,
      eyebrow,
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  }

  // Smooth vertical roll/flip digit block inside overflow-hidden wrapper (zero layout jitter)
  function ScoreboardBlock({ value, label }) {
    const prevRef = useRef(value);
    const [transition, setTransition] = useState({ current: value, previous: null, tick: 0 });

    useEffect(() => {
      if (value !== prevRef.current) {
        const oldVal = prevRef.current;
        prevRef.current = value;
        setTransition((prev) => ({
          current: value,
          previous: oldVal,
          tick: prev.tick + 1,
        }));
      }
    }, [value]);

    return html`
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden px-1 sm:px-2">
          <!-- Invisible static spacer preserving exact width/height -->
          <span
            className="block invisible font-display font-extrabold tabular-nums tracking-tight leading-[0.92] select-none"
            style=${{ fontSize: 'clamp(3.25rem, 11vw, 9.5rem)' }}
            aria-hidden="true"
          >
            ${transition.current}
          </span>

          <!-- Outgoing previous digit sliding up -->
          ${transition.previous !== null &&
          html`
            <span
              key=${`out-${transition.tick}`}
              className="animate-digit-out absolute inset-0 flex items-center justify-center font-display font-extrabold tabular-nums tracking-tight leading-[0.92] text-[#F5F7FA] pointer-events-none"
              style=${{ fontSize: 'clamp(3.25rem, 11vw, 9.5rem)' }}
              aria-hidden="true"
            >
              ${transition.previous}
            </span>
          `}

          <!-- Incoming current digit sliding in from below -->
          <span
            key=${`in-${transition.tick}`}
            className=${`${
              transition.tick > 0 ? 'animate-digit-in' : ''
            } absolute inset-0 flex items-center justify-center font-display font-extrabold tabular-nums tracking-tight leading-[0.92] text-[#F5F7FA]`}
            style=${{ fontSize: 'clamp(3.25rem, 11vw, 9.5rem)' }}
          >
            ${transition.current}
          </span>

          <!-- Subtle 1px stadium split-flap horizontal seam across middle of numbers -->
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#07080A]/75 border-b border-white/[0.1]"
            aria-hidden="true"
          />
        </div>

        <span className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#8B95A5]">
          ${label}
        </span>
      </div>
    `;
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
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#07080A] pt-24"
      >
        <!-- Subtle Atmospheric Gre-Nal Split Glow Behind Scoreboard (~12% opacity) -->
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-[0.12] blur-[140px]"
          style=${{
            background: 'radial-gradient(circle at 38% 48%, #0099FF 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-[0.12] blur-[140px]"
          style=${{
            background: 'radial-gradient(circle at 62% 48%, #E6192E 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />

        <!-- Interactive Particle Canvas -->
        <canvas
          ref=${canvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        <!-- Centered Monumental Stadium Scoreboard -->
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 text-center animate-scoreboard-on">
          <!-- Eyebrow -->
          <div className="inline-flex items-center gap-2.5 mb-8 sm:mb-10">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style=${{ backgroundColor: accentColor }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style=${{ backgroundColor: accentColor }}
              />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#8B95A5]">
              ${countdown.eyebrow}
            </span>
          </div>

          <!-- Giant Monumental Scoreboard Countdown (2x2 on narrow mobile, horizontal row on sm+) -->
          <div
            role="timer"
            aria-live="off"
            aria-label="Contagem regressiva para o evento Jogando Sujo em outubro"
            className="relative w-full flex flex-col items-center"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:flex sm:items-start sm:justify-center sm:gap-x-3 md:gap-x-5 lg:gap-x-7">
              <${ScoreboardBlock} value=${countdown.days} label="DIAS" />

              <span
                className="hidden sm:block animate-colon-pulse font-display font-bold text-[#8B95A5]/65 leading-[0.86] select-none"
                style=${{ fontSize: 'clamp(2.75rem, 9vw, 8rem)' }}
                aria-hidden="true"
              >
                :
              </span>

              <${ScoreboardBlock} value=${countdown.hours} label="HORAS" />

              <span
                className="hidden sm:block animate-colon-pulse font-display font-bold text-[#8B95A5]/65 leading-[0.86] select-none"
                style=${{ fontSize: 'clamp(2.75rem, 9vw, 8rem)' }}
                aria-hidden="true"
              >
                :
              </span>

              <${ScoreboardBlock} value=${countdown.minutes} label="MIN" />

              <span
                className="hidden sm:block animate-colon-pulse font-display font-bold text-[#8B95A5]/65 leading-[0.86] select-none"
                style=${{ fontSize: 'clamp(2.75rem, 9vw, 8rem)' }}
                aria-hidden="true"
              >
                :
              </span>

              <${ScoreboardBlock} value=${countdown.seconds} label="SEG" />
            </div>
          </div>

          <!-- Single-Line Subtitle + Clean Underlined CTA -->
          <p className="mt-10 sm:mt-12 text-sm sm:text-lg text-[#8B95A5] max-w-2xl leading-relaxed">
            A contagem regressiva para definir o time mais sujo do ano.
          </p>

          <a
            href="#lixeiras-3d"
            className="mt-7 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase pb-1 border-b transition-opacity hover:opacity-80"
            style=${{ color: '#E6192E', borderColor: '#E6192E' }}
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
