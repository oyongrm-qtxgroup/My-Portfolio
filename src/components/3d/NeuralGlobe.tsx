import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";
import { useDeviceTier } from "@/contexts/DeviceCapabilityContext";
import type { DeviceTier } from "@/hooks/useDeviceCapability";
import type { Skill } from "@/types";

/* ── Constants ───────────────────────────────────── */
const GLOBE_RADIUS = 2.5;
const ROTATION_SPEED = 0.0015;
const PULSE_SPEED = 0.8;

/* ── Tier Config ─────────────────────────────────── */
interface TierConfig {
  nodeCount: number;
  connectionDist: number;
  wireframe: boolean;
  atmosphere: boolean;
  atmosphereOpacity: number;
  ringCount: number;
  dataFlowCount: number;
  hotspotCount: number;
  interactiveNodes: boolean;
  skillPinCount: number;
}

function getTierConfig(tier: DeviceTier): TierConfig {
  switch (tier) {
    case "high":
      return {
        nodeCount: 250,
        connectionDist: 1.0,
        wireframe: true,
        atmosphere: false,
        atmosphereOpacity: 0,
        ringCount: 3,
        dataFlowCount: 30,
        hotspotCount: 8,
        interactiveNodes: true,
        skillPinCount: 12,
      };
    case "medium":
      return {
        nodeCount: 150,
        connectionDist: 0.8,
        wireframe: true,
        atmosphere: false,
        atmosphereOpacity: 0,
        ringCount: 1,
        dataFlowCount: 15,
        hotspotCount: 4,
        interactiveNodes: true,
        skillPinCount: 4,
      };
    case "low":
      return {
        nodeCount: 80,
        connectionDist: 0.6,
        wireframe: false,
        atmosphere: false,
        atmosphereOpacity: 0,
        ringCount: 0,
        dataFlowCount: 0,
        hotspotCount: 2,
        interactiveNodes: false,
        skillPinCount: 0,
      };
  }
}

/* ── Color Gradient (Y-axis mapped) ──────────────── */
const COLOR_BOTTOM = new THREE.Color("#7c3aed");
const COLOR_EQUATOR = new THREE.Color("#00d4ff");
const COLOR_TOP = new THREE.Color("#00ff88");
const _tmpColor = new THREE.Color();

function getGradientColor(y: number): THREE.Color {
  const t = (y / GLOBE_RADIUS + 1) / 2; // normalize to [0, 1]
  if (t < 0.5) {
    _tmpColor.lerpColors(COLOR_BOTTOM, COLOR_EQUATOR, t * 2);
  } else {
    _tmpColor.lerpColors(COLOR_EQUATOR, COLOR_TOP, (t - 0.5) * 2);
  }
  return _tmpColor;
}

/* ── Helpers ─────────────────────────────────────── */
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / goldenRatio;
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
): { positions: Float32Array; colors: Float32Array } {
  const linePos: number[] = [];
  const lineColors: number[] = [];

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
        linePos.push(ax, ay, az, bx, by, bz);
        const cA = getGradientColor(ay);
        lineColors.push(cA.r, cA.g, cA.b);
        const cB = getGradientColor(by);
        lineColors.push(cB.r, cB.g, cB.b);
      }
    }
  }

  return {
    positions: new Float32Array(linePos),
    colors: new Float32Array(lineColors),
  };
}

/* ── Atmosphere Fresnel Shader ───────────────────── */
const atmosphereVertexShader = /* glsl */ `
  varying float vFresnel;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 viewDir = normalize(-mvPosition.xyz);
    vec3 worldNormal = normalize(normalMatrix * normal);
    vFresnel = pow(1.0 - abs(dot(viewDir, worldNormal)), 3.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFresnel;
  void main() {
    gl_FragColor = vec4(uColor, vFresnel * uOpacity);
  }
`;

/* ── 1. GlobeNodes (vertex-colored point cloud) ──── */
function GlobeNodes({
  positions,
  nodeCount,
  isLight,
}: {
  positions: Float32Array;
  nodeCount: number;
  isLight: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { sizes, colors } = useMemo(() => {
    const s = new Float32Array(nodeCount);
    const c = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      s[i] = 0.03 + Math.random() * 0.04;
      const col = getGradientColor(positions[i * 3 + 1]);
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return { sizes: s, colors: c };
  }, [positions, nodeCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    const base = isLight ? 0.7 : 0.6;
    mat.opacity = base + Math.sin(clock.elapsedTime * PULSE_SPEED) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── 2. GlobeConnections (vertex-colored lines) ──── */
function GlobeConnections({
  linePositions,
  lineColors,
  isLight,
}: {
  linePositions: Float32Array;
  lineColors: Float32Array;
  isLight: boolean;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    const base = isLight ? 0.2 : 0.12;
    mat.opacity = base + Math.sin(clock.elapsedTime * PULSE_SPEED * 0.5) * 0.06;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={isLight ? 0.25 : 0.15}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ── 3. Wireframe Shell (icosahedron overlay) ────── */
function WireframeShell({ isLight }: { isLight: boolean }) {
  return (
    <mesh>
      <icosahedronGeometry args={[GLOBE_RADIUS * 1.02, 3]} />
      <meshBasicMaterial
        wireframe
        color={isLight ? "#0891b2" : "#00d4ff"}
        transparent
        opacity={isLight ? 0.06 : 0.04}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── 4. Atmosphere Glow (Fresnel backside sphere) ── */
function AtmosphereGlow({
  isLight,
  opacity,
}: {
  isLight: boolean;
  opacity: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(isLight ? "#0891b2" : "#00d4ff") },
      uOpacity: { value: opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uColor.value.set(isLight ? "#0891b2" : "#00d4ff");
    matRef.current.uniforms.uOpacity.value = opacity;
  });

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.15, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── 5. Orbiting Rings + Satellites ──────────────── */
function OrbitingRing({
  inclination,
  speed,
  isLight,
}: {
  inclination: number;
  speed: number;
  isLight: boolean;
}) {
  const satelliteRef = useRef<THREE.Mesh>(null);
  const satAngle = useRef(Math.random() * Math.PI * 2);
  const orbitRadius = GLOBE_RADIUS * 1.12;
  const incRad = (inclination * Math.PI) / 180;

  useFrame(() => {
    satAngle.current += speed;
    if (satelliteRef.current) {
      satelliteRef.current.position.set(
        Math.cos(satAngle.current) * orbitRadius,
        Math.sin(satAngle.current) * orbitRadius,
        0,
      );
    }
  });

  return (
    <group rotation={[incRad, 0, 0]}>
      <mesh>
        <torusGeometry args={[orbitRadius, 0.006, 8, 100]} />
        <meshBasicMaterial
          color={isLight ? "#0891b2" : "#00d4ff"}
          transparent
          opacity={isLight ? 0.2 : 0.1}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={satelliteRef} position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function OrbitingRings({
  isLight,
  ringCount,
}: {
  isLight: boolean;
  ringCount: number;
}) {
  const rings = useMemo(() => {
    const configs = [
      { inclination: 30, speed: 0.008 },
      { inclination: 60, speed: 0.012 },
      { inclination: 90, speed: 0.006 },
    ];
    return configs.slice(0, ringCount);
  }, [ringCount]);

  if (ringCount === 0) return null;

  return (
    <group>
      {rings.map((r, i) => (
        <OrbitingRing
          key={i}
          inclination={r.inclination}
          speed={r.speed}
          isLight={isLight}
        />
      ))}
    </group>
  );
}

/* ── 6. Data Flow / Traveling Particles ──────────── */
function DataFlowParticles({
  connectionPositions,
  isLight,
  count,
}: {
  connectionPositions: Float32Array;
  isLight: boolean;
  count: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const segmentCount = Math.floor(connectionPositions.length / 6);

  const particleData = useMemo(() => {
    if (segmentCount === 0) return [];
    return Array.from({ length: count }, () => ({
      segIdx: Math.floor(Math.random() * segmentCount),
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count, segmentCount]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || segmentCount === 0) return;
    const posArr = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      const { segIdx, speed, phase } = particleData[i];
      const t = (Math.sin(clock.elapsedTime * speed + phase) + 1) / 2;
      const si = segIdx * 6;
      posArr[i * 3] = THREE.MathUtils.lerp(
        connectionPositions[si],
        connectionPositions[si + 3],
        t,
      );
      posArr[i * 3 + 1] = THREE.MathUtils.lerp(
        connectionPositions[si + 1],
        connectionPositions[si + 4],
        t,
      );
      posArr[i * 3 + 2] = THREE.MathUtils.lerp(
        connectionPositions[si + 2],
        connectionPositions[si + 5],
        t,
      );
    }
    (
      pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    ).needsUpdate = true;
  });

  if (count === 0 || segmentCount === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={isLight ? "#10b981" : "#00ff88"}
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── 7. Pulsing Hotspots / Energy Bursts ─────────── */
function HotspotRing({
  position,
  phase,
  speed,
  isLight,
}: {
  position: [number, number, number];
  phase: number;
  speed: number;
  isLight: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, camera }) => {
    if (!meshRef.current) return;
    meshRef.current.quaternion.copy(camera.quaternion);
    const t = (Math.sin(clock.elapsedTime * speed + phase) + 1) / 2;
    const scale = 0.08 + t * 0.2;
    meshRef.current.scale.set(scale, scale, scale);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - t) * (isLight ? 0.5 : 0.4);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[0.6, 1.0, 32]} />
      <meshBasicMaterial
        color={isLight ? "#7c3aed" : "#00d4ff"}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function PulsingHotspots({
  nodePositions,
  nodeCount,
  isLight,
  count,
}: {
  nodePositions: Float32Array;
  nodeCount: number;
  isLight: boolean;
  count: number;
}) {
  const hotspots = useMemo(() => {
    return Array.from({ length: count }, () => {
      const idx = Math.floor(Math.random() * nodeCount);
      return {
        position: [
          nodePositions[idx * 3],
          nodePositions[idx * 3 + 1],
          nodePositions[idx * 3 + 2],
        ] as [number, number, number],
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
      };
    });
  }, [nodePositions, count, nodeCount]);

  if (count === 0) return null;

  return (
    <group>
      {hotspots.map((h, i) => (
        <HotspotRing
          key={i}
          position={h.position}
          phase={h.phase}
          speed={h.speed}
          isLight={isLight}
        />
      ))}
    </group>
  );
}

/* ── 8. Interactive Hover Nodes ──────────────────── */
function InteractiveNode({
  position,
  label,
  isHovered,
  onHover,
  isLight,
}: {
  position: [number, number, number];
  label: string;
  isHovered: boolean;
  onHover: (h: boolean) => void;
  isLight: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = isHovered ? 2.5 : 1;

  useFrame(() => {
    if (!meshRef.current) return;
    const s = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(s, targetScale, 0.1));
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial
        color={isLight ? "#0891b2" : "#00d4ff"}
        transparent
        opacity={isHovered ? 0.9 : 0.5}
        depthWrite={false}
      />
      {isHovered && (
        <Html center style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: isLight
                ? "rgba(255,255,255,0.92)"
                : "rgba(10,15,30,0.92)",
              border: `1px solid ${isLight ? "#0891b2" : "#00d4ff"}`,
              borderRadius: 6,
              padding: "4px 10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: isLight ? "#0891b2" : "#00d4ff",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function InteractiveNodes({
  nodePositions,
  nodeCount,
  skills,
  isLight,
}: {
  nodePositions: Float32Array;
  nodeCount: number;
  skills: Skill[];
  isLight: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const nodes = useMemo(() => {
    const targetCount = Math.min(20, nodeCount);
    const step = Math.max(1, Math.floor(nodeCount / targetCount));
    return Array.from({ length: targetCount }, (_, i) => {
      const idx = i * step;
      return {
        position: [
          nodePositions[idx * 3],
          nodePositions[idx * 3 + 1],
          nodePositions[idx * 3 + 2],
        ] as [number, number, number],
        label:
          skills.length > 0 ? skills[i % skills.length].name : `Node ${i + 1}`,
      };
    });
  }, [nodePositions, nodeCount, skills]);

  return (
    <group>
      {nodes.map((node, i) => (
        <InteractiveNode
          key={i}
          position={node.position}
          label={node.label}
          isHovered={hovered === i}
          onHover={(h) => setHovered(h ? i : null)}
          isLight={isLight}
        />
      ))}
    </group>
  );
}

/* ── 9. Skill Pins (hover-to-reveal labels) ──────── */
function SkillPin({
  surfacePos,
  name,
  isLight,
  isHovered,
  onHover,
}: {
  surfacePos: THREE.Vector3;
  name: string;
  isLight: boolean;
  isHovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  const { pinEnd, linePositions: pinLine } = useMemo(() => {
    const end = surfacePos
      .clone()
      .normalize()
      .multiplyScalar(surfacePos.length() + 0.35);
    return {
      pinEnd: end,
      linePositions: new Float32Array([
        ...surfacePos.toArray(),
        ...end.toArray(),
      ]),
    };
  }, [surfacePos]);

  const _worldPos = useMemo(() => new THREE.Vector3(), []);
  const targetScale = isHovered ? 2.5 : 1;

  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    groupRef.current.getWorldPosition(_worldPos);
    const camDir = camera.position.clone().sub(_worldPos).normalize();
    const pinDir = _worldPos.clone().normalize();
    groupRef.current.visible = camDir.dot(pinDir) > 0.15;
    if (dotRef.current) {
      const s = dotRef.current.scale.x;
      dotRef.current.scale.setScalar(THREE.MathUtils.lerp(s, targetScale, 0.1));
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pinLine, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={isLight ? "#0891b2" : "#00d4ff"}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </lineSegments>
      <mesh
        ref={dotRef}
        position={[pinEnd.x, pinEnd.y, pinEnd.z]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial
          color={isLight ? "#7c3aed" : "#00ff88"}
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </mesh>
      {isHovered && (
        <Html
          position={[pinEnd.x, pinEnd.y + 0.18, pinEnd.z]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: isLight
                ? "rgba(255,255,255,0.92)"
                : "rgba(10,15,30,0.92)",
              border: `1px solid ${isLight ? "#0891b2" : "#00d4ff"}`,
              borderRadius: 6,
              padding: "4px 10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: isLight ? "#0891b2" : "#00d4ff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

function SkillPins({
  nodePositions,
  nodeCount,
  skills,
  isLight,
  pinCount,
}: {
  nodePositions: Float32Array;
  nodeCount: number;
  skills: Skill[];
  isLight: boolean;
  pinCount: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const pins = useMemo(() => {
    const count = Math.min(pinCount, skills.length);
    if (count === 0) return [];
    return skills.slice(0, count).map((skill, i) => {
      const idx = Math.floor((i / count) * nodeCount);
      return {
        position: new THREE.Vector3(
          nodePositions[idx * 3],
          nodePositions[idx * 3 + 1],
          nodePositions[idx * 3 + 2],
        ),
        name: skill.name,
      };
    });
  }, [nodePositions, nodeCount, skills, pinCount]);

  if (pins.length === 0) return null;

  return (
    <group>
      {pins.map((pin, i) => (
        <SkillPin
          key={i}
          surfacePos={pin.position}
          name={pin.name}
          isLight={isLight}
          isHovered={hovered === i}
          onHover={(h) => setHovered(h ? i : null)}
        />
      ))}
    </group>
  );
}

/* ── Main Globe ──────────────────────────────────── */
export function NeuralGlobe({ skills = [] }: { skills?: Skill[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const tier = useDeviceTier();
  const config = getTierConfig(tier);

  const { nodePositions, linePositions, lineColors } = useMemo(() => {
    const nodePositions = fibonacciSphere(config.nodeCount, GLOBE_RADIUS);
    const connections = buildConnections(
      nodePositions,
      config.nodeCount,
      config.connectionDist,
    );
    return {
      nodePositions,
      linePositions: connections.positions,
      lineColors: connections.colors,
    };
  }, [config.nodeCount, config.connectionDist]);

  // Slow rotation + subtle mouse-follow via pointer
  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += ROTATION_SPEED;
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
      {/* Base vertex-colored nodes */}
      <GlobeNodes
        positions={nodePositions}
        nodeCount={config.nodeCount}
        isLight={isLight}
      />

      {/* Vertex-colored connections */}
      <GlobeConnections
        linePositions={linePositions}
        lineColors={lineColors}
        isLight={isLight}
      />

      {/* Wireframe shell */}
      {config.wireframe && <WireframeShell isLight={isLight} />}

      {/* Atmospheric Fresnel glow */}
      {config.atmosphere && (
        <AtmosphereGlow isLight={isLight} opacity={config.atmosphereOpacity} />
      )}

      {/* Orbiting rings with satellites */}
      <OrbitingRings isLight={isLight} ringCount={config.ringCount} />

      {/* Data flow traveling particles */}
      <DataFlowParticles
        connectionPositions={linePositions}
        isLight={isLight}
        count={config.dataFlowCount}
      />

      {/* Pulsing energy hotspots */}
      <PulsingHotspots
        nodePositions={nodePositions}
        nodeCount={config.nodeCount}
        isLight={isLight}
        count={config.hotspotCount}
      />

      {/* Interactive hover nodes */}
      {config.interactiveNodes && (
        <InteractiveNodes
          nodePositions={nodePositions}
          nodeCount={config.nodeCount}
          skills={skills}
          isLight={isLight}
        />
      )}

      {/* Skill surface pins */}
      <SkillPins
        nodePositions={nodePositions}
        nodeCount={config.nodeCount}
        skills={skills}
        isLight={isLight}
        pinCount={config.skillPinCount}
      />

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.3, 16, 16]} />
        <meshBasicMaterial
          color={isLight ? "#0891b2" : "#00d4ff"}
          transparent
          opacity={isLight ? 0.06 : 0.03}
          depthWrite={false}
        />
      </mesh>

      {/* Outer rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.05, GLOBE_RADIUS * 1.07, 64]} />
        <meshBasicMaterial
          color={isLight ? "#0891b2" : "#00d4ff"}
          transparent
          opacity={isLight ? 0.15 : 0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
