# DESIGN.md — Ultra-Minimal Brutalist Cinema Workstation

**Project:** Tommaso Ruella — Cinema Student & Visual Direction Portfolio  
**Reference Standards:** Google Stitch DESIGN.md · Vercel Web Interface Guidelines · Industrial Brutalism UI · Minimalist UI · GEMINI.md  

---

## 1. Style Dials & Atmospheric Configuration

| Dial | Level (1–10) | Implementation Expression |
| :--- | :---: | :--- |
| **Creativity** | `8` | Stark cinematic monochromes, molten chrome highlights, deconstructed 35mm contact sheets, pure imagery focus. |
| **Density** | `4` | High-impact negative space, razor-thin structural borders (`1px`), clean tripartite compartmentalization without visual clutter. |
| **Variance** | `8` | Asymmetric layout dynamism: tripartite studio monitor, responsive stills masonry, horizontal SMPTE ruler timeline. |
| **Motion Intent** | `6` | Weighty, fluid spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`). Animate only `transform` and `opacity`. Zero `transition: all`. |

---

## 2. Aesthetic DNA & Visual Language

- **Pitch Black Canvas (`#000000`)**: Deep OLED pitch black base. No washed-out dark-gray fills.
- **Brutalist Monolithic Typography**: Ultra-bold neo-grotesque display headers (`tracking-tight`), uppercase titles, paired with precision monospace telemetry (`tracking-widest`, `tabular-nums`).
- **Tactical Telemetry & DaVinci Workstation**: Inspired by DaVinci Resolve color suites and professional edit bays. Technical HUD overlays (`[REC ●]`, `24 FPS`, `2.39:1`), calibrated SMPTE timecode rulers (`01:00:00:00`), audio peak meters, and color-coded clip tracks.
- **Razor-Sharp Restraint (Absolute Rule)**: ZERO generic tags, ZERO category pills, ZERO explanatory fluff or narrative marketing clichés. Media and project titles speak directly.
- **Specular Chrome & Fluted Glass**: Subtle liquid chrome borders (`linear-gradient`), specular glints on interaction, and optical glare sweeps on card hovers.

---

## 3. Design Tokens & Color Palette

### Base Surfaces
```css
--bg-pitch: #000000;              /* OLED Pitch Black canvas */
--bg-surface: #070709;            /* Base panel background */
--bg-surface-elevated: #0f0f13;   /* Elevated cards & floating docks */
--bg-surface-card: #14141a;       /* Active clip cards */
--border-subtle: rgba(255, 255, 255, 0.08); /* 1px structural dividing lines */
--border-active: rgba(255, 255, 255, 0.25); /* High-contrast active borders */
```

### Metallic & Chrome Accents
```css
--chrome-white: #ffffff;
--chrome-mid: #cbd5e1;
--chrome-dark: #475569;
--chrome-gradient: linear-gradient(135deg, #ffffff 0%, #cbd5e1 25%, #64748b 50%, #f8fafc 75%, #334155 100%);
```

### Tactical Signal Accents
- **Rec Red (`#ff003b`)**: Viewfinder tally lamp and recording status.
- **Sky Blue (`#38bdf8`)**: DaVinci Navy clip accent.
- **Emerald Pulse (`#34d399`)**: Studio monitor status & live feed.
- **Amber Warning (`#fbbf24`)**: DaVinci Orange clip accent.
- **Rose Leather (`#f43f5e`)**: DaVinci Red clip accent.
- **Purple Wave (`#c084fc`)**: DaVinci Purple clip accent.

---

## 4. Typography Hierarchy & Rules

| Role | Font Family | Styles & Parameters |
| :--- | :--- | :--- |
| **Film Titles & Headlines** | `Plus Jakarta Sans` / `Geist Sans` | Ultra-bold (700–800), uppercase, tight letter-spacing (`tracking-tight`), `text-balance`. |
| **Technical Telemetry & HUD** | `JetBrains Mono` / `Geist Mono` | Monospace, `text-[10px]` to `text-xs`, uppercase, wide tracking (`tracking-wider`), `tabular-nums`. |
| **Metadata & Timecodes** | `JetBrains Mono` | Tabular figures (`tabular-nums`), colon-delimited SMPTE (`00:00:00:00`). |
| **Editorial Body & Statements** | `Plus Jakarta Sans` | Light to regular (300–400), line height `leading-relaxed`, neutral high-contrast legibility. |

### Micro-Typography Rules
- Use proper ellipsis (`…`) instead of three individual dots (`...`).
- Numbers and timecodes must enforce `font-variant-numeric: tabular-nums`.
- Non-breaking spaces (`&nbsp;`) between numbers and units (e.g. `24&nbsp;FPS`, `35&nbsp;mm`).

---

## 5. Viewfinder & Cinematic Framing Standards

- **Hero Showreel / Feature Cuts**: `aspect-[2.39/1]` or `aspect-[16/9]` letterboxed container.
- **Stills Bin & Contact Sheets**: Asymmetric 2-column masonry with automatic natural aspect ratio preservation.
- **Viewfinder HUD Overlays**:
  - Top Left: `[REC ● 01:00:00:00]` in neon red / white mono.
  - Top Right: `[ ARRI RAW · 2.39:1 · 24 FPS · 800 ISO ]`.
  - Audio Level Meter: Stereo peak indicator (`L ■■■■□  R ■■■□□ -12dB`).

---

## 6. Component Specifications

### 1. Workstation Tripartite Stage
- **Left Panel (Stills Bin)**: Pure masonry contact sheets. Instant preview selection. Zero tags.
- **Center Panel (Cinema Monitor)**: Clean borderless presentation, pristine YouTube anteprima without obtrusive overlay buttons, in-line DaVinci transport controls docked directly below.
- **Right Panel (Inspector)**: Technical specs table with clean borders (`1px solid var(--border-subtle)`), crew credits, and external links with subtle hover lifts.
- **Bottom Track (Timeline Bar)**: SMPTE millimeter ruler with calibrated timecode marks, color-coded DaVinci clips with active playhead pips and glow rings.

### 2. Floating Liquid Glass Navbar
- Docked pill navigation for non-homepage views (`/statement`, `/archive`, `/films`).
- Frosted glass backdrop blur (`blur(40px) saturate(180%)`), specular inset rim lighting (`inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)`).

### 3. Drawer Profile Inspector
- Slide-over architectural sheet with 35mm film still portrait, polytechnic background summary, and contact terminal.

---

## 7. Web Interface Guidelines & Accessibility Compliance

- **Focus States**: All interactive elements possess `:focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:outline-none`. Never `outline-none` without replacement.
- **Keyboard Navigation**: Spacebar toggles playback, Arrow keys step through projects, Escape closes drawers.
- **Icon Buttons**: Every icon-only button contains an explicit `aria-label` and `title`. Decorative icons have `aria-hidden="true"`.
- **Touch Targets**: Minimum 40px×40px tap targets with `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent`.
- **Motion Safety**: Full compliance with `prefers-reduced-motion: reduce`. Animations gracefully fallback to static opacity states.
- **Theme Color**: Enforced `color-scheme: dark` at HTML root level.
- **Compositor Friendliness**: Strictly animate `transform` and `opacity`. No `transition: all`.

---

## 8. Anti-Patterns (Strictly Prohibited)

- ❌ NO generic SaaS badges, pill tags, category tags, or status indicators.
- ❌ NO explanatory paragraphs or marketing buzzwords ("Elevate", "Seamless", "Next-gen").
- ❌ NO low-contrast washed-out grey canvases — enforce deep pitch black `#000000`.
- ❌ NO emojis in code, markup, or copy.
- ❌ NO `transition: all` — specify exact transition properties.
- ❌ NO un-eased or jarring transition animations.
