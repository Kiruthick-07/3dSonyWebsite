"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface NavbarProps {
  onNavigateBeat: (target: "overview" | "technology" | "anc" | "specs" | "buy") => void;
  onExperienceClick: () => void;
}

const NAV_ITEMS: { label: string; target: "overview" | "technology" | "anc" | "specs" | "buy" }[] = [
  { label: "Overview", target: "overview" },
  { label: "Technology", target: "technology" },
  { label: "Noise Cancelling", target: "anc" },
  { label: "Specs", target: "specs" },
  { label: "Buy", target: "buy" },
];

export default function Navbar({ onNavigateBeat, onExperienceClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [hoveredTop, setHoveredTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Apple-like behavior: nearly invisible at y=0, fades in gracefully on slight scroll
  const navOpacity = useTransform(scrollY, [0, 28, 90], [0.06, 0.72, 1]);
  const backdropOpacity = useTransform(scrollY, [0, 32, 96], [0, 0.65, 0.78]);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 24);
    });
  }, [scrollY]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50"
      onMouseEnter={() => setHoveredTop(true)}
      onMouseLeave={() => setHoveredTop(false)}
    >
      <motion.header
        style={{ opacity: hoveredTop ? 1 : navOpacity }}
        className="relative transition-opacity duration-300"
      >
        {/* Translucent near-black glass backdrop */}
        <motion.div
          style={{ opacity: hoveredTop && !scrolled ? 0.65 : backdropOpacity }}
          className="pointer-events-none absolute inset-0 border-b border-white/[0.08] bg-[#050505]/75 backdrop-blur-xl"
        />

        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-12 max-w-[1200px] items-center justify-between px-5 sm:px-8"
        >
          {/* Left: Product Wordmark */}
          <button
            type="button"
            onClick={() => onNavigateBeat("overview")}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <span className="text-[10px] font-semibold tracking-[0.26em] text-white/50 uppercase transition-colors group-hover:text-[#00D6FF]">
              Sony
            </span>
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <span className="text-[13px] font-medium tracking-[-0.02em] text-white/90 transition-colors group-hover:text-white">
              WH‑1000XM6
            </span>
          </button>

          {/* Center: Minimalist Navigation Links */}
          <ul className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.target}>
                <button
                  type="button"
                  onClick={() => onNavigateBeat(item.target)}
                  className="group relative py-1 text-[12px] font-normal tracking-[-0.01em] text-white/65 transition-colors duration-200 hover:text-white focus:outline-none"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-[#0050FF] via-[#00D6FF] to-[#0050FF] transition-transform duration-300 group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          {/* Right: Gradient Border CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExperienceClick}
              className="cta-gradient-border rounded-full px-3.5 py-1.5 text-[11.5px] font-medium tracking-[-0.01em] text-white/95 transition-all duration-300 hover:scale-[1.02] hover:text-white focus:outline-none"
            >
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Experience WH‑1000XM6
              </span>
            </button>
          </div>
        </nav>
      </motion.header>
    </div>
  );
}
