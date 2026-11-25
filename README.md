# Sony WH‑1000XM6 — Scroll-Linked Interactive Showcase

An Apple/Sony-inspired editorial scrollytelling landing page built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **HTML5 Canvas** image-sequence playback across all 118 high-resolution frames.

## Architecture & Highlights

- **HTML5 Canvas Sequence Engine (`src/components/HeadphoneCanvasStage.tsx`)**: Preloads all 118 frames (`public/frames/ezgif-frame-001.jpg` – `118.jpg`) using a keyframe-first priority queue and renders them with HiDPI scaling, requestAnimationFrame lerp smoothing, and `#050505` radial/edge blending so image boundaries disappear into the dark void.
- **5 Scroll-Synchronized Story Beats (`460vh` sticky stage)**:
  - **0–15%**: Hero / Intro — assembled matte-black silhouette with rim-light sweep.
  - **15–40%**: Engineering Reveal — separation of ear cups, acoustic chambers, and headband.
  - **40–65%**: Adaptive Noise Cancelling — multi-microphone array and processing module spread.
  - **65–85%**: Sound & AI Upscaling — full exploded view highlighting drivers, copper voice coils, and magnets.
  - **85–100%**: Graceful reassembly back into the hero pose with final CTA lock-in.
- **Apple-Style Glassmorphic Navbar (`src/components/Navbar.tsx`)**: Near-invisible at `scrollY = 0` and fades in with translucent `#050505/75` backdrop blur upon scroll.
- **Flagship Specs & Finish Selector (`src/components/TechShowcase.tsx`)**: Engineering pillars grid, full specification sheet (`#specs`), finish configurator (`#buy`), and interactive reservation modal.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
