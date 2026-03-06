# Plan: Full Portfolio Visual Redesign — "Living Dashboard" Overhaul

**TL;DR**: Transform every section from repetitive fade-up card grids into a visually distinct, immersive experience. Add a persistent ambient 3D background, give each section its own visual signature (3D orbital projects, constellation skills, scroll-driven timeline, holographic certs, depth-layered blog, terminal contact), replace generic scroll-reveal with purposeful motion, and implement a device-capability system for graceful degradation. The sci-fi dashboard theme stays — we're amplifying it, not changing it.

**Steps**

## Phase 0 — Foundation & Infrastructure

1. **Install new dependencies**: Add `@react-three/postprocessing` (bloom/glow effects), `maath` (R3F math easing utilities). These complement the already-installed but unused `@react-three/drei`.

2. **Create device capability hook** at `src/hooks/useDeviceCapability.ts` — Detect GPU tier, device memory, and `prefers-reduced-motion`. Returns `"high" | "medium" | "low"`. High = full 3D; Medium = reduced particles + simpler shaders; Low = CSS-only fallbacks, no Three.js canvases at all. Use `navigator.hardwareConcurrency`, `navigator.deviceMemory`, and a small WebGL benchmark.

3. **Create scroll progress hook** at `src/hooks/useScrollProgress.ts` — Track per-section scroll progress (0→1) using `IntersectionObserver` + scroll position math. This powers scroll-linked animations across all sections.

4. **Add ambient 3D background** — Create `src/components/3d/AmbientBackground.tsx`: a fixed-position, full-viewport `<Canvas>` rendered behind all content in `src/App.tsx`. Uses `drei`'s `Stars` component (subtle, slow-drifting starfield) + a faint nebula fog effect. Responds to scroll position (stars slowly shift perspective as user scrolls down). On medium devices: fewer stars, no fog. On low devices: CSS radial gradient animation fallback. This single change extends the hero's atmosphere across the entire page.

5. **Update `src/App.tsx`** — Mount `AmbientBackground` as a fixed layer behind `<Routes>`. Wrap the app in a `DeviceCapabilityProvider` context so all components can access the performance tier.

6. **Add new CSS utilities** in `src/index.css` — Add `.holographic-shine` (animated gradient sweep for cert cards), `.terminal-glow` (green monochrome glow for contact), `.depth-shadow` (multi-layered box-shadow for Z-depth illusion), `.glitch-text` (CSS-only glitch flicker for section headers), section-specific background patterns (each section gets a unique subtle background instead of alternating `bg-secondary`).

## Phase 1 — Projects Section (Highest Impact)

7. **Create `src/components/3d/ProjectShowcase.tsx`** — A 3D scene where project cards float as glass panels in a curved arc or orbital arrangement. Each card is a `drei` `<Html>` element positioned in 3D space with `MeshPhysicalMaterial` glass backing. The active/selected project floats to center-front with a spring animation. Inactive cards recede in Z-depth and reduce opacity. Mouse drag rotates the carousel slowly. Industry filter re-arranges the orbital positions with smooth transitions.

8. **Redesign `src/components/sections/Projects.tsx`** — Replace the sidebar-list + detail-panel layout with:
   - Desktop: 3D carousel as the primary navigation (step 7) occupying ~60% height, with a detail overlay that slides up from bottom when a project is selected (glass panel with frosted blur)
   - Mobile: Horizontal swipe carousel (CSS scroll-snap with 3D transforms, no Three.js) + bottom sheet detail (keep existing mobile pattern but enhance with depth)
   - Fallback (low-end): Enhanced version of current layout with magnetic hover effects and staggered parallax on cards
   - The `FilterBar` floats above the 3D scene with a glassmorphism backdrop

## Phase 2 — Skills Section (Second Highest Impact)

9. **Create `src/components/3d/SkillConstellation.tsx`** — An interactive 3D node graph (extending the neural globe concept from the hero). Skill categories are large anchor nodes; individual skills are smaller satellite nodes orbiting their category. Node size = proficiency level. Connection lines link related skills across categories (e.g., "Python" connects to both "AI/ML" and "Backend"). The constellation slowly rotates, and hovering a node highlights its connections and reveals a detail tooltip. Clicking a category node zooms into that cluster. Uses `drei`'s `Billboard` for labels, `Line` for connections, custom `Points` geometry for nodes.

10. **Redesign `src/components/sections/Skills.tsx`** — Replace the card grid with:
    - Desktop: Full-width constellation (step 9) with a floating legend/filter panel on the side. "Featured Skills" appear as brighter, pulsing nodes
    - A small "List View" toggle for accessibility — switches to an enhanced version of the current grid (but with radial progress rings instead of linear bars, animated with SVG stroke-dasharray)
    - Mobile: 2D interactive force-directed graph using canvas (lighter than Three.js) OR the radial-ring card grid fallback
    - Low-end: Radial ring cards only (CSS animations)

## Phase 3 — Experience Section

11. **Redesign `src/components/sections/Experience.tsx`** — Replace the static vertical timeline with a scroll-linked immersive journey:
    - Each role becomes a "chapter card" that scales up and gains prominence as it enters the viewport center, then scales down and recedes as it passes
    - **Parallax depth layers**: Company logo/branding as a large, faded background element (Z-back), role title/highlights as foreground content (Z-front), tech stack pills float at mid-depth
    - The timeline rail becomes an animated SVG path that **draws itself** as the user scrolls (using `stroke-dashoffset` linked to scroll progress from step 3)
    - Connection particles flow along the timeline path between roles (small cyan dots traveling the SVG path)
    - The current role (first entry) gets a special "active" state: glowing border pulse, holographic sheen, and a subtle breathing animation
    - No Three.js here — this is purely Framer Motion `useScroll` + `useTransform` + SVG animation. Keeps performance budget for other sections.

## Phase 4 — Certifications & Awards

12. **Create `src/components/3d/HolographicCard.tsx`** — A reusable 3D card component with:
    - `MeshPhysicalMaterial` with `clearcoat`, `iridescence`, and `transmission` for a holographic glass look
    - Mouse-tracked rotation (more pronounced than `GlowCard` tilt — full 3D perspective)
    - Animated rainbow/iridescent gradient sweep on hover
    - "Achievement unlocked" entrance animation: card materializes from a burst of particles, accompanied by a brief glow flash
    - Front face shows cert/award info; backface (accessible via click/drag rotation) shows credential details

13. **Redesign `src/components/sections/CertificationsAwards.tsx`** — Replace the flat grid with:
    - A showcase of `HolographicCard` components in a staggered layout
    - Cards animate in with the "unlock" effect as they scroll into view (sequenced, not all at once)
    - Certifications get a verification seal animation (SVG stamp that inks in)
    - Awards get a subtle particle aura (CSS radial gradient pulsing, not Three.js)
    - Medium/low fallback: `GlowCard` with enhanced CSS holographic gradient (conic-gradient shimmer) — no Three.js

## Phase 5 — Blog Section (Enhancement, Not Overhaul)

14. **Enhance `src/components/sections/Blog.tsx`** — The tilt cards are a good base. Layer on:
    - **Bento grid layout** instead of uniform 3-column: featured/latest post gets 2x size, others stagger in a masonry pattern
    - **Parallax depth on scroll**: Each card moves at a slightly different scroll speed, creating depth without Three.js. Cover image and text content separate in Z on hover (CSS `translateZ` with `perspective` on parent)
    - **Reading progress rings**: Small SVG circular progress indicator showing read time visually
    - **Tag clouds**: Animated floating tag pills that drift subtly (CSS `animation: float`)
    - This is CSS/Framer Motion only — no new Three.js for blog

## Phase 6 — Contact Section

15. **Redesign `src/components/sections/Contact.tsx`** — Transform into a "transmission terminal" experience:
    - The form card gets a **terminal aesthetic**: dark monospace interface with a blinking cursor, scan-line CSS overlay, subtle CRT-screen curvature (CSS `border-radius` + `box-shadow` trick), and green-tinted accent color (using the existing `#00ff88` accent)
    - Input fields animate like terminal prompts: label types out, then input field activates
    - Submit button text: "Send Transmission" with a loading state that shows "Transmitting..." with a progress animation
    - Success state: "Transmission received" with the existing particle burst from `KonamiEasterEgg` (extract and reuse that particle physics)
    - **Social links** become floating holographic icons in a mini 3D scene beside the form (small `<Canvas>` with `drei` `Float` + `Html` wrappers around the icons). They orbit slowly and respond to mouse proximity (magnetic pull effect)
    - The availability card gets a "signal strength" animation — the green dot becomes a pulsing radar ping
    - Low-end fallback: Terminal aesthetic stays (it's CSS-only); social icons become CSS-animated floating elements instead of Three.js

## Phase 7 — Section Transitions & Flow

16. **Replace uniform entrance animations** — Currently every element uses `initial={{ opacity: 0, y: 20 }}` → `whileInView={{ opacity: 1, y: 0 }}`. Replace with section-specific entrances:
    - Projects: Cards materialize from a central point, spreading outward
    - Skills: Nodes appear and connections draw in (constellation builds itself)
    - Experience: Chapter slides in from the direction of the timeline flow
    - Certs: "Unlock" burst animation (step 12)
    - Blog: Cards cascade in from different directions (waterfall pattern)
    - Contact: Terminal "boots up" — scan lines sweep, then content renders line by line

17. **Add section dividers** — Replace hard section breaks with animated transitional elements:
    - Between each section, add a `<SectionDivider>` component: an animated SVG wave, particle stream, or gradient mesh that morphs as it scrolls through the viewport
    - Each divider subtly shifts the ambient background color temperature (e.g., more cyan near Projects, more green near Skills, more purple near Experience)

## Phase 8 — Navbar & Footer Polish

18. **Enhance `src/components/layout/Navbar.tsx`** — Add:
    - Active section indicator that morphs/slides between nav items based on scroll position (currently no active state)
    - Navbar background opacity tied to scroll (more opaque as user scrolls down)
    - Nav items get a subtle magnetic snap on hover (element slightly pulls toward cursor)

19. **Enhance `src/components/layout/Footer.tsx`** — Add:
    - Animated gradient border at the top edge (extending the glow-line pattern)
    - "Signal wave" animation: a subtle audio-waveform-style SVG that pulses slowly
    - Social icons get the same hover glow treatment as the navbar items

## Phase 9 — Performance & Polish

20. **Implement lazy 3D loading** — Every Three.js `<Canvas>` (except the ambient background) should be wrapped in an `IntersectionObserver`-gated loader: only mount the canvas when the section is within ~200px of the viewport. Unmount when far away. Use `Suspense` + `LoadingShimmer` as fallbacks.

21. **Add `@react-three/postprocessing` effects** — Subtle bloom on the ambient background and project showcase (enhances glow without changing geometry). Chromatic aberration on the skill constellation on hover. Keep effects minimal — they're expensive.

22. **Test and tune** the `useDeviceCapability` hook across devices. Ensure:
    - iPhone/Android mid-range: Medium tier (reduced 3D, no post-processing)
    - Older laptops/tablets: Low tier (CSS-only fallbacks)
    - Modern desktop with GPU: High tier (full experience)

23. **Respect `prefers-reduced-motion`** — All animations should have a reduced-motion variant: instant transitions, no parallax, static layouts. This is critical for accessibility.

## New Files to Create

- `src/hooks/useDeviceCapability.ts`
- `src/hooks/useScrollProgress.ts`
- `src/components/3d/AmbientBackground.tsx`
- `src/components/3d/ProjectShowcase.tsx`
- `src/components/3d/SkillConstellation.tsx`
- `src/components/3d/HolographicCard.tsx`
- `src/components/3d/ContactScene.tsx`
- `src/components/ui/SectionDivider.tsx`
- `src/components/ui/TerminalForm.tsx`
- `src/contexts/DeviceCapabilityContext.tsx`

## Files to Modify

- `src/App.tsx` — ambient background, capability provider
- `src/index.css` — new utilities, section backgrounds, terminal styles
- `src/pages/Home.tsx` — section dividers, transition orchestration
- `src/components/sections/Projects.tsx` — full rewrite
- `src/components/sections/Skills.tsx` — full rewrite
- `src/components/sections/Experience.tsx` — major rewrite
- `src/components/sections/CertificationsAwards.tsx` — major rewrite
- `src/components/sections/Blog.tsx` — layout + enhancement
- `src/components/sections/Contact.tsx` — full rewrite
- `src/components/layout/Navbar.tsx` — active state + polish
- `src/components/layout/Footer.tsx` — polish
- `src/components/ui/SectionHeader.tsx` — section-specific entrance variants

## Verification

- Run `npm run dev` and test full scroll-through on desktop Chrome/Firefox/Safari
- Test on mobile (real device or DevTools emulation) — verify medium/low fallbacks activate
- Lighthouse performance audit: target >70 on mobile, >85 on desktop (3D-heavy pages are tough)
- Test `prefers-reduced-motion` by enabling it in OS/browser settings
- Verify all data hooks still work — no functional changes to Supabase queries
- Check each section's loading state (shimmer fallback while 3D canvases lazy-load)
- Verify `GlowCard` tilt and custom cursor still work alongside new 3D elements

## Decisions

- Projects get the heaviest 3D investment (most visited section after hero)
- Skills uses abstract 3D constellation (extends the neural globe motif from hero — visual continuity)
- Experience avoids Three.js entirely (scroll-linked Framer Motion + SVG keeps perf budget)
- Blog gets CSS-only enhancements (already decent, least ROI from full 3D rewrite)
- Contact uses terminal aesthetic (fits the "developer portfolio" identity, mostly CSS)
- Each section has a unique background treatment instead of alternating `bg-primary`/`bg-secondary`
- Post-processing effects used sparingly — only bloom on ambient + project showcase
