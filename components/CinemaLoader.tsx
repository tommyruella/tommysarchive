"use client";

import React, { useEffect, useState, useRef } from "react";
import { WORKSTATION_PROJECTS } from "@/data/projects";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

function getCleanPoster(posterUrl: string, youtubeId?: string): string {
  if (youtubeId && posterUrl && posterUrl.includes("img.youtube.com")) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  return posterUrl;
}

function getPreloadAssetList(): string[] {
  const assetSet = new Set<string>();

  WORKSTATION_PROJECTS.forEach((project) => {
    // 1. Hero Cover & Timeline Thumbnail for every single project
    let poster = project.primaryMedia.poster;
    if (!poster && project.primaryMedia.youtubeId) {
      poster = `https://img.youtube.com/vi/${project.primaryMedia.youtubeId}/mqdefault.jpg`;
    }

    if (poster) {
      const clean = getCleanPoster(poster, project.primaryMedia.youtubeId);
      // Hero resolution (1920px)
      const heroUrl = getOptimizedImageUrl(clean, 1920, 75);
      if (heroUrl) assetSet.add(heroUrl);

      // Bottom timeline bar resolution (128px)
      const thumbUrl = getOptimizedImageUrl(clean, 128, 75);
      if (thumbUrl) assetSet.add(thumbUrl);
    }

    // 2. Lead stills for all projects (so switching projects has zero delay)
    if (project.stills && project.stills.length > 0) {
      project.stills.slice(0, 6).forEach((still) => {
        if (still.url) {
          const stillHero = getOptimizedImageUrl(still.url, 1920, 75);
          if (stillHero) assetSet.add(stillHero);

          const stillGrid = getOptimizedImageUrl(still.url, 640, 75);
          if (stillGrid) assetSet.add(stillGrid);
        }
      });
    }
  });

  return Array.from(assetSet);
}

export function CinemaLoader() {
  const [mounted, setMounted] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [counter, setCounter] = useState(0);

  const isAllLoadedRef = useRef(false);
  const loadedCountRef = useRef(0);
  const totalAssetsRef = useRef(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    const assets = getPreloadAssetList();
    totalAssetsRef.current = assets.length;

    // Safety fallback: after 9.5 seconds, force proceed even if network stalls
    const safetyTimeout = setTimeout(() => {
      isAllLoadedRef.current = true;
    }, 9500);

    const checkAllComplete = () => {
      if (loadedCountRef.current >= totalAssetsRef.current) {
        isAllLoadedRef.current = true;
      }
    };

    // Preload and hardware-decode every asset in parallel
    assets.forEach((url) => {
      const img = new Image();
      img.src = url;

      const handleDone = () => {
        loadedCountRef.current += 1;
        checkAllComplete();
      };

      if (img.complete) {
        if (typeof img.decode === "function") {
          img.decode().then(handleDone).catch(handleDone);
        } else {
          handleDone();
        }
      } else {
        img.onload = () => {
          if (typeof img.decode === "function") {
            img.decode().then(handleDone).catch(handleDone);
          } else {
            handleDone();
          }
        };
        img.onerror = handleDone;
      }
    });

    // Calibrated studio duration: 4.5 seconds (4500ms) as requested
    const TOTAL_CALIBRATION_MS = 4500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeRatio = Math.min(elapsed / TOTAL_CALIBRATION_MS, 1);
      const isLoaded = isAllLoadedRef.current || loadedCountRef.current >= (totalAssetsRef.current || 1);

      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Target percentage based on elapsed time over 4.5 seconds
        let target = Math.floor(timeRatio * 100);

        // If time reaches near 90% but some assets are still in flight, hold at 92%
        if (!isLoaded && target > 92) {
          target = 92;
        }

        // Only reach 100% when time >= 4.5s AND all assets are loaded and decoded
        if (target >= 100) {
          if (isLoaded && elapsed >= TOTAL_CALIBRATION_MS) {
            return 100;
          }
          return 99;
        }

        // Smooth steady progress toward target
        if (prev < target) {
          return prev + 1;
        }

        return prev;
      });
    }, 35);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // When counter reaches 100, trigger cinematic shutter reveal
  useEffect(() => {
    if (counter >= 100) {
      const revealTimer = setTimeout(() => {
        setIsRevealing(true);
      }, 250);

      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 850);

      return () => {
        clearTimeout(revealTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [counter]);

  if (!mounted) return null;

  const currentPercent = Math.min(counter, 100);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#000000] flex flex-col justify-between p-6 sm:p-12 pointer-events-none transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
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
        <div className="w-44 sm:w-64 h-[3px] rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-white rounded-full transition-transform duration-100 ease-out origin-left will-change-transform"
            style={{ transform: `scaleX(${currentPercent / 100})` }}
          />
        </div>

        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pt-1">
          {currentPercent < 100 ? "Calibrating Optical Assets" : "Studio Calibrated · 2.39:1"}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums">
        <span>Milano, IT</span>
        <span>2022 — {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
