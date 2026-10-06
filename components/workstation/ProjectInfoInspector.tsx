"use client";

import React from "react";
import { WorkstationProject } from "@/types/project";
import { ArrowUpRight } from "lucide-react";

interface ProjectInfoInspectorProps {
  project: WorkstationProject;
}

export function ProjectInfoInspector({ project }: ProjectInfoInspectorProps) {
  const hasCredits = project.credits && project.credits.length > 0;
  const hasLinks = project.links && project.links.length > 0;

  return (
    <aside className="w-full h-full flex flex-col davinci-panel overflow-hidden select-none bg-[#0c0c10]">
      {/* Header ("PROJECT INFO") */}
      <div className="h-12 px-4 sm:px-5 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0 bg-[#0c0c10]">
        <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
          Project Info
        </h2>
        <span className="text-xs text-zinc-400 font-medium">
          {project.year}
        </span>
      </div>

      {/* Editorial Content */}
      <div className="flex-1 overflow-y-auto custom-workstation-scrollbar p-5 sm:p-6 space-y-6">
        {/* Synopsis */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
            Sinossi & Concept
          </h3>
          <p className="text-sm font-normal text-zinc-200 leading-relaxed text-pretty">
            {project.synopsis}
          </p>
        </div>

        {/* Technical Highlights / Software */}
        {project.technicalSpecs && (
          <div className="space-y-2 pt-1">
            <h3 className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Specifiche & Strumenti
            </h3>

            <div className="space-y-1 text-xs">
              {project.technicalSpecs.camera && (
                <div className="flex items-center justify-between text-zinc-300 py-1.5 border-b border-white/[0.04]">
                  <span className="text-zinc-500 font-mono text-[11px]">Camera</span>
                  <span className="font-medium text-zinc-200">{project.technicalSpecs.camera}</span>
                </div>
              )}
              {project.technicalSpecs.software && (
                <div className="flex items-center justify-between text-zinc-300 py-1.5 border-b border-white/[0.04]">
                  <span className="text-zinc-500 font-mono text-[11px]">Software</span>
                  <span className="font-medium text-zinc-200">{project.technicalSpecs.software}</span>
                </div>
              )}
              {project.technicalSpecs.colorGrade && (
                <div className="flex items-center justify-between text-zinc-300 py-1.5 border-b border-white/[0.04]">
                  <span className="text-zinc-500 font-mono text-[11px]">Color Grading</span>
                  <span className="font-medium text-zinc-200">{project.technicalSpecs.colorGrade}</span>
                </div>
              )}
              {project.technicalSpecs.stock && (
                <div className="flex items-center justify-between text-zinc-300 py-1.5">
                  <span className="text-zinc-500 font-mono text-[11px]">Pellicola</span>
                  <span className="font-medium text-zinc-200">{project.technicalSpecs.stock}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Credits */}
        {hasCredits && (
          <div className="space-y-2 pt-1">
            <h3 className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Crediti & Reparto
            </h3>

            <div className="space-y-1 text-xs">
              {project.credits!.map((credit, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-3 text-zinc-300 py-1 border-b border-white/[0.03]">
                  <span className="text-zinc-500 font-mono text-[11px] min-w-[70px] flex-shrink-0">{credit.role}</span>
                  <span className="font-medium text-zinc-200 text-right leading-relaxed">{credit.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {hasLinks && (
          <div className="pt-2 border-t border-white/[0.06] space-y-2">
            <h3 className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Link Esterni
            </h3>

            <div className="space-y-2">
              {project.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] hover:border-white/20 text-xs font-medium text-zinc-200 hover:text-white flex items-center justify-between transition-[background-color,border-color,color] duration-150 group cursor-pointer focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
                >
                  <span className="truncate">{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
