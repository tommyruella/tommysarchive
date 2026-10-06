"use client";

import React, { useEffect } from "react";
import { X, Mail, ArrowUpRight } from "lucide-react";
import { resolveMediaUrl } from "@/data/projects";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

interface AboutWorkstationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="3" ry="3" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function AboutWorkstationDrawer({
  isOpen,
  onClose,
}: AboutWorkstationDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-fade"
        aria-hidden="true"
      />

      {/* Slide-Over Drawer */}
      <aside
        className="relative w-full max-w-xl h-full bg-[#0c0c10] border-l border-white/10 shadow-2xl flex flex-col z-10 sm:rounded-l-lg overflow-hidden animate-reveal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-heading"
      >
        {/* Header */}
        <div className="h-16 px-6 sm:px-8 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0 bg-transparent">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
              Profilo & Presentazione
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none"
            aria-label="Chiudi finestra profilo"
          >
            <X className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-workstation-scrollbar p-6 sm:p-8 space-y-7">
          {/* Introduction with Authentic Frame Portrait */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/60 shadow-lg">
              <img
                src={getOptimizedImageUrl(resolveMediaUrl("/projects/esothia/02.png"), 128)}
                alt="Tommaso Ruella"
                className="w-full h-full object-cover object-center"
                decoding="async"
              />
            </div>
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-md bg-white/[0.08] text-[11px] font-mono font-medium text-emerald-400 inline-block">
                Ingegneria del Cinema · III&nbsp;Anno
              </span>
              <h2 id="profile-heading" className="text-2xl font-bold tracking-tight text-white">
                Tommaso Ruella
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Politecnico di Torino · 21&nbsp;Anni
              </p>
            </div>
          </div>

          {/* Statement & Bio */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Chi Sono
            </h3>
            <p className="text-sm font-light text-zinc-200 leading-relaxed text-pretty">
              Frequento il III anno di Ingegneria del Cinema al Politecnico di Torino. Sono appassionato di creazione di contenuti visivi, in particolare storytelling, montaggio e color grading, con sperimentazioni su compositing e VFX.
            </p>
            <p className="text-xs font-light text-zinc-400 leading-relaxed text-pretty">
              Lavoro in team con precisione tecnica, alla costante ricerca di contrasti visivi autentici e nuove grammatiche narrative.
            </p>
          </div>

          {/* Core Skills & Tools */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Aree di Interesse & Competenze
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-medium uppercase">Montaggio & Color</span>
                <p className="text-xs font-medium text-zinc-200">
                  Premiere Pro · DaVinci Resolve
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-medium uppercase">3D & Compositing</span>
                <p className="text-xs font-medium text-zinc-200">
                  Blender · After Effects · Substance
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-medium uppercase">Fotografia & Grafica</span>
                <p className="text-xs font-medium text-zinc-200">
                  Photoshop · Lightroom · InDesign
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-medium uppercase">Web & Interattivo</span>
                <p className="text-xs font-medium text-zinc-200">
                  React · Next.js · TouchDesigner
                </p>
              </div>
            </div>
          </div>

          {/* Social Links & Contatti */}
          <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
            <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Contatti
            </h3>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/tommy.ruella/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/20 text-xs font-medium text-white flex items-center justify-between transition-[background-color,border-color] duration-150 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>@tommy.ruella</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" aria-hidden="true" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/tommaso-ruella-847948309/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/20 text-xs font-medium text-white flex items-center justify-between transition-[background-color,border-color] duration-150 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <LinkedInIcon className="w-4 h-4 text-sky-400" />
                <span>Tommaso Ruella</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" aria-hidden="true" />
            </a>

            {/* Email */}
            <a
              href="mailto:tommytegamino@gmail.com"
              className="w-full py-2.5 px-4 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center justify-between transition-[background-color] duration-150 shadow-md focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>tommytegamino@gmail.com</span>
              </div>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.06] bg-black/60 flex items-center justify-between text-xs text-zinc-500 font-mono tabular-nums flex-shrink-0">
          <span>Tommaso Ruella © {new Date().getFullYear()}</span>
          <span>Politecnico di Torino</span>
        </div>
      </aside>
    </div>
  );
}
