"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function ConditionalFooter() {
  const pathname = usePathname();

  // On the home timeline page, the footer is embedded inside the workstation layout
  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="py-10 px-6 sm:px-10 border-t border-white/[0.06] text-xs text-zinc-500 font-mono tracking-wide mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-zinc-400 font-medium">
          Tommaso Ruella © {new Date().getFullYear()}
        </div>
        <div className="text-zinc-500 uppercase tracking-wider text-[11px]">
          Politecnico di Torino
        </div>
      </div>
    </footer>
  );
}
