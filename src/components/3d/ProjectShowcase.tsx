import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/* ── Single floating project card in 3D ──────────── */
function ProjectCard3D({
  project,
  position,
  isActive,
  onClick,
  index,
}: {
  project: Project;
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    // Lerp to target position
    meshRef.current.position.lerp(targetPos, 0.05);
    // Active card slightly forward
    const targetZ = isActive ? position[2] + 0.5 : position[2];
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetZ,
      0.05,
    );
    // Scale
    const targetScale = isActive ? 1.15 : hovered ? 1.05 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08,
    );
    // Opacity via material
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    mat.opacity = THREE.MathUtils.lerp(
      mat.opacity,
      isActive ? 0.95 : 0.6,
      0.05,
    );
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <planeGeometry args={[2.2, 1.4]} />
        <meshPhysicalMaterial
          color="#161b22"
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          side={THREE.DoubleSide}
        />
        <Html
          transform
          occlude
          distanceFactor={4}
          position={[0, 0, 0.01]}
          className="pointer-events-none select-none"
          style={{ width: "220px" }}
        >
          <div
            className={cn(
              "rounded-lg border p-3 transition-all duration-300 backdrop-blur-sm",
              isActive
                ? "border-accent-cyan/40 bg-bg-elevated/90 shadow-glow-cyan"
                : "border-border-glow/30 bg-bg-elevated/70",
            )}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
                {project.industry ?? "General"}
              </span>
              {project.featured && (
                <span className="text-[7px] bg-accent-cyan/20 text-accent-cyan px-1 rounded-full">
                  ★
                </span>
              )}
            </div>
            <h4 className="text-xs font-semibold text-text-primary line-clamp-1">
              {project.title}
            </h4>
            {project.tagline && (
              <p className="mt-0.5 text-[9px] text-text-muted line-clamp-1">
                {project.tagline}
              </p>
            )}
            <div className="mt-1.5 flex gap-1 flex-wrap">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[7px] px-1 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

/* ── Scene with orbital card arrangement ─────────── */
function ProjectScene({
  projects,
  activeIndex,
  onSelectIndex,
}: {
  projects: Project[];
  activeIndex: number;
  onSelectIndex: (i: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Gentle mouse-tracked rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.15,
      0.02,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.05,
      0.02,
    );
  });

  const positions = useMemo(() => {
    const count = projects.length;
    return projects.map((_, i): [number, number, number] => {
      // Arc arrangement
      const angle = ((i - activeIndex) / Math.max(count, 1)) * Math.PI * 1.2;
      const x = Math.sin(angle) * 4;
      const z = Math.cos(angle) * 2 - 2;
      const y = Math.sin(angle * 0.5) * 0.3;
      return [x, y, z];
    });
  }, [projects, activeIndex]);

  return (
    <group ref={groupRef}>
      {projects.map((project, i) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          position={positions[i]}
          isActive={i === activeIndex}
          onClick={() => onSelectIndex(i)}
          index={i}
        />
      ))}
      {/* Subtle light */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-3, -2, 2]} intensity={0.2} color="#00ff88" />
    </group>
  );
}

/* ── Exported component ───────────────────────────── */
export function ProjectShowcase({
  projects,
  activeIndex,
  onSelectIndex,
}: {
  projects: Project[];
  activeIndex: number;
  onSelectIndex: (i: number) => void;
}) {
  return (
    <div className="relative w-full h-[50vh] min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ProjectScene
            projects={projects}
            activeIndex={activeIndex}
            onSelectIndex={onSelectIndex}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
