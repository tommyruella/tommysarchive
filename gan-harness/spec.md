# Product Specification: CineDesk — DaVinci-Inspired Filmmaker Workstation
> Generated from brief: "ho caricato alcune foto per i progetti, poi ti do i link per mettere i video: DONUT IN TURIN, LOGO, ESOTHIA, CNTRL-Z, VALENCIA, BARCELLONA1, BARCELLONA2, LONDON"

## Vision
CineDesk is a pro-grade editorial cinema workstation interface engineered for Tommaso Ruella—a 21-year-old Cinema Engineering student at Politecnico di Torino specializing in video editing, DaVinci Resolve color grading, 3D animation (Blender), and interactive multimedia. Drawing aesthetic discipline from DaVinci Resolve's spatial ergonomics while avoiding software clone traps, CineDesk turns portfolio inspection into an authentic post-production session: tactile matte charcoal panels, dominant distraction-free cinema preview monitoring, authentic high-res production stills, clean non-intrusive video playback, and a horizontal editing timeline.

## Design Direction
- **Color palette**:
  - Deep Base Canvas: `#0a0a0d` (Matte obsidian charcoal)
  - Workstation Panels: `#121217` (Primary panel surface)
  - Secondary Cards & Hover States: `#1a1a22` (Elevated tactile surface)
  - Floating Docks & Pill Overlays: `rgba(18, 18, 23, 0.88)` with `backdrop-filter: blur(24px)`
  - Active Emerald Status Indicator: `#34d399` (Politecnico status & playhead active pip)
  - Transport Action Surface: `#ffffff` with `#0a0a0d` icon (High contrast tactile trigger)
  - Hairline Panel Borders: `rgba(255, 255, 255, 0.07)` default, `rgba(255, 255, 255, 0.16)` on focus/hover
  - Text Hierarchy:
    - Primary Headings: `#f4f4f5` (Zinc 100)
    - Subtitles & Body: `#d4d4d8` (Zinc 300)
    - Metadata Labels & SMPTE Chips: `#71717a` (Zinc 500)
- **Typography**:
  - Font Family: `Plus Jakarta Sans` or high-grade neo-grotesque sans-serif with geometric precision.
  - Hierarchy:
    - Project Title: `text-2xl` to `text-3xl`, font-bold (`font-700`), tight tracking (`tracking-[-0.02em]`).
    - Section Headers & Technical Badges: `text-[11px]` to `text-xs`, font-semibold, uppercase, tracking wide (`tracking-[0.08em]`).
    - Body / Synopsis: `text-xs` to `text-sm`, font-light (`font-300`), leading relaxed (`leading-relaxed`).
    - Numeric Readouts & SMPTE Timecodes: Tabular figures strictly in monospace (`00:03:40:00`, `24.00 FPS`, `2.39:1`).
- **Layout philosophy**:
  - Tripartite Workstation Stage + Bottom Chronological Sequencer:
    - Left Column (25-30% width): Asymmetric Pinterest-style stills bin. Pure visual media thumbnails, zero text overlay clutter.
    - Center Column (Dominant 45-50% width): Dynamic Cinema Preview Monitor with auto-aspect ratio letterboxing, dual native/YouTube playback engine, and floating transport dock.
    - Right Column (20-25% width): Editorial Project Inspector with metadata, academic context, role, synopsis, technical chips, crew credits, and real outbound links.
    - Bottom Row (Full Width): 10+ clip chronological timeline sequencer with active playhead indicator and bottom-right circular "About Me" profile trigger.
  - Zero Desktop Topbar: Eliminates conventional website navigation bars to maximize vertical monitoring estate.
  - Refined Controlled Geometry (`stondato moderato`): `rounded-xl` (12px) for main panel enclosures and slide-over drawers; `rounded-lg` (8px) for media cards, clips, and transport buttons; `rounded-md` (6px) for technical badges and metadata pills.
- **Visual identity**:
  - Industrial post-production minimalism avoiding noisy cyber sci-fi tropes and generic SaaS gradients.
  - Anti-AI-slop directives:
    - NO rainbow gradients or generic purple/cyan neon glows.
    - NO generic 3D floating balls, decorative squiggles, or AI particle canvases.
    - NO stock illustrations, generic avatars, or cartoon drawings.
    - NO messy YouTube chrome, third-party recommended videos, or ads invading the cinema frame.
    - NO text captions or tags stamped on top of thumbnails in the left stills bin.
- **Inspiration**:
  - DaVinci Resolve 19 (Cut & Color Page spatial organization and transport ergonomics).
  - Teenage Engineering hardware (minimalist industrial functionalism).
  - Criterion Channel & Cahiers du Cinéma (reverence for still photography and cinema credits).

---

## Features (prioritized)

### Must-Have (Sprint 1-2)

1. **Curated Media Asset Ingestion & Folder Hierarchy**
   - *Description*: Map the user's authentic uploaded photos from `public/projects/[slug]/` into `data/projects.ts`, replacing all generic Unsplash placeholders. Covers:
     - `timeless`: 5 high-res 2.39:1 anamorphic cinema stills (`Screenshot 2024-05-27 alle 23.42.01.png`, etc.).
     - `logo-animation`: 6 3D Blender renders for American Illness (`Screenshot 2024-05-28 alle 00.10.37.png`, etc.).
     - `esothia`: 2 authentic production stills including Tommaso Ruella's interview frame.
     - `set-23-barca`: 2 analog 16mm/Super-8 film emulation stills (Casa Vicens & La Boqueria).
     - Dedicated asset folders with READMEs for all remaining projects.
   - *Acceptance Criteria*: Zero broken image paths; local assets render instantly; images retain authentic aspect ratios without unwanted stretching.

2. **Dual-Engine Cinema Monitor (Native Video & Clean YouTube Embed)**
   - *Description*: High-fidelity preview monitor supporting both native HTML5 video (`/timeless.mp4`) and seamless embedded YouTube playback for projects with provided video IDs:
     - `donut-in-turin`: ID `pV4sw1oza5c`
     - `logo-animation`: ID `wBEbZQBo4c4`
     - `esothia`: ID `LksrRu6uEtg`
     - `ctrl-z`: ID `QfKeIw0iED8`
     - `set-23-barca` (Barcellona 1): ID `yGgGy4eZROk`
     - `barcellona-2`: ID `xPzrwrbP5tg`
     - `valencia`: ID `wBEbZQBo4c4`
     - `london`: ID `KyG3RiIU38A`
   - *Acceptance Criteria*: When `isPlaying` is false, monitor displays the authentic high-resolution still/poster with a clean play overlay. When play is triggered, iframe embeds with `enablejsapi=1&rel=0&modestbranding=1&playsinline=1` and begins playing cleanly without third-party channel clutter; native videos use `<video>`.

3. **Sleek Custom Transport Dock & Tactile Playback Controls**
   - *Description*: Centered bottom transport bar on the preview monitor featuring Project Title, Skip Back (`←`), Play/Pause (`Space`), Skip Forward (`→`), Year, and Duration readout.
   - *Acceptance Criteria*: Toggling play triggers instant playback or pause; pressing step keys increments or decrements the selected media item (cycling through lead video and secondary stills).

4. **Asymmetric Pinterest-Style Stills Bin (Left Panel)**
   - *Description*: Vertical visual bin displaying project stills with varied aspect ratios (`wide`, `portrait`, `landscape`, `square`).
   - *Acceptance Criteria*: Pure imagery with no text overlays or tag badges; clicking any thumbnail immediately routes that asset into the dominant preview monitor; active still features an illuminated hairline border.

5. **Editorial Project Inspector (Right Panel)**
   - *Description*: Refined typography sidebar presenting project title, academic context, role, comprehensive synopsis, technical specs pills, collaborative crew credits, and real outbound links (YouTube, Atelier 35, Pinterest).
   - *Acceptance Criteria*: Displays full credits accurately; links open in external tabs with `noopener noreferrer`; container scrolls smoothly with `.custom-workstation-scrollbar`.

6. **Horizontal Temporal Project Sequencer (Bottom Bar)**
   - *Description*: Chronological sequence bar showing all portfolio projects (2023–2024) as rounded editing clips (`rounded-lg`).
   - *Acceptance Criteria*: Selecting a clip switches the active project across Left Bin, Center Monitor, and Right Inspector; active clip features an illuminated emerald playhead indicator and automatically scrolls into view.

7. **Expanded Travel & Cinematic Recap Suite**
   - *Description*: Introduce dedicated project entries or sequence clips for the creator's travel cinematography:
     - `Set '23 Barça` (Part 1 - Analog film emulation recap)
     - `Barcellona '23 (Part 2)` (ID `xPzrwrbP5tg`)
     - `Valencia '23` (Travel video recap)
     - `London '24` (ID `KyG3RiIU38A`)
   - *Acceptance Criteria*: All recap projects are accessible from the timeline with correct synopses, video links, camera specs, and color grading notes.

8. **Editorial Profile Slide-Over Drawer with Authentic Student Portrait**
   - *Description*: Circular trigger button at bottom-right (`rounded-full` or `rounded-xl`) opening a slide-over modal drawer.
   - *Acceptance Criteria*: Displays Tommaso Ruella's authentic video frame portrait from `esothia` (`Screenshot 2024-07-29 alle 15.11.53.png`), student credentials at Politecnico di Torino, skills matrix, and working SVG vector links for Instagram, LinkedIn, and email. Closes on `Esc` or backdrop click.

### Should-Have (Sprint 3-4)

9. **Workstation Keyboard Shortcuts Engine**
   - *Description*: Complete pro-editor hotkey system:
     - `Space`: Toggle video play / pause
     - `ArrowLeft` / `ArrowRight`: Navigate previous / next project
     - `ArrowUp` / `ArrowDown`: Step through stills within the current project
     - `F`: Toggle cinema fullscreen presentation
     - `Esc`: Close modals, drawers, or exit fullscreen
   - *Acceptance Criteria*: Hotkeys work reliably across all operating systems without conflicting with native browser scrolling; disabled when typing in form inputs.

10. **Native Fullscreen Cinema Projection Mode**
    - *Description*: Fullscreen button in the monitor header expanding the media edge-to-edge with an auto-hiding floating transport bar.
    - *Acceptance Criteria*: Transport bar fades out smoothly after 2.5 seconds of mouse inactivity and reappears on pointer movement; pressing `F` or `Esc` restores normal layout.

11. **Interactive SMPTE Timecode & Scrub Bar**
    - *Description*: Precision timecode readout (`00:00:00:00`) and interactive scrub bar for native video and timeline navigation.
    - *Acceptance Criteria*: Dragging or clicking the scrubber updates playback position; timecode advances smoothly during playback.

12. **Responsive Studio Deck Mode for Mobile Viewports**
    - *Description*: Clean mobile adaptation replacing 3-column desktop with a sleek segmented tab switcher: `[ Stills ] [ Monitor ] [ Info ]`.
    - *Acceptance Criteria*: Mobile users (<768px) can easily toggle between views; bottom timeline remains reachable; touch swipe gestures supported.

### Nice-to-Have (Sprint 5+)

13. **LUT Color Grade Simulation Switcher**
    - *Description*: Interactive LUT switcher on the cinema monitor allowing reviewers to preview color grades:
      - `Rec.709` (Clean neutral baseline)
      - `Warm Film / Kodak 2383` (Rich contrast, warm highlights, deep shadows)
      - `Bleach Bypass` (Desaturated, silver retention look)
      - `Noir Monochrome` (Contrast-rich black and white)
    - *Acceptance Criteria*: Clicking a LUT applies real-time CSS/SVG filter curves to the active preview without video playback stutter.

14. **Audio VU Peak Level Visualizer**
    - *Description*: Real-time or simulated stereo peak meter in the transport dock reflecting sound design work on audio projects (`Esothia`, `Timeless`).
    - *Acceptance Criteria*: Meter bars bounce responsively when playback is active and settle to zero when paused.

15. **Deep-Link State & Query Param Synchronization**
    - *Description*: Two-way URL synchronization (`?project=donut-in-turin&media=0`).
    - *Acceptance Criteria*: Loading a deep URL opens the exact project and asset directly; browser back/forward buttons update workstation state cleanly.

16. **Dynamic Letterboxing & Cinema Aspect Ratio Framing**
    - *Description*: Aspect ratio framing lines and dynamic letterbox mattes matching the project's true capture format (2.39:1 CinemaScope, 16:9 HD, 9:16 Vertical Short, 4:3 Academy).
    - *Acceptance Criteria*: Badges in the monitor indicate active ratio (`2.39:1 ANAMORPHIC`, `9:16 SHORTS`, etc.); matte cleanly frames the viewport.

---

## Technical Stack
- **Frontend Framework**: Next.js 15 (App Router, React 19)
- **Styling Architecture**: Tailwind CSS with custom DaVinci utility classes (`.davinci-panel`, `.davinci-card`, `.custom-workstation-scrollbar`)
- **Icons**: Lucide React + custom inline vector SVGs for brand icons (Instagram, LinkedIn)
- **Media Engine**: Native HTML5 `<video>`, clean embedded YouTube iframes with no-cookie privacy domains, and Next.js `<Image>` / `<img>` with local asset paths
- **State Management**: React state hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **Animation & Transitions**: CSS hardware-accelerated transitions, custom cubic-bezier timing functions, and backdrop filters

---

## Evaluation Criteria

### Design Quality (weight: 0.3)
- Does the interface capture the authentic, tactile atmosphere of a professional DaVinci workstation without becoming an unusable clone?
- Are panels, cards, and buttons styled with the refined, modern corner radius (`rounded-xl` for panels, `rounded-lg` for cards/buttons, `rounded-md` for badges)?
- Is the layout free of visual clutter: zero desktop topbar, no noisy tags on thumbnails, and no cheesy AI gradients?

### Originality (weight: 0.2)
- Does the workstation feel authorial and uniquely tailored to Tommaso Ruella's dual background in engineering and cinema?
- Is the spatial layout faithful to the reference sketch (Left: Stills, Center: Monitor, Right: Info, Bottom: Timeline)?
- Does it integrate travel cinematography (`Valencia`, `Barcellona`, `London`) as a compelling personal narrative?

### Craft (weight: 0.3)
- Are transitions between projects and media items seamless without page reloads or layout jumps?
- Does the dual-engine monitor transition smoothly between native HTML5 video and embedded YouTube streams?
- Are authentic uploaded screenshots cleanly displayed with correct aspect ratios?
- Is the "About Me" drawer polished with Tommaso's real video frame portrait, complete bio, and working vector social links?

### Functionality (weight: 0.2)
- Does `npm run build` pass with zero TypeScript, JSX, or lint errors?
- Do all video links play without broken iframes or intrusive advertising banners?
- Does keyboard navigation (`Space`, `Arrows`, `F`, `Esc`) operate smoothly?
- Are all dedicated asset folders under `public/projects/[slug]/` present and populated?

---

## Sprint Plan

### Sprint 1: Data Model Expansion & Asset Mapping (Completed)
- **Goals**: Map authentic uploaded screenshots into `data/projects.ts`, create folder architecture, and expand project types with `youtubeId`.
- **Features**: #1, #6.
- **Definition of Done**: `timeless`, `logo-animation`, `esothia`, and `set-23-barca` use authentic uploaded photos; all 10+ project directories established.

### Sprint 2: Dual-Engine Media Playback & Refined Geometry (Current)
- **Goals**: Build dual native/YouTube playback engine in `MainProjectViewer.tsx`, integrate video IDs, refine corner radiuses (`rounded-xl` / `rounded-lg`), and update "About Me" drawer with authentic portrait.
- **Features**: #2, #3, #4, #5, #7, #8.
- **Definition of Done**: Video links play cleanly; left bin shows pure imagery without tags; about drawer features real photo; dev build compiles with 0 errors.

### Sprint 3: Ergonomics & Fullscreen Projection (Next)
- **Goals**: Complete keyboard shortcuts engine, cinema fullscreen projection mode, interactive timecode scrubber, and responsive mobile deck tabs.
- **Features**: #9, #10, #11, #12.
- **Definition of Done**: Full keyboard workflow operates without mouse; fullscreen mode auto-hides controls; mobile tab switcher is fully functional.

### Sprint 4: Advanced Cinema Color & Audio Extensions (Future Polish)
- **Goals**: Implement real-time LUT simulation switcher, dynamic aspect ratio framing, audio VU meter, and deep-link URL state synchronization.
- **Features**: #13, #14, #15, #16.
- **Definition of Done**: Reviewers can switch LUTs in real time; URL parameters persist workstation state.
