"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Sparkles, Volume2, Cpu, BatteryCharging, X } from "lucide-react";

const PILLARS = [
  {
    icon: Cpu,
    eyebrow: "PROCESSING",
    title: "Dual-Processor ANC Matrix",
    description:
      "Multi-microphone arrays sample ambient sound thousands of times per second, canceling low-end cabin rumble and high-frequency chatter before it reaches your ear.",
    metric: "12 Microphones",
  },
  {
    icon: Volume2,
    eyebrow: "TRANSDUCER",
    title: "Carbon-Composite Precision Driver",
    description:
      "A rigid, ultra-lightweight dome suspended by a copper-clad voice coil preserves transient micro-detail, deep sub-bass extension, and open vocal presence.",
    metric: "4 Hz – 40 kHz",
  },
  {
    icon: Sparkles,
    eyebrow: "AI UPSCALING",
    title: "Real-Time Acoustic Restoration",
    description:
      "Edge-AI signal reconstruction restores high-frequency harmonics lost in compressed streams, bringing studio air and spatial separation back to every track.",
    metric: "LDAC · Hi‑Res",
  },
  {
    icon: BatteryCharging,
    eyebrow: "ENDURANCE",
    title: "All-Week Focus Power",
    description:
      "Engineered for transcontinental flights and marathon studio sessions. Quick USB‑C boost delivers hours of playback in minutes.",
    metric: "Up to 40 Hours",
  },
];

const SPECS = [
  { label: "Acoustic Design", value: "Closed-back dynamic circumaural" },
  { label: "Driver Unit", value: "Custom precision carbon-fiber composite dome" },
  { label: "Frequency Response", value: "4 Hz – 40,000 Hz (JEITA / Wired)" },
  { label: "Noise Cancelling", value: "Multi-sensor adaptive real-time array + Ambient mode" },
  { label: "Wireless Connectivity", value: "Bluetooth 5.4 · Multipoint (2 devices)" },
  { label: "Supported Codecs", value: "LDAC, AAC, SBC, LC3 (LE Audio ready)" },
  { label: "Upscaling Engine", value: "AI-enhanced real-time audio upscaling" },
  { label: "Battery Life", value: "Up to 40 hrs (ANC On) · USB‑C fast charge" },
  { label: "Materials", value: "Matte acoustic polymer, memory-foam synthetic leather" },
  { label: "Weight", value: "Approx. 248 g" },
];

const FINISHES = [
  {
    id: "matte-black",
    name: "Matte Black",
    swatch: "bg-[#111215] ring-white/25",
    tagline: "Stealth obsidian anodization",
  },
  {
    id: "platinum-silver",
    name: "Platinum Silver",
    swatch: "bg-[#C9C6BE] ring-white/20",
    tagline: "Warm architectural mineral",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    swatch: "bg-[#131C31] ring-[#0050FF]/50",
    tagline: "Deep sapphire metallic",
  },
];

interface TechShowcaseProps {
  modalOpen: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export default function TechShowcase({
  modalOpen,
  onCloseModal,
  onOpenModal,
}: TechShowcaseProps) {
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [reserved, setReserved] = useState(false);

  const handleReserve = () => {
    setReserved(true);
    setTimeout(() => setReserved(false), 4500);
  };

  return (
    <div className="relative bg-[#050505]">
      {/* Top gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ================================================================ */}
      {/* ENGINEERING PILLARS                                              */}
      {/* ================================================================ */}
      <section className="relative mx-auto max-w-[1200px] px-6 py-24 sm:px-8 sm:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-12 h-96 w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,80,255,0.1)_0%,rgba(5,5,5,0)_70%)] blur-2xl"
        />

        <div className="relative max-w-2xl">
          <p className="text-[11px] font-medium tracking-[0.22em] text-[#00D6FF]/90 uppercase">
            Inside the Acoustic Chamber
          </p>
          <h2 className="text-headline-gradient mt-3 text-4xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl">
            Every millimeter serves the silence.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Beneath the seamless matte silhouette lies a re‑imagined acoustic
            system calibrated for zero resonance and effortless wear.
          </p>
        </div>

        <div className="relative mt-14 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A0A0C] p-7 transition-colors duration-300 hover:border-white/[0.14] sm:p-8"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#0050FF]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#00D6FF]">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-white/75">
                    {item.metric}
                  </span>
                </div>

                <p className="mt-6 text-[10.5px] font-medium tracking-[0.2em] text-white/40 uppercase">
                  {item.eyebrow}
                </p>
                <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-white/90">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-white/60">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* FULL SPECIFICATIONS (#specs)                                     */}
      {/* ================================================================ */}
      <section
        id="specs"
        className="relative border-t border-white/[0.06] bg-[#0A0A0C]/70 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-[1000px] px-6 sm:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium tracking-[0.22em] text-[#00D6FF]/90 uppercase">
                Technical Specifications
              </p>
              <h2 className="text-headline-gradient mt-2.5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                WH‑1000XM6 Architecture
              </h2>
            </div>
            <p className="text-sm text-white/45">
              Engineered by Sony Acoustic Systems
            </p>
          </div>

          <dl className="mt-12 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {SPECS.map((spec) => (
              <div
                key={spec.label}
                className="grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-12 sm:items-center sm:gap-6"
              >
                <dt className="text-sm font-medium text-white/50 sm:col-span-4">
                  {spec.label}
                </dt>
                <dd className="text-[15px] font-normal text-white/90 sm:col-span-8">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================================================================ */}
      {/* BUY / FLAGSHIP RESERVATION (#buy)                                */}
      {/* ================================================================ */}
      <section
        id="buy"
        className="relative overflow-hidden border-t border-white/[0.06] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,#050815_0%,#050505_75%)] py-28 sm:py-36"
      >
        <div className="mx-auto max-w-[920px] px-6 text-center sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.24em] text-[#00D6FF]/90 uppercase">
            Flagship Edition
          </p>
          <h2 className="text-headline-gradient mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            Sony WH‑1000XM6
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Select your finish. Includes sculpted hard-shell travel case, braided
            USB‑C cable, and flight-ready reference audio adapter.
          </p>

          {/* Finish selector */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {FINISHES.map((finish) => {
              const active = finish.id === selectedFinish.id;
              return (
                <button
                  key={finish.id}
                  type="button"
                  onClick={() => setSelectedFinish(finish)}
                  className={`flex items-center gap-3 rounded-full border px-4 py-2 text-left transition-all duration-200 ${
                    active
                      ? "border-[#00D6FF]/60 bg-white/[0.06] text-white"
                      : "border-white/10 bg-[#0A0A0C] text-white/60 hover:border-white/25 hover:text-white/90"
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full ring-1 ${finish.swatch}`}
                  />
                  <span className="text-xs font-medium tracking-tight">
                    {finish.name}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-white/45">
            {selectedFinish.name} — {selectedFinish.tagline}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-white/95">
                $399.99
              </span>
              <span className="text-xs text-white/45">MSRP</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleReserve}
                className="cta-gradient-border rounded-full px-8 py-3.5 text-sm font-semibold tracking-[-0.01em] text-white transition-all duration-300 hover:scale-[1.02] focus:outline-none"
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  Pre‑order {selectedFinish.name}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenModal}
                className="rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
              >
                Compare &amp; In‑Box Details
              </button>
            </div>

            <AnimatePresence>
              {reserved && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00D6FF]/35 bg-[#0050FF]/15 px-4 py-2 text-xs font-medium text-[#8BE8FF]"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>
                    WH‑1000XM6 ({selectedFinish.name}) added to your showcase
                    reservation.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00D6FF]/80" />
              <span>2-Year Sony Flagship Care · Complimentary Express Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Corporate Footer */}
      <footer className="border-t border-white/[0.06] bg-[#050505] py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 text-xs text-white/35 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-[0.22em] text-white/60 uppercase">
              Sony
            </span>
            <span>WH‑1000XM6 Flagship Concept Showcase</span>
          </div>
          <p>Precision Acoustics · Scroll-Linked Interactive Engineering Study</p>
        </div>
      </footer>

      {/* ================================================================ */}
      {/* INTERACTIVE EXPERIENCE / IN-BOX MODAL                            */}
      {/* ================================================================ */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={onCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A0A0C] p-7 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={onCloseModal}
                aria-label="Close modal"
                className="absolute right-5 top-5 rounded-full border border-white/10 p-1.5 text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-[11px] font-medium tracking-[0.22em] text-[#00D6FF] uppercase">
                Sony Flagship Audio
              </p>
              <h3 className="text-headline-gradient mt-2 text-2xl font-semibold tracking-[-0.025em]">
                Experience WH‑1000XM6
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Ready for studios, flights, and quiet focus. Choose your finish
                and reserve priority dispatch.
              </p>

              <div className="mt-6 space-y-2.5">
                {FINISHES.map((finish) => {
                  const active = finish.id === selectedFinish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-[#00D6FF]/60 bg-[#0050FF]/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-4 w-4 rounded-full ring-1 ${finish.swatch}`}
                        />
                        <div>
                          <div className="text-sm font-medium text-white/90">
                            {finish.name}
                          </div>
                          <div className="text-xs text-white/45">
                            {finish.tagline}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-white/75">
                        $399.99
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <div className="text-xs text-white/50">
                  In stock · Ships in sculpted case
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleReserve();
                    onCloseModal();
                  }}
                  className="cta-gradient-border rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  Confirm Reservation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
