"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { WorkstationProject } from "@/types/project";
import { ArrowUpRight, X } from "lucide-react";
import { getProjectEditorial, getClipTheme } from "@/lib/projectUtils";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectDetailsModalProps {
  project: WorkstationProject;
  isOpen: boolean;
  onClose: () => void;
  onSelectStill?: (index: number) => void;
  showWorkstationLink?: boolean;
}

export function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
  onSelectStill,
  showWorkstationLink = false,
}: ProjectDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const editorial = getProjectEditorial(project);
  const theme = getClipTheme(project.clipColor);
  const hasCredits = project.credits && project.credits.length > 0;
  const hasLinks = project.links && project.links.length > 0;
  const hasStills = project.stills && project.stills.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-8 select-none overflow-hidden cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-heading"
          onClick={onClose}
        >
          {/* 1. Backdrop: Soft optical gaussian blur */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 modal-backdrop-blur cursor-pointer"
            aria-hidden="true"
          />

          {/* 2. Modal Box: Swiss Monolithic Specimen Card */}
          <motion.div
            key="modal-panel"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] bg-[#050508] border border-white/[0.14] rounded-none sm:rounded-sm shadow-[0_40px_140px_rgba(0,0,0,0.98)] flex flex-col z-10 overflow-hidden cursor-default"
          >
            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto custom-workstation-scrollbar p-5 sm:p-10 md:p-12 space-y-7 sm:space-y-10">
              {/* Swiss Header & Monumental Display */}
              <div className="space-y-3 pb-6 sm:pb-8 border-b border-white/[0.12]">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase truncate">
                    SPECIMEN // {project.id} · ARCHIVAL RECORD
                  </div>

                  <button
                    onClick={onClose}
                    aria-label="Chiudi scheda"
                    title="Chiudi (Esc)"
                    className="p-1.5 -mr-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 focus-visible:outline-none"
                  >
                    <X className="w-5 h-5 stroke-[1.75]" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
                  <h2
                    id="project-modal-heading"
                    className="text-3xl sm:text-6xl md:text-7xl font-black uppercase tracking-[-0.04em] text-white leading-[0.92] break-words"
                  >
                    {editorial.title}
                  </h2>

                  <span
                    className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase flex-shrink-0 sm:text-right"
                    style={{ color: theme.colorHex }}
                  >
                    {editorial.category}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] sm:text-[11px] text-zinc-400 tracking-[0.16em] uppercase pt-1">
                  <span>{editorial.meta}</span>
                  <span className="text-zinc-700" aria-hidden="true">—</span>
                  <span>{project.typeLabel}</span>
                  <span className="text-zinc-700" aria-hidden="true">—</span>
                  <span className="text-zinc-300">{project.role}</span>
                </div>
              </div>

              {/* Master Media Frame */}
              <div className="relative aspect-video w-full rounded-none sm:rounded-sm overflow-hidden bg-black border border-white/[0.12]">
                <img
                  src={getOptimizedImageUrl(project.primaryMedia.poster, 1080)}
                  alt={project.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("mqdefault.jpg")) {
                      target.src = project.primaryMedia.youtubeId
                        ? `https://img.youtube.com/vi/${project.primaryMedia.youtubeId}/mqdefault.jpg`
                        : project.primaryMedia.poster;
                    }
                  }}
                  onLoad={(e) => {
                    e.currentTarget.classList.remove("opacity-0");
                    e.currentTarget.classList.add("opacity-100");
                  }}
                  className="w-full h-full object-contain transition-opacity duration-300 opacity-0"
                  decoding="async"
                />

                {showWorkstationLink && (
                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20">
                    <Link
                      href={`/?project=${project.slug}`}
                      onClick={onClose}
                      aria-label="Apri nella Workstation"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 bg-black/90 hover:bg-white text-zinc-200 hover:text-black border border-white/25 hover:border-white font-mono text-[10px] uppercase tracking-wider transition-all duration-150 backdrop-blur-sm"
                    >
                      <span className="sm:hidden">MONITOR ↗</span>
                      <span className="hidden sm:inline">MONITOR WORKSTATION ↗</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Synopsis & Directorial Note */}
              <div className="space-y-2.5">
                <h3 className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
                  01 / SINOSSI & NOTE AUTORIALI
                </h3>
                <p className="text-sm sm:text-base font-light text-zinc-200 leading-[1.75] max-w-3xl text-pretty">
                  {project.synopsis}
                </p>
              </div>

              {/* Technical Specifications — Swiss Specimen Grid */}
              {project.technicalSpecs && (
                <div className="space-y-2.5">
                  <h3 className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
                    02 / SPECIFICHE TECNICHE
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/[0.08] border border-white/[0.12]">
                    {project.technicalSpecs.camera && (
                      <div className="bg-[#050508] p-3 sm:p-4 min-w-0">
                        <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500 mb-1">
                          CAMERA
                        </span>
                        <span className="block font-mono text-[11px] sm:text-xs text-zinc-200 uppercase break-words leading-snug font-medium">
                          {project.technicalSpecs.camera}
                        </span>
                      </div>
                    )}
                    {project.technicalSpecs.optics && (
                      <div className="bg-[#050508] p-3 sm:p-4 min-w-0">
                        <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500 mb-1">
                          OTTICHE
                        </span>
                        <span className="block font-mono text-[11px] sm:text-xs text-zinc-200 uppercase break-words leading-snug font-medium">
                          {project.technicalSpecs.optics}
                        </span>
                      </div>
                    )}
                    {project.technicalSpecs.software && (
                      <div className="bg-[#050508] p-3 sm:p-4 min-w-0">
                        <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500 mb-1">
                          SOFTWARE
                        </span>
                        <span className="block font-mono text-[11px] sm:text-xs text-zinc-200 uppercase break-words leading-snug font-medium">
                          {project.technicalSpecs.software}
                        </span>
                      </div>
                    )}
                    {project.technicalSpecs.frontend && (
                      <div className="bg-[#050508] p-3 sm:p-4 min-w-0">
                        <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500 mb-1">
                          FRONTEND
                        </span>
                        <span className="block font-mono text-[11px] sm:text-xs text-zinc-200 uppercase break-words leading-snug font-medium">
                          {project.technicalSpecs.frontend}
                        </span>
                      </div>
                    )}
                    {project.technicalSpecs.colorGrade && (
                      <div className="bg-[#050508] p-3 sm:p-4 min-w-0">
                        <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500 mb-1">
                          COLOR
                        </span>
                        <span className="block font-mono text-[11px] sm:text-xs text-zinc-200 uppercase break-words leading-snug font-medium">
                          {project.technicalSpecs.colorGrade}
                        </span>
                      </div>
                    )}
                    {project.technicalSpecs.stock && (
                      <div className="bg-[#050508] p-3 sm:p-4 min-w-0">
                        <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500 mb-1">
                          FORMATO
                        </span>
                        <span className="block font-mono text-[11px] sm:text-xs text-zinc-200 uppercase break-words leading-snug font-medium">
                          {project.technicalSpecs.stock}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Credits — Editorial Swiss Table */}
              {hasCredits && (
                <div className="space-y-3">
                  <h3 className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
                    03 / CREDITI PRODUZIONE
                  </h3>

                  <div className="border-t border-white/[0.12] grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                    {project.credits!.map((credit, idx) => {
                      const isFullWidth =
                        (credit.name?.length ?? 0) > 35 ||
                        project.credits!.length === 1;

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0 py-2.5 border-b border-white/[0.04] ${
                            isFullWidth ? "sm:col-span-2" : ""
                          }`}
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:w-36 flex-shrink-0">
                            {credit.role}
                          </span>
                          <span className="font-medium text-xs sm:text-sm text-zinc-200 uppercase tracking-tight break-words">
                            {credit.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stills Gallery Grid */}
              {hasStills && (
                <div className="space-y-3">
                  <h3 className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
                    04 / KEY FRAMES [{project.stills.length}]
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {project.stills.map((still, idx) => (
                      <button
                        key={still.id}
                        onClick={() => {
                          onSelectStill?.(idx + 1);
                          onClose();
                        }}
                        className="group relative aspect-video rounded-none overflow-hidden bg-black border border-white/[0.1] hover:border-white/50 cursor-pointer transition-colors duration-150 focus-visible:outline-none text-left"
                        title={`Visualizza frame ${idx + 1}`}
                      >
                        <img
                          src={getOptimizedImageUrl(still.url, 384)}
                          alt={`${project.title} frame ${idx + 1}`}
                          onLoad={(e) => {
                            e.currentTarget.classList.remove("opacity-0");
                            e.currentTarget.classList.add("opacity-100");
                          }}
                          className="w-full h-full object-contain transition-opacity duration-300 opacity-0"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <span className="text-[9px] font-mono tabular-nums tracking-widest uppercase text-white">
                            FRAME {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              {hasLinks && (
                <div className="space-y-2.5 pt-4 border-t border-white/[0.12]">
                  <h3 className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
                    05 / COLLEGAMENTI ESTERNI
                  </h3>

                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    {project.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 cursor-pointer group"
                      >
                        <span className="group-hover:underline underline-offset-4 decoration-white/40">
                          {link.label}
                        </span>
                        <ArrowUpRight
                          className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swiss Colophon Bar */}
            <div className="min-h-[2.5rem] py-2.5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:py-0 sm:pb-0 sm:h-10 px-5 sm:px-12 border-t border-white/[0.08] flex items-center justify-between gap-4 text-[10px] text-zinc-500 font-mono tracking-widest uppercase flex-shrink-0">
              <span className="flex-shrink-0">
                <span className="sm:hidden">TR</span>
                <span className="hidden sm:inline">TOMMASO RUELLA</span> © {new Date().getFullYear()}
              </span>
              <span className="truncate">PROJECT // {project.title.toUpperCase()}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
