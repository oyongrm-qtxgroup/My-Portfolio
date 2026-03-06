import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Config ──────────────────────────────────────── */
const NODE_COUNT = 150;
const GLOBE_RADIUS = 2.5;
const CONNECTION_DISTANCE = 0.8;
const ROTATION_SPEED = 0.0015;
const PULSE_SPEED = 0.8;

/* ── Helpers ─────────────────────────────────────── */
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / goldenRatio;

    // Add subtle randomness for organic feel
    const r = radius * (0.95 + Math.random() * 0.1);
    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);
  }

  return positions;
}

function buildConnections(
  positions: Float32Array,
  count: number,
  maxDist: number,
) {
  const linePositions: number[] = [];

  for (let i = 0; i < count; i++) {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];

    for (let j = i + 1; j < count; j++) {
      const bx = positions[j * 3];
      const by = positions[j * 3 + 1];
      const bz = positions[j * 3 + 2];

      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < maxDist) {
        linePositions.push(ax, ay, az, bx, by, bz);
      }
    }
  }

  return new Float32Array(linePositions);
}

/* ── Nodes (points) ──────────────────────────────── */
function GlobeNodes({ positions }: { positions: Float32Array }) {
  const pointsRef = useRef<THREE.Points>(null);

  const sizes = useMemo(() => {
    const s = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      s[i] = 0.03 + Math.random() * 0.04;
    }
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.6 + Math.sin(clock.elapsedTime * PULSE_SPEED) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00d4ff"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Connections (lines) ─────────────────────────── */
function GlobeConnections({ linePositions }: { linePositions: Float32Array }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.12 + Math.sin(clock.elapsedTime * PULSE_SPEED * 0.5) * 0.06;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00d4ff"
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ── Main Globe ──────────────────────────────────── */
export function NeuralGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  const { nodePositions, linePositions } = useMemo(() => {
    const nodePositions = fibonacciSphere(NODE_COUNT, GLOBE_RADIUS);
    const linePositions = buildConnections(
      nodePositions,
      NODE_COUNT,
      CONNECTION_DISTANCE,
    );
    return { nodePositions, linePositions };
  }, []);

  // Slow rotation + subtle mouse-follow via pointer
  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += ROTATION_SPEED;
    // Subtle tilt toward cursor (lerp)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.15,
      0.02,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.x * 0.08,
      0.02,
    );
  });

  return (
    <group ref={groupRef}>
      <GlobeNodes positions={nodePositions} />
      <GlobeConnections linePositions={linePositions} />

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.3, 16, 16]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>

      {/* Outer rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.05, GLOBE_RADIUS * 1.07, 64]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
