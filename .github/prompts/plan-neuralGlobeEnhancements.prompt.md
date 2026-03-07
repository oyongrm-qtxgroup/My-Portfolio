# Plan: NeuralGlobe 9-Factor Visual Upgrade

Upgrade the hero globe from a basic node-connection mesh to a richly layered, interactive, performance-tiered 3D visualization with all 9 requested enhancements. All existing globe behavior (rotation, mouse tilt, theme support) is preserved — new effects layer on top.

---

## Phase 1: Core Visual Enhancements (pure geometry additions)

1. **More nodes & denser connections** — Make `NODE_COUNT` and `CONNECTION_DISTANCE` dynamic based on `useDeviceTier()`: high=250/1.0, medium=150/0.8, low=80/0.6. Import tier context into `NeuralGlobe`.

2. **Color gradient / multi-color nodes** — Add per-vertex colors via `bufferAttribute` with `vertexColors: true` on `PointsMaterial`. Color mapped by Y-axis: bottom `#7c3aed` (purple) → equator `#00d4ff` (cyan) → top `#00ff88` (green). Connections get a similar treatment.

3. **Wireframe shell / grid overlay** — Add an `<icosahedronGeometry>` mesh (radius × 1.02, detail=3) with `wireframe: true`, very low opacity. Skip on low tier.

4. **Atmospheric glow / halo** — Custom Fresnel shader on a backside-rendered sphere (radius × 1.15). Edges glow bright, center transparent — authentic atmosphere look. Reduce on medium, skip on low.

## Phase 2: Animated Effects (useFrame-driven)

5. **Orbiting rings / satellites** — 2-3 `<torusGeometry>` rings at different inclinations (30°, 60°, 90°) rotating at varied speeds. 1-2 small sphere "satellites" orbit along each ring. Tier: 3 rings (high), 1 (medium), none (low).

6. **Data flow / traveling particles** — ~20-30 particles that travel along randomly selected connection line segments using sinusoidal lerp. Brighter/larger than regular nodes. Tier: 30/15/0.

7. **Pulsing hotspots / energy bursts** — 5-8 random nodes emit expanding/fading ring pulses (`<ringGeometry>`), staggered with random phase offsets. Billboarded to face camera. Tier: 8/4/2.

## Phase 3: Interactive & Data-Driven (requires drei `<Html>`)

8. **Hover/click interactivity** — Add ~20 larger `<instancedMesh>` nodes overlaying the point cloud. These respond to `onPointerOver`/`onPointerOut` — scale up and show a tooltip via drei `<Html>` with a skill/tech keyword. Skip on low tier.

9. **Skill pins** — Fetch featured skills via `useSkills` (already available from Supabase), pass to `HeroCanvas` → `NeuralGlobe`. Place 8-12 pins on the surface: vertical line + dot + `<Html>` label (JetBrains Mono, small). Auto-hide labels facing away from camera. Tier: 12/4/0.

## Phase 4: Integration & Polish

10. **Wire up `useDeviceTier()`** throughout all new sub-components via prop drilling from the main `NeuralGlobe` component.

11. **Adjust HeroCanvas lighting** — Tweak point light intensities to better illuminate wireframe and orbiting rings.

12. **Test & tune** — Verify all 3 tiers, both themes, mobile layout, and fps.

---

## Relevant Files

- `src/components/3d/NeuralGlobe.tsx` — **Primary target**. Add 5 new sub-components (`OrbitingRings`, `DataFlowParticles`, `PulsingHotspots`, `InteractiveNodes`, `SkillPins`), modify `GlobeNodes` for vertex colors, add wireframe mesh and atmosphere mesh.
- `src/components/3d/HeroCanvas.tsx` — Pass skill data prop, adjust lighting.
- `src/components/sections/Hero.tsx` — Import `useSkills`, thread featured skills to `HeroCanvas`.
- `src/contexts/DeviceCapabilityContext.tsx` — `useDeviceTier()` consumed for all tier branching.
- `src/hooks/useSkills.ts` — Source of skill pin data.
- `src/components/3d/FloatingParticles.tsx` — No changes, but data flow particles should use different color/size to avoid visual blending.

## New Dependencies

- None — `@react-three/drei` (v10.7.7) already installed.

## Verification

1. **Dark mode visual**: Dense multi-color nodes, wireframe shell, atmosphere halo, orbiting rings with satellites, traveling data particles, energy bursts, skill labels all visible
2. **Light mode visual**: Same elements with `NormalBlending` and adjusted opacities
3. **Interactivity**: Hover large nodes → scale + tooltip; mouse tilt still works
4. **High-tier perf**: >45fps in DevTools Performance tab
5. **Low-tier perf**: Override tier to "low" → minimal globe (80 nodes, no extras)
6. **Mobile**: Globe fits in `flex-col-reverse` layout, labels don't overflow
7. **Build**: `npm run build` passes clean

## Decisions

- **vertexColors buffer** over custom shaders for multi-color nodes (simpler, sufficient quality)
- **Custom Fresnel shader** for atmosphere (more authentic than plain transparent sphere, ~20 lines)
- **InstancedMesh** for interactive nodes (only ~20 selectable, rest stay as fast point cloud)
- **Skill pins** filtered to `is_featured: true` from Supabase
- All effects are **additive layers** — nothing changes about the existing base globe

## Further Considerations

1. Interactive node tooltips could show skill names randomly assigned from skills data, or just show category labels — which do you prefer?
2. Should orbiting rings have a dotted/dashed style or solid thin rings?
3. Step 9 (skill pins) adds a data-fetch dependency to the globe — if skills fail to load, pins simply don't render (graceful degradation). Sound good?
