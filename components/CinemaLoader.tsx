"use client";

import React, { useEffect, useState } from "react";

export function CinemaLoader() {
  const [mounted, setMounted] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 40);

    const revealTimer = setTimeout(() => {
      setIsRevealing(true);
    }, 600);

    const unmountTimer = setTimeout(() => {
      setMounted(false);
    }, 1100);

    return () => {
      clearInterval(interval);
      clearTimeout(revealTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  const currentPercent = Math.min(counter, 100);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#000000] flex flex-col justify-between p-6 sm:p-12 pointer-events-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isRevealing ? "opacity-0 scale-[1.01]" : "opacity-100 scale-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span className="font-semibold text-zinc-300">Tommaso Ruella</span>
        <span className="tracking-widest uppercase">Cinema Workstation</span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-mono tabular-nums">
          {currentPercent}%
        </div>

        {/* Minimal calibrated progress bar */}
        <div className="w-40 sm:w-56 h-[3px] rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-white rounded-full transition-transform duration-150 ease-out origin-left will-change-transform"
            style={{ transform: `scaleX(${currentPercent / 100})` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums">
        <span>Milano, IT</span>
        <span>2022 — {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
