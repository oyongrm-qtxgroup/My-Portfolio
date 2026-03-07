import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { NeuralGlobe } from "./NeuralGlobe";
import { FloatingParticles } from "./FloatingParticles";
import type { Skill } from "@/types";

function GlobeLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-accent-cyan/20 bg-accent-cyan/5">
        <div
          className="absolute inset-4 rounded-full border border-accent-cyan/10 animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <span className="font-mono text-xs text-accent-cyan/40">
          Loading...
        </span>
      </div>
    </div>
  );
}

export function HeroCanvas({ skills = [] }: { skills?: Skill[] }) {
  return (
    <Suspense fallback={<GlobeLoader />}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          overflow: "visible",
        }}
      >
        {/* Lighting — boosted to illuminate wireframe & rings */}
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#00ff88" />
        <pointLight position={[0, -5, 4]} intensity={0.2} color="#7c3aed" />

        {/* Globe */}
        <NeuralGlobe skills={skills} />

        {/* Background particles */}
        <FloatingParticles />
      </Canvas>
    </Suspense>
  );
}
