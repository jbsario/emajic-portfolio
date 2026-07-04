import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const GOLD = "#dcab2c";
const GOLD_LIGHT = "#eec96c";
const GOLD_DARK = "#9b7a27";

const FLOOR_COUNT = 13;
const FLOOR_HEIGHT = 0.17;
const TOWER_W = 0.72;
const TOWER_D = 0.52;
const BUILDING_HEIGHT = FLOOR_COUNT * FLOOR_HEIGHT;

type FloorRefs = {
  group: THREE.Group | null;
  material: THREE.MeshStandardMaterial | null;
};

const Tower = ({ progress }: { progress: MotionValue<number> }) => {
  const rootRef = useRef<THREE.Group>(null);
  const floors = useRef<FloorRefs[]>([]);
  const craneMastRef = useRef<THREE.Group>(null);
  const craneMaterialsRef = useRef<THREE.Material[]>([]);
  const cableRef = useRef<THREE.Mesh>(null);
  const ghostMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const floorDefs = useMemo(
    () =>
      Array.from({ length: FLOOR_COUNT }, (_, i) => {
        const isSetback = i >= FLOOR_COUNT - 3;
        const w = isSetback ? TOWER_W * 0.75 : TOWER_W;
        const d = isSetback ? TOWER_D * 0.75 : TOWER_D;
        const geometry = new THREE.BoxGeometry(w, FLOOR_HEIGHT, d);
        const edges = new THREE.EdgesGeometry(geometry);
        return { geometry, edges, baseY: i * FLOOR_HEIGHT };
      }),
    []
  );

  const ghostEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(TOWER_W, BUILDING_HEIGHT, TOWER_D)),
    []
  );

  const craneHeight = BUILDING_HEIGHT + 0.5;
  const craneX = TOWER_W / 2 + 0.32;

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

    root.rotation.y += delta * 0.15 + pointer.current.x * 0.002;
    root.rotation.x += delta * 0.04 + pointer.current.y * 0.001;

    const p = progress.get();
    const t = state.clock.elapsedTime;

    floors.current.forEach((floor, i) => {
      if (!floor.group || !floor.material) return;
      const floorStart = i / FLOOR_COUNT;
      const floorEnd = (i + 1) / FLOOR_COUNT;
      const localT = THREE.MathUtils.clamp((p - floorStart) / (floorEnd - floorStart), 0, 1);

      floor.group.visible = localT > 0.001;
      floor.group.scale.y = Math.max(localT, 0.001);

      if (localT < 1) {
        const pulse = (Math.sin(t * 6) + 1) / 2;
        floor.material.emissiveIntensity = 0.15 + pulse * 0.45;
      } else {
        floor.material.emissiveIntensity = 0.12;
      }
    });

    if (ghostMaterialRef.current) {
      ghostMaterialRef.current.opacity = (1 - p) * 0.3;
    }

    const currentHeight = THREE.MathUtils.clamp(p * FLOOR_COUNT, 0, FLOOR_COUNT) * FLOOR_HEIGHT;
    const craneT = THREE.MathUtils.clamp((p - 0.75) / 0.2, 0, 1);
    const craneOpacity = 1 - craneT;

    craneMaterialsRef.current.forEach((mat) => {
      if ("opacity" in mat) (mat as THREE.Material & { opacity: number }).opacity = craneOpacity;
    });

    if (craneMastRef.current) {
      craneMastRef.current.rotation.y += delta * 0.4;
      craneMastRef.current.visible = craneOpacity > 0.01;
    }

    if (cableRef.current) {
      const jibY = craneHeight;
      const dist = Math.max(jibY - currentHeight, 0.01);
      cableRef.current.position.set(0, currentHeight + dist / 2, 0);
      cableRef.current.scale.y = dist;
    }
  });

  return (
    <group ref={rootRef}>
      {/* Site plaza base */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[1.6, 0.06, 1.2]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={0.4} roughness={0.7} transparent opacity={0.5} />
      </mesh>

      {/* Ghost blueprint silhouette — fades out as the real tower rises */}
      <lineSegments geometry={ghostEdges} position={[0, BUILDING_HEIGHT / 2, 0]}>
        <lineBasicMaterial ref={ghostMaterialRef} color={GOLD_LIGHT} transparent opacity={0.3} />
      </lineSegments>

      {/* Floors, rising one by one */}
      {floorDefs.map((def, i) => (
        <group
          key={i}
          position={[0, def.baseY, 0]}
          ref={(el) => {
            floors.current[i] = floors.current[i] ?? { group: null, material: null };
            floors.current[i].group = el;
          }}
        >
          <mesh position={[0, FLOOR_HEIGHT / 2, 0]} geometry={def.geometry}>
            <meshStandardMaterial
              ref={(el) => {
                floors.current[i] = floors.current[i] ?? { group: null, material: null };
                floors.current[i].material = el;
              }}
              color={GOLD}
              metalness={0.8}
              roughness={0.3}
              emissive={GOLD_DARK}
              emissiveIntensity={0.12}
            />
          </mesh>
          <lineSegments position={[0, FLOOR_HEIGHT / 2, 0]} geometry={def.edges}>
            <lineBasicMaterial color={GOLD_LIGHT} transparent opacity={0.5} />
          </lineSegments>
        </group>
      ))}

      {/* Construction crane — present while building, fades near completion */}
      <group ref={craneMastRef} position={[craneX, 0, 0]}>
        <mesh position={[0, craneHeight / 2, 0]}>
          <boxGeometry args={[0.03, craneHeight, 0.03]} />
          <meshStandardMaterial
            ref={(el) => el && (craneMaterialsRef.current[0] = el)}
            color={GOLD_LIGHT}
            transparent
            opacity={1}
            emissive={GOLD_LIGHT}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.28, craneHeight, 0]}>
          <boxGeometry args={[0.56, 0.025, 0.025]} />
          <meshStandardMaterial
            ref={(el) => el && (craneMaterialsRef.current[1] = el)}
            color={GOLD_LIGHT}
            transparent
            opacity={1}
            emissive={GOLD_LIGHT}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.12, craneHeight, 0]}>
          <boxGeometry args={[0.16, 0.025, 0.025]} />
          <meshStandardMaterial
            ref={(el) => el && (craneMaterialsRef.current[2] = el)}
            color={GOLD_LIGHT}
            transparent
            opacity={1}
            emissive={GOLD_LIGHT}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh ref={cableRef} position={[-0.28, craneHeight / 2, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 1, 6]} />
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
        camera={{ position: [1.6, 1.1, 4.6], fov: 32 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={1.2} color={GOLD_LIGHT} />
        <pointLight position={[-4, -2, -3]} intensity={0.6} color={GOLD} />
        <Suspense fallback={null}>
          <Tower progress={progress} />
          <Sparkles count={20} scale={3.5} size={2} speed={0.3} color={GOLD_LIGHT} opacity={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroModel3D;
