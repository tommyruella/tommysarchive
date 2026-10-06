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
    let poster = project.primaryMedia.poster;
    if (!poster && project.primaryMedia.youtubeId) {
      poster = `https://img.youtube.com/vi/${project.primaryMedia.youtubeId}/mqdefault.jpg`;
    }

    if (poster) {
      const clean = getCleanPoster(poster, project.primaryMedia.youtubeId);
      // Main hero viewer resolution (1920px)
      const heroUrl = getOptimizedImageUrl(clean, 1920, 75);
      if (heroUrl) assetSet.add(heroUrl);

      // Bottom timeline bar resolution (128px)
      const thumbUrl = getOptimizedImageUrl(clean, 128, 75);
      if (thumbUrl) assetSet.add(thumbUrl);
    }

    // Lead still for image collections
    if (project.stills && project.stills.length > 0) {
      const firstStill = project.stills[0]?.url;
      if (firstStill) {
        const stillUrl = getOptimizedImageUrl(firstStill, 1920, 75);
        if (stillUrl) assetSet.add(stillUrl);
      }
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

    // Safety fallback: after 8.5 seconds, force proceed even if network stalls
    const safetyTimeout = setTimeout(() => {
      isAllLoadedRef.current = true;
    }, 8500);

    const checkAllComplete = () => {
      if (loadedCountRef.current >= totalAssetsRef.current) {
        isAllLoadedRef.current = true;
      }
    };

    // Preload and decode every asset in parallel
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

    // Minimum cinematic calibration duration (1.4s) for aesthetic elegance
    const MIN_CALIBRATION_MS = 1400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const total = totalAssetsRef.current || 1;
      const downloadRatio = Math.min(loadedCountRef.current / total, 1);
      const isLoaded = isAllLoadedRef.current || loadedCountRef.current >= total;
      const minTimePassed = elapsed >= MIN_CALIBRATION_MS;

      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // If all assets are fully downloaded and decoded, and minimum time passed, finish to 100%
        if (isLoaded && minTimePassed) {
          const next = prev + Math.floor(Math.random() * 8) + 8;
          return next >= 100 ? 100 : next;
        }

        // While still downloading assets, advance smoothly proportionally to download progress
        // capped at 88% so it NEVER completes prematurely
        const targetPercent = Math.min(Math.floor(downloadRatio * 88), 88);
        if (prev < targetPercent) {
          return prev + Math.floor(Math.random() * 4) + 2;
        } else if (prev < 85) {
          // Slow incremental crawl while waiting for heavy assets
          return prev + (Math.random() > 0.6 ? 1 : 0);
        }

        return prev;
      });
    }, 35);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // When counter reaches 100, trigger cinematic reveal
  useEffect(() => {
    if (counter >= 100) {
      const revealTimer = setTimeout(() => {
        setIsRevealing(true);
      }, 200);

      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 700);

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

        <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest pt-1">
          {currentPercent < 100 ? "Calibrating Optical Assets" : "Studio Calibrated"}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums">
        <span>Milano, IT</span>
        <span>2022 — {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
