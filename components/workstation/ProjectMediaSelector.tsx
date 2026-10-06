"use client";

import React from "react";
import { WorkstationProject } from "@/types/project";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

interface ProjectMediaSelectorProps {
  project: WorkstationProject;
  activeMediaIndex: number;
  onSelectMedia: (index: number) => void;
}

function getCleanPoster(posterUrl: string, youtubeId?: string): string {
  if (youtubeId && posterUrl && posterUrl.includes("img.youtube.com")) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  return posterUrl;
}

export function ProjectMediaSelector({
  project,
  activeMediaIndex,
  onSelectMedia,
}: ProjectMediaSelectorProps) {
  const cleanPoster = getCleanPoster(project.primaryMedia.poster, project.primaryMedia.youtubeId);

  return (
    <aside className="w-full h-full flex flex-col davinci-panel overflow-hidden select-none bg-[#0c0c10]">
      {/* Clean Header: Project Title + Telemetry Count */}
      <div className="h-12 px-4 sm:px-5 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0 bg-[#0c0c10]">
        <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase truncate pr-2">
          {project.title}
        </h2>
        <span className="text-xs text-zinc-400 font-medium flex-shrink-0">
          [{project.stills.length + 1}]
        </span>
      </div>

      {/* Pure Stills Grid: Automatic Natural Aspect Ratio */}
      <div className="flex-1 overflow-y-auto custom-workstation-scrollbar p-2.5 sm:p-3.5 space-y-2.5">
        {/* Item 0: Lead Media / Master Feed */}
        <button
          onClick={() => onSelectMedia(0)}
          className={`w-full text-left relative davinci-card block transition-[border-color,box-shadow,transform] duration-200 group cursor-pointer focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none ${
            activeMediaIndex === 0
              ? "ring-1 ring-white/90 border-transparent shadow-[0_0_16px_rgba(255,255,255,0.12)]"
              : "border-white/[0.08] hover:border-white/30"
          }`}
          aria-label={`Media Principale ${project.title}`}
        >
          <div className="relative w-full overflow-hidden bg-black/80 rounded-lg">
            <img
              src={getOptimizedImageUrl(cleanPoster, 384)}
              alt={project.title}
              onLoad={(e) => {
                e.currentTarget.classList.remove("opacity-0");
                e.currentTarget.classList.add("opacity-100");
              }}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("hqdefault.jpg")) {
                  target.src = project.primaryMedia.poster;
                }
              }}
              className="w-full h-auto block filter contrast-105 group-hover:scale-[1.02] transition-all duration-300 ease-out opacity-0"
              decoding="async"
            />
            <div className="optical-glare" />
            {activeMediaIndex === 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" aria-hidden="true" />
            )}
          </div>
        </button>

        {/* Asymmetric Columns: Natural Aspect Ratio Masonry */}
        <div className="columns-2 gap-2 space-y-2">
          {project.stills.map((still, idx) => {
            const mediaIndex = idx + 1;
            const isSelected = activeMediaIndex === mediaIndex;

            return (
              <button
                key={still.id}
                onClick={() => onSelectMedia(mediaIndex)}
                className={`w-full break-inside-avoid text-left relative davinci-card block transition-[border-color,box-shadow,transform] duration-200 group cursor-pointer focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none ${
                  isSelected
                    ? "ring-1 ring-white/90 border-transparent shadow-[0_0_16px_rgba(255,255,255,0.12)]"
                    : "border-white/[0.08] hover:border-white/30"
                }`}
                aria-label={`Still ${idx + 1} per ${project.title}`}
              >
                <div className="relative w-full overflow-hidden bg-black/80 rounded-lg">
                  <img
                    src={getOptimizedImageUrl(still.url, 384)}
                    alt={`${project.title} Still ${idx + 1}`}
                    onLoad={(e) => {
                      e.currentTarget.classList.remove("opacity-0");
                      e.currentTarget.classList.add("opacity-100");
                    }}
                    className="w-full h-auto block filter contrast-105 group-hover:scale-[1.03] transition-all duration-300 ease-out opacity-0"
                    decoding="async"
                  />
                  <div className="optical-glare" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" aria-hidden="true" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
