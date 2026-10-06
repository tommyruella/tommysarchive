"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { WorkstationProject } from "@/types/project";
import { Play, Pause, Info, Film, Image as ImageIcon } from "lucide-react";
import { getProjectEditorial, getClipTheme } from "@/lib/projectUtils";
import { RecentPhotosViewer } from "./RecentPhotosViewer";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

interface MainProjectViewerProps {
  project: WorkstationProject;
  activeMediaIndex: number;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onStepMedia?: (direction: "prev" | "next") => void;
  onSelectMedia?: (index: number) => void;
  currentTimecode?: string;
  onTimeUpdate?: (timecode: string) => void;
  onOpenDetails?: () => void;
}

function getCleanPoster(posterUrl: string, youtubeId?: string): string {
  if (youtubeId && posterUrl && posterUrl.includes("img.youtube.com")) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  return posterUrl;
}

export function MainProjectViewer({
  project,
  activeMediaIndex,
  isPlaying: isPlayingProp,
  onTogglePlay,
  onStepMedia,
  onSelectMedia,
  currentTimecode,
  onOpenDetails,
}: MainProjectViewerProps) {
  // If viewing Recent Photos, render dedicated sectioned Pinterest / Carousel viewer
  if (project.slug === "recent-works-foto" || project.id === "11") {
    return (
      <RecentPhotosViewer
        project={project}
        activeMediaIndex={activeMediaIndex}
        onSelectMedia={onSelectMedia}
      />
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const touchStartX = useRef<number | null>(null);
  const activeMobileBtnRef = useRef<HTMLButtonElement>(null);

  const [hasStartedVideo, setHasStartedVideo] = useState(false);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  const isPlaying = isPlayingProp !== undefined ? isPlayingProp : internalIsPlaying;

  const isLeadMedia = activeMediaIndex === 0;
  const isVideoProject = project.primaryMedia.type === "video";
  const hasLocalVideo = !!project.primaryMedia.localVideo;
  const hasYoutubeId = !!project.primaryMedia.youtubeId;
  const selectedStill = !isLeadMedia ? project.stills[activeMediaIndex - 1] : null;

  const totalAssets = project.stills.length + 1;
  const hasMultipleAssets = totalAssets > 1;

  const editorial = getProjectEditorial(project);
  const theme = getClipTheme(project.clipColor);
  const cleanPoster = getCleanPoster(project.primaryMedia.poster, project.primaryMedia.youtubeId);
  const activeStillUrl = selectedStill?.url || cleanPoster;
  const [loadedDisplayUrl, setLoadedDisplayUrl] = useState<string | null>(null);

  // Send postMessage command to embedded YouTube player
  const sendCommand = useCallback((func: string, args: any = "") => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    }
  }, []);

  // Reset playback state when project changes
  useEffect(() => {
    setHasStartedVideo(false);
    setInternalIsPlaying(false);
  }, [project.id]);

  // Keep active mobile media button in view smoothly without clipping
  useEffect(() => {
    if (activeMobileBtnRef.current) {
      activeMobileBtnRef.current.scrollIntoView({
        behavior: "smooth",
        inline: activeMediaIndex === 0 ? "start" : "center",
        block: "nearest",
      });
    }
  }, [activeMediaIndex]);

  // Listen to YouTube player state changes to keep Play/Pause in sync
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onStateChange") {
          if (data.info === 1) setInternalIsPlaying(true);
          if (data.info === 2 || data.info === 0) setInternalIsPlaying(false);
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Toggle playback in place
  const handleTogglePlay = () => {
    if (!hasStartedVideo) {
      setHasStartedVideo(true);
      setInternalIsPlaying(true);
      onTogglePlay?.();
      return;
    }

    if (hasYoutubeId) {
      if (isPlaying) {
        sendCommand("pauseVideo");
        setInternalIsPlaying(false);
      } else {
        sendCommand("playVideo");
        setInternalIsPlaying(true);
      }
    } else if (hasLocalVideo && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setInternalIsPlaying(true);
      } else {
        videoRef.current.pause();
        setInternalIsPlaying(false);
      }
    }
    onTogglePlay?.();
  };

  // Auto-hide mouse cursor in fullscreen after 2 seconds of inactivity
  useEffect(() => {
    let idleTimer: NodeJS.Timeout | null = null;

    const showCursor = () => {
      document.body.classList.remove("hide-cursor");
      if (idleTimer) clearTimeout(idleTimer);

      const isFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );

      if (isFs) {
        idleTimer = setTimeout(() => {
          document.body.classList.add("hide-cursor");
        }, 2000);
      }
    };

    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );
      if (isFs) {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          document.body.classList.add("hide-cursor");
        }, 2000);
      } else {
        document.body.classList.remove("hide-cursor");
        if (idleTimer) clearTimeout(idleTimer);
      }
    };

    window.addEventListener("mousemove", showCursor);
    window.addEventListener("keydown", showCursor);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      document.body.classList.remove("hide-cursor");
      window.removeEventListener("mousemove", showCursor);
      window.removeEventListener("keydown", showCursor);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        onStepMedia?.("next");
      } else {
        onStepMedia?.("prev");
      }
    }
    touchStartX.current = null;
  };

  const [boxDimensions, setBoxDimensions] = useState<{ width: number; height: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Keep player box strictly fixed in 16:9 geometry, independent of cover or asset list
  useEffect(() => {
    const updateDimensions = () => {
      if (!stageRef.current) return;
      const { clientWidth, clientHeight } = stageRef.current;
      if (!clientWidth || !clientHeight) return;

      // Reserve space horizontally and vertically for breathing room and side feed column
      const reservedX = clientWidth < 640 ? 16 : 64;
      const reservedY = clientWidth < 640 ? 44 : 16;

      const availW = Math.max(280, clientWidth - reservedX);
      const availH = Math.max(160, clientHeight - reservedY);

      // Fit strictly within 16:9
      let w = availW;
      let h = Math.round((w * 9) / 16);

      if (h > availH) {
        h = availH;
        w = Math.round((h * 16) / 9);
      }

      setBoxDimensions((prev) => {
        if (prev && prev.width === w && prev.height === h) return prev;
        return { width: w, height: h };
      });
    };

    updateDimensions();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && stageRef.current) {
      ro = new ResizeObserver(updateDimensions);
      ro.observe(stageRef.current);
    }

    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between select-none relative overflow-hidden"
    >
      {/* 1. CINEMA MONITOR VIEWPORT (Hero Level 1) */}
      <div
        ref={stageRef}
        className="relative flex-1 w-full min-h-0 flex items-center justify-center p-1 sm:p-2"
      >
        {/* Fixed Sizing Wrapper & Relative Anchor for Side Feed Column */}
        <div
          style={
            boxDimensions
              ? { width: `${boxDimensions.width}px`, height: `${boxDimensions.height}px` }
              : { aspectRatio: "16/9", maxHeight: "100%", width: "auto", height: "100%" }
          }
          className="relative max-w-full max-h-full flex items-center justify-center flex-shrink-0"
        >
          {/* Media Monitor Frame - STRICTLY FIXED 16:9 */}
          <div
            className="w-full h-full relative aspect-video overflow-hidden rounded-xl bg-black border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {isLeadMedia && isVideoProject ? (
              hasYoutubeId ? (
                /* YouTube Video Embed & Pristine Cover */
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-black">
                  {hasStartedVideo ? (
                    <iframe
                      ref={iframeRef}
                      key={project.primaryMedia.youtubeId}
                      src={`https://www.youtube.com/embed/${project.primaryMedia.youtubeId}?autoplay=1&enablejsapi=1&rel=0`}
                      title={project.title}
                      className="youtube-compact-frame border-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    /* Pristine Cinema Cover: Pure, uncluttered visual with click-to-play */
                    <div
                      onClick={handleTogglePlay}
                      className="w-full h-full relative cursor-pointer overflow-hidden bg-black flex items-center justify-center group"
                      title="Clicca per riprodurre (Space)"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTogglePlay();
                        }
                      }}
                      aria-label={`Riproduci ${project.title}`}
                    >
                      <img
                        src={getOptimizedImageUrl(cleanPoster, 1920, 75)}
                        alt={project.title}
                        onLoad={() => setLoadedDisplayUrl(cleanPoster)}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes("mqdefault.jpg")) {
                            target.src = project.primaryMedia.youtubeId
                              ? `https://img.youtube.com/vi/${project.primaryMedia.youtubeId}/mqdefault.jpg`
                              : project.primaryMedia.poster;
                          }
                        }}
                        className={`w-full h-full object-contain select-none transition-opacity duration-300 ease-out ${
                          loadedDisplayUrl === cleanPoster ? "opacity-100" : "opacity-0"
                        }`}
                        decoding="async"
                        fetchPriority="high"
                      />

                      {/* Centered Minimal Play Icon on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play
                          className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] ml-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : hasLocalVideo ? (
                /* Local HTML5 Video Player */
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    src={project.primaryMedia.localVideo}
                    poster={getOptimizedImageUrl(project.primaryMedia.poster, 1920, 75)}
                    controls
                    playsInline
                  />
                </div>
              ) : (
                /* Fallback poster */
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <img
                    src={getOptimizedImageUrl(cleanPoster, 1920, 75)}
                    alt={project.title}
                    className="w-full h-full object-contain select-none"
                    decoding="async"
                  />
                </div>
              )
            ) : (
              /* Still or Photo Project Display (Edge-to-edge container, object-contain, ZERO inner padding, ZERO inner rounded border, ZERO inner drop shadow) */
              <div className="w-full h-full flex items-center justify-center bg-black relative">
                <img
                  key={activeStillUrl}
                  src={getOptimizedImageUrl(activeStillUrl, 1920, 75)}
                  alt={project.title}
                  onLoad={() => setLoadedDisplayUrl(activeStillUrl)}
                  className={`w-full h-full object-contain select-none transition-opacity duration-300 ease-out ${
                    loadedDisplayUrl === activeStillUrl ? "opacity-100" : "opacity-0"
                  }`}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            )}
          </div>

          {/* Desktop Media Assets Selector Column (Hidden on mobile, preserved on desktop) */}
          {hasMultipleAssets && (
            <div
              className="hidden sm:flex absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 flex-col items-center gap-1.5 py-1 max-h-full overflow-y-auto custom-workstation-scrollbar z-10 pointer-events-auto"
              role="tablist"
              aria-label="Selezione Feed Progetto"
            >
              <button
                onClick={() => onSelectMedia?.(0)}
                className={`py-0.5 px-1 text-[11px] font-mono ${
                  isVideoProject ? "tracking-wider" : "tabular-nums"
                } transition-colors duration-150 cursor-pointer text-center bg-transparent focus-visible:outline-none ${
                  activeMediaIndex === 0
                    ? "text-white font-bold"
                    : "text-zinc-600 hover:text-zinc-300"
                }`}
                title={isVideoProject ? "Master Video Feed" : "01"}
              >
                {isVideoProject ? "VIDEO" : "01"}
              </button>
              {project.stills.map((_, idx) => {
                const mediaIndex = idx + 1;
                const isActive = activeMediaIndex === mediaIndex;
                const label = isVideoProject
                  ? String(mediaIndex).padStart(2, "0")
                  : String(mediaIndex + 1).padStart(2, "0");
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectMedia?.(mediaIndex)}
                    className={`py-0.5 px-1 text-[11px] font-mono tabular-nums transition-colors duration-150 cursor-pointer text-center bg-transparent focus-visible:outline-none ${
                      isActive
                        ? "text-white font-bold"
                        : "text-zinc-600 hover:text-zinc-300"
                    }`}
                    title={`Still ${label}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile Media Selector Bar: Accessible & Horizontally Scrollable (Hidden on Desktop) */}
          {hasMultipleAssets && (
            <div
              className="sm:hidden absolute -bottom-8 left-0 right-0 w-full overflow-x-auto no-scrollbar py-1 z-20 pointer-events-auto"
              role="tablist"
              aria-label="Selezione Feed Progetto Mobile"
            >
              <div className="flex items-center gap-3 min-w-full w-max justify-center px-4">
                <button
                  ref={activeMediaIndex === 0 ? activeMobileBtnRef : null}
                  onClick={() => onSelectMedia?.(0)}
                  className={`py-1 px-1.5 text-xs font-mono ${
                    isVideoProject ? "tracking-wider" : "tabular-nums"
                  } flex-shrink-0 transition-colors duration-150 cursor-pointer text-center bg-transparent border-0 focus-visible:outline-none ${
                    activeMediaIndex === 0
                      ? "text-white font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title={isVideoProject ? "Master Video Feed" : "01"}
                >
                  {isVideoProject ? "VIDEO" : "01"}
                </button>
                {project.stills.map((_, idx) => {
                  const mediaIndex = idx + 1;
                  const isActive = activeMediaIndex === mediaIndex;
                  const label = isVideoProject
                    ? String(mediaIndex).padStart(2, "0")
                    : String(mediaIndex + 1).padStart(2, "0");
                  return (
                    <button
                      key={idx}
                      ref={isActive ? activeMobileBtnRef : null}
                      onClick={() => onSelectMedia?.(mediaIndex)}
                      className={`py-1 px-1.5 text-xs font-mono tabular-nums flex-shrink-0 transition-colors duration-150 cursor-pointer text-center bg-transparent border-0 focus-visible:outline-none ${
                        isActive
                          ? "text-white font-bold"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      title={`Still ${label}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. CINEMATIC EDITORIAL CAPTION BLOCK */}
      <div
        style={{ maxWidth: boxDimensions ? `${boxDimensions.width}px` : "72rem" }}
        className="w-full mx-auto px-1 sm:px-2 pt-3 sm:pt-4 pb-1 sm:pb-2 flex flex-col justify-between gap-2.5 sm:gap-3 min-h-[96px] sm:min-h-[110px] flex-shrink-0"
      >
        {/* Row 1: Huge Editorial Title (Left) + Distinct Category (Right) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
            {editorial.title}
          </h1>
          <span
            className={`font-mono text-xs sm:text-sm md:text-base ${theme.textAccent} font-bold tracking-widest uppercase flex-shrink-0 sm:text-right`}
            style={{ color: theme.colorHex }}
          >
            {editorial.category}
          </span>
        </div>

        {/* Row 2: Minimal Year & Nature Meta (Left) + Technical INFO ⓘ Exit Link (Right) */}
        <div className="flex items-center justify-between gap-4 pt-1 sm:pt-1.5 border-t border-white/[0.06]">
          <div className="font-mono text-[11px] sm:text-xs text-zinc-500 tracking-wider uppercase">
            {editorial.meta}
          </div>

          <button
            onClick={onOpenDetails}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-zinc-400 hover:text-white tracking-widest uppercase transition-colors duration-150 cursor-pointer focus-visible:outline-none group"
            aria-label={`Apri scheda e crediti di ${editorial.title}`}
          >
            <span className="group-hover:underline underline-offset-4 decoration-white/40">INFO</span>
            <Info className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors stroke-[1.75]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
