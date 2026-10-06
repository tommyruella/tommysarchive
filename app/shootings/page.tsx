import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

import { WORKSTATION_PROJECTS } from "@/data/projects";
import { getOptimizedImageUrl } from "@/lib/mediaOptimizer";

export const metadata: Metadata = {
  title: "Shootings & Stills — Tommaso Ruella",
  description: "Reportage fotografici, progetti di scatto e studi di luce.",
};

export default function ShootingsPage() {
  const recentProj = WORKSTATION_PROJECTS.find((p) => p.slug === "recent-works-foto");
  const stills = recentProj ? recentProj.stills : [];

  const sectionMap = new Map<string, string[]>();
  stills.forEach((s) => {
    const sec = s.section || "ARCHIVE";
    if (!sectionMap.has(sec)) sectionMap.set(sec, []);
    sectionMap.get(sec)!.push(s.url);
  });

  const shootingSeries = Array.from(sectionMap.entries()).map(([sectionName, images], idx) => ({
    id: String(idx + 1).padStart(2, "0"),
    title: sectionName,
    subtitle: `${images.length} Scatti · Reportage & Color Stills`,
    images,
  }));

  return (
    <div className="pt-8 sm:pt-12 pb-24 px-5 sm:px-10 max-w-7xl mx-auto w-full flex-1">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-14 pb-5 border-b border-white/[0.08]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-150 mb-3 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            aria-label="Torna alla Workstation"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Workstation</span>
          </Link>
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white uppercase text-balance">
            Shootings & Stills
          </h1>
        </div>

        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
          35&nbsp;mm · 16&nbsp;mm · Digital
        </span>
      </div>

      {/* Series List with Grand Images */}
      <div className="space-y-24 sm:space-y-28">
        {shootingSeries.map((series) => (
          <section key={series.id} className="space-y-5">
            <div className="flex items-baseline justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-zinc-400 font-mono tabular-nums font-semibold">{series.id}</span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                  {series.title}
                </h2>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {series.subtitle}
              </span>
            </div>

            {/* Immersive Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2">
              {series.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-950 border border-white/[0.08] group"
                >
                  <img
                    src={getOptimizedImageUrl(img, 1080, 80)}
                    alt={`${series.title} ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-104"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="optical-glare" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
