"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { WORKSTATION_PROJECTS } from "@/data/projects";
import { WorkstationProject } from "@/types/project";
import { ProjectDetailsModal } from "@/components/workstation/ProjectDetailsModal";

type FilterType = "ALL" | "FILMS" | "PHOTOS" | "3D";

interface ArchiveItem {
  id: string;
  title: string;
  category: "FILMS" | "PHOTOS" | "3D";
  slug: string;
  image: string;
  project: WorkstationProject;
}

export default function ArchivePage() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [selectedProject, setSelectedProject] = useState<WorkstationProject | null>(null);

  const archiveItems = useMemo<ArchiveItem[]>(() => {
    const projectItems: ArchiveItem[] = [];
    const seenImages = new Set<string>();

    WORKSTATION_PROJECTS.forEach((proj) => {
      const cat: "FILMS" | "PHOTOS" | "3D" =
        proj.category === "3D" || proj.category === "3D MOTION"
          ? "3D"
          : proj.category === "PHOTOGRAPHY" || proj.category === "PHOTO"
          ? "PHOTOS"
          : "FILMS";

      // Lead project image (guaranteed unique)
      if (proj.primaryMedia.poster && !seenImages.has(proj.primaryMedia.poster)) {
        seenImages.add(proj.primaryMedia.poster);
        projectItems.push({
          id: `proj-${proj.id}`,
          title: proj.title,
          category: cat,
          slug: `/?project=${proj.slug}`,
          image: proj.primaryMedia.poster,
          project: proj,
        });
      }

      // Distinct project stills
      proj.stills.forEach((still, sIdx) => {
        if (still.url && !seenImages.has(still.url)) {
          seenImages.add(still.url);
          projectItems.push({
            id: `still-${proj.id}-${sIdx}`,
            title: `${proj.title} Frame ${sIdx + 1}`,
            category: cat,
            slug: `/?project=${proj.slug}`,
            image: still.url,
            project: proj,
          });
        }
      });
    });

    return projectItems;
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "ALL") return archiveItems;
    return archiveItems.filter((item) => item.category === filter);
  }, [archiveItems, filter]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-zinc-100 select-none">
      {/* 1. SLIM BRUTALIST AUTHORIAL HEADER */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-white/[0.08] flex items-center justify-between bg-black sticky top-0 z-30 flex-shrink-0">
        {/* Left: Author Brand (Pure name, no breadcrumbs) */}
        <div className="flex items-center">
          <Link
            href="/"
            className="group focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            aria-label="Torna alla Workstation"
          >
            <span className="text-sm sm:text-base font-black tracking-tight uppercase text-white group-hover:text-zinc-300 transition-colors">
              Tommaso Ruella
            </span>
          </Link>
        </div>

        {/* Center: Category Filter Tabs (Pure Typographic Highlight) */}
        <div
          className="flex items-center gap-3 sm:gap-5"
          role="tablist"
          aria-label="Filtri Categoria"
        >
          {[
            { label: "Tutto", val: "ALL" },
            { label: "Film", val: "FILMS" },
            { label: "3D", val: "3D" },
            { label: "Foto", val: "PHOTOS" },
          ].map((tab) => {
            const isActive = filter === tab.val;
            return (
              <button
                key={tab.val}
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(tab.val as FilterType)}
                className={`py-1 text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-colors duration-150 cursor-pointer bg-transparent border-0 focus-visible:outline-none ${
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

        {/* Right: Back to Timeline (Pure text highlight, no button container) */}
        <div className="flex items-center">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none"
            aria-label="Torna alla Timeline"
          >
            TIMELINE
          </Link>
        </div>
      </header>

      {/* 2. CINEMA ARCHIVE FULLGRID: CLICKING OPENS CENTERED MODAL */}
      <main className="flex-1 w-full p-2.5 sm:p-4 md:p-6">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedProject(item.project)}
              title={item.title}
              aria-label={`Visualizza scheda dettaglio di ${item.title}`}
              className="group relative block aspect-[16/10] overflow-hidden rounded-sm bg-black border border-white/[0.08] hover:border-white/40 transition-all duration-200 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none cursor-pointer text-left w-full"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />

              {/* Minimal Hover Overlay with Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2 sm:p-2.5">
                <span className="text-[11px] font-mono text-white truncate drop-shadow">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 3. CENTERED INTERACTIVE MODAL (Click outside on backdrop to exit) */}
      <ProjectDetailsModal
        project={selectedProject || WORKSTATION_PROJECTS[0]}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        showWorkstationLink={true}
      />
    </div>
  );
}
