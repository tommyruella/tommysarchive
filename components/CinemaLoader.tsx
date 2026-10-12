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

    // Safety timeout: an image cannot block the pipeline for more than 3.5s
    const timer = setTimeout(() => {
      resolve(true);
    }, 3500);

    const img = new Image();
    img.src = src;

    const handleSuccess = () => {
      clearTimeout(timer);
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
      img.onerror = () => {
        clearTimeout(timer);
        resolve(false);
      };
    }
  });
}

interface AssetQueue {
  priority: string[];
  secondary: string[];
}

function getEssentialAssets(activeProjectId?: string): AssetQueue {
  const prioritySet = new Set<string>();
  const secondarySet = new Set<string>();

  // 1. Active project hero poster + lead scene stills (TOP PRIORITY - defaults to 01 London March '26)
  const activeProj =
    WORKSTATION_PROJECTS.find(
      (p) => p.id === activeProjectId || p.slug === activeProjectId
    ) || WORKSTATION_PROJECTS[0];

  if (activeProj) {
    const isPhotoProject =
      activeProj.category === "PHOTO" ||
      activeProj.category === "PHOTOGRAPHY" ||
      activeProj.slug === "recent-works-foto";

    let poster = activeProj.primaryMedia.poster;
    if (!poster && activeProj.primaryMedia.youtubeId) {
      poster = `https://img.youtube.com/vi/${activeProj.primaryMedia.youtubeId}/maxresdefault.jpg`;
    }

    if (isPhotoProject) {
      // Only if deep-linked directly to Recent Photos: preload lead masonry stills at 640px
      if (activeProj.stills && activeProj.stills.length > 0) {
        activeProj.stills.slice(0, 10).forEach((still) => {
          if (still.url) {
            const gridUrl = getOptimizedImageUrl(still.url, 640, 75);
            if (gridUrl) prioritySet.add(gridUrl);
          }
        });
      }
      if (poster) {
        const clean = getCleanPoster(poster, activeProj.primaryMedia.youtubeId);
        const heroUrl = getOptimizedImageUrl(clean, 1920, 75);
        if (heroUrl) prioritySet.add(heroUrl);
      }
    } else {
      // Standard lead project (01 London): Preload 1920px hero poster + lead 4 stills
      if (poster) {
        const clean = getCleanPoster(poster, activeProj.primaryMedia.youtubeId);
        const heroUrl = getOptimizedImageUrl(clean, 1920, 75);
        if (heroUrl) prioritySet.add(heroUrl);
      }
      if (activeProj.stills && activeProj.stills.length > 0) {
        activeProj.stills.slice(0, 4).forEach((still) => {
          if (still.url) {
            const stillHero = getOptimizedImageUrl(still.url, 1920, 75);
            if (stillHero) prioritySet.add(stillHero);
          }
        });
      }
    }
  }

  // 2. Timeline thumbnails (128px): First 6 visible clips in priority queue, remaining (including #11 Recent Photos) in secondary queue
  WORKSTATION_PROJECTS.forEach((proj, idx) => {
    let poster = proj.primaryMedia.poster;
    if (!poster && proj.primaryMedia.youtubeId) {
      poster = `https://img.youtube.com/vi/${proj.primaryMedia.youtubeId}/mqdefault.jpg`;
    }
    if (poster) {
      const clean = getCleanPoster(poster, proj.primaryMedia.youtubeId);
      const thumbUrl = getOptimizedImageUrl(clean, 128, 75);
      if (thumbUrl && !prioritySet.has(thumbUrl)) {
        if (idx < 6 || proj.id === activeProj?.id) {
          prioritySet.add(thumbUrl);
        } else {
          secondarySet.add(thumbUrl);
        }
      }
    }
  });

  // 3. Secondary queue: Next immediate timeline project hero posters (02, 03), followed last by Recent Photos (#11) lead grid stills
  WORKSTATION_PROJECTS.slice(1, 4).forEach((proj) => {
    let poster = proj.primaryMedia.poster;
    if (!poster && proj.primaryMedia.youtubeId) {
      poster = `https://img.youtube.com/vi/${proj.primaryMedia.youtubeId}/maxresdefault.jpg`;
    }
    if (poster) {
      const clean = getCleanPoster(poster, proj.primaryMedia.youtubeId);
      const heroUrl = getOptimizedImageUrl(clean, 1920, 75);
      if (heroUrl && !prioritySet.has(heroUrl)) {
        secondarySet.add(heroUrl);
      }
    }
  });

  // Lowest priority (last project in timeline): warm lead 6 stills of Recent Photos in background
  const photosProj = WORKSTATION_PROJECTS[WORKSTATION_PROJECTS.length - 1];
  if (photosProj && photosProj.slug === "recent-works-foto" && activeProj?.id !== photosProj.id) {
    photosProj.stills.slice(0, 6).forEach((still) => {
      if (still.url) {
        const gridUrl = getOptimizedImageUrl(still.url, 640, 75);
        if (gridUrl && !prioritySet.has(gridUrl)) {
          secondarySet.add(gridUrl);
        }
      }
    });
  }

  return {
    priority: Array.from(prioritySet),
    secondary: Array.from(secondarySet),
  };
}

let isSessionCalibrated = false;

export function hasSessionCalibrated(): boolean {
  if (isSessionCalibrated) return true;
  if (typeof window !== "undefined") {
    try {
      if (sessionStorage.getItem("cinema_calibrated") === "true") {
        isSessionCalibrated = true;
        return true;
      }
    } catch {}
  }
  return false;
}

export function markSessionCalibrated(): void {
  isSessionCalibrated = true;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("cinema_calibrated", "true");
    } catch {}
  }
}

export function CinemaLoader({ activeProjectId, onComplete }: CinemaLoaderProps) {
  const [mounted, setMounted] = useState(() => !hasSessionCalibrated());
  const [isRevealing, setIsRevealing] = useState(false);
  const [counter, setCounter] = useState(0);

  // Keep latest onComplete in a ref so changes never trigger cleanup of reveal timers
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // If already calibrated in this session, immediately notify parent and don't render
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "Tommaso Ruella";
    }
    if (hasSessionCalibrated()) {
      onCompleteRef.current?.();
      setMounted(false);
    }
  }, []);

  const hasFinishedRef = useRef(false);

  useEffect(() => {
    const { priority, secondary } = getEssentialAssets(activeProjectId);
    let isCancelled = false;
    let assetsLoaded = false;

    // Hard fallback: after 5.5s, force assetsLoaded = true even if connection stalled
    const networkFallbackTimer = setTimeout(() => {
      assetsLoaded = true;
    }, 5500);

    // Preload & GPU-decode priority assets FIRST (Active project lead photos/stills)
    Promise.all(priority.map(preloadAndDecodeImage)).then(() => {
      if (isCancelled) return;
      assetsLoaded = true;
      // Secondary timeline thumbnails preloaded in background without blocking primary content
      Promise.all(secondary.map(preloadAndDecodeImage)).catch(() => {});
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
      clearTimeout(networkFallbackTimer);
      cancelAnimationFrame(animFrameId);
    };
  }, [activeProjectId]);

  // When counter hits 100%, trigger shutter reveal sequence.
  // Note: Only depends on [counter], NEVER on onComplete callback!
  useEffect(() => {
    if (counter >= 100 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      markSessionCalibrated();

      // 1. Tell WorkstationShell that the studio assets are 100% ready
      onCompleteRef.current?.();

      // 2. Hold at 100% for 400ms so user reads "Studio Calibrated · 2.39:1"
      const revealTimer = setTimeout(() => {
        setIsRevealing(true);
      }, 400);

      // 3. Unmount after shutter dissolve transition completes (1100ms)
      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 1100);

      return () => {
        clearTimeout(revealTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [counter]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#000000] flex flex-col justify-between select-none transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealing
          ? "opacity-0 scale-[1.01] pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
      aria-hidden={isRevealing}
    >
      {/* Top authorial header - Matched 1:1 with site topbar */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0 bg-[#000000] z-20">
        <span className="text-sm sm:text-base font-black tracking-tight uppercase text-white">
          <span className="sm:hidden">TR</span>
          <span className="hidden sm:inline">Tommaso Ruella</span>
        </span>

        <div className="flex items-center gap-5 sm:gap-7">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400">
            About
          </span>
          <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400">
            Archive
          </span>
        </div>
      </header>

      {/* Center percentage counter & calibrated progress bar */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-4">
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

        <div className="text-xs text-zinc-400 font-mono tracking-wide pt-1">
          {counter < 100 ? "it may take just a few sec :)" : "Studio Calibrated · 2.39:1"}
        </div>
      </div>

      {/* Bottom technical metadata */}
      <footer className="h-12 sm:h-14 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-0 px-4 sm:px-8 flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums flex-shrink-0">
        <span>Turin, Italy</span>
        <span>2022 — {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
