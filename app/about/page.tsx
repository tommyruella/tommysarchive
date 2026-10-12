"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { markSessionCalibrated } from "@/components/CinemaLoader";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function AboutPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "About — Tommaso Ruella";
    }
    markSessionCalibrated();
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col bg-black text-zinc-100 selection:bg-white selection:text-black">
      {/* Discreet Top Navigation Bar */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-white/[0.08] flex items-center justify-between bg-black/90 backdrop-blur-sm sticky top-0 z-30 flex-shrink-0">
        <Link
          href="/"
          aria-label="Torna alla Home"
          className="text-sm sm:text-base font-black tracking-tight uppercase text-white hover:text-zinc-300 transition-colors focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
        >
          <span className="sm:hidden">TR</span>
          <span className="hidden sm:inline">Tommaso Ruella</span>
        </Link>

        <nav
          aria-label="Navigazione principale"
          className="flex items-center gap-5 sm:gap-7"
        >
          <Link
            href="/"
            className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            Timeline
          </Link>
          <Link
            href="/archive"
            className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
          >
            Archive
          </Link>
        </nav>
      </header>

      {/* Main Editorial Content — Vertically & Horizontally Centered */}
      <main className="flex-1 w-full max-w-[660px] mx-auto px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-center">
        <div className="w-full space-y-5 sm:space-y-6">
          {/* 1. Introduction & Profilo */}
          <motion.section
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            aria-labelledby="about-intro-heading"
            className="space-y-2"
          >
            <div className="space-y-2.5 sm:space-y-3">
              <h1
                id="about-intro-heading"
                className="font-sans text-2xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#F4F4F2] leading-[1.15]"
              >
                Ciao, sono Tommaso Ruella.
              </h1>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                Filmaker / Editor
              </p>
            </div>

            <p className="font-sans text-sm sm:text-base text-zinc-200 font-light leading-[1.6] pt-0.5">
              Studente di Ingegneria del Cinema al Politecnico di Torino.
              <br />
              Montaggio, color grading e linguaggio visivo.
            </p>
          </motion.section>

          {/* 2. Education & Focus */}
          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.06}
            variants={fadeUp}
            aria-label="Education e Focus"
            className="pt-5 sm:pt-6 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-6 sm:gap-10 items-start"
          >
            {/* Education */}
            <div className="space-y-2.5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Education
              </h2>

              <div className="space-y-3">
                <div className="space-y-0.5">
                  <div className="font-mono text-[11px] text-zinc-400 tracking-wider uppercase">
                    2022 - Present
                  </div>
                  <div className="font-sans text-sm sm:text-[15px] font-semibold text-zinc-100 uppercase">
                    Politecnico di Torino
                  </div>
                  <div className="font-sans text-xs sm:text-[13px] text-zinc-400">
                    Ingegneria del Cinema e dei mezzi di Comunicazione
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-mono text-[11px] text-zinc-400 tracking-wider uppercase">
                    2016 - 2024
                  </div>
                  <div className="font-sans text-sm sm:text-[15px] font-semibold text-zinc-100 uppercase">
                    I.I.S. Bernardo Vittone
                  </div>
                  <div className="font-sans text-xs sm:text-[13px] text-zinc-400">
                    Costruzioni Ambiente Territorio
                  </div>
                </div>
              </div>
            </div>

            {/* Focus */}
            <div className="space-y-2">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Focus
              </h2>
              <ul className="space-y-0.5 font-sans text-xs sm:text-sm font-medium uppercase tracking-wide text-zinc-200">
                <li>Film</li>
                <li>Editing</li>
                <li>Color</li>
                <li>3D</li>
                <li>VFX</li>
                <li>Photography</li>
              </ul>
            </div>
          </motion.section>

          {/* 3. Software & Languages */}
          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.12}
            variants={fadeUp}
            aria-label="Software e Languages"
            className="pt-5 sm:pt-6 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-6 sm:gap-10 items-start"
          >
            {/* Software */}
            <div className="space-y-2">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Software
              </h2>
              <ul className="space-y-0.5 font-sans text-xs sm:text-sm font-medium uppercase tracking-wide text-zinc-200">
                <li>DaVinci Resolve</li>
                <li className="text-zinc-300">Lightroom – Photoshop</li>
                <li className="text-zinc-400">Blender</li>
                <li className="text-zinc-400">Web Design</li>
              </ul>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Languages
              </h2>
              <div className="space-y-1 font-mono text-xs uppercase tracking-wider">
                <div className="flex items-baseline gap-3">
                  <span className="font-sans font-bold text-zinc-100 text-xs sm:text-sm">
                    IT
                  </span>
                  <span className="text-zinc-400 text-[11px]">Native</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-sans font-bold text-zinc-100 text-xs sm:text-sm">
                    EN
                  </span>
                  <span className="text-zinc-400 text-[11px]">B2 - First</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 4. Contacts */}
          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.18}
            variants={fadeUp}
            aria-labelledby="about-contact-heading"
            className="pt-5 sm:pt-6 border-t border-white/[0.07] space-y-2.5"
          >
            <h2
              id="about-contact-heading"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"
            >
              Contacts
            </h2>

            <div className="flex items-center justify-between gap-6">
              <a
                href="mailto:tommaso.ruella@gmail.com"
                className="group inline-flex items-center gap-1.5 font-sans text-sm sm:text-[15px] font-medium text-zinc-100 hover:text-white transition-colors whitespace-nowrap focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
              >
                <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-white transition-colors">
                  tommaso.ruella@gmail.com
                </span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0"
                  aria-hidden="true"
                />
              </a>

              <div className="flex items-center gap-4 text-zinc-400 flex-shrink-0">
                <a
                  href="https://www.instagram.com/tommy.ruella/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @tommy.ruella"
                  className="text-zinc-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
                >
                  <svg
                    className="w-[18px] h-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                <a
                  href="https://www.linkedin.com/in/tommaso-ruella-847948309/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Tommaso Ruella"
                  className="text-zinc-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none"
                >
                  <svg
                    className="w-[18px] h-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
