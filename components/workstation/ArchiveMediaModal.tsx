"use client";

import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

export interface ArchiveMediaItem {
  id: string;
  title: string;
  category: "FILMS" | "PHOTOS" | "3D";
  type: "video" | "image";
  mediaUrl: string;
  youtubeId?: string;
  localVideo?: string;
  aspectRatio?: string;
  projectSlug: string;
  projectTitle: string;
  frameIndex?: number;
  year?: string;
}

interface ArchiveMediaModalProps {
  items: ArchiveMediaItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ArchiveMediaModal({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: ArchiveMediaModalProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen ? items[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIndex);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(nextIndex);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation: Escape to close, Left/Right arrows to step
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

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

  if (!isOpen || !currentItem) {
    return null;
  }

  const isPortrait = currentItem.aspectRatio === "portrait";

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md select-none overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={currentItem.title}
      >
        {/* FLOATING TOP-RIGHT CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi visualizzatore"
          className="absolute top-3 right-3 sm:top-5 sm:right-6 z-40 p-2 sm:p-2.5 text-zinc-400 hover:text-white bg-black/60 hover:bg-black/90 border border-white/15 hover:border-white/40 transition-all duration-150 cursor-pointer focus-visible:outline-none rounded-none backdrop-blur-sm"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* CENTER VIEWPORT (The Media Itself) */}
        <main
          className="flex-1 w-full min-h-0 relative flex items-center justify-center p-3 sm:p-6 md:p-8 cursor-pointer"
          onClick={(e) => {
            // Close if clicking the empty stage outside the media container
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Floating Navigation: Prev Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Elemento precedente"
              className="absolute left-2 sm:left-4 z-30 p-2 sm:p-3 bg-black/60 hover:bg-white text-zinc-400 hover:text-black border border-white/20 transition-all duration-150 cursor-pointer focus-visible:outline-none rounded-none backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </button>
          )}

          {/* Floating Navigation: Next Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Elemento successivo"
              className="absolute right-2 sm:right-4 z-30 p-2 sm:p-3 bg-black/60 hover:bg-white text-zinc-400 hover:text-black border border-white/20 transition-all duration-150 cursor-pointer focus-visible:outline-none rounded-none backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </button>
          )}

          {/* Media Content Display */}
          <div
            className="w-full h-full flex items-center justify-center cursor-default z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === "video" ? (
              /* VIDEO VIEWER */
              currentItem.youtubeId ? (
                <div
                  key={currentItem.id}
                  className={`relative ${
                    isPortrait
                      ? "aspect-[9/16] h-[82vh] max-w-[90vw]"
                      : "aspect-video w-full max-w-5xl max-h-[82vh]"
                  } bg-black border border-white/[0.12] overflow-hidden shadow-[0_20px_90px_rgba(0,0,0,0.95)]`}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${currentItem.youtubeId}?autoplay=1&enablejsapi=1&rel=0`}
                    title={currentItem.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : currentItem.localVideo ? (
                <div
                  key={currentItem.id}
                  className="relative aspect-video w-full max-w-5xl max-h-[82vh] bg-black border border-white/[0.12] overflow-hidden shadow-[0_20px_90px_rgba(0,0,0,0.95)] flex items-center justify-center"
                >
                  <video
                    src={currentItem.localVideo}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div key={currentItem.id} className="relative max-h-[84vh] max-w-[92vw] flex items-center justify-center">
                  <img
                    src={getOptimizedImageUrl(currentItem.mediaUrl, 1920, 85)}
                    alt={currentItem.title}
                    className="max-h-[84vh] max-w-[92vw] object-contain select-none border border-white/[0.12]"
                  />
                </div>
              )
            ) : (
              /* PHOTO / STILL VIEWER */
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-h-[85vh] max-w-[94vw] flex items-center justify-center"
              >
                <img
                  src={getOptimizedImageUrl(currentItem.mediaUrl, 1920, 85)}
                  alt={currentItem.title}
                  className="max-h-[85vh] max-w-[94vw] object-contain select-none border border-white/[0.1] shadow-[0_25px_100px_rgba(0,0,0,0.95)]"
                  loading="eager"
                  decoding="sync"
                />
              </motion.div>
            )}
          </div>
        </main>

        {/* BOTTOM HUD BAR - ORDERED & CLEAN */}
        <footer className="h-14 sm:h-16 px-4 sm:px-8 border-t border-white/[0.08] flex items-center justify-between z-20 bg-black/90 backdrop-blur-md flex-shrink-0">
          {/* Left: Project Title, Frame & Year */}
          <div className="flex items-baseline gap-2 sm:gap-3.5 truncate pr-4">
            <span className="font-sans font-bold text-sm sm:text-base text-white uppercase tracking-tight truncate">
              {currentItem.projectTitle}
            </span>

            {currentItem.frameIndex !== undefined && (
              <>
                <span className="text-zinc-700 font-mono text-xs" aria-hidden="true">/</span>
                <span className="font-mono text-[11px] sm:text-xs text-zinc-400 tracking-wider uppercase">
                  Frame {String(currentItem.frameIndex).padStart(2, "0")}
                </span>
              </>
            )}

            {currentItem.year && (
              <>
                <span className="text-zinc-700 font-mono text-xs" aria-hidden="true">/</span>
                <span className="font-mono text-[11px] sm:text-xs text-zinc-500 tracking-wider">
                  {currentItem.year}
                </span>
              </>
            )}
          </div>

          {/* Right: Position Counter */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="font-mono text-xs text-zinc-400 tabular-nums">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
        </footer>
      </div>
    </AnimatePresence>
  );
}
