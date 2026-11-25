"use client";

import React, { useCallback, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import HeadphoneCanvasStage from "@/components/HeadphoneCanvasStage";
import TechShowcase from "@/components/TechShowcase";

export default function HomePage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const jumpToStageProgress = useCallback((progress: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const stageTop = window.scrollY + rect.top;
    const scrollableDistance = stage.offsetHeight - window.innerHeight;
    const targetY = stageTop + scrollableDistance * Math.max(0, Math.min(1, progress));
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  const handleNavigateBeat = useCallback(
    (target: "overview" | "technology" | "anc" | "specs" | "buy") => {
      if (target === "overview") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (target === "technology") {
        jumpToStageProgress(0.26);
      } else if (target === "anc") {
        jumpToStageProgress(0.52);
      } else if (target === "specs") {
        document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" });
      } else if (target === "buy") {
        document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [jumpToStageProgress]
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white/90">
      <Navbar
        onNavigateBeat={handleNavigateBeat}
        onExperienceClick={() => setModalOpen(true)}
      />

      <HeadphoneCanvasStage
        stageRef={stageRef}
        onSeeSpecs={() => handleNavigateBeat("specs")}
        onExperienceClick={() => setModalOpen(true)}
        onJumpToProgress={jumpToStageProgress}
      />

      <TechShowcase
        modalOpen={modalOpen}
        onOpenModal={() => setModalOpen(true)}
        onCloseModal={() => setModalOpen(false)}
      />
    </main>
  );
}
