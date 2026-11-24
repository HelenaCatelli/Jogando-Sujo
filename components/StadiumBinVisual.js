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
    clone.traverse((obj) => {
      if (obj.userData && obj.userData.receiptMeta) {
        obj.visible = false;
      }
    });

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
    const cameraTweenRef = useRef(null);
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

      // FOV 34 product camera slightly elevated & backed out so floor ring clears bottom buttons
      const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
      camera.position.set(1.98, 2.34, 3.68);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.9;
      controls.minPolarAngle = 0.3;
      controls.maxPolarAngle = Math.PI / 2 + 0.06;
      controls.target.set(0, 0.58, 0);
      controls.update();

      const onControlStart = () => {
        cameraTweenRef.current = null;
      };
      controls.addEventListener('start', onControlStart);

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

      const floorRingGeo = new THREE.RingGeometry(0.86, 0.89, 64);
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

      function resetReceiptAndLeds(group) {
        if (!group || !group.userData) return;
        const receipt = group.userData.receiptMesh;
        if (receipt) {
          receipt.visible = false;
          receipt.material.opacity = 1;
          receipt.rotation.set(0, 0, 0);
          if (receipt.userData.receiptMeta) {
            receipt.position.set(0, receipt.userData.receiptMeta.baseY, receipt.userData.receiptMeta.baseZ);
          }
          if (window.BinModels3D && window.BinModels3D.applyReceiptPrintPose) {
            window.BinModels3D.applyReceiptPrintPose(receipt, 0, 0, 0);
          }
        }
        if (group.userData.ledMeshes) {
          group.userData.ledMeshes.forEach((m) => {
            m.material.emissiveIntensity = m.userData.baseEmissive || 1.4;
          });
        }
        if (group.userData.slotLedMeshes) {
          group.userData.slotLedMeshes.forEach((m) => {
            m.material.emissiveIntensity =
              m.userData.baseEmissive !== undefined ? m.userData.baseEmissive : 0.18;
          });
        }
      }

      function animate() {
        frameId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);

        // Smooth camera auto-framing tween to front three-quarter view when printing triggers
        if (cameraTweenRef.current && cameraTweenRef.current.active) {
          const tween = cameraTweenRef.current;
          tween.elapsed += dt;
          const u = Math.min(tween.elapsed / tween.duration, 1);
          const ease = 1 - Math.pow(1 - u, 3);
          camera.position.lerpVectors(tween.startPos, tween.endPos, ease);
          controls.target.lerpVectors(tween.startTarget, tween.endTarget, ease);
          if (u >= 1) {
            cameraTweenRef.current = null;
          }
        }

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

          // 2. Thermal receipt printing -> pendular sway -> gentle release/fade
          if (progress >= 0.7) {
            anim.fxElapsed += dt;
            const printDur = 0.65;
            const swayDur = 1.75;
            const fadeDur = 0.65;
            const totalFxDur = printDur + swayDur + fadeDur;
            const activeGroup = binGroupRef.current;

            if (activeGroup && activeGroup.userData) {
              const receipt = activeGroup.userData.receiptMesh;
              const basePos = activeGroup.userData.receiptBasePos;

              if (receipt && basePos) {
                receipt.visible = true;

                if (anim.fxElapsed <= printDur) {
                  // Phase A: Progressive thermal printing with outward curl
                  const p = Math.min(anim.fxElapsed / printDur, 1);
                  const easedPrint = 1 - Math.pow(1 - p, 2.2);
                  receipt.material.opacity = 1;
                  receipt.position.set(0, basePos.y, basePos.z);
                  receipt.rotation.set(0, 0, Math.sin(p * Math.PI * 5) * 0.008);
                  if (window.BinModels3D && window.BinModels3D.applyReceiptPrintPose) {
                    window.BinModels3D.applyReceiptPrintPose(receipt, easedPrint, anim.fxElapsed, 0.005);
                  }
                } else if (anim.fxElapsed <= printDur + swayDur) {
                  // Phase B: Printed receipt hangs with natural damped pendular sway
                  const sT = anim.fxElapsed - printDur;
                  const decay = Math.exp(-sT * 1.15);
                  const swayZ = Math.sin(sT * 3.8) * 0.028 * decay;
                  receipt.material.opacity = 1;
                  receipt.position.set(0, basePos.y, basePos.z);
                  receipt.rotation.set(0, 0, swayZ);
                  if (window.BinModels3D && window.BinModels3D.applyReceiptPrintPose) {
                    window.BinModels3D.applyReceiptPrintPose(receipt, 1, anim.fxElapsed, 0.016 * decay);
                  }
                } else {
                  // Phase C: Gentle detachment drop & opacity fade out
                  const fT = Math.min((anim.fxElapsed - printDur - swayDur) / fadeDur, 1);
                  const fallEase = fT * fT;
                  receipt.material.opacity = Math.max(0, 1 - Math.pow(fT, 1.3));
                  receipt.position.set(0, basePos.y - fallEase * 0.24, basePos.z + fallEase * 0.05);
                  receipt.rotation.set(fallEase * 0.16, 0, 0);
                  if (window.BinModels3D && window.BinModels3D.applyReceiptPrintPose) {
                    window.BinModels3D.applyReceiptPrintPose(receipt, 1, anim.fxElapsed, 0.004);
                  }
                }
              }

              // Subtle slot LED flash at print start + stadium body LED pulse
              if (activeGroup.userData.slotLedMeshes) {
                const slotFlash =
                  anim.fxElapsed < 0.7
                    ? Math.sin((anim.fxElapsed / 0.7) * Math.PI) * 1.65
                    : 0;
                activeGroup.userData.slotLedMeshes.forEach((m) => {
                  const baseE = m.userData.baseEmissive !== undefined ? m.userData.baseEmissive : 0.18;
                  m.material.emissiveIntensity = baseE + slotFlash;
                });
              }

              if (activeGroup.userData.ledMeshes) {
                const pulseEnvelope =
                  anim.fxElapsed < 1.1 ? Math.sin((anim.fxElapsed / 1.1) * Math.PI) * 0.45 : 0;
                activeGroup.userData.ledMeshes.forEach((m) => {
                  const baseE = m.userData.baseEmissive || 1.4;
                  m.material.emissiveIntensity = baseE * (1 + pulseEnvelope);
                });
              }
            }

            if (anim.fxElapsed >= totalFxDur) {
              resetReceiptAndLeds(activeGroup);
              controls.autoRotate = true;
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
        controls.removeEventListener('start', onControlStart);
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
      const { scene, controls, ledBounceA, ledBounceB, floorRingMat } = sceneCtxRef.current;

      if (dropAnimRef.current && dropAnimRef.current.mesh && !dropAnimRef.current.canRemoved) {
        scene.remove(dropAnimRef.current.mesh);
      }
      dropAnimRef.current = null;
      controls.autoRotate = true;

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

    // Trigger 3D falling recyclable + auto-frame camera + thermal receipt print animation
    useEffect(() => {
      if (!dropTrigger || !threeReady || !sceneCtxRef.current || !window.BinModels3D) return;
      const { THREE } = window.ThreeKit;
      const { scene, camera, controls } = sceneCtxRef.current;

      if (dropAnimRef.current && dropAnimRef.current.mesh && !dropAnimRef.current.canRemoved) {
        scene.remove(dropAnimRef.current.mesh);
      }

      // Reset prior receipt pose immediately on rapid repeat clicks
      if (binGroupRef.current && binGroupRef.current.userData && binGroupRef.current.userData.receiptMesh) {
        const prevReceipt = binGroupRef.current.userData.receiptMesh;
        prevReceipt.visible = false;
        prevReceipt.material.opacity = 1;
        prevReceipt.rotation.set(0, 0, 0);
        if (prevReceipt.userData.receiptMeta) {
          prevReceipt.position.set(
            0,
            prevReceipt.userData.receiptMeta.baseY,
            prevReceipt.userData.receiptMeta.baseZ
          );
        }
        if (window.BinModels3D.applyReceiptPrintPose) {
          window.BinModels3D.applyReceiptPrintPose(prevReceipt, 0, 0, 0);
        }
      }

      // Auto-frame camera smoothly back to front/three-quarter view so console & receipt are visible
      controls.autoRotate = false;
      cameraTweenRef.current = {
        active: true,
        elapsed: 0,
        duration: 0.5,
        startPos: camera.position.clone(),
        endPos: new THREE.Vector3(1.52, 2.12, 3.88),
        startTarget: controls.target.clone(),
        endTarget: new THREE.Vector3(0, 0.58, 0),
      };

      const accent = activeBin === 'gremio' ? 0x0099ff : 0xe6192e;
      const dropMesh = window.BinModels3D.createDropItemGroup(THREE, accent);
      dropMesh.position.set(0, 2.85, 0);
      scene.add(dropMesh);

      dropAnimRef.current = {
        mesh: dropMesh,
        startY: 2.75,
        endY: 1.16,
        elapsed: 0,
        duration: 0.45,
        canRemoved: false,
        fxElapsed: 0,
      };
    }, [dropTrigger, threeReady, activeBin]);

    const isArena = activeBin === 'gremio';

    return html`
      <div className="relative w-full">
        <!-- Wide, soft atmospheric radial studio backdrop (graphite core + team tint fading cleanly to transparent) -->
        <div
          className="pointer-events-none absolute -inset-16 sm:-inset-24"
          style=${{
            background:
              'radial-gradient(ellipse 68% 62% at 50% 48%, rgba(20, 24, 32, 0.92) 0%, rgba(20, 24, 32, 0.42) 44%, rgba(7, 8, 10, 0) 74%)',
          }}
        />
        <div
          className="pointer-events-none absolute -inset-16 sm:-inset-24 transition-opacity duration-[600ms] ease-out"
          style=${{
            opacity: isArena ? 1 : 0,
            background:
              'radial-gradient(ellipse 60% 56% at 50% 46%, rgba(0, 149, 255, 0.19) 0%, rgba(0, 149, 255, 0.08) 38%, rgba(0, 149, 255, 0) 72%)',
          }}
        />
        <div
          className="pointer-events-none absolute -inset-16 sm:-inset-24 transition-opacity duration-[600ms] ease-out"
          style=${{
            opacity: !isArena ? 1 : 0,
            background:
              'radial-gradient(ellipse 60% 56% at 50% 46%, rgba(230, 34, 44, 0.19) 0%, rgba(230, 34, 44, 0.08) 38%, rgba(230, 34, 44, 0) 72%)',
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
