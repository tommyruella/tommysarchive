"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WORKSTATION_PROJECTS } from "@/data/projects";
import { WorkstationProject } from "@/types/project";
import { ProjectDetailsModal } from "@/components/workstation/ProjectDetailsModal";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

export default function FilmsPage() {
  const [selectedFilm, setSelectedFilm] = useState<WorkstationProject | null>(null);

  const films = WORKSTATION_PROJECTS.filter(
    (p) => p.primaryMedia.type === "video" || p.category === "FILM"
  );

  return (
    <div className="pt-8 sm:pt-12 pb-24 px-4 sm:px-10 max-w-7xl mx-auto w-full flex-1 select-none">
      <div className="flex items-baseline justify-between mb-10 sm:mb-14 pb-5 border-b border-white/[0.08]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-150 mb-3 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            aria-label="Torna alla Workstation"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Workstation</span>
          </Link>
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white uppercase text-balance">
            Films
          </h1>
        </div>

        <span className="text-xs text-zinc-400 font-mono tabular-nums tracking-wider">
          [{films.length}&nbsp;PROGETTI]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {films.map((film) => (
          <button
            key={film.id}
            onClick={() => setSelectedFilm(film)}
            className="group block space-y-3.5 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none rounded-2xl cursor-pointer text-left w-full"
            aria-label={`Vedi dettaglio film ${film.title}`}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/[0.08] group-hover:border-white/30 transition-[border-color] duration-300">
              <img
                src={getOptimizedImageUrl(film.primaryMedia.poster, 640)}
                alt={film.title}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="flex items-baseline justify-between px-1 pt-1">
              <div className="min-w-0 pr-4">
                <h2 className="text-lg sm:text-2xl font-bold text-white group-hover:text-zinc-300 transition-colors duration-150 uppercase truncate">
                  {film.title}
                </h2>
                <div className="text-xs font-mono text-zinc-400 pt-0.5">
                  {film.typeLabel} · <span className="text-zinc-300">{film.role}</span>
                </div>
              </div>

              <span className="text-xs font-mono tabular-nums text-zinc-400 flex-shrink-0">
                {film.year}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Centered Modal Pop-up */}
      <ProjectDetailsModal
        project={selectedFilm || films[0]}
        isOpen={!!selectedFilm}
        onClose={() => setSelectedFilm(null)}
        showWorkstationLink={true}
      />
    </div>
  );
}
