import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contatti — Tommaso Ruella",
  description: "Contatti, collaborazioni e informazioni su produzioni video e shooting fotografici.",
};

export default function ContactPage() {
  return (
    <div className="pt-8 sm:pt-12 pb-24 px-5 sm:px-10 max-w-5xl mx-auto w-full flex-1">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          aria-label="Torna alla Workstation"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Workstation</span>
        </Link>
      </div>

      <div className="mb-14 pb-6 border-b border-white/[0.08]">
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white uppercase text-balance">
          Contatti
        </h1>
      </div>

      <div className="space-y-12">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0c0c10] border border-white/[0.08]">
          <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-3">
            Inquiries & Collaborazioni
          </div>
          <a
            href="mailto:tommytegamino@gmail.com"
            className="text-2xl sm:text-5xl font-extrabold tracking-tight text-white hover:text-zinc-300 transition-[color] duration-150 block truncate focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            tommytegamino@gmail.com
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/[0.08] text-xs">
          <div>
            <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">Location</div>
            <div className="text-zinc-200">Torino / Milano, Italia</div>
            <div className="text-zinc-400 text-[11px] mt-0.5">Disponibile per trasferte</div>
          </div>

          <div>
            <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">Profili</div>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/tommy.ruella/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/in/tommaso-ruella-847948309/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">Materiali</div>
            <a
              href="mailto:tommytegamino@gmail.com?subject=Richiesta%20CV"
              className="inline-block border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] px-5 py-2.5 rounded-lg text-white hover:border-white transition-[background-color,border-color] duration-150 font-medium text-xs focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            >
              Richiedi CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
