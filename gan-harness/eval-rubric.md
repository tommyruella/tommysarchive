# Evaluator Rubric: CineDesk — DaVinci Filmmaker Workstation

This evaluation rubric defines the objective criteria and test scenarios used by the Evaluator agent to grade the implementation of the CineDesk workstation interface against the reference sketch, user prompt, and product specification.

## Scoring Overview (Total: 100 Points)

| Category | Weight | Max Points | Passing Threshold |
| :--- | :--- | :--- | :--- |
| **Design Quality & Spatial Blueprint** | 30% | 30 pts | 25 pts |
| **Craft & Polish (Transitions & Authentic Media)** | 30% | 30 pts | 26 pts |
| **Functionality & Dual-Engine Video Playback** | 20% | 20 pts | 18 pts |
| **Originality & Cinema Workstation Identity** | 20% | 20 pts | 17 pts |
| **Total Score** | **100%** | **100 pts** | **86 pts** |

---

## 1. Design Quality & Spatial Blueprint (Weight: 0.3 · 30 Points)

- **Spatial Blueprint Compliance (10 pts)**:
  - Exact tripartite top layout matching the reference sketch: Left (Stills Bin), Center (Dominant Preview Monitor), Right (Project Inspector).
  - Bottom row: Horizontal chronological project timeline with smooth scrolling + "About Me" profile trigger at bottom right.
  - Zero desktop topbar: Maximizes vertical screen estate for preview monitoring.
- **DaVinci Clean Aesthetic & Controlled Geometry (10 pts)**:
  - Matte obsidian surfaces (`#0a0a0d`, `#121217`, `#1a1a22`).
  - Refined, modern corner radius (`rounded-xl` / 12px for panels and drawer, `rounded-lg` / 8px for media cards, timeline clips, and buttons, `rounded-md` / 6px for badges).
  - Strict anti-AI-slop execution: no garish gradients, no cartoonish illustrations, no generic SaaS card grids.
- **Left Panel Asymmetric Stills Bin (5 pts)**:
  - Multi-ratio masonry/grid with zero text tags or caption clutter printed on top of stills.
  - Responsive image loading and clean rounded borders.
- **Typography & Visual Hierarchy (5 pts)**:
  - High-contrast sans-serif headings with generous leading.
  - Monospace typography restricted strictly to technical readouts (SMPTE timecodes, durations, dates).

---

## 2. Craft & Polish (Weight: 0.3 · 30 Points)

- **Authentic Asset Integration (8 pts)**:
  - Real uploaded project screenshots mapped from `public/projects/` (`timeless`, `logo-animation`, `esothia`, `set-23-barca`) replacing generic stock placeholders.
  - Correct aspect ratios preserved without distortion.
- **Media Switching & Transport Fluidity (8 pts)**:
  - Switching projects via the bottom timeline updates Left Bin, Center Monitor, and Right Inspector instantaneously without layout jumps.
  - Clicking any still in the left bin updates the main monitor immediately with active border illumination.
- **Floating Transport Dock (7 pts)**:
  - Restrained transport bar (`rounded-lg` / `rounded-xl`) on the monitor with backdrop blur (`backdrop-blur-xl`).
  - Tactile play/pause button (`Space`), step forward/back controls (`←` / `→`), and duration readouts.
- **Editorial "About Me" Slide-Over Drawer (7 pts)**:
  - Smooth slide-in drawer from the right edge with backdrop blur.
  - Displays Tommaso Ruella's authentic video frame portrait from `esothia` (`Screenshot 2024-07-29 alle 15.11.53.png`).
  - Clean vector SVG icons for Instagram and LinkedIn (zero broken package imports).
  - Escape key and backdrop click close the drawer cleanly.

---

## 3. Functionality & Dual-Engine Video Playback (Weight: 0.2 · 20 Points)

- **Clean Compilation & Zero Runtime Errors (5 pts)**:
  - `npm run build` passes with zero TypeScript or JSX errors.
  - Dev server runs cleanly at `localhost:3000` with no unhandled runtime exceptions.
- **Dual-Engine Video Engine (5 pts)**:
  - Native HTML5 `<video>` for local media (`/timeless.mp4`).
  - Seamless embedded YouTube playback for provided video links (`donut-in-turin`, `logo-animation`, `esothia`, `ctrl-z`, `valencia`, `barca1`, `barca2`, `london`) without third-party channel clutter or intrusive ads.
  - Falls back cleanly to high-res still photography when stopped or stepping through stills.
- **Data Integrity & Travel Recaps (5 pts)**:
  - All projects present with authentic titles, roles, synopses, technical chips, and external links.
  - Travel recap suite (`Valencia`, `Barcellona 1`, `Barcellona 2`, `London`) properly cataloged.
  - Dedicated asset directories exist under `public/projects/[slug]/`.
- **Keyboard Navigation & Ergonomics (5 pts)**:
  - `Space`: Toggles play/pause.
  - `ArrowLeft` / `ArrowRight`: Navigates to previous / next project.
  - `Escape`: Closes active modal or drawer.

---

## 4. Originality & Cinema Identity (Weight: 0.2 · 20 Points)

- **Post-Production Software Metaphor (8 pts)**:
  - Feels like a real creative editing workstation rather than a conventional portfolio template.
- **Authentic Student Context (6 pts)**:
  - Accurately highlights Politecnico di Torino Cinema Engineering background, Blender 3D, DaVinci Resolve, and real collaborative student crew credits.
- **Timeline Playhead Interaction (6 pts)**:
  - Horizontal timeline acts as a visual editing track with illuminated active playhead pip and smooth horizontal auto-scroll.

---

## Verification Checklist for Evaluator

- [ ] Run `npm run build` or check dev server status: 0 compilation errors.
- [ ] Inspect `http://localhost:3000`: workstation shell renders with no missing modules.
- [ ] Verify Left Stills Bin: renders pure imagery without tags or captions.
- [ ] Verify Center Monitor: plays `/timeless.mp4` natively and provided YouTube IDs cleanly upon Play.
- [ ] Verify Right Inspector: displays accurate project metadata, crew credits, and external links.
- [ ] Verify Bottom Timeline: all project clips selectable; active indicator visible.
- [ ] Verify About Me Drawer: opens on button click; displays authentic photo; Instagram and LinkedIn links work with SVG icons; closes on Escape or backdrop click.
- [ ] Verify all project folders exist under `public/projects/`.
