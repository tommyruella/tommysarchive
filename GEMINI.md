# CINEMA STUDENT PORTFOLIO — AESTHETIC & ARCHITECTURAL SPECIFICATION

> **Aesthetic DNA**: *Ultra-Minimal Brutalist Cinema (Austere Cyber-Noir / Stark Monochromatic Monolith)*  
> **Source Moodboard**: Curated from TommyTegamino (OLED Black, Liquid Chrome Typography, High-Contrast 35mm, Razor-Sharp Layout, Zero Clutter).  
> **ABSOLUTE RULE**: **ZERO TAGS OF ANY KIND (NEVER NOW, NEVER EVER — STRICTLY ABOLISHED). ZERO EXTRA DESCRIPTIONS, ZERO CAPTIONS, ZERO SYNOPSES, ZERO TEXTUAL PARAGRAPHS, ZERO FORMAT PILLS, ZERO CATEGORY BADGES, ZERO STATUS TAGS.** Only pure imagery and project titles (dates calibrated only on the central ruler). No explanatory copy, no category subtitles, no narrative fluff, NO TAGS anywhere. Clean typographic navbar. High-impact negative space and stark imagery.

---

## 1. Aesthetic DNA & Visual Language

1. **Pitch Black Canvas (`#000000`)**: Deep OLED pitch black. No generic dark-gray or washed-out fills.
2. **Brutalist Monolithic Typography**: Huge grotesque headlines, ultra-tight letter spacing, austere hierarchy.
3. **Razor-Sharp Restraint**: Captions and metadata reduced to the absolute minimum. Avoid decorative tags, fake telemetry overload, or unnecessary badges.
4. **Cinematic 2.39:1 Framing**: Raw, high-contrast imagery with subtle liquid chrome specular highlights.
5. **Ultra-Clean Navigation**: Minimalist typography, zero visual noise.

---

## 2. Design Tokens & Color System

```css
:root {
  /* Surface & Base */
  --bg-pitch: #000000;
  --bg-surface: #070709;
  --bg-surface-elevated: #0f0f13;
  --bg-card: rgba(14, 14, 18, 0.7);

  /* Chrome & Metallic */
  --chrome-highlight: #ffffff;
  --chrome-mid: #cbd5e1;
  --chrome-dark: #475569;
  --chrome-gradient: linear-gradient(135deg, #ffffff 0%, #cbd5e1 25%, #64748b 50%, #f8fafc 75%, #334155 100%);
  --chrome-border: linear-gradient(to bottom right, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2));

  /* Shock Accents */
  --accent-cobalt: #0022ff;        /* Comme des Garçons blue / Electric vinyl */
  --accent-crimson: #e11d48;       /* Resin dice / Red boxing leather / Danger */
  --accent-toxic-cyan: #00f0ff;    /* Thermal edge / Anamorphic streak */
  --accent-thermal-orange: #ff5500;/* Heatmap core / Amber flame */

  /* Viewfinder & Technical Overlays */
  --rec-red: #ff003b;
  --hud-green: #00ff66;
  --hud-dim: rgba(255, 255, 255, 0.45);
  --grid-line: rgba(255, 255, 255, 0.07);

  /* Aspect Ratios */
  --aspect-anamorphic: 2.39 / 1;
  --aspect-cinemascope: 2.35 / 1;
  --aspect-widescreen: 16 / 9;
  --aspect-academy: 4 / 3;
}
```

---

## 3. Typography Hierarchy & Rules

| Role | Font Family / Style | Treatment & Characteristics |
| :--- | :--- | :--- |
| **Hero Display / Film Titles** | Heavy Grotesk / Bold Brutalist Display (`Syne`, `Cabinet Grotesk`, `Clash Display`, or `Space Grotesk`) | Ultra-bold (800/900), uppercase, tight letter-spacing (`tracking-tighter`). Optional molten chrome text clipping (`bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500`). |
| **Technical HUD & Metadata** | Monospace (`JetBrains Mono`, `Geist Mono`, `Space Mono`) | Uppercase, micro-typography (`text-[10px]` to `text-xs`), spaced (`tracking-widest`). Used for timecodes, camera metadata, aspect ratio tags, audio dB meters, and director credits. |
| **Editorial & Statement Body** | Clean Sans (`Geist Sans`, `Inter`) | Neutral, elegant, crisp high-contrast legibility against pure black. Line-height `leading-relaxed`. |
| **Subversive / Accent Badges** | Liquid Drip / Stencil / Distortion | Small sticker-like badges with metallic silver or electric blue backgrounds and inverted dark text. |

---

## 4. Materials, Textures & Optical Effects

### A. Ribbed / Fluted Glass Distortion
Use backdrop filters combined with subtle repeating SVG or linear-gradient stripe masks to evoke ribbed architectural glass and lenticular lens filters:
```css
.fluted-glass {
  background: rgba(10, 10, 14, 0.4);
  backdrop-filter: blur(16px) saturate(180%);
  background-image: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0px,
    rgba(255, 255, 255, 0.03) 2px,
    transparent 2px,
    transparent 8px
  );
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

### B. Liquid Chrome Badges & 4-Point Glints
* Buttons and card borders feature specular micro-gradients that shimmer on pointer hover.
* Key focal points (play buttons, project tags, section markers) utilize the **4-point star flare** (`✧` or custom SVG metallic glint).

### C. 35mm Film Grain & Halftone Moiré
* A global or section-level subtle noise overlay (`pointer-events-none opacity-[0.035] mix-blend-overlay`) providing tactile film grain across media surfaces.
* Interactive thumbnail states can reveal subtle halftone / dot-matrix dithering on hover.

### D. Thermal Heatmap Gradient Glows
* Ambient background glows behind key cards and hero elements utilize thermal gradients:
  `radial-gradient(circle at 50% 50%, rgba(255, 77, 0, 0.15) 0%, rgba(0, 34, 255, 0.1) 45%, transparent 70%)`.

---

## 5. Viewfinder & Cinematic Framing Standards

Every film showcase component must enforce authentic cinematic standards:
1. **Aspect Ratio Discipline**:
   * Hero Showreel & Feature Short Films: `aspect-[2.39/1]` (Letterboxed anamorphic).
   * Directorial Stills & Scene Breakdowns: `aspect-[2.39/1]` or `aspect-[16/9]`.
   * BTS / Viewfinder / Director Monitor: `aspect-[4/3]` with authentic HUD frame.
2. **Camcorder / Monitor HUD Overlays**:
   * Corner elements: `[REC ● 00:00:24:08]` in neon red / white mono.
   * Audio channel meters: dual-channel stereo peak meter (`L ■■■■□  R ■■■□□ -12dB`).
   * Lens and technical credit chip: `[ ARRI RAW · 35mm T1.3 · 2.39:1 · 800 ISO ]`.

---

## 6. Integration Rules with Active Plugins & Skills

### A. transitions.dev & transitions-polish
* Always use the installed `transitions-dev` tokens for UI state changes:
  * **Card Hover 3D Tilt**: Apply `19-card-tilt` to film project cards (pointer-tracked tilt with subtle specular glare).
  * **Video Modal Open/Close**: Apply `06-modal` (scale-up spring with dark backdrop cross-blur).
  * **Text/Control Swaps**: Apply `04-text-states-swap` when toggling audio (MUTE ↔ SOUND ON) or switching play states.
  * **Skeleton Loader**: Apply `14-skeleton-reveal` for streaming video posters and high-res stills.
* Never use abrupt or jarring un-eased standard transitions.

### B. Agentation MCP
* Ensure all interactive components have accessible test selectors / semantic attributes (`data-testid`, `aria-label`) so the Agentation MCP server can inspect, annotate, and verify UI elements seamlessly.

### C. ECC (Everything Claude Code / Antigravity Harness)
* **Plan before build**: Always define the structure and state before writing code.
* **Component Modularity**: Keep components atomic, typed, and isolated (`components/cinematic/ViewfinderHUD.tsx`, `components/cinematic/FilmCard.tsx`, `components/cinematic/ChromeButton.tsx`).
* **Zero Bloat**: Write clean, modern TypeScript + Tailwind code without redundant dependencies.

---

## 7. Portfolio Structure & Key Sections

1. **Top Nav / Viewfinder Bar**: Minimalist brand logo (Liquid Chrome insignia), current local time / timecode, soundscape toggle, project filter tabs.
2. **Hero Section (Showreel)**: Anamorphic 2.39:1 video viewport with custom play/pause/scrub controls, ambient thermal backlight glow, live director statement teaser.
3. **Filmography Grid (The Reel & Projects)**: Asymmetric poster collage inspired by the Pinterest board layout with hover tilt, metadata HUD tags, and instant full-screen playback.
4. **Director's Vision & Statement**: High-contrast typography, statement quotes, raw 35mm portrait with monochrome or thermal key lighting.
5. **Festival Selections & Laurels**: Sleek metallic laurels and festival recognition list.
6. **Technical Arsenal & Gear**: Film cameras (ARRI, RED, 16mm Bolex), DaVinci Resolve color grading setup, optics and sound kit.
7. **Contact / Representation**: Clean inquiry form with a booking terminal / VHS-style aesthetic.
