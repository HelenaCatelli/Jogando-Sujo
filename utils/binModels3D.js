// Photorealistic Procedural 3D Smart Stadium Bins ("Beira-Rio" & "Arena do Grêmio")
// Arena uses subtle squircle superellipse (n = 2.65); Beira-Rio uses smooth oval (n = 2)
// Identical footprint (rx = 0.92, rz = 0.72) and height (~1.33), strictly upright +Y, MeshPhysicalMaterial PBR

(function () {
  function formatWeightText(kg) {
    return `${Number(kg).toLocaleString('pt-BR', {
      minimumFractionDigits: Number.isInteger(kg) ? 0 : 1,
      maximumFractionDigits: 1,
    })} kg`;
  }

  // Exact superellipse contour helper: x = rx * sgn(cos t) * |cos t|^(2/n), z = rz * sgn(sin t) * |sin t|^(2/n)
  function squirclePoint(t, rx, rz, n = 2.65) {
    const exp = 2 / n;
    const c = Math.cos(t);
    const s = Math.sin(t);
    return {
      x: rx * Math.sign(c) * Math.pow(Math.abs(c), exp),
      z: rz * Math.sign(s) * Math.pow(Math.abs(s), exp),
    };
  }

  // Morphs a circular/Y-up geometry onto a superellipse (n = 2.65) with ovalRatioZ
  function applySquircleToGeometry(geo, ovalRatioZ, n = 2.65) {
    const exp = 2 / n;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      if (r < 1e-6) continue;

      const t = Math.atan2(z, x);
      const c = Math.cos(t);
      const s = Math.sin(t);
      const nx = r * Math.sign(c) * Math.pow(Math.abs(c), exp);
      const nz = r * ovalRatioZ * Math.sign(s) * Math.pow(Math.abs(s), exp);
      pos.setXYZ(i, nx, y, nz);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function createSquircleShape(rx, rz, n = 2.65, segments = 64) {
    const shape = new window.ThreeKit.THREE.Shape();
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const pt = squirclePoint(t, rx, rz, n);
      if (i === 0) shape.moveTo(pt.x, pt.z);
      else shape.lineTo(pt.x, pt.z);
    }
    shape.closePath();
    return shape;
  }

  function createOvalShape(rx, rz) {
    const shape = new window.ThreeKit.THREE.Shape();
    shape.absellipse(0, 0, rx, rz, 0, Math.PI * 2, false, 0);
    return shape;
  }

  function createOvalHolePath(rx, rz) {
    const path = new window.ThreeKit.THREE.Path();
    path.absellipse(0, 0, rx, rz, 0, Math.PI * 2, true, 0);
    return path;
  }

  function createRoundedTotemShape(bottomWidth, topWidth, height, topRadius) {
    const shape = new window.ThreeKit.THREE.Shape();
    const bw = bottomWidth / 2;
    const tw = topWidth / 2;
    const r = Math.min(topRadius, tw * 0.88);

    shape.moveTo(-bw, 0);
    shape.lineTo(bw, 0);
    shape.lineTo(tw, height - r);
    shape.quadraticCurveTo(tw, height, tw - r, height);
    shape.lineTo(-tw + r, height);
    shape.quadraticCurveTo(-tw, height, -tw, height - r);
    shape.closePath();
    return shape;
  }

  function createRoundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function createNavyBandsTexture(THREE) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1B3E66';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#122B48';
    ctx.fillRect(0, 95, canvas.width, 46);
    ctx.fillRect(0, 225, canvas.width, 46);
    ctx.fillRect(0, 355, canvas.width, 46);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function createDomeRadialTexture(THREE) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#BFC6D0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(51, 65, 85, 0.28)';
    ctx.lineWidth = 2;
    const lines = 28;
    for (let i = 0; i <= lines; i++) {
      const x = (i / lines) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function createPictogramTexture(THREE, bgHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 144;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(92, 36, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(92, 48);
    ctx.lineTo(92, 86);
    ctx.lineTo(78, 114);
    ctx.moveTo(92, 86);
    ctx.lineTo(106, 114);
    ctx.moveTo(92, 60);
    ctx.lineTo(130, 60);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(146, 66, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(134, 80);
    ctx.lineTo(162, 80);
    ctx.lineTo(157, 114);
    ctx.lineTo(139, 114);
    ctx.closePath();
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function createReceiptTexture(THREE, accentHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 396;
    const ctx = canvas.getContext('2d');

    // Crisp thermal paper white
    ctx.fillStyle = '#f5f6f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper edge shading
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    // Top perforated thermal header
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 26);
    ctx.lineTo(canvas.width - 20, 26);
    ctx.stroke();
    ctx.setLineDash([]);

    // Brand Header
    ctx.fillStyle = '#0a0c10';
    ctx.font = '800 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('JOGANDO SUJO', 128, 66);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px sans-serif';
    ctx.fillText('RECIBO DE DESCARTE', 128, 88);

    // Team accent hairline divider
    ctx.fillStyle = accentHex;
    ctx.fillRect(46, 106, 164, 3);

    // Main weight
    ctx.fillStyle = '#0a0c10';
    ctx.font = '800 42px sans-serif';
    ctx.fillText('+1,00 kg', 128, 174);

    // Points line
    ctx.fillStyle = accentHex;
    ctx.font = '800 23px sans-serif';
    ctx.fillText('+10 PONTOS', 128, 218);

    // Subtle separator above barcode
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(24, 250);
    ctx.lineTo(canvas.width - 24, 250);
    ctx.stroke();
    ctx.setLineDash([]);

    // Minimalist crisp black barcode at the bottom
    ctx.fillStyle = '#0a0c10';
    const bars = [3, 2, 5, 1, 2, 4, 2, 3, 1, 5, 2, 2, 4, 1, 3, 2, 5, 2, 3, 1, 4, 2];
    const totalUnits = bars.reduce((acc, w) => acc + w, 0);
    const barScale = 176 / totalUnits;
    let bx = 40;
    bars.forEach((w, idx) => {
      const bw = w * barScale;
      if (idx % 2 === 0) ctx.fillRect(bx, 276, bw, 68);
      bx += bw;
    });

    ctx.fillStyle = '#475569';
    ctx.font = '600 11px monospace';
    ctx.fillText('0100-JS-POA-2026', 128, 366);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  function drawConsoleScreenCanvas(canvas, config, weightKg) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = config.screenBg;
    createRoundedRectPath(ctx, 6, 6, w - 12, h - 12, 26);
    ctx.fill();

    ctx.strokeStyle = config.screenBorder;
    ctx.lineWidth = 6;
    createRoundedRectPath(ctx, 10, 10, w - 20, h - 20, 24);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TOTAL COLETADO', w / 2, 96);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 84px sans-serif';
    ctx.fillText(formatWeightText(weightKg), w / 2, 212);

    ctx.fillStyle = config.screenAccent;
    ctx.fillRect(w / 2 - 72, 256, 144, 5);
  }

  function createTotemFooterTexture(THREE, emblemType) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (emblemType === 'beira') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(256, 62, 34, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(256, 62, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(256, 62, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(256, 62, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('JOGANDO', 256, 158);
    ctx.fillText('SUJO', 256, 208);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function buildIntegratedConsole(THREE, config, initialWeightKg) {
    const consoleGroup = new THREE.Group();
    consoleGroup.name = 'TotemConsoleFront';

    // Satin automotive/industrial paint finish for console housing
    const housingMat = new THREE.MeshPhysicalMaterial({
      color: config.housingHex,
      roughness: config.housingRoughness ?? 0.3,
      metalness: config.housingMetalness ?? 0.15,
      clearcoat: config.housingClearcoat ?? 0.5,
      clearcoatRoughness: 0.2,
    });
    housingMat.userData = { envMapIntensity: 0.45 };

    const recessMat = new THREE.MeshStandardMaterial({
      color: 0x0b0e14,
      roughness: 0.75,
      metalness: 0.1,
    });
    recessMat.userData = { envMapIntensity: 0.3 };

    const depth = config.zFront - config.zBack;

    const shape = createRoundedTotemShape(
      config.bottomWidth,
      config.topWidth,
      config.height,
      config.topRadius
    );
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.018,
      bevelSegments: 4,
      curveSegments: 24,
    });
    const bodyMesh = new THREE.Mesh(geo, housingMat);
    bodyMesh.position.set(0, config.baseY, config.zBack);
    bodyMesh.userData.envMapIntensity = 0.45;
    consoleGroup.add(bodyMesh);

    if (config.borderHex) {
      const borderMat = new THREE.MeshStandardMaterial({
        color: config.borderHex,
        roughness: 0.35,
        metalness: 0.55,
      });
      const outerB = createRoundedTotemShape(
        config.bottomWidth + 0.045,
        config.topWidth + 0.045,
        config.height + 0.024,
        config.topRadius + 0.02
      );
      const innerB = createRoundedTotemShape(
        config.bottomWidth - 0.03,
        config.topWidth - 0.03,
        config.height - 0.03,
        Math.max(0.06, config.topRadius - 0.02)
      );
      outerB.holes.push(innerB);
      const borderGeo = new THREE.ExtrudeGeometry(outerB, {
        depth: 0.045,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 2,
        curveSegments: 24,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.set(0, config.baseY - 0.005, config.zFront - 0.012);
      borderMesh.userData.envMapIntensity = 0.65;
      consoleGroup.add(borderMesh);
    }

    const frontZ = config.zFront + 0.027;
    const slotY = config.baseY + config.height - 0.125;
    const slotLedMeshes = [];

    if (config.slotBorderHex) {
      const baseSlotEmissive =
        config.slotEmissiveIntensity !== undefined ? config.slotEmissiveIntensity : 0.18;
      const slotFrameMat = new THREE.MeshStandardMaterial({
        color: config.slotBorderHex,
        emissive: config.slotEmissiveHex || config.slotBorderHex,
        emissiveIntensity: baseSlotEmissive,
        roughness: 0.32,
        metalness: 0.25,
      });
      const slotFrame = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.056, 0.018), slotFrameMat);
      slotFrame.position.set(0, slotY, frontZ - 0.002);
      slotFrame.userData.envMapIntensity = 0.5;
      slotFrame.userData.isNeonLed = true;
      slotFrame.userData.baseEmissive = baseSlotEmissive;
      slotLedMeshes.push(slotFrame);
      consoleGroup.add(slotFrame);
    }

    const slotRecess = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.022), recessMat);
    slotRecess.position.set(0, slotY, frontZ + 0.002);
    slotRecess.userData.envMapIntensity = 0.3;
    consoleGroup.add(slotRecess);

    const receiptW = 0.22;
    const receiptH = 0.34;
    const receiptSegsY = 18;
    const receiptGeo = new THREE.PlaneGeometry(receiptW, receiptH, 1, receiptSegsY);
    const receiptTex = createReceiptTexture(THREE, config.screenAccent);
    const receiptMat = new THREE.MeshStandardMaterial({
      map: receiptTex,
      roughness: 0.78,
      metalness: 0.02,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const receiptMouthY = slotY - 0.002;
    const receiptMouthZ = frontZ + 0.011;
    const receiptMesh = new THREE.Mesh(receiptGeo, receiptMat);
    receiptMesh.position.set(0, receiptMouthY, receiptMouthZ);
    receiptMesh.visible = false;
    receiptMesh.userData.noShadowCast = true;
    receiptMesh.userData.envMapIntensity = 0.25;
    receiptMesh.userData.receiptMeta = {
      width: receiptW,
      height: receiptH,
      segsY: receiptSegsY,
      baseY: receiptMouthY,
      baseZ: receiptMouthZ,
    };
    consoleGroup.add(receiptMesh);

    const screenW = config.screenW;
    const screenH = config.screenH;
    const screenY = config.baseY + config.height * 0.56;

    const screenRecess = new THREE.Mesh(
      new THREE.BoxGeometry(screenW + 0.03, screenH + 0.03, 0.02),
      recessMat
    );
    screenRecess.position.set(0, screenY, frontZ - 0.004);
    screenRecess.userData.envMapIntensity = 0.3;
    consoleGroup.add(screenRecess);

    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 320;
    drawConsoleScreenCanvas(screenCanvas, config, initialWeightKg);

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    screenTex.needsUpdate = true;

    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      emissiveMap: screenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.78,
      roughness: 0.25,
      metalness: 0.05,
    });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenH), screenMat);
    screenMesh.position.set(0, screenY, frontZ + 0.008);
    screenMesh.userData.noShadowCast = true;
    screenMesh.userData.envMapIntensity = 0.3;
    consoleGroup.add(screenMesh);

    // Clearcoat studio glass pane over the digital display (catches crisp subtle diagonal reflection)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.06,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenH), glassMat);
    glassPane.position.set(0, screenY, frontZ + 0.015);
    glassPane.userData.noShadowCast = true;
    glassPane.userData.noShadowReceive = true;
    glassPane.userData.envMapIntensity = 0.65;
    consoleGroup.add(glassPane);

    const footerTex = createTotemFooterTexture(THREE, config.emblemType);
    const footerMat = new THREE.MeshStandardMaterial({
      map: footerTex,
      transparent: true,
      alphaTest: 0.08,
      roughness: 0.4,
      metalness: 0.05,
    });
    const footerPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(config.footerW, config.footerH),
      footerMat
    );
    footerPlate.position.set(0, config.baseY + config.footerH * 0.54, frontZ + 0.003);
    footerPlate.userData.noShadowCast = true;
    footerPlate.userData.envMapIntensity = 0.3;
    consoleGroup.add(footerPlate);

    return {
      consoleGroup,
      receiptMesh,
      slotLedMeshes,
      receiptBasePos: {
        y: receiptMouthY,
        z: receiptMouthZ,
      },
      screenState: {
        canvas: screenCanvas,
        texture: screenTex,
        config,
      },
    };
  }

  function applyReceiptPrintPose(receiptMesh, printProgress, swayTime = 0, swayAmp = 0) {
    if (!receiptMesh || !receiptMesh.userData || !receiptMesh.userData.receiptMeta) return;
    const { width, height, segsY } = receiptMesh.userData.receiptMeta;
    const posAttr = receiptMesh.geometry.attributes.position;
    const printedLength = Math.max(0, Math.min(1, printProgress)) * height;

    for (let r = 0; r <= segsY; r++) {
      const posFromTop = (r / segsY) * height;
      const outDist = Math.max(0, printedLength - (height - posFromTop));
      const dNorm = outDist / height;

      let y = 0.002;
      let z = -0.014;
      if (outDist > 0.0004) {
        const exitCurl = 0.052 * Math.sin(Math.min(1, outDist / 0.13) * (Math.PI * 0.5));
        const tipCurl = 0.036 * Math.pow(dNorm, 1.65);
        const flutter = swayAmp * Math.sin(swayTime * 4.4 - dNorm * 1.6) * Math.pow(dNorm, 1.25);
        y = -outDist * 0.94 + Math.pow(dNorm, 2) * 0.014;
        z = exitCurl + tipCurl + flutter;
      }

      const leftIdx = r * 2;
      const rightIdx = leftIdx + 1;
      posAttr.setXYZ(leftIdx, -width * 0.5, y, z);
      posAttr.setXYZ(rightIdx, width * 0.5, y, z);
    }

    posAttr.needsUpdate = true;
    receiptMesh.geometry.computeVertexNormals();
  }

  function applyStudioShadowAndEnvStandards(group) {
    group.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = !obj.userData.noShadowCast;
        obj.receiveShadow = !obj.userData.noShadowReceive;
        if (obj.material && !obj.userData.isNeonLed && obj.material.envMapIntensity !== undefined) {
          obj.material.envMapIntensity =
            obj.userData.envMapIntensity !== undefined ? obj.userData.envMapIntensity : 0.3;
        }
      }
    });
  }

  function updateBinScreenWeight(group, newWeightKg) {
    if (!group || !group.userData || !group.userData.screenState) return;
    const { canvas, texture, config } = group.userData.screenState;
    drawConsoleScreenCanvas(canvas, config, newWeightKg);
    texture.needsUpdate = true;
  }

  // Parametric Beira-Rio Membrane Petal Builder (smooth oval n = 2)
  function createBeiraRioMembranePetalGeometry(THREE, centerAngle, halfSectorAngle, rx, rz, uMin) {
    const uSteps = 18;
    const vSteps = 6;
    const positions = [];
    const indices = [];

    function sampleProfile(u) {
      if (u <= 0.56) {
        const t = u / 0.56;
        const y = 0.1 + t * (0.92 - 0.1);
        const s = 0.86 + t * (1.0 - 0.86);
        return [y, s];
      } else {
        const t = (u - 0.56) / 0.44;
        const s = 1.0 - Math.pow(t, 1.35) * (1.0 - 0.54);
        const y = 0.92 + Math.sin(t * Math.PI * 0.5) * (1.28 - 0.92);
        return [y, s];
      }
    }

    function sampleWidthRatio(u) {
      if (u >= 0.58) return 1.04;
      const t = u / 0.58;
      return 0.24 + Math.pow(t, 1.85) * (1.04 - 0.24);
    }

    for (let layer = 0; layer < 2; layer++) {
      const isOuter = layer === 0;
      for (let iu = 0; iu <= uSteps; iu++) {
        const u = uMin + (iu / uSteps) * (1.0 - uMin);
        const [yBase, scaleBase] = sampleProfile(u);
        const wRatio = sampleWidthRatio(u);

        for (let iv = 0; iv <= vSteps; iv++) {
          const v = -1 + (iv / vSteps) * 2;
          const theta = centerAngle + v * halfSectorAngle * wRatio;

          const archDrop = (1 - Math.abs(v)) * 0.038 * (0.55 + u * 0.65);
          const thickness = isOuter ? 0.042 + archDrop : -0.018;
          const yOffset = isOuter ? (1 - Math.abs(v)) * 0.022 * Math.min(u / 0.6, 1) : -0.012;

          const curRx = rx * scaleBase + thickness;
          const curRz = rz * scaleBase + thickness * (rz / rx);

          const px = Math.cos(theta) * curRx;
          const pz = Math.sin(theta) * curRz;
          const py = yBase + yOffset;

          positions.push(px, py, pz);
        }
      }
    }

    const rowStride = vSteps + 1;
    const layerOffset = (uSteps + 1) * rowStride;

    for (let iu = 0; iu < uSteps; iu++) {
      for (let iv = 0; iv < vSteps; iv++) {
        const a = iu * rowStride + iv;
        const b = a + 1;
        const c = (iu + 1) * rowStride + iv;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);

        const ia = layerOffset + a;
        const ib = layerOffset + b;
        const ic = layerOffset + c;
        const id = layerOffset + d;
        indices.push(ia, ib, ic, ib, id, ic);
      }
    }

    for (let iu = 0; iu < uSteps; iu++) {
      const l0 = iu * rowStride;
      const l1 = (iu + 1) * rowStride;
      const il0 = layerOffset + l0;
      const il1 = layerOffset + l1;
      indices.push(l0, il0, l1, il0, il1, l1);

      const r0 = iu * rowStride + vSteps;
      const r1 = (iu + 1) * rowStride + vSteps;
      const ir0 = layerOffset + r0;
      const ir1 = layerOffset + r1;
      indices.push(r0, r1, ir0, ir0, r1, ir1);
    }

    for (let iv = 0; iv < vSteps; iv++) {
      const b0 = iv;
      const b1 = iv + 1;
      const ib0 = layerOffset + b0;
      const ib1 = layerOffset + b1;
      indices.push(b0, b1, ib0, ib0, b1, ib1);

      const topStart = uSteps * rowStride;
      const t0 = topStart + iv;
      const t1 = topStart + iv + 1;
      const it0 = layerOffset + t0;
      const it1 = layerOffset + t1;
      indices.push(t0, it0, t1, it0, it1, t1);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // ==========================================================================
  // MODELO 02 — LIXEIRA BEIRA-RIO (Oval suave n = 2, PBR físico acetinado)
  // ==========================================================================
  function buildBeiraRioBinGroup(THREE, initialWeightKg = 43850) {
    const group = new THREE.Group();
    group.name = 'Lixeira_Beira_Rio';
    const ledMeshes = [];

    const rx = 0.92;
    const rz = 0.72;
    const ovalRatioZ = rz / rx;

    const baseGreyMat = new THREE.MeshStandardMaterial({
      color: 0x8d939c,
      roughness: 0.35,
      metalness: 0.55,
    });

    // Satin automotive/industrial crimson core
    const coreRedMat = new THREE.MeshPhysicalMaterial({
      color: 0xb8141c,
      roughness: 0.3,
      metalness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });

    const coreRingRedMat = new THREE.MeshStandardMaterial({
      color: 0xc4121b,
      emissive: 0xff0a1a,
      emissiveIntensity: 0.45,
      roughness: 0.35,
      metalness: 0.12,
    });

    // Satin-matte architectural membrane off-white petals (#dce0e6)
    const membraneWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xdce0e6,
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.15,
      clearcoatRoughness: 0.35,
    });

    const topRedRimMat = new THREE.MeshPhysicalMaterial({
      color: 0xc4161e,
      roughness: 0.3,
      metalness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });

    const matteBlackMat = new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      roughness: 0.9,
      metalness: 0.05,
    });

    const baseGeo = new THREE.CylinderGeometry(0.84, 0.87, 0.11, 56);
    baseGeo.scale(1, 1, ovalRatioZ);
    const baseMesh = new THREE.Mesh(baseGeo, baseGreyMat);
    baseMesh.position.y = 0.055;
    baseMesh.userData.envMapIntensity = 0.65;
    group.add(baseMesh);

    const coreProfile = [
      new THREE.Vector2(0.8, 0.11),
      new THREE.Vector2(0.85, 0.42),
      new THREE.Vector2(0.89, 0.72),
      new THREE.Vector2(0.91, 0.94),
      new THREE.Vector2(0.8, 1.12),
      new THREE.Vector2(0.52, 1.26),
    ];
    const coreGeo = new THREE.LatheGeometry(coreProfile, 56);
    coreGeo.scale(1, 1, ovalRatioZ);
    const coreMesh = new THREE.Mesh(coreGeo, coreRedMat);
    coreMesh.userData.envMapIntensity = 0.45;
    group.add(coreMesh);

    [
      { y: 0.32, r: 0.824 },
      { y: 0.52, r: 0.854 },
      { y: 0.72, r: 0.882 },
      { y: 0.91, r: 0.898 },
    ].forEach(({ y, r }) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.011, 10, 56);
      ringGeo.rotateX(Math.PI / 2);
      ringGeo.scale(1, 1, ovalRatioZ);
      const ringMesh = new THREE.Mesh(ringGeo, coreRingRedMat);
      ringMesh.position.y = y;
      ringMesh.userData.isNeonLed = true;
      ringMesh.userData.baseEmissive = 0.45;
      ledMeshes.push(ringMesh);
      group.add(ringMesh);
    });

    const flankGap = 0.42;
    const fullCount = 19;
    const startAngle = Math.PI / 2 + flankGap;
    const spanAngle = Math.PI * 2 - flankGap * 2;
    const fullStep = spanAngle / (fullCount - 1);

    for (let i = 0; i < fullCount; i++) {
      const angle = startAngle + i * fullStep;
      const petalGeo = createBeiraRioMembranePetalGeometry(
        THREE,
        angle,
        fullStep * 0.5,
        rx,
        rz,
        0.0
      );
      const petal = new THREE.Mesh(petalGeo, membraneWhiteMat);
      petal.userData.envMapIntensity = 0.3;
      group.add(petal);
    }

    [-0.145, 0.145].forEach((offset) => {
      const petalGeo = createBeiraRioMembranePetalGeometry(
        THREE,
        Math.PI / 2 + offset,
        0.16,
        rx,
        rz,
        0.71
      );
      const petal = new THREE.Mesh(petalGeo, membraneWhiteMat);
      petal.userData.envMapIntensity = 0.3;
      group.add(petal);
    });

    const rimOuter = createOvalShape(0.54, 0.41);
    rimOuter.holes.push(createOvalHolePath(0.42, 0.27));

    const rimGeo = new THREE.ExtrudeGeometry(rimOuter, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 3,
      curveSegments: 48,
    });
    rimGeo.rotateX(-Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, topRedRimMat);
    rimMesh.position.y = 1.24;
    rimMesh.userData.envMapIntensity = 0.45;
    group.add(rimMesh);

    const chuteGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 36);
    chuteGeo.scale(1, 1, 0.64);
    const chuteMesh = new THREE.Mesh(chuteGeo, matteBlackMat);
    chuteMesh.position.y = 1.19;
    chuteMesh.userData.envMapIntensity = 0.3;
    group.add(chuteMesh);

    const pictoTex = createPictogramTexture(THREE, '#C4161E');
    const pictoMat = new THREE.MeshStandardMaterial({
      map: pictoTex,
      roughness: 0.38,
      metalness: 0.08,
    });
    const pictoPlaque = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.11), pictoMat);
    pictoPlaque.position.set(0, 1.326, -0.34);
    pictoPlaque.rotation.x = -Math.PI / 2;
    pictoPlaque.userData.envMapIntensity = 0.3;
    group.add(pictoPlaque);

    const consoleRes = buildIntegratedConsole(
      THREE,
      {
        housingHex: '#B8141C',
        housingRoughness: 0.3,
        housingMetalness: 0.15,
        housingClearcoat: 0.5,
        borderHex: null,
        slotBorderHex: '#1D5BBF',
        screenBg: '#182534',
        screenBorder: '#2463C9',
        screenAccent: '#3B82F6',
        emblemType: 'beira',
        bottomWidth: 0.68,
        topWidth: 0.62,
        topRadius: 0.14,
        height: 1.01,
        baseY: 0.11,
        zBack: 0.28,
        zFront: 0.745,
        screenW: 0.45,
        screenH: 0.25,
        footerW: 0.45,
        footerH: 0.2,
      },
      initialWeightKg
    );
    group.add(consoleRes.consoleGroup);

    applyStudioShadowAndEnvStandards(group);

    group.userData.ledMeshes = ledMeshes;
    group.userData.slotLedMeshes = consoleRes.slotLedMeshes;
    group.userData.receiptMesh = consoleRes.receiptMesh;
    group.userData.receiptBasePos = consoleRes.receiptBasePos;
    group.userData.screenState = consoleRes.screenState;
    return group;
  }

  // ==========================================================================
  // MODELO 01 — LIXEIRA ARENA DO GRÊMIO (Superelipse squircle n = 2.65, aço escovado & vidro)
  // ==========================================================================
  function buildArenaBinGroup(THREE, initialWeightKg = 45210) {
    const group = new THREE.Group();
    group.name = 'Lixeira_Arena_Gremio';
    const ledMeshes = [];

    const rx = 0.92;
    const rz = 0.72;
    const ovalRatioZ = rz / rx;
    const squircleN = 2.65;

    // Brushed aluminum/steel for base, pillars, truss & dome
    const brushedMetalMat = new THREE.MeshStandardMaterial({
      color: 0xaab1bc,
      roughness: 0.35,
      metalness: 0.55,
    });

    const darkRecessMat = new THREE.MeshStandardMaterial({
      color: 0x0d1c30,
      roughness: 0.5,
      metalness: 0.2,
    });

    // Clearcoated glass-like deep navy facade
    const navyWallTex = createNavyBandsTexture(THREE);
    const navyWallMat = new THREE.MeshPhysicalMaterial({
      map: navyWallTex,
      roughness: 0.22,
      metalness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
    });

    const domeTex = createDomeRadialTexture(THREE);
    const domeMat = new THREE.MeshStandardMaterial({
      map: domeTex,
      roughness: 0.35,
      metalness: 0.55,
    });

    const arenaBlueRimMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e5288,
      roughness: 0.28,
      metalness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });

    const matteBlackMat = new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      roughness: 0.9,
      metalness: 0.05,
    });

    const cyanLedMat = new THREE.MeshStandardMaterial({
      color: 0x7ad7ff,
      emissive: 0x4cc3ff,
      emissiveIntensity: 1.4,
      metalness: 0.05,
      roughness: 0.2,
    });

    // 1. Brushed metal squircle base (y = 0 .. 0.11)
    const baseGeo = applySquircleToGeometry(
      new THREE.CylinderGeometry(0.84, 0.87, 0.11, 64),
      ovalRatioZ,
      squircleN
    );
    const baseMesh = new THREE.Mesh(baseGeo, brushedMetalMat);
    baseMesh.position.y = 0.055;
    baseMesh.userData.envMapIntensity = 0.65;
    group.add(baseMesh);

    // 2. Inverted conical deep-navy squircle glass facade (y = 0.11 .. 0.88)
    const wallHeight = 0.77;
    const rBottom = 0.82;
    const rTop = 0.91;
    const wallGeo = applySquircleToGeometry(
      new THREE.CylinderGeometry(rTop, rBottom, wallHeight, 64),
      ovalRatioZ,
      squircleN
    );
    const wallMesh = new THREE.Mesh(wallGeo, navyWallMat);
    wallMesh.position.y = 0.11 + wallHeight / 2;
    wallMesh.userData.envMapIntensity = 0.65;
    group.add(wallMesh);

    // 3. Lower third: vertical brushed-metal pillars + mid squircle belt
    const beltY = 0.43;
    const beltR = rBottom + (rTop - rBottom) * ((beltY - 0.11) / wallHeight);

    const beltArcGap = 0.25;
    const midBeltGeo = new THREE.TorusGeometry(
      beltR + 0.008,
      0.02,
      10,
      64,
      Math.PI * 2 - beltArcGap * 2
    );
    midBeltGeo.rotateX(Math.PI / 2);
    midBeltGeo.rotateY(-(Math.PI / 2 + beltArcGap));
    applySquircleToGeometry(midBeltGeo, ovalRatioZ, squircleN);
    const midBelt = new THREE.Mesh(midBeltGeo, brushedMetalMat);
    midBelt.position.y = beltY;
    midBelt.userData.envMapIntensity = 0.65;
    group.add(midBelt);

    const pillarCount = 16;
    const pillarUp = new THREE.Vector3(0, 1, 0);
    const pillarGeo = new THREE.CylinderGeometry(0.028, 0.028, beltY - 0.09, 10);
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      if (sinA > 0.85 && Math.abs(cosA) < 0.36) continue;

      const ptBot = squirclePoint(angle, rBottom, rBottom * ovalRatioZ, squircleN);
      const ptTop = squirclePoint(angle, beltR, beltR * ovalRatioZ, squircleN);
      const pBot = new THREE.Vector3(ptBot.x, 0.1, ptBot.z);
      const pTop = new THREE.Vector3(ptTop.x, beltY, ptTop.z);
      const pDir = new THREE.Vector3().subVectors(pTop, pBot).normalize();

      const pillar = new THREE.Mesh(pillarGeo, brushedMetalMat);
      pillar.position.copy(pBot).lerp(pTop, 0.5);
      pillar.quaternion.setFromUnitVectors(pillarUp, pDir);
      pillar.userData.envMapIntensity = 0.65;
      group.add(pillar);
    }

    // 4. 3 thin horizontal sky-blue/cyan LED squircle rings tucked cleanly into console sides
    [0.23, 0.51, 0.78].forEach((y) => {
      const rAtY = rBottom + (rTop - rBottom) * ((y - 0.11) / wallHeight);
      const ringGeo = new THREE.TorusGeometry(
        rAtY + 0.005,
        0.014,
        10,
        64,
        Math.PI * 2 - beltArcGap * 2
      );
      ringGeo.rotateX(Math.PI / 2);
      ringGeo.rotateY(-(Math.PI / 2 + beltArcGap));
      applySquircleToGeometry(ringGeo, ovalRatioZ, squircleN);
      const ringMesh = new THREE.Mesh(ringGeo, cyanLedMat);
      ringMesh.position.y = y;
      ringMesh.userData.isNeonLed = true;
      ringMesh.userData.baseEmissive = 1.4;
      ledMeshes.push(ringMesh);
      group.add(ringMesh);
    });

    // 5. Compact Upper Squircle Truss Band (y = 0.86 .. 1.01) extending cleanly into console sides
    const yLow = 0.86;
    const yHigh = 1.01;
    const rLow = rTop - 0.005;
    const rHigh = rTop + 0.015;

    const recessCollarGeo = applySquircleToGeometry(
      new THREE.CylinderGeometry(rHigh - 0.015, rLow - 0.015, yHigh - yLow, 64),
      ovalRatioZ,
      squircleN
    );
    const recessCollar = new THREE.Mesh(recessCollarGeo, darkRecessMat);
    recessCollar.position.y = (yLow + yHigh) / 2;
    recessCollar.userData.envMapIntensity = 0.3;
    group.add(recessCollar);

    const trussGap = 0.23;
    [
      { y: yLow, r: rLow + 0.005 },
      { y: yHigh, r: rHigh + 0.005 },
    ].forEach(({ y, r }) => {
      const ringGeo = new THREE.TorusGeometry(
        r,
        0.018,
        10,
        64,
        Math.PI * 2 - trussGap * 2
      );
      ringGeo.rotateX(Math.PI / 2);
      ringGeo.rotateY(-(Math.PI / 2 + trussGap));
      applySquircleToGeometry(ringGeo, ovalRatioZ, squircleN);
      const ring = new THREE.Mesh(ringGeo, brushedMetalMat);
      ring.position.y = y;
      ring.userData.envMapIntensity = 0.65;
      group.add(ring);
    });

    const trussSegments = 30;
    for (let i = 0; i < trussSegments; i++) {
      const a1 = (i / trussSegments) * Math.PI * 2;
      const a2 = ((i + 1) / trussSegments) * Math.PI * 2;
      const isEven = i % 2 === 0;
      const y1 = isEven ? yLow : yHigh;
      const y2 = isEven ? yHigh : yLow;
      const r1 = isEven ? rLow : rHigh;
      const r2 = isEven ? rHigh : rLow;

      const s1 = squirclePoint(a1, r1, r1 * ovalRatioZ, squircleN);
      const s2 = squirclePoint(a2, r2, r2 * ovalRatioZ, squircleN);
      const p1 = new THREE.Vector3(s1.x, y1, s1.z);
      const p2 = new THREE.Vector3(s2.x, y2, s2.z);

      const midX = (p1.x + p2.x) * 0.5;
      const midZ = (p1.z + p2.z) * 0.5;
      if (midZ > 0.62 && Math.abs(midX) < 0.24) {
        continue;
      }

      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const strutGeo = new THREE.CylinderGeometry(0.017, 0.017, len, 8);
      const strut = new THREE.Mesh(strutGeo, brushedMetalMat);
      strut.position.copy(p1).addScaledVector(dir, 0.5);
      strut.quaternion.setFromUnitVectors(pillarUp, dir.normalize());
      strut.userData.envMapIntensity = 0.65;
      group.add(strut);
    }

    // 6. Brushed-metal squircle domed roof (y = 1.00 .. 1.29)
    const domeProfile = [
      new THREE.Vector2(0.5, 1.2),
      new THREE.Vector2(0.925, 1.0),
      new THREE.Vector2(0.945, 1.04),
      new THREE.Vector2(0.89, 1.13),
      new THREE.Vector2(0.74, 1.22),
      new THREE.Vector2(0.54, 1.285),
      new THREE.Vector2(0.5, 1.285),
      new THREE.Vector2(0.5, 1.2),
    ];
    const domeGeo = applySquircleToGeometry(
      new THREE.LatheGeometry(domeProfile, 64),
      ovalRatioZ,
      squircleN
    );
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.userData.envMapIntensity = 0.65;
    group.add(domeMesh);

    // 7. Embedded Wide Squircle-Outer / Oval-Inner Top Rim (#1e5288)
    const rimOuter = createSquircleShape(0.55, 0.43, squircleN, 64);
    rimOuter.holes.push(createOvalHolePath(0.42, 0.27));

    const rimGeo = new THREE.ExtrudeGeometry(rimOuter, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 3,
      curveSegments: 48,
    });
    rimGeo.rotateX(-Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, arenaBlueRimMat);
    rimMesh.position.y = 1.24;
    rimMesh.userData.envMapIntensity = 0.5;
    group.add(rimMesh);

    const chuteGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 36);
    chuteGeo.scale(1, 1, 0.64);
    const chuteMesh = new THREE.Mesh(chuteGeo, matteBlackMat);
    chuteMesh.position.y = 1.19;
    chuteMesh.userData.envMapIntensity = 0.3;
    group.add(chuteMesh);

    const pictoTex = createPictogramTexture(THREE, '#1E5288');
    const pictoMat = new THREE.MeshStandardMaterial({
      map: pictoTex,
      roughness: 0.38,
      metalness: 0.08,
    });
    const pictoPlaque = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.11), pictoMat);
    pictoPlaque.position.set(0, 1.326, -0.35);
    pictoPlaque.rotation.x = -Math.PI / 2;
    pictoPlaque.userData.envMapIntensity = 0.3;
    group.add(pictoPlaque);

    // 8. Integrated Trapezoidal Navy Console advanced cleanly in +Z
    const consoleRes = buildIntegratedConsole(
      THREE,
      {
        housingHex: '#183C66',
        housingRoughness: 0.28,
        housingMetalness: 0.15,
        housingClearcoat: 0.55,
        borderHex: '#AEB6C2',
        slotBorderHex: '#E01B24',
        slotEmissiveHex: '#FF1E2D',
        slotEmissiveIntensity: 0.4,
        screenBg: '#162332',
        screenBorder: '#E6222C',
        screenAccent: '#E6222C',
        emblemType: 'arena',
        bottomWidth: 0.64,
        topWidth: 0.52,
        topRadius: 0.12,
        height: 0.99,
        baseY: 0.11,
        zBack: 0.28,
        zFront: 0.78,
        screenW: 0.42,
        screenH: 0.24,
        footerW: 0.44,
        footerH: 0.19,
      },
      initialWeightKg
    );
    group.add(consoleRes.consoleGroup);

    applyStudioShadowAndEnvStandards(group);

    group.userData.ledMeshes = ledMeshes;
    group.userData.slotLedMeshes = consoleRes.slotLedMeshes;
    group.userData.receiptMesh = consoleRes.receiptMesh;
    group.userData.receiptBasePos = consoleRes.receiptBasePos;
    group.userData.screenState = consoleRes.screenState;
    return group;
  }

  function createDropItemGroup(THREE, accentColor) {
    const item = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.72,
      roughness: 0.28,
    });
    const bandMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 1.3,
      roughness: 0.28,
    });

    const canBody = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.26, 20), mat);
    const labelBand = new THREE.Mesh(new THREE.CylinderGeometry(0.089, 0.089, 0.11, 20), bandMat);
    item.add(canBody);
    item.add(labelBand);
    return item;
  }

  window.BinModels3D = {
    buildArenaBinGroup,
    buildBeiraRioBinGroup,
    updateBinScreenWeight,
    applyReceiptPrintPose,
    createDropItemGroup,
  };
})();
