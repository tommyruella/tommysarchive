"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { WorkstationProject } from "@/types/project";
import { X, ArrowUpRight } from "lucide-react";
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-8 select-none overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-heading"
        >
          {/* 1. Backdrop: animates blur and dark overlay in lockstep */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* 2. Modal Box: smooth glide up from bottom, deep pitch black, brutalist restraint */}
          <motion.div
            key="modal-panel"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] bg-[#070709] border border-white/10 rounded-t-xl sm:rounded-lg shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col z-10 overflow-hidden"
          >
        {/* Header Bar */}
        <div className="h-12 sm:h-14 px-5 sm:px-8 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0 bg-transparent">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
            <span className="text-zinc-500 tabular-nums">[{project.id} // 11]</span>
            <span className="text-zinc-700" aria-hidden="true">/</span>
            <span>PROJECT DETAILS</span>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none group"
            aria-label="Chiudi"
          >
            <span className="hidden sm:inline text-zinc-500 group-hover:text-zinc-300">ESC</span>
            <X className="w-4 h-4 stroke-[2]" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto custom-workstation-scrollbar p-5 sm:p-8 md:p-10 space-y-8 sm:space-y-10">
          {/* Main Title Block: Matches homepage caption band signature */}
          <div className="space-y-2.5 pb-6 border-b border-white/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <h2
                id="project-modal-heading"
                className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none"
              >
                {editorial.title}
              </h2>
              <span
                className={`font-mono text-xs sm:text-sm md:text-base ${theme.textAccent} font-bold tracking-widest uppercase flex-shrink-0 sm:text-right`}
                style={{ color: theme.colorHex }}
              >
                {editorial.category}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] sm:text-xs text-zinc-500 tracking-wider uppercase pt-1">
              <span className="text-zinc-400">{editorial.meta}</span>
              <span className="text-zinc-700" aria-hidden="true">/</span>
              <span>{project.typeLabel}</span>
              <span className="text-zinc-700" aria-hidden="true">/</span>
              <span>{project.role}</span>
            </div>
          </div>

          {/* Master Media Frame */}
          <div className="relative aspect-video w-full rounded-sm overflow-hidden bg-black border border-white/[0.08]">
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
              <div className="absolute bottom-3 right-3 z-20">
                <Link
                  href={`/?project=${project.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/80 hover:bg-white text-zinc-300 hover:text-black border border-white/20 hover:border-white font-mono text-[11px] uppercase tracking-wider transition-all duration-150 backdrop-blur-sm"
                >
                  <span>MONITOR WORKSTATION ↗</span>
                </Link>
              </div>
            )}
          </div>

          {/* Synopsis & Directorial Note */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              SINOSSI & NOTE
            </h3>
            <p className="text-sm sm:text-base font-normal text-zinc-300 leading-relaxed max-w-3xl">
              {project.synopsis}
            </p>
          </div>

          {/* Technical Specifications */}
          {project.technicalSpecs && (
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                SPECIFICHE TECNICHE
              </h3>

              <div className="flex flex-wrap items-start gap-x-8 sm:gap-x-12 gap-y-3 py-3 border-y border-white/[0.06]">
                {project.technicalSpecs.camera && (
                  <div className="min-w-[120px] flex-shrink-0">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                      CAMERA
                    </span>
                    <span className="font-mono text-xs text-zinc-200 uppercase whitespace-nowrap">
                      {project.technicalSpecs.camera}
                    </span>
                  </div>
                )}
                {project.technicalSpecs.optics && (
                  <div className="min-w-[120px] flex-shrink-0">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                      OTTICHE
                    </span>
                    <span className="font-mono text-xs text-zinc-200 uppercase whitespace-nowrap">
                      {project.technicalSpecs.optics}
                    </span>
                  </div>
                )}
                {project.technicalSpecs.software && (
                  <div className="min-w-[140px] flex-shrink-0">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                      SOFTWARE
                    </span>
                    <span className="font-mono text-xs text-zinc-200 uppercase whitespace-nowrap">
                      {project.technicalSpecs.software}
                    </span>
                  </div>
                )}
                {project.technicalSpecs.frontend && (
                  <div className="min-w-[120px] flex-shrink-0">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                      FRONT-END
                    </span>
                    <span className="font-mono text-xs text-zinc-200 uppercase whitespace-nowrap">
                      {project.technicalSpecs.frontend}
                    </span>
                  </div>
                )}
                {project.technicalSpecs.colorGrade && (
                  <div className="min-w-[120px] flex-shrink-0">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                      COLOR
                    </span>
                    <span className="font-mono text-xs text-zinc-200 uppercase whitespace-nowrap">
                      {project.technicalSpecs.colorGrade}
                    </span>
                  </div>
                )}
                {project.technicalSpecs.stock && (
                  <div className="min-w-[120px] flex-shrink-0">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                      FORMATO
                    </span>
                    <span className="font-mono text-xs text-zinc-200 uppercase whitespace-nowrap">
                      {project.technicalSpecs.stock}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Credits */}
          {hasCredits && (
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                CREDITI
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-xs">
                {project.credits!.map((credit, idx) => {
                  const isFullWidth =
                    (credit.name?.length ?? 0) > 35 ||
                    project.credits!.length === 1;

                  return (
                    <div
                      key={idx}
                      className={`flex items-baseline gap-4 py-2 border-b border-white/[0.04] ${
                        isFullWidth ? "sm:col-span-2" : ""
                      }`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 min-w-[70px] sm:min-w-[85px] flex-shrink-0">
                        {credit.role}
                      </span>
                      <span className="font-medium text-xs sm:text-sm text-zinc-200 leading-relaxed">
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
              <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                KEY FRAMES [{project.stills.length}]
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {project.stills.map((still, idx) => (
                  <button
                    key={still.id}
                    onClick={() => {
                      onSelectStill?.(idx + 1);
                      onClose();
                    }}
                    className="group relative aspect-video rounded-sm overflow-hidden bg-black border border-white/[0.08] hover:border-white/40 cursor-pointer transition-colors duration-150 focus-visible:outline-none text-left"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] font-mono tabular-nums text-white">
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
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                COLLEGAMENTI ESTERNI
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
      </motion.div>
    </div>
  )}
</AnimatePresence>
  );
}
