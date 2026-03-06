import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDeviceTier } from "@/contexts/DeviceCapabilityContext";
import { usePageScroll } from "@/hooks/useScrollProgress";

/* ── Nebula fog planes ────────────────────────────── */
function NebulaFog() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.elapsedTime;
  });

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#00d4ff") },
        uColor2: { value: new THREE.Color("#7c3aed") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        void main() {
          float noise = sin(vUv.x * 3.0 + uTime * 0.1) * cos(vUv.y * 2.0 + uTime * 0.15) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, noise);
          float alpha = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y) * 0.04;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    }),
    [],
  );

  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <planeGeometry args={[60, 30]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}

/* ── Scroll-responsive starfield wrapper ──────────── */
function ScrollStarfield({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Slowly shift perspective based on scroll
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      scrollProgress * 0.3 - 0.15,
      0.02,
    );
    groupRef.current.rotation.y += 0.0001;
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={80}
        depth={60}
        count={1200}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />
    </group>
  );
}

function MediumStarfield({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      scrollProgress * 0.2 - 0.1,
      0.02,
    );
    groupRef.current.rotation.y += 0.00005;
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={60}
        depth={40}
        count={500}
        factor={2.5}
        saturation={0}
        fade
        speed={0.2}
      />
    </group>
  );
}

/* ── 3D Scene (high tier) ─────────────────────────── */
function HighTierScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ScrollStarfield scrollProgress={scrollProgress} />
      <NebulaFog />
      <ambientLight intensity={0.05} />
    </>
  );
}

/* ── 3D Scene (medium tier) ───────────────────────── */
function MediumTierScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <MediumStarfield scrollProgress={scrollProgress} />
      <ambientLight intensity={0.05} />
    </>
  );
}

/* ── CSS fallback (low tier) ──────────────────────── */
function CSSFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 animate-gradient-shift bg-gradient-animated"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(124,58,237,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(0,255,136,0.02) 0%, transparent 50%)",
        }}
      />
      {/* Static star dots */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-glow-pulse"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.15 + Math.random() * 0.2,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────── */
export function AmbientBackground() {
  const tier = useDeviceTier();
  const scrollProgress = usePageScroll();

  if (tier === "low") {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CSSFallback />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Suspense fallback={<CSSFallback />}>
        <Canvas
          camera={{ position: [0, 0, 20], fov: 60 }}
          dpr={[1, tier === "high" ? 1.25 : 1]}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          frameloop="always"
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          {tier === "high" ? (
            <HighTierScene scrollProgress={scrollProgress} />
          ) : (
            <MediumTierScene scrollProgress={scrollProgress} />
          )}
          {tier === "high" && (
            <EffectComposer multisampling={0}>
              <Bloom
                luminanceThreshold={0.4}
                luminanceSmoothing={0.9}
                intensity={0.3}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Canvas>
      </Suspense>
    </div>
  );
}
