"use client";

import React, { useRef, useEffect } from "react";
import { WorkstationProject } from "@/types/project";
import { getClipTheme } from "@/lib/projectUtils";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

interface ProjectTimelineBarProps {
  projects: WorkstationProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
}

function getCleanPoster(posterUrl: string, youtubeId?: string): string {
  if (youtubeId && posterUrl && posterUrl.includes("img.youtube.com")) {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  }
  return posterUrl;
}

export function ProjectTimelineBar({
  projects,
  activeProjectId,
  onSelectProject,
}: ProjectTimelineBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeProjectId]);

  return (
    <div className="w-full h-full flex flex-col justify-between select-none relative overflow-hidden bg-[#07070a] border-t border-white/[0.08] px-3 sm:px-6 py-2">
      {/* Scrollable Container hosting both minimal ruler and clips in 1:1 lockstep */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full flex flex-col justify-between overflow-x-auto custom-workstation-scrollbar scroll-smooth"
        role="tablist"
        aria-label="Sequenza Filmstrip Progetti"
      >
        <div className="w-max flex flex-col justify-between h-full">
          {/* 1. MINIMAL RULER (Scrolls synchronously with clips, matched with years & clip colors) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 pb-1.5 border-b border-white/[0.06]">
            {projects.map((proj, idx) => {
              const isActive = proj.id === activeProjectId;
              const theme = getClipTheme(proj.clipColor);

              return (
                <div
                  key={`ruler-${proj.id}`}
                  className="min-w-[170px] sm:min-w-[210px] flex-shrink-0 flex items-center justify-between px-1"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-[1px] h-2 transition-colors ${
                        isActive ? theme.needleBg : "bg-white/20"
                      }`}
                      style={isActive ? { backgroundColor: theme.colorHex, boxShadow: `0 0 8px ${theme.colorHex}` } : undefined}
                    />
                    <span
                      className={`text-[10px] font-mono tabular-nums tracking-wider ${
                        isActive ? `${theme.textAccent} font-bold` : "text-zinc-500"
                      }`}
                      style={isActive ? { color: theme.colorHex } : undefined}
                    >
                      {proj.year}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono tabular-nums text-zinc-600">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 2. PROJECT CLIPS (Surrounded by distinct clip color according to video category) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-h-0 pt-1.5">
            {projects.map((proj, idx) => {
              const isActive = proj.id === activeProjectId;
              const theme = getClipTheme(proj.clipColor);
              const poster = getCleanPoster(
                proj.primaryMedia.poster,
                proj.primaryMedia.youtubeId
              );

              return (
                <button
                  key={proj.id}
                  ref={isActive ? activeBtnRef : null}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectProject(proj.id)}
                  className={`h-full min-h-[58px] sm:min-h-[64px] min-w-[170px] sm:min-w-[210px] flex-shrink-0 relative rounded-lg border text-left p-1.5 sm:p-2 flex items-center gap-2.5 sm:gap-3 transition-all duration-200 group cursor-pointer focus-visible:ring-1 focus-visible:outline-none ${
                    isActive
                      ? `bg-[#141216] ${theme.borderActive} ${theme.glowActive}`
                      : `bg-[#0b0b0f] border-white/[0.08] ${theme.borderHover} hover:bg-[#111116]`
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: theme.colorHex,
                          boxShadow: `0 0 16px ${theme.colorHex}45`,
                        }
                      : undefined
                  }
                >
                  {/* Project Frame Thumbnail (Filmstrip Cell) */}
                  <div className="relative w-14 sm:w-16 h-full aspect-video rounded overflow-hidden bg-black flex-shrink-0 border border-white/10">
                    <img
                      src={getOptimizedImageUrl(poster, 128)}
                      alt={proj.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("mqdefault.jpg")) {
                          target.src = proj.primaryMedia.youtubeId
                            ? `https://img.youtube.com/vi/${proj.primaryMedia.youtubeId}/mqdefault.jpg`
                            : proj.primaryMedia.poster;
                        }
                      }}
                      className={`w-full h-full object-contain ${
                        isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                      }`}
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  {/* Title & Index Details */}
                  <div className="min-w-0 flex-1 flex flex-col justify-center space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono tabular-nums leading-none">
                      <span
                        className={
                          isActive
                            ? `${theme.textAccent} font-bold`
                            : "text-zinc-500 group-hover:text-zinc-400"
                        }
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-zinc-500">{proj.year}</span>
                    </div>

                    <div
                      className={`text-xs sm:text-[13px] font-bold uppercase truncate tracking-tight leading-tight ${
                        isActive
                          ? "text-white"
                          : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {proj.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
