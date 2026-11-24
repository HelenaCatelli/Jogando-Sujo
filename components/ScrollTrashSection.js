// Sticky Scroll Section ("NÃO PRECISAMOS DE MAIS UM PROJETO DE CONSCIENTIZAÇÃO.")
// Slow-motion autoPlay loop video (./lixo-scroll.mp4) with scroll-driven rise, scale & opacity

(function () {
  const html = window.htm.bind(React.createElement);
  const { useEffect, useRef } = React;
  const { DotMatrixIcon } = window.AppIcons;

  function ScrollTrashSection({ supporter }) {
    const outerRef = useRef(null);
    const videoRef = useRef(null);
    const motionWrapRef = useRef(null);

    const isColorado = supporter === 'colorado';
    const accentColor = isColorado ? '#E6192E' : '#0099FF';

    // Ensure slow-motion playback skips any black initial frame at 0:00
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return undefined;

      function startPlayback() {
        video.playbackRate = 0.65;
        if (video.currentTime < 0.5 && Number.isFinite(video.duration) && video.duration > 1) {
          try {
            video.currentTime = 0.5;
          } catch (e) {
            // Ignore seek before metadata ready
          }
        }
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      }

      if (video.readyState >= 1) {
        startPlayback();
      }
      video.addEventListener('loadedmetadata', startPlayback);
      video.addEventListener('canplay', startPlayback);

      return () => {
        video.removeEventListener('loadedmetadata', startPlayback);
        video.removeEventListener('canplay', startPlayback);
      };
    }, []);

    // Smooth scroll-linked motion: translateY(25% -> 0%), scale(1.05 -> 1.18), opacity(0.35 -> 1)
    useEffect(() => {
      const outer = outerRef.current;
      if (!outer) return undefined;

      const reducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let rawProgress = 0;
      let smoothProgress = reducedMotion ? 1 : 0;
      let rafId = null;

      function updateTargetScroll() {
        const rect = outer.getBoundingClientRect();
        const scrollable = Math.max(outer.offsetHeight - window.innerHeight, 1);
        const scrolledInside = -rect.top;
        rawProgress = Math.max(0, Math.min(1, scrolledInside / scrollable));
      }

      updateTargetScroll();
      window.addEventListener('scroll', updateTargetScroll, { passive: true });
      window.addEventListener('resize', updateTargetScroll);

      function tick() {
        rafId = requestAnimationFrame(tick);

        if (!reducedMotion) {
          smoothProgress += (rawProgress - smoothProgress) * 0.09;
        }

        const wrap = motionWrapRef.current;
        if (wrap) {
          const translateY = 25 - smoothProgress * 25;
          const scale = 1.05 + smoothProgress * 0.13;
          const opacity = 0.35 + smoothProgress * 0.65;
          wrap.style.transform = `translate3d(0, ${translateY.toFixed(2)}%, 0) scale(${scale.toFixed(3)})`;
          wrap.style.opacity = opacity.toFixed(3);
        }
      }

      tick();

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('scroll', updateTargetScroll);
        window.removeEventListener('resize', updateTargetScroll);
      };
    }, []);

    return html`
      <section
        ref=${outerRef}
        className="relative h-[240vh] bg-[#07080A] border-t border-white/[0.08]"
        aria-label="O problema do lixo em Porto Alegre"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          <!-- Z-0 Video Layer (No solid black overlay blocking the frames) -->
          <div
            ref=${motionWrapRef}
            className="absolute inset-0 z-0 w-full h-full pointer-events-none will-change-transform"
            style=${{ transform: 'translate3d(0, 25%, 0) scale(1.05)', opacity: 0.35 }}
          >
            <video
              ref=${videoRef}
              src="./lixo-scroll.mp4"
              muted
              playsInline
              autoPlay
              loop
              preload="auto"
              onError=${(e) => {
                const attemptedUrl = e.currentTarget.currentSrc || e.currentTarget.src;
                console.error('Erro ao carregar o vídeo ./lixo-scroll.mp4:', attemptedUrl, e);
              }}
              className="w-full h-full object-cover z-0 opacity-100"
              style=${{ filter: 'blur(2.5px) brightness(0.9) contrast(1.08)' }}
            />
          </div>

          <!-- Z-10 Soft Edge-Only Gradient (Top & Bottom blend into #07080A, clear center) -->
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style=${{
              background:
                'linear-gradient(to bottom, #07080A 0%, rgba(7,8,10,0) 22%, rgba(7,8,10,0) 78%, #07080A 100%)',
            }}
            aria-hidden="true"
          />

          <!-- Z-20 Transparent Editorial Typography -->
          <div className="relative z-20 max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center bg-transparent">
            <${DotMatrixIcon} className="w-5 h-5 text-[#F5F7FA] mb-6 opacity-95" accent=${accentColor} />

            <h2
              className="font-display font-bold uppercase tracking-tight leading-[0.98] text-3xl sm:text-5xl lg:text-6xl text-[#F5F7FA]"
              style=${{ textShadow: '0 4px 24px rgba(0, 0, 0, 0.85)' }}
            >
              NÃO PRECISAMOS DE MAIS UM PROJETO DE CONSCIENTIZAÇÃO.
            </h2>

            <p
              className="mt-6 text-base sm:text-xl text-[#F5F7FA]/95 max-w-2xl leading-relaxed"
              style=${{ textShadow: '0 2px 16px rgba(0, 0, 0, 0.9)' }}
            >
              Lixo é sujo, incômodo e feio. Ninguém aguenta ver espalhado por Porto Alegre — mas todo mundo adora ver lotando o estádio do rival.
            </p>

            <a
              href="#lixeiras-3d"
              className="mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase pb-1 border-b transition-opacity hover:opacity-80"
              style=${{
                color: accentColor,
                borderColor: accentColor,
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
              }}
            >
              <span>SUJAR O ESTÁDIO RIVAL ↗</span>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  window.ScrollTrashSection = ScrollTrashSection;
})();
