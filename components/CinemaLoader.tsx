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

  useEffect(() => {
    const assets = getPreloadAssetList();
    totalAssetsRef.current = assets.length;

    // Safety fallback: after 10 seconds, force proceed if network stalls
    const safetyTimeout = setTimeout(() => {
      isAllLoadedRef.current = true;
    }, 10000);

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

    // Pure deterministic counter: increments by exactly 1 every 45ms.
    // 100 steps * 45ms = 4500ms (exactly 4.5 seconds).
    // It can NEVER jump or skip ahead because it only does `prev + 1`.
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // If we reach 88% and assets are still loading over the network,
        // hold at 88% until every single cover and still has arrived!
        if (prev >= 88 && !isAllLoadedRef.current) {
          return 88;
        }

        return prev + 1;
      });
    }, 45);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // When counter reaches 100%, hold briefly then trigger cinematic shutter reveal
  useEffect(() => {
    if (counter >= 100) {
      const revealTimer = setTimeout(() => {
        setIsRevealing(true);
      }, 350);

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
      className={`fixed inset-0 z-[100] bg-[#000000] flex flex-col justify-between p-6 sm:p-12 select-none transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealing
          ? "opacity-0 scale-[1.01] pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
      aria-hidden={isRevealing}
    >
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span className="font-semibold text-zinc-300">Tommaso Ruella</span>
        <span className="tracking-widest uppercase">Cinema Workstation</span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-mono tabular-nums">
          {counter}%
        </div>

        {/* Minimal calibrated progress bar */}
        <div className="w-48 sm:w-72 h-[3px] rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-white rounded-full transition-transform duration-75 ease-linear origin-left will-change-transform"
            style={{ transform: `scaleX(${counter / 100})` }}
          />
        </div>

        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pt-1">
          {counter < 100 ? "Calibrating Optical Assets" : "Studio Calibrated · 2.39:1"}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums">
        <span>Milano, IT</span>
        <span>2022 — {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
