// Crisp Lucide-style vector icon set + Jogando Sujo brand emblem & QR Code SVG

(function () {
  const html = window.htm.bind(React.createElement);

  const ICON_PATHS = {
    Trash2: [
      'M3 6h18',
      'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
      'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
      'M10 11v6',
      'M14 11v6',
    ],
    MapPin: [
      'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z',
      'M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    ],
    Scale: [
      'm16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z',
      'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z',
      'M7 21h10',
      'M12 3v18',
      'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
    ],
    Ticket: [
      'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z',
      'M13 5v2',
      'M13 17v2',
      'M13 11v2',
    ],
    Trophy: [
      'M6 9H4.5a2.5 2.5 0 0 1 0-5H6',
      'M18 9h1.5a2.5 2.5 0 0 0 0-5H18',
      'M4 22h16',
      'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22',
      'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22',
      'M18 2H6v7a6 6 0 0 0 12 0V2Z',
    ],
    Award: [
      'm15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526',
      'M12 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z',
    ],
    Sparkles: [
      'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
      'M20 3v4',
      'M22 5h-4',
      'M4 17v2',
      'M5 18H3',
    ],
    Gift: [
      'M20 12v10H4V12',
      'M2 7h20v5H2z',
      'M12 22V7',
      'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
      'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    ],
    Star: [
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    ],
    Flame: [
      'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
    ],
    Zap: ['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'],
    Droplets: [
      'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z',
      'M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97',
    ],
    Recycle: [
      'M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5',
      'M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12',
      'm14 16-3 3 3 3',
      'M8.293 13.596 7.196 9.5 3.1 10.598',
      'm9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843',
      'm13.378 9.633 4.096 1.098 1.097-4.096',
    ],
    CheckCircle2: [
      'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
      'm9 12 2 2 4-4',
    ],
    ArrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
    ChevronRight: ['m9 18 6-6-6-6'],
    Navigation: ['polygon:3 11 22 2 13 21 11 13 3 11'],
    Radio: [
      'M4.9 19.1C1 15.2 1 8.8 4.9 4.9',
      'M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5',
      'M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
      'M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5',
      'M19.1 4.9C23 8.8 23 15.1 19.1 19',
    ],
    Plus: ['M5 12h14', 'M12 5v14'],
    X: ['M18 6 6 18', 'm6 6 12 12'],
    Menu: ['M4 12h16', 'M4 6h16', 'M4 18h16'],
    ShieldCheck: [
      'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
      'm9 12 2 2 4-4',
    ],
    Box: [
      'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
      'm3.3 7 8.7 5 8.7-5',
      'M12 22V12',
    ],
    QrCode: [
      'M3 3h5v5H3z',
      'M16 3h5v5h-5z',
      'M3 16h5v5H3z',
      'M21 16h-3a2 2 0 0 0-2 2v3',
      'M21 21v.01',
      'M12 7v3a2 2 0 0 1-2 2H7',
      'M3 12h.01',
      'M12 3h.01',
      'M12 16v.01',
      'M16 12h1',
      'M21 12v.01',
      'M12 21v-1',
    ],
  };

  function Icon({ name, className = 'w-5 h-5', strokeWidth = 2 }) {
    const paths = ICON_PATHS[name] || ICON_PATHS.Sparkles;
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth=${strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className=${className}
        aria-hidden="true"
      >
        ${paths.map((d, idx) =>
          d.startsWith('polygon:')
            ? html`<polygon key=${idx} points=${d.replace('polygon:', '')} />`
            : html`<path key=${idx} d=${d} />`
        )}
      </svg>
    `;
  }

  // Minimalist geometric dot-matrix signature mark (inspired by contemporary athletic editorials)
  function DotMatrixIcon({ className = 'w-4 h-4', accent = '#F5F7FA' }) {
    const dots = [
      [3, 3], [9, 3], [15, 3],
      [3, 9], [9, 9], [15, 9],
      [3, 15], [9, 15], [15, 15],
    ];
    return html`
      <svg viewBox="0 0 18 18" fill="none" className=${className} aria-hidden="true">
        ${dots.map(([cx, cy], idx) =>
          html`<circle key=${idx} cx=${cx} cy=${cy} r="1.35" fill=${idx === 4 ? accent : 'currentColor'} />`
        )}
      </svg>
    `;
  }

  // Minimalist athletic split-crest logo for JOGANDO SUJO
  function BrandEmblem({ className = 'w-8 h-8' }) {
    return html`
      <svg viewBox="0 0 40 40" fill="none" className=${className} aria-hidden="true">
        <defs>
          <linearGradient id="brandSplit" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0099FF" />
            <stop offset="48%" stopColor="#F5F7FA" />
            <stop offset="52%" stopColor="#F5F7FA" />
            <stop offset="100%" stopColor="#E6192E" />
          </linearGradient>
        </defs>
        <path
          d="M20 3L34 8.5V19.5C34 28.2 28 34.4 20 37C12 34.4 6 28.2 6 19.5V8.5L20 3Z"
          fill="#07080A"
          stroke="url(#brandSplit)"
          strokeWidth="2.2"
        />
        <path d="M20 7.5V32.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeDasharray="2 2" />
        <path d="M13 15L20 22L27 15" stroke="#F5F7FA" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 25H26" stroke="#F5F7FA" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    `;
  }

  // High-contrast crisp SVG QR code pointing conceptually to www.jogandosujo.com
  function StylizedQRCode({ className = 'w-28 h-28' }) {
    const modules = [
      // Top-left finder
      [0,0,7,7,1], [1,1,5,5,0], [2,2,3,3,1],
      // Top-right finder
      [14,0,7,7,1], [15,1,5,5,0], [16,2,3,3,1],
      // Bottom-left finder
      [0,14,7,7,1], [1,15,5,5,0], [2,16,3,3,1],
      // Timing & data blocks
      [8,1,1,1,1], [10,1,2,1,1], [8,3,2,2,1], [11,3,2,1,1], [9,6,2,1,1], [12,6,1,2,1],
      [1,8,2,1,1], [4,8,2,2,1], [7,9,2,2,1], [11,9,2,1,1], [14,8,2,1,1], [18,8,3,1,1],
      [2,11,1,2,1], [5,11,2,1,1], [9,12,2,2,1], [13,11,2,2,1], [16,10,2,2,1], [19,11,2,1,1],
      [8,15,2,1,1], [11,14,1,3,1], [14,15,2,2,1], [17,14,2,1,1], [20,14,1,2,1],
      [8,18,2,2,1], [12,18,2,1,1], [15,19,2,2,1], [18,18,3,2,1], [10,20,1,1,1],
    ];
    return html`
      <svg viewBox="0 0 21 21" className=${className} role="img" aria-label="QR Code para www.jogandosujo.com">
        <rect width="21" height="21" rx="1.2" fill="#FFFFFF" />
        ${modules.map(([x, y, w, h, fill], i) =>
          html`<rect key=${i} x=${x} y=${y} width=${w} height=${h} fill=${fill ? '#050507' : '#FFFFFF'} />`
        )}
      </svg>
    `;
  }

  window.AppIcons = { Icon, DotMatrixIcon, BrandEmblem, StylizedQRCode };
})();
