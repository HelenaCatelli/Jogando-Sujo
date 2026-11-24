// Box-Free Floating Giant Three.js 3D Stadium Bin Viewer
// FOV 34 product camera, clean studio PBR (RoomEnvironment + 2048px PCFSoftShadowMap),
// transparent alpha canvas, OrbitControls, receipt slide animation on +1kg, and upright .GLB / .STL export

(function () {
  const html = window.htm.bind(React.createElement);
  const { useState, useEffect, useRef } = React;

  function triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function prepareExportClone(sourceGroup, format) {
    const clone = sourceGroup.clone(true);
    clone.position.set(0, 0, 0);
    clone.scale.set(1, 1, 1);

    if (format === 'stl') {
      // STL / CAD / 3D slicers expect Z-up: rotate +90deg around X from Y-up
      clone.rotation.set(Math.PI / 2, 0, 0);
    } else {
      // glTF / .GLB official standard is Y-up
      clone.rotation.set(0, 0, 0);
    }

    clone.updateMatrixWorld(true);
    return clone;
  }

  function exportStadiumBin3D(targetModelKey, format, liveGroup, activeBin, modelWeightKg, onStatus) {
    if (!window.ThreeKit || !window.BinModels3D) return;
    const { THREE, GLTFExporter, STLExporter } = window.ThreeKit;

    const sourceGroup =
      targetModelKey === activeBin && liveGroup
        ? liveGroup
        : targetModelKey === 'gremio'
        ? window.BinModels3D.buildArenaBinGroup(THREE, modelWeightKg)
        : window.BinModels3D.buildBeiraRioBinGroup(THREE, modelWeightKg);

    const exportGroup = prepareExportClone(sourceGroup, format);
    const baseName =
      targetModelKey === 'gremio' ? 'lixeira-arena-gremio' : 'lixeira-beira-rio';

    if (format === 'glb') {
      const exporter = new GLTFExporter();
      if (onStatus) onStatus(`Gerando ${baseName}.glb...`);
      exporter.parse(
        exportGroup,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            triggerBlobDownload(blob, `${baseName}.glb`);
            if (onStatus) onStatus(`Baixado: ${baseName}.glb`);
          }
        },
        (err) => {
          console.error('GLTFExporter error:', err);
          if (onStatus) onStatus('Erro ao exportar .GLB.');
        },
        { binary: true }
      );
    } else if (format === 'stl') {
      const exporter = new STLExporter();
      if (onStatus) onStatus(`Gerando ${baseName}.stl...`);
      const stlBuffer = exporter.parse(exportGroup, { binary: true });
      const blob = new Blob([stlBuffer], { type: 'application/octet-stream' });
      triggerBlobDownload(blob, `${baseName}.stl`);
      if (onStatus) onStatus(`Baixado: ${baseName}.stl`);
    }
  }

  window.exportStadiumBin3D = exportStadiumBin3D;

  function StadiumBinVisual({ activeBin, scores, onSelectBin, dropTrigger, liveGroupRef }) {
    const [threeReady, setThreeReady] = useState(Boolean(window.ThreeKit));
    const [sceneError, setSceneError] = useState(null);

    const mountRef = useRef(null);
    const sceneCtxRef = useRef(null);
    const binGroupRef = useRef(null);
    const dropAnimRef = useRef(null);
    const scoresRef = useRef(scores);

    useEffect(() => {
      scoresRef.current = scores;
    }, [scores]);

    useEffect(() => {
      if (window.ThreeKit) {
        setThreeReady(true);
        return undefined;
      }
      function onReady() {
        setThreeReady(true);
      }
      window.addEventListener('threekit-ready', onReady);
      return () => window.removeEventListener('threekit-ready', onReady);
    }, []);

    // Initialize transparent-background WebGLRenderer + RoomEnvironment + Clean Studio Lighting
    useEffect(() => {
      if (!threeReady || !mountRef.current) return undefined;
      const container = mountRef.current;
      const { THREE, OrbitControls, RoomEnvironment } = window.ThreeKit;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
      } catch (err) {
        setSceneError('WebGL indisponível neste navegador para renderizar o modelo 3D.');
        return undefined;
      }

      const width = container.clientWidth || 620;
      const height = container.clientHeight || 560;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      // Moderate RoomEnvironment IBL
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
      scene.environment = envRenderTarget.texture;
      roomEnv.dispose();
      pmremGenerator.dispose();

      // FOV 34 product camera slightly elevated looking cleanly at center (~0.74)
      const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
      camera.position.set(1.85, 2.2, 3.4);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.9;
      controls.minPolarAngle = 0.3;
      controls.maxPolarAngle = Math.PI / 2 + 0.06;
      controls.target.set(0, 0.74, 0);
      controls.update();

      // Dark Editorial Photographic Studio Rig (high contrast, crisp silhouettes, LED bounce)
      const keyLight = new THREE.DirectionalLight(0xfff6ee, 2.6);
      keyLight.position.set(4.5, 6.5, 5.0);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.radius = 4;
      keyLight.shadow.camera.left = -1.8;
      keyLight.shadow.camera.right = 1.8;
      keyLight.shadow.camera.top = 1.8;
      keyLight.shadow.camera.bottom = -1.8;
      keyLight.shadow.camera.near = 1.0;
      keyLight.shadow.camera.far = 16.0;
      keyLight.shadow.bias = -0.0004;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xb8d4ff, 0.45);
      fillLight.position.set(-5.0, 3.0, 2.0);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
      rimLight.position.set(0.0, 5.0, -6.0);
      scene.add(rimLight);

      // 2 short-range colored LED bounce PointLights near ribs/LED strips
      const ledBounceA = new THREE.PointLight(0x0095ff, 1.1, 2.2, 2);
      ledBounceA.position.set(0.95, 0.65, 0.45);
      scene.add(ledBounceA);

      const ledBounceB = new THREE.PointLight(0x0095ff, 1.1, 2.2, 2);
      ledBounceB.position.set(-0.95, 0.65, -0.45);
      scene.add(ledBounceB);

      // Invisible shadow-catcher plane at y = 0 anchoring the bin weight
      const shadowGroundGeo = new THREE.CircleGeometry(2.4, 48);
      shadowGroundGeo.rotateX(-Math.PI / 2);
      const shadowGroundMat = new THREE.ShadowMaterial({ opacity: 0.55 });
      const shadowGround = new THREE.Mesh(shadowGroundGeo, shadowGroundMat);
      shadowGround.position.y = 0.0;
      shadowGround.receiveShadow = true;
      scene.add(shadowGround);

      const floorRingGeo = new THREE.RingGeometry(1.12, 1.15, 64);
      floorRingGeo.rotateX(-Math.PI / 2);
      const floorRingMat = new THREE.MeshBasicMaterial({
        color: 0x0095ff,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
      });
      const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat);
      floorRing.position.y = -0.005;
      scene.add(floorRing);

      sceneCtxRef.current = {
        scene,
        camera,
        renderer,
        controls,
        ledBounceA,
        ledBounceB,
        floorRingMat,
      };

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          }
        }
      });
      resizeObserver.observe(container);

      let frameId = null;
      const clock = new THREE.Clock();

      function animate() {
        frameId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);

        if (dropAnimRef.current) {
          const anim = dropAnimRef.current;
          anim.elapsed += dt;
          const progress = Math.min(anim.elapsed / anim.duration, 1);

          // 1. Falling recyclable can into top opening
          if (!anim.canRemoved) {
            const eased = progress * progress;
            anim.mesh.position.y = anim.startY + (anim.endY - anim.startY) * eased;
            anim.mesh.rotation.x += dt * 7;
            anim.mesh.rotation.z += dt * 5;
            if (progress >= 1) {
              scene.remove(anim.mesh);
              anim.canRemoved = true;
            }
          }

          // 2. Brief receipt slide out & back inside clean slot after impact
          if (progress >= 0.72) {
            anim.fxElapsed += dt;
            const fxDuration = 1.1;
            const fxT = Math.min(anim.fxElapsed / fxDuration, 1);
            const activeGroup = binGroupRef.current;

            if (activeGroup && activeGroup.userData) {
              if (activeGroup.userData.receiptMesh && activeGroup.userData.receiptBasePos) {
                const receipt = activeGroup.userData.receiptMesh;
                const basePos = activeGroup.userData.receiptBasePos;
                receipt.visible = true;
                const slideCurve = Math.sin(fxT * Math.PI);
                receipt.position.z = basePos.z - 0.03 + slideCurve * 0.075;
                receipt.position.y = basePos.y - slideCurve * 0.035;
              }

              if (activeGroup.userData.ledMeshes) {
                const pulseBoost = 1 + Math.sin(fxT * Math.PI) * 0.4;
                activeGroup.userData.ledMeshes.forEach((m) => {
                  const baseE = m.userData.baseEmissive || 1.4;
                  m.material.emissiveIntensity = baseE * pulseBoost;
                });
              }
            }

            if (fxT >= 1) {
              if (activeGroup && activeGroup.userData) {
                if (activeGroup.userData.receiptMesh) {
                  activeGroup.userData.receiptMesh.visible = false;
                }
                if (activeGroup.userData.ledMeshes) {
                  activeGroup.userData.ledMeshes.forEach((m) => {
                    m.material.emissiveIntensity = m.userData.baseEmissive || 1.4;
                  });
                }
              }
              dropAnimRef.current = null;
            }
          }
        }

        controls.update();
        renderer.render(scene, camera);
      }

      animate();

      return () => {
        if (frameId) cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        controls.dispose();
        envRenderTarget.dispose();
        renderer.dispose();
        sceneCtxRef.current = null;
      };
    }, [threeReady]);

    // Swap active procedural 3D bin mesh & LED bounce light color whenever activeBin changes
    useEffect(() => {
      if (!threeReady || !sceneCtxRef.current || !window.BinModels3D) return;
      const { THREE } = window.ThreeKit;
      const { scene, ledBounceA, ledBounceB, floorRingMat } = sceneCtxRef.current;

      if (binGroupRef.current) {
        scene.remove(binGroupRef.current);
        binGroupRef.current = null;
      }

      const isArena = activeBin === 'gremio';
      const currentWeight = scoresRef.current ? scoresRef.current[activeBin] : undefined;
      const newGroup = isArena
        ? window.BinModels3D.buildArenaBinGroup(THREE, currentWeight)
        : window.BinModels3D.buildBeiraRioBinGroup(THREE, currentWeight);

      scene.add(newGroup);
      binGroupRef.current = newGroup;
      if (liveGroupRef) liveGroupRef.current = newGroup;

      const ledBounceHex = isArena ? 0x0095ff : 0xff1122;
      ledBounceA.color.setHex(ledBounceHex);
      ledBounceB.color.setHex(ledBounceHex);
      floorRingMat.color.setHex(ledBounceHex);
    }, [threeReady, activeBin, liveGroupRef]);

    // Update live CanvasTexture screen readout whenever scoreboard numbers change
    useEffect(() => {
      if (!threeReady || !binGroupRef.current || !window.BinModels3D || !scores) return;
      window.BinModels3D.updateBinScreenWeight(binGroupRef.current, scores[activeBin]);
    }, [threeReady, activeBin, scores]);

    // Trigger 3D falling recyclable + brief receipt slide animation
    useEffect(() => {
      if (!dropTrigger || !threeReady || !sceneCtxRef.current || !window.BinModels3D) return;
      const { THREE } = window.ThreeKit;
      const { scene } = sceneCtxRef.current;

      if (dropAnimRef.current && dropAnimRef.current.mesh && !dropAnimRef.current.canRemoved) {
        scene.remove(dropAnimRef.current.mesh);
      }

      const accent = activeBin === 'gremio' ? 0x0099ff : 0xe6192e;
      const dropMesh = window.BinModels3D.createDropItemGroup(THREE, accent);
      dropMesh.position.set(0, 2.85, 0);
      scene.add(dropMesh);

      dropAnimRef.current = {
        mesh: dropMesh,
        startY: 2.75,
        endY: 1.16,
        elapsed: 0,
        duration: 0.5,
        canRemoved: false,
        fxElapsed: 0,
      };
    }, [dropTrigger, threeReady, activeBin]);

    const isArena = activeBin === 'gremio';

    return html`
      <div className="relative w-full">
        <!-- Subtle ambient stadium halo behind floating 3D object (zero border/box) -->
        <div
          className="pointer-events-none absolute inset-12 rounded-full blur-[120px] opacity-20 transition-all duration-700"
          style=${{
            background: isArena
              ? 'radial-gradient(circle, rgba(0, 153, 255, 0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(230, 25, 46, 0.5) 0%, transparent 70%)'
          }}
        />

        <!-- Box-Free Transparent 3D Viewport -->
        <div
          ref=${mountRef}
          className="relative z-10 w-full h-[420px] sm:h-[520px] lg:h-[600px] cursor-grab active:cursor-grabbing"
          aria-label=${`Visualizador 3D interativo da lixeira ${isArena ? 'Arena do Grêmio' : 'Estádio Beira-Rio'}`}
        >
          ${!threeReady &&
          !sceneError &&
          html`
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#8B95A5] text-xs">
              <div className="w-6 h-6 rounded-full border border-white/20 border-t-white animate-spin" />
              <span>Carregando modelo 3D...</span>
            </div>
          `}
          ${sceneError &&
          html`
            <div className="w-full h-full flex items-center justify-center p-6 text-center text-xs text-[#8B95A5]">
              ${sceneError}
            </div>
          `}
        </div>

        <!-- Floating Bottom-Right Thumbnails & Drag Hint -->
        <div className="relative z-20 mt-2 lg:mt-0 lg:absolute lg:bottom-4 lg:right-2 flex flex-col items-start lg:items-end gap-3">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#8B95A5]">
            Arraste para girar 360°
          </span>

          <div className="flex items-center gap-2.5" role="group" aria-label="Selecionar modelo 3D">
            <button
              type="button"
              onClick=${() => onSelectBin('gremio')}
              className=${`px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-[0.12em] uppercase backdrop-blur-md transition-all cursor-pointer border ${
                isArena
                  ? 'bg-white/[0.09] border-[#0099FF] text-[#F5F7FA]'
                  : 'bg-white/[0.03] border-white/[0.12] text-[#8B95A5] hover:text-[#F5F7FA]'
              }`}
            >
              01. Lixeira Arena
            </button>
            <button
              type="button"
              onClick=${() => onSelectBin('inter')}
              className=${`px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-[0.12em] uppercase backdrop-blur-md transition-all cursor-pointer border ${
                !isArena
                  ? 'bg-white/[0.09] border-[#E6192E] text-[#F5F7FA]'
                  : 'bg-white/[0.03] border-white/[0.12] text-[#8B95A5] hover:text-[#F5F7FA]'
              }`}
            >
              02. Lixeira Beira-Rio
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.StadiumBinVisual = StadiumBinVisual;
})();
