import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const GOLD = "#dcab2c";
const GOLD_LIGHT = "#eec96c";
const GOLD_DARK = "#9b7a27";

// Palette matched to the approved perspective render: warm beige ground floor,
// white upper volume, dark roof/window bands, wood-slat accents.
const CONCRETE = "#98908a";
const BEIGE = "#c9b28e";
const WHITE = "#e8e2d5";
const DARK = "#33302c";
const WOOD = "#b08344";
const GLASS = "#181614";

const HOUSE_HEIGHT = 1.3;

type PieceDef = {
  key: string;
  size: [number, number, number];
  /** Group position; y is the piece's bottom edge. */
  position: [number, number, number];
  color: string;
  /** Progress window [start, end] during which this piece builds. */
  phase: [number, number];
  /** grow = rises from the ground like poured construction; fade = appears in place. */
  mode: "grow" | "fade";
  emissive?: string;
  emissiveIntensity?: number;
  edges?: boolean;
};

// Construction sequence: foundation → ground floor → second-floor slab →
// upper volume + wood accent → staggered roofs → balcony → windows light up →
// perimeter fence.
const PIECES: PieceDef[] = [
  { key: "foundation", size: [2.5, 0.08, 1.6], position: [0, 0, 0], color: CONCRETE, phase: [0.02, 0.1], mode: "grow" },
  { key: "gf-main", size: [1.5, 0.5, 1.3], position: [-0.4, 0.08, 0], color: BEIGE, phase: [0.1, 0.28], mode: "grow", edges: true },
  { key: "gf-column", size: [0.09, 0.5, 0.09], position: [1.02, 0.08, 0.5], color: DARK, phase: [0.24, 0.3], mode: "grow" },
  { key: "slab-2f", size: [2.4, 0.08, 1.45], position: [0, 0.58, 0], color: CONCRETE, phase: [0.3, 0.38], mode: "grow" },
  { key: "2f-main", size: [1.5, 0.5, 1.3], position: [-0.4, 0.66, 0], color: WHITE, phase: [0.38, 0.56], mode: "grow", edges: true },
  { key: "wood-accent", size: [0.55, 0.5, 0.05], position: [0.02, 0.66, 0.66], color: WOOD, phase: [0.54, 0.62], mode: "grow" },
  { key: "roof-main", size: [1.7, 0.08, 1.5], position: [-0.4, 1.16, 0], color: DARK, phase: [0.6, 0.7], mode: "grow", edges: true },
  { key: "roof-upper", size: [0.9, 0.06, 1.2], position: [-0.7, 1.24, 0], color: DARK, phase: [0.66, 0.72], mode: "grow" },
  { key: "balcony", size: [0.75, 0.06, 0.4], position: [0.72, 0.58, 0.78], color: WOOD, phase: [0.68, 0.74], mode: "grow" },
  { key: "win-gf", size: [0.55, 0.28, 0.03], position: [-0.75, 0.2, 0.655], color: GLASS, phase: [0.72, 0.84], mode: "fade", emissive: GOLD, emissiveIntensity: 0.55 },
  { key: "door", size: [0.32, 0.44, 0.03], position: [-0.12, 0.08, 0.655], color: GLASS, phase: [0.74, 0.86], mode: "fade", emissive: GOLD, emissiveIntensity: 0.35 },
  { key: "win-2f", size: [1.15, 0.26, 0.03], position: [-0.42, 0.8, 0.655], color: GLASS, phase: [0.72, 0.84], mode: "fade", emissive: GOLD, emissiveIntensity: 0.6 },
  { key: "fence-1", size: [0.55, 0.3, 0.05], position: [-1.0, 0, 1.05], color: BEIGE, phase: [0.82, 0.88], mode: "grow", edges: true },
  { key: "fence-2", size: [0.55, 0.3, 0.05], position: [-0.35, 0, 1.05], color: BEIGE, phase: [0.85, 0.91], mode: "grow", edges: true },
  { key: "fence-3", size: [0.55, 0.3, 0.05], position: [0.3, 0, 1.05], color: BEIGE, phase: [0.88, 0.94], mode: "grow", edges: true },
];

type PieceRefs = { group: THREE.Group | null; material: THREE.MeshStandardMaterial | null };

const House = ({ progress }: { progress: MotionValue<number> }) => {
  const rootRef = useRef<THREE.Group>(null);
  const refs = useRef<PieceRefs[]>([]);
  const railMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const ghostMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const craneMastRef = useRef<THREE.Group>(null);
  const craneMaterialsRef = useRef<THREE.Material[]>([]);
  const cableRef = useRef<THREE.Mesh>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const geometries = useMemo(
    () =>
      PIECES.map((def) => {
        const geometry = new THREE.BoxGeometry(...def.size);
        return { geometry, edges: def.edges ? new THREE.EdgesGeometry(geometry) : null };
      }),
    []
  );

  const ghostEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.3, HOUSE_HEIGHT, 1.3)), []);
  const railEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.75, 0.22, 0.4)), []);

  const craneHeight = HOUSE_HEIGHT + 0.45;
  const craneX = 1.7;

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    pointer.current.x += (target.current.x - pointer.current.x) * 0.03;
    pointer.current.y += (target.current.y - pointer.current.y) * 0.03;

    root.rotation.y += delta * 0.14 + pointer.current.x * 0.002;

    const p = progress.get();
    const t = state.clock.elapsedTime;
    const pulse = (Math.sin(t * 6) + 1) / 2;

    PIECES.forEach((def, i) => {
      const piece = refs.current[i];
      if (!piece?.group || !piece.material) return;
      const [start, end] = def.phase;
      const localT = THREE.MathUtils.clamp((p - start) / (end - start), 0, 1);
      const building = localT > 0 && localT < 1;

      if (def.mode === "grow") {
        piece.group.visible = localT > 0.001;
        piece.group.scale.y = Math.max(localT, 0.001);
        piece.material.emissiveIntensity = building ? 0.15 + pulse * 0.5 : 0.06;
      } else {
        piece.group.visible = localT > 0.01;
        piece.material.opacity = localT;
        piece.material.emissiveIntensity = localT * (def.emissiveIntensity ?? 0);
      }
    });

    // Balcony railing appears with the balcony details
    if (railMaterialRef.current) {
      railMaterialRef.current.opacity = THREE.MathUtils.clamp((p - 0.74) / 0.06, 0, 1) * 0.9;
    }

    // Blueprint ghost of the finished house fades as reality replaces it
    if (ghostMaterialRef.current) {
      ghostMaterialRef.current.opacity = (1 - p) * 0.3;
    }

    // Crane: slewing while building, gone at reveal
    const craneT = THREE.MathUtils.clamp((p - 0.82) / 0.16, 0, 1);
    const craneOpacity = 1 - craneT;
    craneMaterialsRef.current.forEach((mat) => {
      if ("opacity" in mat) (mat as THREE.Material & { opacity: number }).opacity = craneOpacity;
    });
    if (craneMastRef.current) {
      craneMastRef.current.rotation.y += delta * 0.35;
      craneMastRef.current.visible = craneOpacity > 0.01;
    }
    if (cableRef.current) {
      const builtHeight = THREE.MathUtils.clamp(p / 0.7, 0, 1) * (HOUSE_HEIGHT - 0.06);
      const dist = Math.max(craneHeight - builtHeight, 0.01);
      cableRef.current.position.y = builtHeight + dist / 2 - 0; // relative to mast group at y 0
      cableRef.current.scale.y = dist;
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.62, 0]}>
      {/* Site plaza */}
      <mesh position={[0, -0.035, 0]}>
        <boxGeometry args={[3.1, 0.07, 2.3]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={0.4} roughness={0.7} transparent opacity={0.45} />
      </mesh>

      {/* Blueprint ghost silhouette */}
      <lineSegments geometry={ghostEdges} position={[0, HOUSE_HEIGHT / 2, 0]}>
        <lineBasicMaterial ref={ghostMaterialRef} color={GOLD_LIGHT} transparent opacity={0.3} />
      </lineSegments>

      {/* House pieces */}
      {PIECES.map((def, i) => (
        <group
          key={def.key}
          position={def.position}
          ref={(el) => {
            refs.current[i] = refs.current[i] ?? { group: null, material: null };
            refs.current[i].group = el;
          }}
        >
          <mesh position={[0, def.size[1] / 2, 0]} geometry={geometries[i].geometry}>
            <meshStandardMaterial
              ref={(el) => {
                refs.current[i] = refs.current[i] ?? { group: null, material: null };
                refs.current[i].material = el;
              }}
              color={def.color}
              metalness={0.3}
              roughness={0.6}
              transparent
              opacity={def.mode === "fade" ? 0 : 1}
              emissive={def.emissive ?? GOLD_DARK}
              emissiveIntensity={0.06}
            />
          </mesh>
          {geometries[i].edges && (
            <lineSegments position={[0, def.size[1] / 2, 0]} geometry={geometries[i].edges}>
              <lineBasicMaterial color={GOLD_LIGHT} transparent opacity={0.28} />
            </lineSegments>
          )}
        </group>
      ))}

      {/* Balcony railing */}
      <lineSegments geometry={railEdges} position={[0.72, 0.75, 0.78]}>
        <lineBasicMaterial ref={railMaterialRef} color={GOLD_LIGHT} transparent opacity={0} />
      </lineSegments>

      {/* Tower crane */}
      <group ref={craneMastRef} position={[craneX, 0, 0]}>
        <mesh position={[0, craneHeight / 2, 0]}>
          <boxGeometry args={[0.035, craneHeight, 0.035]} />
          <meshStandardMaterial
            ref={(el) => el && (craneMaterialsRef.current[0] = el)}
            color={GOLD_LIGHT}
            transparent
            opacity={1}
            emissive={GOLD_LIGHT}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.5, craneHeight, 0]}>
          <boxGeometry args={[1.1, 0.03, 0.03]} />
          <meshStandardMaterial
            ref={(el) => el && (craneMaterialsRef.current[1] = el)}
            color={GOLD_LIGHT}
            transparent
            opacity={1}
            emissive={GOLD_LIGHT}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.22, craneHeight, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.03]} />
          <meshStandardMaterial
            ref={(el) => el && (craneMaterialsRef.current[2] = el)}
            color={GOLD_LIGHT}
            transparent
            opacity={1}
            emissive={GOLD_LIGHT}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh ref={cableRef} position={[-0.6, craneHeight / 2, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 1, 6]} />
          <meshBasicMaterial
            ref={(el) => el && (craneMaterialsRef.current[3] = el)}
            color={GOLD_LIGHT}
            transparent
            opacity={1}
          />
        </mesh>
      </group>
    </group>
  );
};

const HeroModel3D = ({ progress }: { progress: MotionValue<number> }) => {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [2.3, 1.15, 4.3], fov: 33 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[4, 4, 4]} intensity={1.2} color={GOLD_LIGHT} />
        <pointLight position={[-4, -2, -3]} intensity={0.6} color={GOLD} />
        <Suspense fallback={null}>
          <House progress={progress} />
          <Sparkles count={20} scale={3.5} size={2} speed={0.3} color={GOLD_LIGHT} opacity={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroModel3D;
