"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WORKSTATION_PROJECTS } from "@/data/projects";
import { MainProjectViewer } from "./MainProjectViewer";
import { ProjectTimelineBar } from "./ProjectTimelineBar";
import { AboutWorkstationDrawer } from "./AboutWorkstationDrawer";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { ArrowUpRight } from "lucide-react";

export function WorkstationShell() {
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const projectParam = params.get("project");
      if (projectParam) {
        const found = WORKSTATION_PROJECTS.find(
          (p) => p.slug === projectParam || p.id === projectParam
        );
        if (found) return found.id;
      }
    }
    return WORKSTATION_PROJECTS[0]?.id || "01";
  });
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimecode, setCurrentTimecode] = useState<string>("00:00:00:00");
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const activeProject =
    WORKSTATION_PROJECTS.find((p) => p.id === activeProjectId) ||
    WORKSTATION_PROJECTS[0];

  const activeIndex = WORKSTATION_PROJECTS.findIndex(
    (p) => p.id === activeProject.id
  );

  // Sync with URL query parameter ?project=slug and ?details=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const projectParam = params.get("project");
      const detailsParam = params.get("details");
      if (projectParam) {
        const found = WORKSTATION_PROJECTS.find(
          (p) => p.slug === projectParam || p.id === projectParam
        );
        if (found) {
          setActiveProjectId(found.id);
        }
      }
      if (detailsParam === "true" || detailsParam === "1") {
        setIsDetailsOpen(true);
      }
    }
  }, []);

  // Update timecode and URL when active project changes
  useEffect(() => {
    setCurrentTimecode(activeProject.timecode || "00:00:00:00");
    setActiveMediaIndex(0);
    setIsPlaying(false);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("project", activeProject.slug);
      window.history.replaceState({}, "", url.toString());
    }
  }, [activeProjectId, activeProject]);

  const handleSelectProject = useCallback((id: string) => {
    setActiveProjectId(id);
    setActiveMediaIndex(0);
    setIsPlaying(false);
  }, []);

  const handleStepMedia = useCallback(
    (direction: "prev" | "next") => {
      const currentIndex = WORKSTATION_PROJECTS.findIndex(
        (p) => p.id === activeProjectId
      );
      if (direction === "next") {
        const nextIndex = (currentIndex + 1) % WORKSTATION_PROJECTS.length;
        handleSelectProject(WORKSTATION_PROJECTS[nextIndex].id);
      } else {
        const prevIndex =
          (currentIndex - 1 + WORKSTATION_PROJECTS.length) %
          WORKSTATION_PROJECTS.length;
        handleSelectProject(WORKSTATION_PROJECTS[prevIndex].id);
      }
    },
    [activeProjectId, handleSelectProject]
  );

  // Keyboard navigation: Space to play, Arrows to navigate projects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % WORKSTATION_PROJECTS.length;
        handleSelectProject(WORKSTATION_PROJECTS[nextIndex].id);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        const prevIndex =
          (activeIndex - 1 + WORKSTATION_PROJECTS.length) %
          WORKSTATION_PROJECTS.length;
        handleSelectProject(WORKSTATION_PROJECTS[prevIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, handleSelectProject]);

  return (
    <div className="w-full h-[100dvh] bg-[#000000] text-zinc-100 flex flex-col overflow-hidden select-none">
      {/* 1. MINIMAL AUTHORIAL TOP NAVIGATION BAR */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0 bg-[#000000] z-20">
        {/* Left: Author Identity (Only Name) */}
        <Link
          href="/"
          className="focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
        >
          <span className="text-sm sm:text-base font-black tracking-tight uppercase text-white hover:text-zinc-300 transition-colors">
            Tommaso Ruella
          </span>
        </Link>

        {/* Right: Just Archive */}
        <Link
          href="/archive"
          className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
        >
          Archive
        </Link>
      </header>

      {/* 2. MAIN CINEMA STAGE (Single hero stage, zero cramped side panels!) */}
      <main className="flex-1 w-full min-h-0 flex flex-col overflow-hidden relative p-2 sm:p-4 md:p-6">
        <MainProjectViewer
          project={activeProject}
          activeMediaIndex={activeMediaIndex}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStepMedia={handleStepMedia}
          onSelectMedia={setActiveMediaIndex}
          currentTimecode={currentTimecode}
          onTimeUpdate={setCurrentTimecode}
          onOpenDetails={() => setIsDetailsOpen(true)}
        />
      </main>

      {/* 3. SIGNATURE SMPTE PLAYHEAD & FILMSTRIP RAIL */}
      <footer className="w-full flex-shrink-0 h-28 sm:h-32">
        <ProjectTimelineBar
          projects={WORKSTATION_PROJECTS}
          activeProjectId={activeProjectId}
          onSelectProject={handleSelectProject}
        />
      </footer>

      {/* Centered Modal Pop-up for Project Details & Credits */}
      <ProjectDetailsModal
        project={activeProject}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            if (url.searchParams.has("details")) {
              url.searchParams.delete("details");
              window.history.replaceState({}, "", url.toString());
            }
          }
        }}
        onSelectStill={(index) => setActiveMediaIndex(index)}
      />

      {/* Slide-Over Drawer for Profile / About */}
      <AboutWorkstationDrawer
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
