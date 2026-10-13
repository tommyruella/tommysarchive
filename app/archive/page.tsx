"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { WORKSTATION_PROJECTS } from "@/data/projects";
import { ArchiveMediaModal, ArchiveMediaItem } from "@/components/workstation/ArchiveMediaModal";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";
import { markSessionCalibrated } from "@/components/CinemaLoader";

type FilterType = "ALL" | "FILMS" | "PHOTOS" | "3D";

export default function ArchivePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "Tommaso Ruella";
    }
    markSessionCalibrated();
  }, []);

  const [filter, setFilter] = useState<FilterType>("ALL");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  const archiveItems = useMemo<ArchiveMediaItem[]>(() => {
    const items: ArchiveMediaItem[] = [];
    const seenMedia = new Set<string>();

    WORKSTATION_PROJECTS.forEach((proj) => {
      const cat: "FILMS" | "PHOTOS" | "3D" =
        proj.category === "3D" || proj.category === "3D MOTION"
          ? "3D"
          : proj.category === "PHOTOGRAPHY" || proj.category === "PHOTO"
          ? "PHOTOS"
          : "FILMS";

      const isVideo = proj.primaryMedia.type === "video";

      // 1. Lead media (video or cover image)
      if (proj.primaryMedia.poster && !seenMedia.has(proj.primaryMedia.poster)) {
        seenMedia.add(proj.primaryMedia.poster);
        items.push({
          id: `proj-${proj.id}`,
          title: proj.title,
          category: cat,
          type: isVideo ? "video" : "image",
          mediaUrl: proj.primaryMedia.poster,
          youtubeId: proj.primaryMedia.youtubeId,
          localVideo: proj.primaryMedia.localVideo,
          aspectRatio: proj.primaryMedia.aspectRatio,
          projectSlug: proj.slug,
          projectTitle: proj.title,
          year: proj.year,
        });
      }

      // 2. Project stills (high-res images)
      proj.stills.forEach((still, sIdx) => {
        if (still.url && !seenMedia.has(still.url)) {
          seenMedia.add(still.url);
          items.push({
            id: `still-${proj.id}-${sIdx}`,
            title: `${proj.title} Frame ${sIdx + 1}`,
            category: cat,
            type: "image",
            mediaUrl: still.url,
            aspectRatio: still.aspectRatio,
            projectSlug: proj.slug,
            projectTitle: proj.title,
            year: proj.year,
          });
        }
      });
    });

    return items;
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "ALL") return archiveItems;
    return archiveItems.filter((item) => item.category === filter);
  }, [archiveItems, filter]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-zinc-100 select-none">
      {/* 1. SLIM BRUTALIST AUTHORIAL HEADER */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-white/[0.08] flex items-center justify-between bg-black sticky top-0 z-30 flex-shrink-0">
        {/* Left: Author Brand (TR on mobile, full name on desktop) */}
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="Torna alla Home"
            className="text-sm sm:text-base font-black tracking-tight uppercase text-white hover:text-zinc-300 transition-colors focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            <span className="sm:hidden">TR</span>
            <span className="hidden sm:inline">Tommaso Ruella</span>
          </Link>
        </div>

        {/* Right: Navigation */}
        <nav aria-label="Navigazione principale" className="flex items-center gap-5 sm:gap-7">
          <Link
            href="/about"
            className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            About
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            Timeline
          </Link>
        </nav>
      </header>

      {/* 1B. DEDICATED ARCHIVE FILTER BAR (Centered, pure white highlight) */}
      <div className="w-full px-4 sm:px-8 py-2.5 border-b border-white/[0.08] bg-black/95 backdrop-blur-sm sticky top-14 sm:top-16 z-20 flex items-center justify-center">
        <div
          className="flex items-center justify-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Filtri Categoria"
        >
          {[
            { label: "Film", val: "FILMS" },
            { label: "3D", val: "3D" },
            { label: "Foto", val: "PHOTOS" },
            { label: "Tutto", val: "ALL" },
          ].map((tab) => {
            const isActive = filter === tab.val;
            return (
              <button
                key={tab.val}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setFilter(tab.val as FilterType);
                  setSelectedMediaIndex(null);
                }}
                className={`py-1 text-[11px] sm:text-xs font-mono uppercase tracking-widest transition-colors duration-150 cursor-pointer bg-transparent border-0 flex-shrink-0 focus-visible:outline-none ${
                  isActive
                    ? "text-white font-bold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CINEMA ARCHIVE FULLGRID: CLICKING OPENS MEDIA VIEWER */}
      <main className="flex-1 w-full p-2.5 pb-14 sm:p-4 md:p-6">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedMediaIndex(index)}
              title={item.title}
              aria-label={`Visualizza ${item.title}`}
              className="group relative block aspect-[16/10] overflow-hidden rounded-sm bg-black border border-white/[0.08] hover:border-white/40 transition-all duration-200 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none cursor-pointer text-left w-full"
            >
              <img
                src={getOptimizedImageUrl(item.mediaUrl, 384)}
                alt={item.title}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />

              {/* Minimal Hover Overlay with Title & optional video indicator */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-2 sm:p-2.5">
                <span className="text-[11px] font-mono text-white truncate drop-shadow">
                  {item.title}
                </span>
                {item.type === "video" && (
                  <Play className="w-3 h-3 text-white/90 fill-white/80 flex-shrink-0 ml-1.5" aria-hidden="true" />
                )}
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 3. DIRECT MEDIA VIEWER MODAL (Plays video or displays high-res photo) */}
      <ArchiveMediaModal
        items={filteredItems}
        currentIndex={selectedMediaIndex}
        onClose={() => setSelectedMediaIndex(null)}
        onNavigate={(idx) => setSelectedMediaIndex(idx)}
      />
    </div>
  );
}
