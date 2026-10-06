/**
 * Utilities for formatting, splitting project editorial titles and DaVinci clip themes
 */

import { DaVinciClipColor } from "@/types/project";

export interface ProjectEditorialInfo {
  title: string;
  category: string;
  meta: string;
}

export function getProjectEditorial(project: {
  id?: string;
  title: string;
  year?: string;
  category?: string;
}): ProjectEditorialInfo {
  const editorialMap: Record<string, ProjectEditorialInfo> = {
    "01": { title: "LONDON MARCH '26", category: "TRAVEL VLOG", meta: "2026 / PERSONAL" },
    "02": { title: "BARÇA JULY '25", category: "TRAVEL VLOG", meta: "2025 / PERSONAL" },
    "03": { title: "CTRL+Z", category: "EXPERIMENTAL", meta: "2025 / ARG & WEB" },
    "04": { title: "HOBBITON", category: "3D ENVIRONMENT", meta: "2025 / 3D SCENE" },
    "05": { title: "TIMELESS", category: "SHORT FILM", meta: "2024 / PERSONAL" },
    "06": { title: "DONUT IN TURIN", category: "3D ANIMATION", meta: "2024 / 3D RENDER" },
    "07": { title: "ESOTHIA", category: "SOUND & VFX", meta: "2024 / INSTALLATION" },
    "08": { title: "LOGO ANIMATION", category: "MOTION GRAPHICS", meta: "2024 / 3D MOTION" },
    "09": { title: "BARÇA SET '23", category: "TRAVEL VLOG", meta: "2023 / PERSONAL" },
    "10": { title: "VALENCIA APRIL '23", category: "TRAVEL VLOG", meta: "2023 / PERSONAL" },
    "11": { title: "RECENT PHOTOS", category: "PHOTOGRAPHY", meta: "2024–2026 / PHOTO" },
  };

  if (project.id && editorialMap[project.id]) {
    return editorialMap[project.id];
  }

  return {
    title: project.title.toUpperCase(),
    category: (project.category || "FILM").toUpperCase(),
    meta: `${project.year || "2024"} / PERSONAL`,
  };
}

export interface SplitTitleResult {
  primary: string;
  secondary: string;
  fullTitle: string;
}

export function splitProjectTitle(
  title: string,
  category?: string
): SplitTitleResult {
  if (!title) {
    return { primary: "", secondary: "", fullTitle: "" };
  }

  // Handle month/year patterns: "London March '26", "Barça August '25", "Barça Set '23", "Valencia April '23"
  const datePattern = /^(.*?)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December|Set)\s+'?\d{2,4})$/i;
  const match = title.match(datePattern);
  if (match) {
    return {
      primary: match[1].toUpperCase(),
      secondary: match[2].toUpperCase(),
      fullTitle: title,
    };
  }

  // Handle slash patterns: "Recent Works / Foto"
  if (title.includes(" / ")) {
    const parts = title.split(" / ");
    return {
      primary: parts[0].toUpperCase(),
      secondary: parts[1].toUpperCase(),
      fullTitle: title,
    };
  }

  // If no date suffix in title, secondary can be a curated editorial label or category
  const defaultSecondaryMap: Record<string, string> = {
    "CTRL+Z": "ARG & GAMEPLAY",
    "Hobbiton": "3D ENVIRONMENT",
    "Timeless": "SHORT FILM",
    "Donut in Turin": "3D ANIMATION",
    "Esothia": "SHORT FILM",
    "Logo Animation": "MOTION GRAPHICS",
  };

  const secondary =
    defaultSecondaryMap[title] || (category ? category.toUpperCase() : "");

  return {
    primary: title.toUpperCase(),
    secondary,
    fullTitle: title,
  };
}

export interface ClipTheme {
  colorHex: string;
  borderActive: string;
  glowActive: string;
  needleBg: string;
  needleShadow: string;
  textAccent: string;
  borderHover: string;
}

export const CLIP_THEMES: Record<DaVinciClipColor, ClipTheme> = {
  navy: {
    colorHex: "#38bdf8",
    borderActive: "border-sky-400",
    glowActive: "shadow-[0_0_16px_rgba(56,189,248,0.3)]",
    needleBg: "bg-sky-400",
    needleShadow: "shadow-[0_0_8px_#38bdf8]",
    textAccent: "text-sky-400",
    borderHover: "hover:border-sky-400/40",
  },
  orange: {
    colorHex: "#fbbf24",
    borderActive: "border-amber-400",
    glowActive: "shadow-[0_0_16px_rgba(251,191,36,0.3)]",
    needleBg: "bg-amber-400",
    needleShadow: "shadow-[0_0_8px_#fbbf24]",
    textAccent: "text-amber-400",
    borderHover: "hover:border-amber-400/40",
  },
  green: {
    colorHex: "#34d399",
    borderActive: "border-emerald-400",
    glowActive: "shadow-[0_0_16px_rgba(52,211,153,0.3)]",
    needleBg: "bg-emerald-400",
    needleShadow: "shadow-[0_0_8px_#34d399]",
    textAccent: "text-emerald-400",
    borderHover: "hover:border-emerald-400/40",
  },
  red: {
    colorHex: "#f43f5e",
    borderActive: "border-rose-500",
    glowActive: "shadow-[0_0_16px_rgba(244,63,94,0.3)]",
    needleBg: "bg-rose-500",
    needleShadow: "shadow-[0_0_8px_#f43f5e]",
    textAccent: "text-rose-400",
    borderHover: "hover:border-rose-500/40",
  },
  purple: {
    colorHex: "#c084fc",
    borderActive: "border-purple-400",
    glowActive: "shadow-[0_0_16px_rgba(192,132,252,0.3)]",
    needleBg: "bg-purple-400",
    needleShadow: "shadow-[0_0_8px_#c084fc]",
    textAccent: "text-purple-400",
    borderHover: "hover:border-purple-400/40",
  },
  default: {
    colorHex: "#ffffff",
    borderActive: "border-white",
    glowActive: "shadow-[0_0_16px_rgba(255,255,255,0.25)]",
    needleBg: "bg-white",
    needleShadow: "shadow-[0_0_8px_#ffffff]",
    textAccent: "text-white",
    borderHover: "hover:border-white/40",
  },
};

export function getClipTheme(color?: DaVinciClipColor): ClipTheme {
  if (color && CLIP_THEMES[color]) {
    return CLIP_THEMES[color];
  }
  return CLIP_THEMES.default;
}
