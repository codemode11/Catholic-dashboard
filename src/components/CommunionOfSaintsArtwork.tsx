import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Eye, EyeOff, Download, Maximize2, Minimize2 } from 'lucide-react';

interface SaintLayerConfig {
  id: string;
  name: string;
  title: string;
  vestments: string;
  src: string;
  // Target center position and dimensions on the 1920x1080 horizontal canvas
  cx: number;
  cy: number;
  width: number;
  height: number;
  // Source crop ratios (0..1)
  sxRatio: number;
  syRatio: number;
  swRatio: number;
  shRatio: number;
  tier: 'christ' | 'mary' | 'foreground' | 'choir';
  keyMode: 'dark' | 'green' | 'white' | 'olive' | 'vignette' | 'christ';
  haloRadius?: number;
  flipX?: boolean;
  labelX: number;
  labelY: number;
}

const SAINT_LAYERS: SaintLayerConfig[] = [
  // === UPPER HEAVENLY CHOIR (COMMUNION OF SAINTS IN HEAVEN - 7 DISTINCT SAINTS) ===
  {
    id: 'kolbe',
    name: 'St. Maximilian Kolbe',
    title: 'Martyr of Charity',
    vestments: 'Conventual Franciscan habit',
    src: '/saints/kolbe.jpg',
    cx: 195,
    cy: 300,
    width: 230,
    height: 290,
    sxRatio: 0.05,
    syRatio: 0.02,
    swRatio: 0.9,
    shRatio: 0.88,
    tier: 'choir',
    keyMode: 'vignette',
    haloRadius: 78,
    labelX: 10,
    labelY: 24,
  },
  {
    id: 'ignatius',
    name: 'St. Ignatius of Loyola',
    title: 'Founder of the Society of Jesus',
    vestments: 'Black Jesuit cassock & sacred chasuble',
    src: '/saints/ignatius.jpg',
    cx: 390,
    cy: 265,
    width: 235,
    height: 295,
    sxRatio: 0.05,
    syRatio: 0.02,
    swRatio: 0.9,
    shRatio: 0.9,
    tier: 'choir',
    keyMode: 'dark',
    haloRadius: 80,
    labelX: 20,
    labelY: 21,
  },
  {
    id: 'peter',
    name: 'St. Peter the Apostle',
    title: 'Prince of the Apostles',
    vestments: 'Apostolic gold and blue mantle with the Keys of Heaven',
    src: '/saints/peter.jpg',
    cx: 615,
    cy: 250,
    width: 260,
    height: 320,
    sxRatio: 0.08,
    syRatio: 0.04,
    swRatio: 0.84,
    shRatio: 0.75,
    tier: 'choir',
    keyMode: 'dark',
    haloRadius: 86,
    labelX: 32,
    labelY: 20,
  },
  {
    id: 'paul',
    name: 'St. Paul the Apostle',
    title: 'Apostle to the Gentiles',
    vestments: 'Crimson apostolic cloak over tunic',
    src: '/saints/paul.jpg',
    cx: 1305,
    cy: 250,
    width: 260,
    height: 320,
    sxRatio: 0.08,
    syRatio: 0.04,
    swRatio: 0.84,
    shRatio: 0.78,
    tier: 'choir',
    keyMode: 'dark',
    haloRadius: 86,
    labelX: 68,
    labelY: 20,
  },
  {
    id: 'francis',
    name: 'St. Francis of Assisi',
    title: 'Seraphic Patriarch',
    vestments: 'Rough brown Franciscan habit & cord',
    src: '/saints/francis.jpg',
    cx: 1525,
    cy: 265,
    width: 240,
    height: 300,
    sxRatio: 0.08,
    syRatio: 0.03,
    swRatio: 0.84,
    shRatio: 0.82,
    tier: 'choir',
    keyMode: 'vignette',
    haloRadius: 80,
    labelX: 79,
    labelY: 21,
  },
  {
    id: 'catherine',
    name: 'St. Catherine of Siena',
    title: 'Doctor of the Church',
    vestments: 'Dominican tertiary white veil & black mantle',
    src: '/saints/catherine.jpg',
    cx: 1730,
    cy: 300,
    width: 235,
    height: 295,
    sxRatio: 0.08,
    syRatio: 0.03,
    swRatio: 0.84,
    shRatio: 0.82,
    tier: 'choir',
    keyMode: 'vignette',
    haloRadius: 78,
    labelX: 90,
    labelY: 24,
  },
  {
    id: 'therese_lisieux',
    name: 'St. Thérèse of Lisieux',
    title: 'Doctor of the Church • The Little Flower',
    vestments: 'Carmelite brown habit, white mantle & black veil',
    src: '/saints/therese_lisieux.jpg',
    cx: 760,
    cy: 355,
    width: 235,
    height: 295,
    sxRatio: 0.06,
    syRatio: 0.02,
    swRatio: 0.88,
    shRatio: 0.88,
    tier: 'choir',
    keyMode: 'vignette',
    haloRadius: 78,
    labelX: 40,
    labelY: 31,
  },

  // === CENTRAL AXIS: JESUS CHRIST BEHIND THE BLESSED VIRGIN MARY ===
  {
    id: 'jesus',
    name: 'Our Lord Jesus Christ',
    title: 'Eternal High Priest & King of Glory (Behind Mary)',
    vestments: 'Radiant white and golden-crimson glorified mantle',
    src: '/saints/jesus.jpg',
    cx: 960,
    cy: 295,
    width: 490,
    height: 580,
    sxRatio: 0.05,
    syRatio: 0.02,
    swRatio: 0.9,
    shRatio: 0.88,
    tier: 'christ',
    keyMode: 'christ',
    haloRadius: 155,
    labelX: 50,
    labelY: 16,
  },
  {
    id: 'mary',
    name: 'The Blessed Virgin Mary',
    title: 'Queen of All Saints (In the Middle, Hands Joined in Prayer)',
    vestments: 'Sapphire-blue maphorion mantle, ivory veil & crimson tunic',
    src: '/saints/mary.jpg',
    cx: 960,
    cy: 675,
    width: 460,
    height: 575,
    sxRatio: 0.02,
    syRatio: 0.04,
    swRatio: 0.96,
    shRatio: 0.96,
    tier: 'mary',
    keyMode: 'dark',
    haloRadius: 135,
    labelX: 50,
    labelY: 54,
  },

  // === FOREGROUND SAINTS (9 FAMOUS & FAMILIAR SAINTS IN EARTHLY VESTMENTS) ===
  {
    id: 'augustine',
    name: 'St. Augustine of Hippo',
    title: 'Bishop & Doctor of Grace',
    vestments: 'Episcopal gold-embroidered cope, alb & burning heart',
    src: '/saints/augustine.jpg',
    cx: 135,
    cy: 690,
    width: 340,
    height: 450,
    sxRatio: 0.2,
    syRatio: 0.1,
    swRatio: 0.65,
    shRatio: 0.72,
    tier: 'foreground',
    keyMode: 'dark',
    haloRadius: 96,
    labelX: 8,
    labelY: 86,
  },
  {
    id: 'jerome',
    name: 'St. Jerome',
    title: 'Priest & Doctor of Sacred Scripture',
    vestments: 'Crimson scholar’s drapery with the Vulgate Bible',
    src: '/saints/jerome.jpg',
    cx: 330,
    cy: 645,
    width: 320,
    height: 420,
    sxRatio: 0.22,
    syRatio: 0.1,
    swRatio: 0.68,
    shRatio: 0.75,
    tier: 'foreground',
    keyMode: 'dark',
    haloRadius: 92,
    flipX: true,
    labelX: 18,
    labelY: 79,
  },
  {
    id: 'thomas_aquinas',
    name: 'St. Thomas Aquinas',
    title: 'Angelicum Doctor of the Church',
    vestments: 'Dominican black cappa & white tunic with golden sunburst',
    src: '/saints/thomas_aquinas.jpg',
    cx: 505,
    cy: 605,
    width: 315,
    height: 420,
    sxRatio: 0.16,
    syRatio: 0.08,
    swRatio: 0.76,
    shRatio: 0.78,
    tier: 'foreground',
    keyMode: 'vignette',
    haloRadius: 95,
    flipX: true,
    labelX: 27,
    labelY: 73,
  },
  {
    id: 'mother_teresa',
    name: 'St. Teresa of Calcutta',
    title: 'Missionaries of Charity',
    vestments: 'White cotton sari bordered with three blue stripes & crucifix',
    src: '/saints/mother_teresa.jpg',
    cx: 625,
    cy: 750,
    width: 320,
    height: 425,
    sxRatio: 0.05,
    syRatio: 0.04,
    swRatio: 0.9,
    shRatio: 0.88,
    tier: 'foreground',
    keyMode: 'dark',
    haloRadius: 98,
    labelX: 33,
    labelY: 89,
  },
  {
    id: 'john_paul_ii',
    name: 'St. John Paul II',
    title: 'Supreme Pontiff',
    vestments: 'Papal white vestments, embroidered mitre, stole & pastoral cross',
    src: '/saints/john_paul_ii.jpg',
    cx: 765,
    cy: 695,
    width: 350,
    height: 455,
    sxRatio: 0.04,
    syRatio: 0.01,
    swRatio: 0.68,
    shRatio: 0.76,
    tier: 'foreground',
    keyMode: 'white',
    haloRadius: 102,
    flipX: true,
    labelX: 41,
    labelY: 83,
  },
  {
    id: 'padre_pio',
    name: 'St. Padre Pio of Pietrelcina',
    title: 'Capuchin Friar • Bearing the Sacred Stigmata',
    vestments: 'Brown Capuchin Franciscan habit with visible crimson stigmata on his hands',
    src: '/saints/padre_pio.jpg',
    cx: 1165,
    cy: 710,
    width: 335,
    height: 435,
    sxRatio: 0.02,
    syRatio: 0.01,
    swRatio: 0.96,
    shRatio: 0.96,
    tier: 'foreground',
    keyMode: 'green',
    haloRadius: 102,
    labelX: 60,
    labelY: 84,
  },
  {
    id: 'faustina',
    name: 'St. Faustina Kowalska',
    title: 'Apostle of Divine Mercy',
    vestments: 'Black habit, white starched wimple & crucifix of Our Lady of Mercy',
    src: '/saints/faustina.jpg',
    cx: 1325,
    cy: 745,
    width: 320,
    height: 425,
    sxRatio: 0.08,
    syRatio: 0.06,
    swRatio: 0.84,
    shRatio: 0.88,
    tier: 'foreground',
    keyMode: 'olive',
    haloRadius: 96,
    labelX: 69,
    labelY: 89,
  },
  {
    id: 'teresa_avila',
    name: 'St. Teresa of Ávila',
    title: 'Foundress of the Discalced Carmelites & Doctor of Prayer',
    vestments: 'Brown Carmelite habit, cream white mantle & black veil',
    src: '/saints/teresa_avila.jpg',
    cx: 1525,
    cy: 670,
    width: 345,
    height: 455,
    sxRatio: 0.16,
    syRatio: 0.12,
    swRatio: 0.76,
    shRatio: 0.84,
    tier: 'foreground',
    keyMode: 'olive',
    haloRadius: 96,
    labelX: 79,
    labelY: 81,
  },
  {
    id: 'anthony_padua',
    name: 'St. Anthony of Padua',
    title: 'Franciscan Friar & Evangelical Doctor',
    vestments: 'Brown Franciscan habit with white lily of purity & Gospel book',
    src: '/saints/anthony_padua.jpg',
    cx: 1755,
    cy: 695,
    width: 355,
    height: 470,
    sxRatio: 0.14,
    syRatio: 0.11,
    swRatio: 0.72,
    shRatio: 0.85,
    tier: 'foreground',
    keyMode: 'dark',
    haloRadius: 96,
    labelX: 91,
    labelY: 86,
  },
];

export const CommunionOfSaintsArtwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSaint, setHoveredSaint] = useState<SaintLayerConfig | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const W = 1920;
    const H = 1080;

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        const baseUrl = import.meta.env.BASE_URL || './';
        const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        img.src = src.startsWith('/') ? `${normalizedBase}${src.slice(1)}` : src;
      });

    // Helper: Paint soft volumetric cloud puff
    const drawCloudPuff = (
      targetCtx: CanvasRenderingContext2D,
      x: number,
      y: number,
      rx: number,
      ry: number,
      innerColor: string,
      outerColor: string,
      alpha = 1
    ) => {
      targetCtx.save();
      targetCtx.globalAlpha = alpha;
      targetCtx.translate(x, y);
      targetCtx.scale(1, ry / rx);
      const grad = targetCtx.createRadialGradient(0, 0, rx * 0.08, 0, 0, rx);
      grad.addColorStop(0, innerColor);
      grad.addColorStop(0.55, outerColor);
      grad.addColorStop(1, 'rgba(255, 244, 214, 0)');
      targetCtx.fillStyle = grad;
      targetCtx.beginPath();
      targetCtx.arc(0, 0, rx, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.restore();
    };

    // Helper: Render realistic stigmatized hands of Padre Pio in Capuchin sleeves
    const drawPadrePioStigmataHands = (targetCtx: CanvasRenderingContext2D, cx: number, cy: number) => {
      targetCtx.save();

      // Left and right raised hands in prayer/blessing showing the crimson stigmata wounds
      const hands = [
        { x: cx - 54, y: cy + 128, angle: -0.18, isLeft: true },
        { x: cx + 54, y: cy + 128, angle: 0.18, isLeft: false },
      ];

      for (const h of hands) {
        targetCtx.save();
        targetCtx.translate(h.x, h.y);
        targetCtx.rotate(h.angle);

        // Brown Capuchin wool sleeve cuff & white knotted Franciscan cord hint
        const sleeveGrad = targetCtx.createLinearGradient(-34, 28, 34, 95);
        sleeveGrad.addColorStop(0, '#3e2414');
        sleeveGrad.addColorStop(0.5, '#2b170b');
        sleeveGrad.addColorStop(1, '#1c0e06');
        targetCtx.fillStyle = sleeveGrad;
        targetCtx.beginPath();
        targetCtx.moveTo(-30, 32);
        targetCtx.quadraticCurveTo(0, 24, 30, 32);
        targetCtx.lineTo(42, 95);
        targetCtx.lineTo(-42, 95);
        targetCtx.closePath();
        targetCtx.fill();

        // White lace/linen alb cuff edge
        targetCtx.fillStyle = 'rgba(244, 238, 225, 0.85)';
        targetCtx.beginPath();
        targetCtx.ellipse(0, 30, 24, 7, 0, 0, Math.PI * 2);
        targetCtx.fill();

        // Photorealistic warm skin-toned palm & fingers
        const skinGrad = targetCtx.createRadialGradient(0, -6, 4, 0, 0, 42);
        skinGrad.addColorStop(0, '#f3cfb3');
        skinGrad.addColorStop(0.65, '#d9a682');
        skinGrad.addColorStop(1, '#a97452');
        targetCtx.fillStyle = skinGrad;

        // Palm
        targetCtx.beginPath();
        targetCtx.ellipse(0, 4, 21, 26, 0, 0, Math.PI * 2);
        targetCtx.fill();

        // 4 fingers extended upward in solemn blessing/prayer
        const fingerOffsets = [-13, -4.5, 4.5, 13];
        const fingerLengths = [32, 37, 35, 27];
        fingerOffsets.forEach((fx, idx) => {
          const fl = fingerLengths[idx];
          targetCtx.beginPath();
          targetCtx.roundRect(fx - 4.2, -4 - fl, 8.4, fl + 8, 4.2);
          targetCtx.fill();
        });

        // Thumb
        const thumbDir = h.isLeft ? 1 : -1;
        targetCtx.save();
        targetCtx.translate(thumbDir * 17, 4);
        targetCtx.rotate(thumbDir * 0.48);
        targetCtx.beginPath();
        targetCtx.roundRect(-4.5, -22, 9, 26, 4.5);
        targetCtx.fill();
        targetCtx.restore();

        // Sacred Stigmata Wound in the center of the palm (luminous crimson-ruby wound)
        const woundGlow = targetCtx.createRadialGradient(0, 2, 1, 0, 2, 16);
        woundGlow.addColorStop(0, 'rgba(255, 220, 180, 0.95)');
        woundGlow.addColorStop(0.25, 'rgba(185, 18, 26, 0.95)');
        woundGlow.addColorStop(0.6, 'rgba(115, 8, 14, 0.75)');
        woundGlow.addColorStop(1, 'rgba(115, 8, 14, 0)');
        targetCtx.fillStyle = woundGlow;
        targetCtx.beginPath();
        targetCtx.arc(0, 2, 16, 0, Math.PI * 2);
        targetCtx.fill();

        // Deep crimson stigmata core
        targetCtx.fillStyle = '#6e070c';
        targetCtx.beginPath();
        targetCtx.ellipse(0, 2, 5.8, 7.2, 0, 0, Math.PI * 2);
        targetCtx.fill();

        targetCtx.restore();
      }

      // Traditional Franciscan knotted white cord hanging gently between his hands
      targetCtx.strokeStyle = 'rgba(245, 238, 220, 0.85)';
      targetCtx.lineWidth = 4.5;
      targetCtx.lineCap = 'round';
      targetCtx.beginPath();
      targetCtx.moveTo(cx - 12, cy + 165);
      targetCtx.quadraticCurveTo(cx - 4, cy + 205, cx - 8, cy + 245);
      targetCtx.stroke();
      for (const ky of [188, 212, 236]) {
        targetCtx.fillStyle = '#efe5ce';
        targetCtx.beginPath();
        targetCtx.arc(cx - 7, cy + ky, 4.5, 0, Math.PI * 2);
        targetCtx.fill();
      }

      targetCtx.restore();
    };

    // Process an individual saint portrait on an offscreen canvas with keying + soft feathering
    const renderSaintPortrait = (
      img: HTMLImageElement,
      cfg: SaintLayerConfig
    ): HTMLCanvasElement => {
      const off = document.createElement('canvas');
      off.width = cfg.width;
      off.height = cfg.height;
      const octx = off.getContext('2d', { willReadFrequently: true })!;

      const sx = img.width * cfg.sxRatio;
      const sy = img.height * cfg.syRatio;
      const sw = img.width * cfg.swRatio;
      const sh = img.height * cfg.shRatio;

      octx.save();
      if (cfg.flipX) {
        octx.translate(cfg.width, 0);
        octx.scale(-1, 1);
      }
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cfg.width, cfg.height);
      octx.restore();

      const imgData = octx.getImageData(0, 0, cfg.width, cfg.height);
      const data = imgData.data;
      const w = cfg.width;
      const h = cfg.height;

      for (let y = 0; y < h; y++) {
        const ny = (y / h) * 2 - 1; // -1..1
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * 2 - 1; // -1..1
          const i = (y * w + x) * 4;
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Elliptical distance from figure core (biased slightly lower for shoulders/vestments)
          const dy = (y / h - 0.53) / 0.49;
          const topTapering = y < h * 0.45 ? 0.42 : 0.49;
          const dx = (x / w - 0.5) / topTapering;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Soft elliptical edge feathering so there are NEVER hard rectangular edges
          let maskAlpha = 1;
          if (dist > 0.76) {
            maskAlpha = Math.max(0, 1 - (dist - 0.76) / 0.24);
            maskAlpha = maskAlpha * maskAlpha * (3 - 2 * maskAlpha); // smoothstep
          }

          // Bottom cloud-blend fade
          if (y > h * 0.84) {
            const bottomFade = Math.max(0, 1 - (y - h * 0.84) / (h * 0.16));
            maskAlpha *= bottomFade;
          }

          // Background keying by portrait background type
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          const distFromHeadCenter = Math.hypot(nx, (y / h - 0.34) * 1.6);

          if (cfg.keyMode === 'green') {
            // Padre Pio studio green screen removal
            const greenness = g - Math.max(r, b);
            if (greenness > 8 || (g > r * 1.05 && g > b * 1.12 && distFromHeadCenter > 0.48)) {
              const fade = Math.max(0, 1 - (greenness - 4) / 28);
              maskAlpha *= fade;
              // Neutralize green spill on white beard and brown Capuchin habit edge
              g = Math.min(g, Math.round((r + b) * 0.52));
            }
          } else if (cfg.keyMode === 'dark') {
            // Sassoferrato Mary, Mother Teresa, Anthony, Augustine, Jerome dark studio background removal
            const isOuterRegion = distFromHeadCenter > 0.52 || y < h * 0.22;
            if (isOuterRegion && luma < 56 && Math.abs(r - b) < 34) {
              const darkFade = Math.max(0, (luma - 22) / 34);
              maskAlpha *= darkFade * darkFade;
            }
          } else if (cfg.keyMode === 'white') {
            // John Paul II bright snow backdrop removal while preserving white vestments & mitre
            const isSkySide =
              (y < h * 0.56 && Math.abs(nx) > 0.36) ||
              (y < h * 0.22 && Math.abs(nx) > 0.22);
            if (isSkySide && luma > 195 && b >= r - 15) {
              const skyFade = Math.max(0, 1 - (luma - 195) / 48);
              maskAlpha *= skyFade;
            }
          } else if (cfg.keyMode === 'olive') {
            // Faustina & Teresa of Avila olive/grey painted background outside veil contour
            const headShouldersWidth = y < h * 0.5 ? 0.36 : 0.46;
            const outsideHabit = Math.abs(nx) > headShouldersWidth || y < h * 0.12;
            if (outsideHabit && luma > 65 && luma < 175 && Math.abs(r - g) < 28) {
              maskAlpha *= 0.08;
            }
          }

          // Harmonize color temperature into unified hyperrealistic golden heavenly lighting
          r = Math.min(255, Math.round(r * 1.04 + 6));
          g = Math.min(255, Math.round(g * 1.02 + 3));
          b = Math.min(255, Math.round(b * 0.97));

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = Math.round(255 * maskAlpha);
        }
      }

      octx.putImageData(imgData, 0, 0);
      return off;
    };

    const composeScene = async () => {
      try {
        const loadedPairs = await Promise.all(
          SAINT_LAYERS.map(async (layer) => {
            const img = await loadImage(layer.src);
            return { layer, img };
          })
        );
        if (cancelled) return;

        // 1. CELESTIAL EMPYREAN BACKGROUND (1920x1080 Horizontal)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
        skyGrad.addColorStop(0, '#1c2b4b');
        skyGrad.addColorStop(0.28, '#3b4f76');
        skyGrad.addColorStop(0.58, '#8d6d46');
        skyGrad.addColorStop(0.85, '#c89b5b');
        skyGrad.addColorStop(1, '#dfbe84');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);

        // Radiant glory light behind Jesus Christ in the center
        const gloryGrad = ctx.createRadialGradient(W * 0.5, H * 0.24, 30, W * 0.5, H * 0.3, 980);
        gloryGrad.addColorStop(0, 'rgba(255, 253, 240, 1)');
        gloryGrad.addColorStop(0.22, 'rgba(255, 236, 175, 0.92)');
        gloryGrad.addColorStop(0.5, 'rgba(244, 195, 105, 0.55)');
        gloryGrad.addColorStop(0.8, 'rgba(186, 128, 64, 0.18)');
        gloryGrad.addColorStop(1, 'rgba(30, 42, 68, 0)');
        ctx.fillStyle = gloryGrad;
        ctx.fillRect(0, 0, W, H);

        // Crepuscular God-rays radiating from Christ at top-center
        ctx.save();
        ctx.translate(W * 0.5, H * 0.24);
        for (let i = 0; i < 36; i++) {
          const angle = (i / 36) * Math.PI * 2;
          const rayGrad = ctx.createLinearGradient(0, 0, Math.cos(angle) * 1200, Math.sin(angle) * 1200);
          rayGrad.addColorStop(0, 'rgba(255, 249, 218, 0.24)');
          rayGrad.addColorStop(0.5, 'rgba(255, 224, 148, 0.08)');
          rayGrad.addColorStop(1, 'rgba(255, 224, 148, 0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, 1300, angle - 0.032, angle + 0.032);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Distant upper heavenly clouds
        for (let i = 0; i < 18; i++) {
          const cx = (i / 17) * W;
          const cy = 120 + Math.sin(i * 1.4) * 55;
          drawCloudPuff(
            ctx,
            cx,
            cy,
            240,
            110,
            'rgba(255, 246, 220, 0.36)',
            'rgba(225, 190, 130, 0.14)',
            0.8
          );
        }

        // Helper to draw a saint layer with halo and warm heavenly rim-lighting
        const drawSaintLayer = (pair: { layer: SaintLayerConfig; img: HTMLImageElement }) => {
          const { layer, img } = pair;
          const processed = renderSaintPortrait(img, layer);

          // Halo behind head
          if (layer.haloRadius) {
            const hx = layer.cx;
            const hy = layer.cy - layer.height * 0.22;
            const haloGrad = ctx.createRadialGradient(
              hx,
              hy,
              layer.haloRadius * 0.2,
              hx,
              hy,
              layer.haloRadius * 1.35
            );
            haloGrad.addColorStop(0, 'rgba(255, 250, 222, 0.78)');
            haloGrad.addColorStop(0.55, 'rgba(255, 215, 120, 0.42)');
            haloGrad.addColorStop(1, 'rgba(255, 215, 120, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(hx, hy, layer.haloRadius * 1.35, 0, Math.PI * 2);
            ctx.fill();

            // Delicate gold nimbus ring
            ctx.save();
            ctx.strokeStyle =
              layer.tier === 'christ'
                ? 'rgba(255, 244, 190, 0.75)'
                : 'rgba(255, 232, 162, 0.42)';
            ctx.lineWidth = layer.tier === 'christ' ? 3 : 1.6;
            ctx.beginPath();
            ctx.arc(hx, hy, layer.haloRadius * 0.88, 0, Math.PI * 2);
            ctx.stroke();

            // Twelve stars around the Blessed Virgin Mary's halo
            if (layer.tier === 'mary') {
              for (let s = 0; s < 12; s++) {
                const a = -Math.PI * 0.85 + (s / 11) * Math.PI * 0.7 - Math.PI * 0.15;
                const sx = hx + Math.cos(a) * (layer.haloRadius * 0.94);
                const sy = hy + Math.sin(a) * (layer.haloRadius * 0.94);
                ctx.fillStyle = 'rgba(255, 250, 224, 0.92)';
                ctx.beginPath();
                ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            ctx.restore();
          }

          // Draw the saint figure
          ctx.drawImage(processed, layer.cx - layer.width / 2, layer.cy - layer.height / 2);

          // If St. Faustina, add subtle Divine Mercy red and pale rays emanating from her heart
          if (layer.id === 'faustina') {
            ctx.save();
            const rx = layer.cx - 8;
            const ry = layer.cy + 55;
            const redRay = ctx.createLinearGradient(rx, ry, rx + 110, ry + 170);
            redRay.addColorStop(0, 'rgba(220, 38, 38, 0.32)');
            redRay.addColorStop(1, 'rgba(220, 38, 38, 0)');
            ctx.fillStyle = redRay;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + 125, ry + 170);
            ctx.lineTo(rx + 35, ry + 185);
            ctx.closePath();
            ctx.fill();

            const paleRay = ctx.createLinearGradient(rx, ry, rx - 95, ry + 170);
            paleRay.addColorStop(0, 'rgba(224, 242, 254, 0.34)');
            paleRay.addColorStop(1, 'rgba(224, 242, 254, 0)');
            ctx.fillStyle = paleRay;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - 20, ry + 185);
            ctx.lineTo(rx - 110, ry + 165);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          // If Padre Pio, render his raised hands bearing the visible crimson stigmata wounds
          if (layer.id === 'padre_pio') {
            drawPadrePioStigmataHands(ctx, layer.cx, layer.cy);
          }
        };

        // 2. RENDER UPPER CHOIR SAINTS
        loadedPairs
          .filter((p) => p.layer.tier === 'choir')
          .forEach((p) => drawSaintLayer(p));

        // Mid-tier heavenly cloud bank separating upper choir and central/foreground saints
        for (let i = 0; i < 22; i++) {
          const cx = (i / 21) * W;
          const cy = 415 + Math.cos(i * 1.1) * 28;
          drawCloudPuff(
            ctx,
            cx,
            cy,
            220,
            88,
            'rgba(255, 248, 228, 0.72)',
            'rgba(232, 200, 145, 0.35)',
            0.85
          );
        }

        // 3. RENDER JESUS CHRIST (Directly Behind Mary in the Center)
        loadedPairs
          .filter((p) => p.layer.tier === 'christ')
          .forEach((p) => drawSaintLayer(p));

        // Soft luminous cloud veil between Jesus' lower robe and Mary's shoulders
        drawCloudPuff(
          ctx,
          W * 0.5,
          500,
          310,
          95,
          'rgba(255, 250, 235, 0.76)',
          'rgba(242, 212, 158, 0.38)',
          0.9
        );

        // 4. RENDER FOREGROUND SAINTS (Outer -> Inner so central figures overlap naturally)
        const foregroundOrder = [
          'augustine',
          'anthony_padua',
          'jerome',
          'teresa_avila',
          'thomas_aquinas',
          'faustina',
          'mother_teresa',
          'john_paul_ii',
          'padre_pio',
        ];
        for (const id of foregroundOrder) {
          const found = loadedPairs.find((p) => p.layer.id === id);
          if (found) drawSaintLayer(found);
        }

        // 5. RENDER BLESSED VIRGIN MARY IN THE VERY CENTER (With Hands Joined in Prayer)
        loadedPairs
          .filter((p) => p.layer.tier === 'mary')
          .forEach((p) => drawSaintLayer(p));

        // 6. FOREGROUND HEAVENLY CLOUD BANK (Billowing golden-ivory clouds across the lower frame)
        for (let i = 0; i < 28; i++) {
          const cx = (i / 27) * W;
          const cy = 955 + Math.sin(i * 1.35) * 34;
          drawCloudPuff(
            ctx,
            cx,
            cy,
            250,
            115,
            'rgba(255, 250, 236, 0.94)',
            'rgba(235, 204, 152, 0.62)',
            0.95
          );
        }
        for (let i = 0; i < 20; i++) {
          const cx = ((i + 0.5) / 20) * W;
          const cy = 1035 + Math.cos(i * 0.9) * 24;
          drawCloudPuff(
            ctx,
            cx,
            cy,
            310,
            130,
            'rgba(255, 252, 242, 0.98)',
            'rgba(224, 188, 132, 0.78)',
            1
          );
        }

        // 7. UNIFIED ATMOSPHERIC GOLDEN LIGHT BLOOM OVER ENTIRE CANVAS
        const bloom = ctx.createRadialGradient(W * 0.5, H * 0.32, 80, W * 0.5, H * 0.5, 1150);
        bloom.addColorStop(0, 'rgba(255, 248, 220, 0.16)');
        bloom.addColorStop(0.55, 'rgba(255, 222, 155, 0.08)');
        bloom.addColorStop(1, 'rgba(24, 16, 8, 0.24)');
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, W, H);

        setIsRendered(true);
      } catch (err) {
        console.error('Error composing Communion of Saints canvas:', err);
      }
    };

    composeScene();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'communion-of-saints-in-heaven-1920x1080.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <section
      className={`relative transition-all duration-500 ${
        isExpanded ? 'fixed inset-4 z-50 bg-stone-950/95 p-4 md:p-6 overflow-y-auto flex flex-col justify-center' : 'mb-14'
      }`}
    >
      <div className="border-2 border-stone-800 bg-[#14100c] shadow-[0_24px_60px_rgba(28,20,12,0.28)] overflow-hidden">
        {/* Top Classical Dedicatory Architrave */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 bg-gradient-to-r from-[#1f1710] via-[#2c2116] to-[#1f1710] border-b border-amber-500/30 text-amber-100">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <h2 className="font-serif text-sm md:text-base tracking-[0.16em] uppercase text-amber-100 font-semibold">
                Sanctorum Communio • The Communion of Saints in Heaven
              </h2>
              <p className="text-[11px] text-amber-200/75 font-serif italic">
                Our Lady in the center with hands joined in prayer, Our Lord Jesus Christ behind her, surrounded by the Saints in their earthly vestments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLabels((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif uppercase tracking-wider border border-amber-400/40 bg-amber-950/50 hover:bg-amber-900/60 text-amber-100 transition-colors cursor-pointer"
            >
              {showLabels ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showLabels ? 'Hide Saint Names' : 'Identify Saints'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!isRendered}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif uppercase tracking-wider border border-amber-400/40 bg-amber-950/50 hover:bg-amber-900/60 text-amber-100 transition-colors cursor-pointer disabled:opacity-40"
              title="Download Full-HD 1920x1080 Horizontal Image"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save HD Image</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-serif uppercase tracking-wider border border-amber-400/40 bg-amber-950/50 hover:bg-amber-900/60 text-amber-100 transition-colors cursor-pointer"
              title={isExpanded ? 'Exit Fullscreen' : 'View Larger'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 16:9 Horizontal Hyperrealistic Canvas Container */}
        <div className="relative w-full aspect-[16/9] bg-[#1c2333] overflow-hidden select-none">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full h-full object-cover block"
          />

          {/* Interactive Saint Identification Markers when toggled */}
          {showLabels && (
            <div className="absolute inset-0 pointer-events-none">
              {SAINT_LAYERS.map((s) => (
                <div
                  key={s.id}
                  style={{ left: `${s.labelX}%`, top: `${s.labelY}%` }}
                  onMouseEnter={() => setHoveredSaint(s)}
                  onMouseLeave={() => setHoveredSaint(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                >
                  <div className="px-2 py-0.5 bg-stone-950/85 border border-amber-400/60 text-[10px] md:text-xs font-serif text-amber-100 whitespace-nowrap shadow-lg group-hover:bg-amber-900 group-hover:border-amber-300 transition-colors cursor-pointer">
                    {s.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hovered Saint Details Banner */}
          {hoveredSaint && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-stone-950/90 border border-amber-400/60 text-center max-w-xl shadow-2xl pointer-events-none">
              <div className="text-xs md:text-sm font-serif font-bold text-amber-200 tracking-wide">
                {hoveredSaint.name} — <span className="font-normal italic text-amber-100/90">{hoveredSaint.title}</span>
              </div>
              <div className="text-[11px] text-stone-300 font-serif mt-0.5">
                Vestments: {hoveredSaint.vestments}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Legend of Foreground Saints & Central Figures */}
        <div className="px-4 md:px-6 py-3 bg-[#19130d] border-t border-amber-500/25 text-[11px] md:text-xs text-stone-300 font-serif flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-amber-300 font-semibold uppercase tracking-wider mr-2">
              Center:
            </span>
            <span className="text-amber-100">
              Blessed Virgin Mary (hands joined in prayer) &amp; Our Lord Jesus Christ (behind her)
            </span>
          </div>
          <div className="text-stone-400">
            <span className="text-amber-300/90 font-semibold uppercase tracking-wider mr-1.5">
              Foreground Saints (Left to Right):
            </span>
            St. Augustine • St. Jerome • St. Thomas Aquinas • St. Teresa of Calcutta • St. John Paul II • St. Padre Pio (with stigmata) • St. Faustina • St. Teresa of Ávila • St. Anthony of Padua
          </div>
        </div>
      </div>
    </section>
  );
};
