import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function ProfileAndContactPage() {
  return (
    <div className="pt-8 sm:pt-12 pb-24 px-5 sm:px-12 max-w-5xl mx-auto w-full flex-1">
      {/* Header */}
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
          Profilo & Contatti
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 items-start mb-16">
        {/* Sharp brutalist 35mm portrait */}
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-950 border border-white/[0.08] group">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-104"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop')`,
              }}
            />
            <div className="optical-glare" />
          </div>
          <div className="mt-3 text-xs text-zinc-500 font-mono px-1 lowercase">
            tommaso ruella — 35mm still
          </div>
        </div>

        {/* Bio & Details */}
        <div className="md:col-span-7 space-y-7">
          <div>
            <p className="text-xl sm:text-2xl font-light text-zinc-100 leading-relaxed mb-4 text-pretty">
              Studente di Ingegneria del Cinema al Politecnico di Torino. Regia, direzione della fotografia e sperimentazione analogica su pellicola.
            </p>

            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed text-pretty">
              Il mio percorso unisce la disciplina della narrazione visiva con la lavorazione su pellicola 35&nbsp;mm e 16&nbsp;mm. Esploro contrasti netti, ombre profonde e la luce notturna attraverso cortometraggi di percorso accademico e shooting fotografici indipendenti.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0c0c10] border border-white/[0.08] grid grid-cols-2 gap-6 text-xs">
            <div>
              <div className="text-zinc-500 font-mono uppercase tracking-wider mb-1 text-[11px]">Base</div>
              <div className="text-zinc-200 font-medium">Torino / Milano, Italia</div>
            </div>

            <div>
              <div className="text-zinc-500 font-mono uppercase tracking-wider mb-1 text-[11px]">Ambiti</div>
              <div className="text-zinc-200 font-medium">Regia · 35&nbsp;mm · Color Grading</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Contact Section */}
      <section className="rounded-2xl p-7 sm:p-12 space-y-8 bg-[#0c0c10] border border-white/[0.08]">
        <div>
          <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mb-3">
            Contatti & Collaborazioni
          </div>
          <a
            href="mailto:tommytegamino@gmail.com"
            className="text-2xl sm:text-5xl font-extrabold tracking-tight text-white hover:text-zinc-300 transition-[color] duration-150 block truncate focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            tommytegamino@gmail.com
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/[0.07] text-xs">
          <div>
            <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">Disponibilità</div>
            <div className="text-zinc-200">Torino, Milano & Trasferte</div>
            <div className="text-zinc-400 text-[11px] mt-0.5">Produzioni indie & shooting</div>
          </div>

          <div>
            <div className="text-zinc-500 font-mono uppercase tracking-wider mb-2 text-[11px]">Piattaforme</div>
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
              href="mailto:tommytegamino@gmail.com?subject=Richiesta%20CV%20Tommaso%20Ruella"
              className="inline-block border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] px-5 py-2.5 rounded-lg text-white hover:border-white transition-[background-color,border-color] duration-150 font-medium text-xs focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
            >
              Richiedi CV / Portfolio
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
