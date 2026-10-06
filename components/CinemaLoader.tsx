"use client";

import React, { useEffect, useState, useRef } from "react";
import { WORKSTATION_PROJECTS } from "@/data/projects";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

interface CinemaLoaderProps {
  activeProjectId?: string;
  onComplete?: () => void;
}

function getCleanPoster(posterUrl: string, youtubeId?: string): string {
  if (youtubeId && posterUrl && posterUrl.includes("img.youtube.com")) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  return posterUrl;
}

function preloadAndDecodeImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!src) return resolve(true);
    const img = new Image();
    img.src = src;

    const handleSuccess = () => {
      if (typeof img.decode === "function") {
        img.decode().then(() => resolve(true)).catch(() => resolve(true));
      } else {
        resolve(true);
      }
    };

    if (img.complete) {
      handleSuccess();
    } else {
      img.onload = handleSuccess;
      img.onerror = () => resolve(false);
    }
  });
}

function getEssentialAssets(activeProjectId?: string): string[] {
  const assetSet = new Set<string>();

  // 1. Active project hero poster (1920px) + lead scene stills (1920px)
  const activeProj =
    WORKSTATION_PROJECTS.find(
      (p) => p.id === activeProjectId || p.slug === activeProjectId
    ) || WORKSTATION_PROJECTS[0];

  if (activeProj) {
    let poster = activeProj.primaryMedia.poster;
    if (!poster && activeProj.primaryMedia.youtubeId) {
      poster = `https://img.youtube.com/vi/${activeProj.primaryMedia.youtubeId}/maxresdefault.jpg`;
    }
    if (poster) {
      const clean = getCleanPoster(poster, activeProj.primaryMedia.youtubeId);
      const heroUrl = getOptimizedImageUrl(clean, 1920, 75);
      if (heroUrl) assetSet.add(heroUrl);
    }

    if (activeProj.stills && activeProj.stills.length > 0) {
      activeProj.stills.slice(0, 4).forEach((still) => {
        if (still.url) {
          const stillHero = getOptimizedImageUrl(still.url, 1920, 75);
          if (stillHero) assetSet.add(stillHero);
        }
      });
    }
  }

  // 2. All 11 project timeline thumbnails (128px) so the filmstrip renders instantly
  WORKSTATION_PROJECTS.forEach((proj) => {
    let poster = proj.primaryMedia.poster;
    if (!poster && proj.primaryMedia.youtubeId) {
      poster = `https://img.youtube.com/vi/${proj.primaryMedia.youtubeId}/mqdefault.jpg`;
    }
    if (poster) {
      const clean = getCleanPoster(poster, proj.primaryMedia.youtubeId);
      const thumbUrl = getOptimizedImageUrl(clean, 128, 75);
      if (thumbUrl) assetSet.add(thumbUrl);
    }
  });

  return Array.from(assetSet);
}

export function CinemaLoader({ activeProjectId, onComplete }: CinemaLoaderProps) {
  const [mounted, setMounted] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [counter, setCounter] = useState(0);

  const onCompleteCalledRef = useRef(false);

  useEffect(() => {
    const assets = getEssentialAssets(activeProjectId);
    let isCancelled = false;
    let assetsLoaded = false;

    // Preload & GPU-decode every critical asset in parallel
    Promise.all(assets.map(preloadAndDecodeImage)).then(() => {
      assetsLoaded = true;
    });

    // Total calibrated duration: 4.8 seconds (4800ms)
    const TARGET_DURATION_MS = 4800;
    const startTime = performance.now();
    let animFrameId: number;

    const tick = (now: number) => {
      if (isCancelled) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / TARGET_DURATION_MS, 1);

      // Steady linear percentage based on real clock elapsed time
      let nextVal = Math.floor(progress * 100);

      // If we reach 90% and network assets are still in flight, hold at 90%
      if (nextVal >= 90 && !assetsLoaded) {
        nextVal = 90;
      }

      setCounter((prev) => Math.max(prev, nextVal));

      if (progress < 1 || !assetsLoaded) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        setCounter(100);
      }
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animFrameId);
    };
  }, [activeProjectId]);

  // When counter hits 100%, trigger shutter reveal sequence
  useEffect(() => {
    if (counter >= 100 && !onCompleteCalledRef.current) {
      onCompleteCalledRef.current = true;

      // 1. Tell WorkstationShell that the studio assets are 100% ready
      if (onComplete) {
        onComplete();
      }

      // 2. Hold at 100% for 450ms so user reads "Studio Calibrated · 2.39:1"
      const revealTimer = setTimeout(() => {
        setIsRevealing(true);
      }, 450);

      // 3. Unmount after shutter dissolve transition completes
      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 1200);

      return () => {
        clearTimeout(revealTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [counter, onComplete]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#000000] flex flex-col justify-between p-6 sm:p-12 select-none transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealing
          ? "opacity-0 scale-[1.01] pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
      aria-hidden={isRevealing}
    >
      {/* Top authorial header */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span className="font-semibold text-zinc-300">Tommaso Ruella</span>
        <span className="tracking-widest uppercase">Cinema Workstation</span>
      </div>

      {/* Center percentage counter & calibrated progress bar */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-mono tabular-nums">
          {counter}%
        </div>

        {/* Minimal calibrated progress bar */}
        <div className="w-52 sm:w-80 h-[3px] rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-white rounded-full transition-transform duration-75 ease-linear origin-left will-change-transform"
            style={{ transform: `scaleX(${counter / 100})` }}
          />
        </div>

        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pt-1">
          {counter < 100 ? "Calibrating Optical Assets" : "Studio Calibrated · 2.39:1"}
        </div>
      </div>

      {/* Bottom technical metadata */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums">
        <span>Milano, IT</span>
        <span>2022 — {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
