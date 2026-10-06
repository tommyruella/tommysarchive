import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showreel — Tommaso Ruella",
  description: "Cinema projection mode and directorial showreel.",
};

export default function ReelPage() {
  return (
    <div className="pt-28 pb-24 px-5 sm:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-white/[0.08]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-150 mb-3 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            aria-label="Torna alla Workstation"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Workstation</span>
          </Link>
          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white uppercase text-balance">
            Timeless Reel
          </h1>
        </div>

        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          Cinema Projection Mode
        </span>
      </div>

      {/* Main Full Cinema Player */}
      <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/[0.08]">
        <video
          className="w-full h-full object-contain"
          src="/timeless.mp4"
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
}
