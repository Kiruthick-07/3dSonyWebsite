"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TOTAL_FRAMES = 118;

function getFrameSrc(index: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index + 1));
  return `/frames/ezgif-frame-${String(clamped).padStart(3, "0")}.jpg`;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Maps normalized scroll progress [0..1] to the 118-frame disassembly -> reassembly sequence.
 * 0.00 - 0.15: Hero rim-light sweep (frames 0 -> 26)
 * 0.15 - 0.40: Engineering separation (frames 26 -> 60)
 * 0.40 - 0.65: ANC & mic module spread (frames 60 -> 96)
 * 0.65 - 0.85: Full exploded driver/coil diagram (frames 96 -> 117)
 * 0.85 - 0.96: Graceful reassembly (frames 117 -> 0)
 * 0.96 - 1.00: Final assembled hero lock (frame 0)
 */
function scrollProgressToFrame(p: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  if (clamped <= 0.15) {
    return (clamped / 0.15) * 26;
  }
  if (clamped <= 0.4) {
    return 26 + ((clamped - 0.15) / 0.25) * (60 - 26);
  }
  if (clamped <= 0.65) {
    return 60 + ((clamped - 0.4) / 0.25) * (96 - 60);
  }
  if (clamped <= 0.85) {
    return 96 + ((clamped - 0.65) / 0.2) * (117 - 96);
  }
  if (clamped <= 0.96) {
    const t = easeInOutCubic((clamped - 0.85) / 0.11);
    return 117 * (1 - t);
  }
  return 0;
}

interface HeadphoneCanvasStageProps {
  stageRef: React.RefObject<HTMLDivElement>;
  onSeeSpecs: () => void;
  onExperienceClick: () => void;
  onJumpToProgress: (progress: number) => void;
}

const STORY_STEPS = [
  { id: "hero", label: "Overview", progress: 0.02 },
  { id: "engineering", label: "Architecture", progress: 0.27 },
  { id: "anc", label: "Noise Cancelling", progress: 0.52 },
  { id: "sound", label: "Acoustics", progress: 0.75 },
  { id: "reassembly", label: "WH‑1000XM6", progress: 0.97 },
];

export default function HeadphoneCanvasStage({
  stageRef,
  onSeeSpecs,
  onExperienceClick,
  onJumpToProgress,
}: HeadphoneCanvasStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  const [loadProgress, setLoadProgress] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  // Beat 1: Hero / Intro (0 - 15%)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.16], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -28]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Beat 2: Engineering Reveal (15 - 40%)
  const engOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.21, 0.34, 0.41],
    [0, 1, 1, 0]
  );
  const engX = useTransform(scrollYProgress, [0.14, 0.22, 0.41], [-36, 0, -16]);

  // Beat 3: Noise Cancelling & Microphones (40 - 65%)
  const ancOpacity = useTransform(
    scrollYProgress,
    [0.39, 0.46, 0.59, 0.66],
    [0, 1, 1, 0]
  );
  const ancX = useTransform(scrollYProgress, [0.39, 0.47, 0.66], [36, 0, 16]);

  // Beat 4: Sound & Upscaling (65 - 85%)
  const soundOpacity = useTransform(
    scrollYProgress,
    [0.64, 0.71, 0.8, 0.86],
    [0, 1, 1, 0]
  );
  const soundY = useTransform(scrollYProgress, [0.64, 0.71, 0.86], [24, 0, -20]);

  // Beat 5: Reassembly & CTA (85 - 100%)
  const ctaOpacity = useTransform(scrollYProgress, [0.87, 0.94, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.87, 0.95], [26, 0]);
  const ctaScale = useTransform(scrollYProgress, [0.87, 0.95], [0.98, 1]);

  // Draw frame to canvas with seamless #050505 void edge-blending
  const drawFrame = useCallback((frameFloat: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameFloat)));
    let img = imagesRef.current[idx];

    // Fallback to nearest loaded frame if user scrubs faster than initial load
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = idx - offset >= 0 ? imagesRef.current[idx - offset] : null;
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next =
          idx + offset < TOTAL_FRAMES ? imagesRef.current[idx + offset] : null;
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;

    // Pure #050505 void base
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Smart responsive contain-fit so full exploded diagram never clips horizontally
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scaleContain = Math.min(w / iw, h / ih);
    const drawW = iw * scaleContain;
    const drawH = ih * scaleContain;
    const dx = (w - drawW) * 0.5;
    const dy = (h - drawH) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, drawW, drawH);

    // Subtle bottom-right corner blend into #050505 to dissolve studio mark cleanly
    const markRadius = Math.max(drawW, drawH) * 0.14;
    const markX = dx + drawW * 0.945;
    const markY = dy + drawH * 0.895;
    const cornerMask = ctx.createRadialGradient(
      markX,
      markY,
      markRadius * 0.08,
      markX,
      markY,
      markRadius
    );
    cornerMask.addColorStop(0, "rgba(5, 5, 5, 1)");
    cornerMask.addColorStop(0.55, "rgba(5, 5, 5, 0.92)");
    cornerMask.addColorStop(1, "rgba(5, 5, 5, 0)");
    ctx.fillStyle = cornerMask;
    ctx.fillRect(
      markX - markRadius,
      markY - markRadius,
      markRadius * 2,
      markRadius * 2
    );

    // Edge-feathering gradients so 16:9 image perimeter dissolves 100% invisibly into #050505
    const fadeTop = ctx.createLinearGradient(0, dy, 0, dy + drawH * 0.14);
    fadeTop.addColorStop(0, "rgba(5,5,5,1)");
    fadeTop.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = fadeTop;
    ctx.fillRect(dx, dy, drawW, drawH * 0.14);

    const fadeBottom = ctx.createLinearGradient(
      0,
      dy + drawH * 0.82,
      0,
      dy + drawH
    );
    fadeBottom.addColorStop(0, "rgba(5,5,5,0)");
    fadeBottom.addColorStop(1, "rgba(5,5,5,1)");
    ctx.fillStyle = fadeBottom;
    ctx.fillRect(dx, dy + drawH * 0.82, drawW, drawH * 0.18);

    const fadeLeft = ctx.createLinearGradient(dx, 0, dx + drawW * 0.08, 0);
    fadeLeft.addColorStop(0, "rgba(5,5,5,1)");
    fadeLeft.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = fadeLeft;
    ctx.fillRect(dx, dy, drawW * 0.08, drawH);

    const fadeRight = ctx.createLinearGradient(
      dx + drawW * 0.92,
      0,
      dx + drawW,
      0
    );
    fadeRight.addColorStop(0, "rgba(5,5,5,0)");
    fadeRight.addColorStop(1, "rgba(5,5,5,1)");
    ctx.fillStyle = fadeRight;
    ctx.fillRect(dx + drawW * 0.92, dy, drawW * 0.08, drawH);
  }, []);

  // Priority-queued image preloader
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;

    // Build load order: frame 0, 117, every 6th keyframe, then remaining frames
    const order: number[] = [];
    const seen = new Set<number>();
    const pushIdx = (i: number) => {
      if (i >= 0 && i < TOTAL_FRAMES && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    pushIdx(0);
    pushIdx(117);
    for (let i = 0; i < TOTAL_FRAMES; i += 6) pushIdx(i);
    for (let i = 0; i < TOTAL_FRAMES; i++) pushIdx(i);

    const loadSingle = (idx: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            imagesRef.current[idx] = img;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            if (idx === 0) {
              setFirstFrameReady(true);
              lastDrawnFrameRef.current = -1;
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = getFrameSrc(idx);
      });

    // Load first hero frame immediately, then batch rest cleanly (8 concurrent)
    (async () => {
      await loadSingle(0);
      const rest = order.slice(1);
      const concurrency = 8;
      let cursor = 0;
      const workers = Array.from({ length: concurrency }, async () => {
        while (!cancelled && cursor < rest.length) {
          const nextIdx = rest[cursor++];
          await loadSingle(nextIdx);
        }
      });
      await Promise.all(workers);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Resize canvas to crisp HiDPI viewport dimensions
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      lastDrawnFrameRef.current = -1;
      drawFrame(currentFrameRef.current);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [drawFrame]);

  // Subscribe to scroll progress & run silky rAF lerp loop
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (p) => {
      targetFrameRef.current = scrollProgressToFrame(p);
      if (p < 0.15) setActiveBeatIndex(0);
      else if (p < 0.4) setActiveBeatIndex(1);
      else if (p < 0.65) setActiveBeatIndex(2);
      else if (p < 0.85) setActiveBeatIndex(3);
      else setActiveBeatIndex(4);
    });

    let rafId = 0;
    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.04) {
        currentFrameRef.current = current + diff * 0.18;
      } else {
        currentFrameRef.current = target;
      }

      const rounded = Math.round(currentFrameRef.current);
      if (
        rounded !== lastDrawnFrameRef.current ||
        (firstFrameReady && lastDrawnFrameRef.current === -1)
      ) {
        drawFrame(currentFrameRef.current);
        lastDrawnFrameRef.current = rounded;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      unsub();
      cancelAnimationFrame(rafId);
    };
  }, [drawFrame, firstFrameReady, scrollYProgress]);

  return (
    <section
      ref={stageRef}
      id="overview"
      aria-label="WH-1000XM6 Interactive Disassembly Showcase"
      className="relative h-[460vh] w-full bg-[#050505]"
    >
      {/* Top hairline asset preloader */}
      {loadProgress < 100 && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] transition-all duration-200"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      )}

      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        {/* Extremely subtle radial studio aura behind product */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_52%_at_50%_48%,rgba(5,8,21,0.85)_0%,rgba(5,5,5,0)_75%)]"
        />

        {/* Subtle architectural alignment hairlines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            maskImage:
              "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 80%)",
          }}
        />

        {/* HTML5 Canvas Image Sequence Renderer */}
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          aria-label="Sony WH-1000XM6 3D exploded sequence"
        />

        {/* Ambient radial dark vignette overlay for seamless edge blending */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,5,0.72)_88%,#050505_100%)]"
        />

        {/* ============================================================ */}
        {/* BEAT 1: HERO / INTRO (0 - 15% scroll)                        */}
        {/* ============================================================ */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between px-6 pt-20 pb-10 text-center sm:pt-24 sm:pb-12"
        >
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00D6FF] shadow-[0_0_8px_#00D6FF]" />
              <span className="text-[10.5px] font-medium tracking-[0.22em] text-white/70 uppercase">
                Flagship Wireless Noise Cancelling
              </span>
            </div>

            <h1 className="text-headline-gradient text-5xl font-semibold tracking-[-0.04em] sm:text-7xl md:text-[5.25rem] md:leading-[1.02]">
              Sony WH‑1000XM6
            </h1>

            <p className="mt-3 text-xl font-medium tracking-[-0.02em] text-white/90 sm:text-2xl">
              Silence, perfected.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
              Flagship wireless noise cancelling, re‑engineered for a world that
              never stops.
            </p>

            <motion.div
              style={{ opacity: scrollHintOpacity }}
              className="flex flex-col items-center gap-2 pt-1"
            >
              <span className="text-[10px] font-medium tracking-[0.24em] text-white/40 uppercase">
                Scroll to disassemble
              </span>
              <div className="h-7 w-[1px] overflow-hidden bg-white/15">
                <motion.div
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-1/2 w-full bg-gradient-to-b from-transparent via-[#00D6FF] to-transparent"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* BEAT 2: ENGINEERING REVEAL (15 - 40% scroll)                 */}
        {/* ============================================================ */}
        <motion.div
          style={{ opacity: engOpacity, x: engX }}
          className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center px-6 sm:px-12 lg:px-20"
        >
          <div className="relative max-w-md rounded-2xl border border-white/[0.06] bg-[#050505]/60 p-6 backdrop-blur-md sm:p-8">
            <div className="absolute -left-px top-6 bottom-6 w-[2px] rounded-full bg-gradient-to-b from-[#0050FF] via-[#00D6FF] to-transparent" />

            <p className="text-[11px] font-medium tracking-[0.2em] text-[#00D6FF]/90 uppercase">
              01 / Acoustic Architecture
            </p>
            <h2 className="text-headline-gradient mt-2.5 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
              Precision-engineered for silence.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60 sm:text-base">
              Custom drivers, sealed acoustic chambers, and optimized airflow
              deliver studio-grade clarity.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60 sm:text-base">
              Every component is tuned for balance, power, and comfort—hour
              after hour.
            </p>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* BEAT 3: NOISE CANCELLING & MICROPHONES (40 - 65% scroll)     */}
        {/* ============================================================ */}
        <motion.div
          style={{ opacity: ancOpacity, x: ancX }}
          className="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center px-6 sm:px-12 lg:px-20"
        >
          <div className="relative max-w-md rounded-2xl border border-white/[0.07] bg-[#050505]/68 p-6 backdrop-blur-md sm:p-8">
            <div className="absolute -right-px top-6 bottom-6 w-[2px] rounded-full bg-gradient-to-b from-[#00D6FF] via-[#0050FF] to-transparent" />

            <p className="text-[11px] font-medium tracking-[0.2em] text-[#00D6FF]/90 uppercase">
              02 / Adaptive Intelligence
            </p>
            <h2 className="text-headline-gradient mt-2.5 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
              Adaptive noise cancelling, redefined.
            </h2>

            <ul className="mt-5 space-y-3.5 text-[15px] leading-relaxed text-white/65 sm:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D6FF] shadow-[0_0_8px_#00D6FF]" />
                <span>Multi-microphone array listens in every direction.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0050FF] shadow-[0_0_8px_#0050FF]" />
                <span>
                  Real-time noise analysis adapts to your environment.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                <span>
                  Your music stays pure—planes, trains, and crowds fade away.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* BEAT 4: SOUND & UPSCALING (65 - 85% scroll)                  */}
        {/* ============================================================ */}
        <motion.div
          style={{ opacity: soundOpacity, y: soundY }}
          className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-6 sm:bottom-12 sm:justify-start sm:px-12 lg:px-20"
        >
          <div className="relative max-w-xl rounded-2xl border border-white/[0.07] bg-[#050505]/72 p-6 backdrop-blur-md sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-medium tracking-[0.2em] text-[#00D6FF]/90 uppercase">
                03 / Sound &amp; AI Upscaling
              </p>
              <span className="rounded-full border border-[#0050FF]/40 bg-[#0050FF]/15 px-2.5 py-0.5 text-[10px] font-medium tracking-[0.12em] text-[#7BE4FF] uppercase">
                Hi‑Res Audio · LDAC
              </span>
            </div>

            <h2 className="text-headline-gradient mt-2 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl">
              Immersive, lifelike sound.
            </h2>

            <p className="mt-3 text-[15px] leading-relaxed text-white/60 sm:text-base">
              High-performance drivers unlock detail, depth, and texture in
              every track. AI-enhanced upscaling restores clarity to compressed
              audio, so every note feels alive.
            </p>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* BEAT 5: REASSEMBLY & CTA (85 - 100% scroll)                  */}
        {/* ============================================================ */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY, scale: ctaScale }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end px-6 pb-12 text-center sm:pb-16"
        >
          <div
            className={`max-w-2xl rounded-3xl border border-white/[0.07] bg-[#050505]/70 px-7 py-7 backdrop-blur-xl sm:px-10 sm:py-8 ${
              activeBeatIndex === 4 ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <p className="text-[11px] font-medium tracking-[0.22em] text-[#00D6FF]/90 uppercase">
              Flagship Craftsmanship
            </p>
            <h2 className="text-headline-gradient mt-2 text-4xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl">
              Hear everything. Feel nothing else.
            </h2>
            <p className="mt-3 text-base font-normal text-white/70 sm:text-lg">
              WH‑1000XM6. Designed for focus, crafted for comfort.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={onExperienceClick}
                className="cta-gradient-border rounded-full px-6 py-3 text-sm font-semibold tracking-[-0.01em] text-white transition-all duration-300 hover:scale-[1.02] focus:outline-none"
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  Experience WH‑1000XM6
                </span>
              </button>

              <button
                type="button"
                onClick={onSeeSpecs}
                className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-white/75 transition-colors hover:text-[#00D6FF] focus:outline-none"
              >
                <span>See full specs</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </button>
            </div>

            <p className="mt-4 text-xs tracking-wide text-white/40">
              Engineered for airports, offices, and everything in between.
            </p>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* RIGHT-EDGE STORY BEAT PROGRESS RAIL                          */}
        {/* ============================================================ */}
        <aside
          aria-label="Story beats navigation"
          className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3.5 sm:flex lg:right-7"
        >
          {STORY_STEPS.map((step, idx) => {
            const active = idx === activeBeatIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onJumpToProgress(step.progress)}
                className="group flex items-center gap-2.5 py-0.5 focus:outline-none"
              >
                <span
                  className={`text-[10px] font-medium tracking-[0.14em] uppercase transition-all duration-300 ${
                    active
                      ? "translate-x-0 text-white/85 opacity-100"
                      : "translate-x-1 text-white/35 opacity-0 group-hover:translate-x-0 group-hover:opacity-80"
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    active
                      ? "h-5 w-1 bg-gradient-to-b from-[#0050FF] to-[#00D6FF] shadow-[0_0_10px_rgba(0,214,255,0.6)]"
                      : "h-1.5 w-1 bg-white/25 group-hover:h-3 group-hover:bg-white/60"
                  }`}
                />
              </button>
            );
          })}
        </aside>
      </div>
    </section>
  );
}
