"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize, Minimize, ArrowUpRight } from "lucide-react";
import { WorkstationProject } from "@/types/project";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

interface FilmDetailViewProps {
  project: WorkstationProject;
}

export default function FilmDetailView({ project }: FilmDetailViewProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStartedIframe, setHasStartedIframe] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isVideo = project.primaryMedia.type === "video";
  const hasLocalVideo = !!project.primaryMedia.localVideo;
  const hasYoutube = !!project.primaryMedia.youtubeId;

  return (
    <div className="pt-8 sm:pt-12 pb-28 px-4 sm:px-10 max-w-7xl mx-auto w-full flex-1">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          aria-label="Torna alla Workstation"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Workstation</span>
        </Link>

        {isVideo && (
          <button
            onClick={toggleFullscreen}
            className="frosted-dock px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-[color,background-color] duration-150 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            title="Schermo intero"
            aria-label="Alterna Schermo Intero"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Riduci</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Schermo Intero</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Viewport / Cinema Stage */}
      <div
        ref={playerContainerRef}
        className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl mb-12 sm:mb-16 border border-white/[0.08]"
      >
        {isVideo ? (
          hasLocalVideo ? (
            <video
              className="w-full h-full object-contain bg-black"
              src={project.primaryMedia.localVideo}
              poster={project.primaryMedia.poster}
              controls
              playsInline
            />
          ) : hasYoutube ? (
            hasStartedIframe ? (
              <iframe
                src={`https://www.youtube.com/embed/${project.primaryMedia.youtubeId}?autoplay=1&rel=0`}
                title={project.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => setHasStartedIframe(true)}
                className="w-full h-full relative group cursor-pointer overflow-hidden bg-black flex items-center justify-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHasStartedIframe(true);
                  }
                }}
                aria-label={`Riproduci ${project.title}`}
              >
                <img
                  src={getOptimizedImageUrl(project.primaryMedia.poster, 1200)}
                  alt={project.title}
                  className="w-full h-full object-contain"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 group-hover:bg-white/25 backdrop-blur-md border border-white/25 flex items-center justify-center text-white transition-all transform group-hover:scale-110 shadow-2xl">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
                  </div>
                </div>
              </div>
            )
          ) : (
            <img
              src={getOptimizedImageUrl(project.primaryMedia.poster, 1200)}
              alt={project.title}
              className="w-full h-full object-contain"
              decoding="async"
            />
          )
        ) : (
          <img
            src={getOptimizedImageUrl(project.primaryMedia.src || project.primaryMedia.poster, 1200)}
            alt={project.title}
            className="w-full h-full object-contain"
            decoding="async"
          />
        )}
      </div>

      {/* Project Meta, Editorial & Stills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
        {/* Left Column: Heading, Synopsis & Stills */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white uppercase text-balance">
              {project.title}
            </h1>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-400 font-mono tabular-nums">
              <span>{project.typeLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{project.year}</span>
              {project.duration && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{project.duration}</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 text-zinc-300 text-base sm:text-lg font-light leading-relaxed max-w-3xl text-pretty">
            <p>{project.synopsis}</p>
          </div>

          {/* Stills Gallery */}
          {project.stills.length > 0 && (
            <div className="pt-4 space-y-4">
              <h2 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider tabular-nums">
                Fotogrammi & Stills [{project.stills.length}]
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {project.stills.map((still) => (
                  <div
                    key={still.id}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden group bg-black/60 border border-white/[0.06]"
                  >
                    <img
                      src={getOptimizedImageUrl(still.url, 640)}
                      alt={`${project.title} frame`}
                      className="w-full h-full object-contain filter contrast-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Technical Sidebar & Credits */}
        <div className="lg:col-span-4 rounded-2xl p-6 sm:p-8 space-y-6 text-xs bg-[#0c0c10] border border-white/[0.08]">
          <div>
            <div className="text-zinc-500 font-mono uppercase tracking-wider mb-1 text-[11px]">
              Ruolo
            </div>
            <div className="text-white font-medium text-sm">{project.role}</div>
          </div>

          {project.duration && (
            <div>
              <div className="text-zinc-500 font-mono uppercase tracking-wider mb-1 text-[11px]">
                Durata
              </div>
              <div className="text-zinc-200 font-mono tabular-nums">{project.duration}</div>
            </div>
          )}

          {project.technicalSpecs && (
            <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
              <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">
                Specifiche Tecniche
              </div>
              {project.technicalSpecs.camera && (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-zinc-400 font-mono">Camera</span>
                  <span className="text-zinc-200 font-medium">
                    {project.technicalSpecs.camera}
                  </span>
                </div>
              )}
              {project.technicalSpecs.software && (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-zinc-400 font-mono">Software</span>
                  <span className="text-zinc-200 font-medium">
                    {project.technicalSpecs.software}
                  </span>
                </div>
              )}
              {project.technicalSpecs.colorGrade && (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-zinc-400 font-mono">Color Grade</span>
                  <span className="text-zinc-200 font-medium">
                    {project.technicalSpecs.colorGrade}
                  </span>
                </div>
              )}
              {project.technicalSpecs.aspectRatio && (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-zinc-400 font-mono">Aspect Ratio</span>
                  <span className="text-zinc-200 font-medium">
                    {project.technicalSpecs.aspectRatio}
                  </span>
                </div>
              )}
            </div>
          )}

          {project.credits && project.credits.length > 0 && (
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">
                Crediti
              </div>
              {project.credits.map((credit, idx) => (
                <div
                  key={idx}
                  className="flex items-baseline justify-between gap-3 py-0.5 text-zinc-300"
                >
                  <span className="text-zinc-500 font-mono text-[11px] min-w-[70px] flex-shrink-0">{credit.role}</span>
                  <span className="font-medium text-zinc-200 text-right leading-relaxed">
                    {credit.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">
                Link Esterni
              </div>
              {project.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] hover:border-white/20 text-zinc-200 hover:text-white flex items-center justify-between transition-[background-color,border-color] duration-150 group cursor-pointer focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
                >
                  <span className="truncate">{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
