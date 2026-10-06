"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { WorkstationProject, ProjectStill } from "@/types/project";
import { ChevronLeft, ChevronRight, Play, Pause, LayoutGrid, Film } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

interface RecentPhotosViewerProps {
  project: WorkstationProject;
  activeMediaIndex?: number;
  onSelectMedia?: (index: number) => void;
}

interface PhotoSection {
  title: string;
  stills: {
    still: ProjectStill;
    globalIndex: number;
  }[];
}

export function RecentPhotosViewer({
  project,
  activeMediaIndex = 0,
  onSelectMedia,
}: RecentPhotosViewerProps) {
  // View mode: 'grid' (Pinterest dashboard) or 'carousel' (Cinema slideshow)
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [loadedCarouselUrl, setLoadedCarouselUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Group all stills into sections based on folder name
  const { sections, allPhotos } = useMemo(() => {
    const list = project.stills;
    const map = new Map<string, { still: ProjectStill; globalIndex: number }[]>();

    list.forEach((still, idx) => {
      const sectionName = still.section || "PORTFOLIO";
      if (!map.has(sectionName)) {
        map.set(sectionName, []);
      }
      map.get(sectionName)!.push({ still, globalIndex: idx });
    });

    const parsedSections: PhotoSection[] = Array.from(map.entries()).map(([title, stills]) => ({
      title,
      stills,
    }));

    return { sections: parsedSections, allPhotos: list };
  }, [project.stills]);

  const totalPhotos = allPhotos.length;

  // Active photo in carousel
  const currentPhoto = allPhotos[carouselIndex] || allPhotos[0];

  // Carousel navigation
  const handlePrev = useCallback(() => {
    if (totalPhotos === 0) return;
    setCarouselIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
    setProgress(0);
  }, [totalPhotos]);

  const handleNext = useCallback(() => {
    if (totalPhotos === 0) return;
    setCarouselIndex((prev) => (prev + 1) % totalPhotos);
    setProgress(0);
  }, [totalPhotos]);

  // Open photo in carousel from grid
  const handlePhotoClick = (index: number) => {
    setCarouselIndex(index);
    setViewMode("carousel");
    setProgress(0);
    onSelectMedia?.(index);
  };

  // Keyboard navigation when in carousel mode
  useEffect(() => {
    if (viewMode !== "carousel") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setViewMode("grid");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleNext, handlePrev]);

  // Autoplay timer in carousel mode (advances every 3.5s)
  useEffect(() => {
    if (viewMode !== "carousel" || !isPlaying || totalPhotos <= 1) return;

    const stepMs = 50;
    const totalMs = 3500;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + (stepMs / totalMs) * 100;
        if (nextVal >= 100) {
          handleNext();
          return 0;
        }
        return nextVal;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [viewMode, isPlaying, totalPhotos, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between select-none relative overflow-hidden bg-[#000000]"
    >
      {/* 1. TOP UTILITY BAR (Section Title + Stats + Mode Toggle) */}
      <div className="w-full px-2 sm:px-4 py-2 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0 bg-[#070709] z-20">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <h2 className="text-xs sm:text-sm font-black tracking-tight text-white uppercase truncate">
            {project.title}
          </h2>
          <span className="text-[10px] sm:text-xs font-mono text-zinc-400 tabular-nums uppercase hidden xs:inline">
            [{totalPhotos} SCATTI · {sections.length} SERIE]
          </span>
        </div>

        {/* View Mode Toggle: Grid vs Carousel */}
        <div className="flex items-center gap-3 sm:gap-4" role="tablist">
          <button
            onClick={() => setViewMode("grid")}
            className={`py-1 text-[11px] font-mono uppercase tracking-wider transition-colors duration-150 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 focus-visible:outline-none ${
              viewMode === "grid"
                ? "text-white font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Vista Pinterest Dashboard"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DASHBOARD</span>
          </button>

          <button
            onClick={() => {
              setViewMode("carousel");
              setProgress(0);
            }}
            className={`py-1 text-[11px] font-mono uppercase tracking-wider transition-colors duration-150 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 focus-visible:outline-none ${
              viewMode === "carousel"
                ? "text-white font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Vista Cinema Carosello"
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CAROSELLO</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN STAGE CONTENT */}
      {viewMode === "grid" ? (
        /* ========================================================= */
        /* MODE A: PINTEREST DASHBOARD (ORGANIZED BY FOLDER SECTIONS) */
        /* ========================================================= */
        <div className="flex-1 w-full min-h-0 overflow-y-auto custom-workstation-scrollbar p-3 sm:p-5 md:p-6 space-y-8 sm:space-y-12">
          {sections.map((section, secIdx) => (
            <section key={section.title} className="space-y-3 sm:space-y-4">
              {/* Section Header */}
              <div className="flex items-baseline justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[10px] sm:text-xs font-mono text-zinc-500 font-bold tabular-nums">
                    {String(secIdx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold tracking-tight text-white uppercase">
                    {section.title}
                  </h3>
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-zinc-400 tabular-nums">
                  [{section.stills.length}&nbsp;SCATTI]
                </span>
              </div>

              {/* Dynamic Pinterest Masonry Grid */}
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5 sm:gap-3 space-y-2.5 sm:space-y-3">
                {section.stills.map(({ still, globalIndex }) => (
                  <button
                    key={still.id}
                    onClick={() => handlePhotoClick(globalIndex)}
                    className="w-full break-inside-avoid text-left relative block rounded-lg overflow-hidden bg-black/60 border border-white/[0.08] hover:border-white/40 group cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80"
                    title={`Visualizza ${section.title} — Still ${globalIndex + 1}`}
                  >
                    <img
                      src={getOptimizedImageUrl(still.url, 640, 75)}
                      alt={`${section.title} ${globalIndex + 1}`}
                      onLoad={(e) => {
                        e.currentTarget.classList.remove("opacity-0");
                        e.currentTarget.classList.add("opacity-100");
                      }}
                      className="w-full h-auto block filter contrast-105 group-hover:scale-[1.02] transition-all duration-300 ease-out opacity-0"
                      decoding="async"
                    />
                    <div className="optical-glare" />

                    {/* Minimalist Hover Stamp */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-2">
                      <span className="text-[9px] font-mono text-white/90 tabular-nums">
                        {String(globalIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                        APRI
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* ========================================================= */
        /* MODE B: CINEMA CAROUSEL (AUTOPLAY + CONTROLS + NUMBERS)   */
        /* ========================================================= */
        <div
          className="flex-1 w-full min-h-0 flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Photo Cinema Frame */}
          <div className="relative flex-1 w-full min-h-0 flex items-center justify-center">
            {/* Nav Arrow Left */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 p-2 text-zinc-500 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none bg-transparent border-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              aria-label="Foto Precedente"
              title="Foto Precedente (Freccia Sinistra)"
            >
              <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 stroke-[1.5]" />
            </button>

            {/* Photo Container */}
            <div className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden rounded-xl bg-black border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] p-1">
              <img
                key={currentPhoto?.url}
                src={getOptimizedImageUrl(currentPhoto?.url, 1920, 75)}
                alt={project.title}
                onLoad={() => setLoadedCarouselUrl(currentPhoto?.url)}
                className={`max-h-[58vh] sm:max-h-[64vh] max-w-full w-auto h-auto object-contain select-none transition-opacity duration-300 ease-out ${
                  loadedCarouselUrl === currentPhoto?.url ? "opacity-100" : "opacity-0"
                }`}
                decoding="async"
                fetchPriority="high"
              />

              {/* Autoplay Progress Bar */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-white transition-[width] duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Nav Arrow Right */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 p-2 text-zinc-500 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none bg-transparent border-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              aria-label="Foto Successiva"
              title="Foto Successiva (Freccia Destra)"
            >
              <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 stroke-[1.5]" />
            </button>
          </div>

          {/* Carousel Telemetry & Playback Controls Bar */}
          <div className="w-full max-w-xl mx-auto pt-3 sm:pt-4 flex items-center justify-between gap-3 text-xs font-mono text-zinc-400">
            {/* Section Tag */}
            <div className="min-w-0 flex items-center gap-2 truncate">
              <span className="text-white font-bold tracking-wider uppercase truncate">
                {currentPhoto?.section || "SERIE"}
              </span>
            </div>

            {/* Center Controls: Play/Pause */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 py-1 px-1.5 text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none"
                title={isPlaying ? "Metti in Pausa (Spazio)" : "Avvia Autoplay (Spazio)"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span className="text-[10px] tracking-widest uppercase">PAUSA</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span className="text-[10px] tracking-widest uppercase">PLAY</span>
                  </>
                )}
              </button>
            </div>

            {/* Index Counter */}
            <div className="flex items-center gap-1.5 flex-shrink-0 tabular-nums">
              <span className="text-white font-bold">
                {String(carouselIndex + 1).padStart(2, "0")}
              </span>
              <span>/</span>
              <span>{String(totalPhotos).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
