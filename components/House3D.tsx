"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { roomGeometry, fixedGeometry } from "@/lib/geometry";
import type { RoomId } from "@/lib/house";

type Props = {
  activeRoom: RoomId;
};

const roomTones: Record<RoomId, string> = {
  ingresso: "#dedbd2",
  disimpegno: "#e7e3d9",
  "soggiorno-cucina": "#e9e5dc",
  "bagno-lavanderia": "#d9e2df",
  camera: "#e5dfd7",
  "cabina-armadio": "#ddd6cb",
};

function Floor({ roomId, active }: { roomId: RoomId; active: boolean }) {
  const geometry = roomGeometry.find((room) => room.roomId === roomId)!;
  const shape = new THREE.Shape();
  geometry.polygon.forEach(([x, z], index) => {
    if (index === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  });
  shape.closePath();
  const shapeGeometry = new THREE.ShapeGeometry(shape);
  shapeGeometry.rotateX(Math.PI / 2);

  return (
    <mesh geometry={shapeGeometry} position={[0, active ? 0.012 : 0, 0]} receiveShadow>
      <meshStandardMaterial color={active ? "#c9c0ad" : roomTones[roomId]} roughness={0.9} />
    </mesh>
  );
}

function Wall({ x, z, length, axis = "x", height = 2.7, thickness = 0.14 }: {
  x: number;
  z: number;
  length: number;
  axis?: "x" | "z";
  height?: number;
  thickness?: number;
}) {
  return (
    <mesh position={[x, height / 2, z]} castShadow receiveShadow>
      <boxGeometry args={axis === "x" ? [length, height, thickness] : [thickness, height, length]} />
      <meshStandardMaterial color="#f4f1ea" roughness={0.96} />
    </mesh>
  );
}

function WindowPanel({ x, z, width, axis = "z" }: { x: number; z: number; width: number; axis?: "x" | "z" }) {
  return (
    <group position={[x, 1.45, z]}>
      <mesh>
        <boxGeometry args={axis === "z" ? [0.035, 1.35, width] : [width, 1.35, 0.035]} />
        <meshPhysicalMaterial color="#dce8ea" transparent opacity={0.42} roughness={0.15} transmission={0.2} />
      </mesh>
    </group>
  );
}

function DoorMarker({ x, z, rotation = 0 }: { x: number; z: number; rotation?: number }) {
  return (
    <group position={[x, 0.02, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0.42, 0, 0]}>
        <boxGeometry args={[0.84, 0.025, 0.035]} />
        <meshStandardMaterial color="#b6a993" />
      </mesh>
    </group>
  );
}

function FurnitureVolumes() {
  const [cx, cz] = fixedGeometry.structuralColumnLiving.position;
  const [cw, cd] = fixedGeometry.structuralColumnLiving.footprintM;

  return (
    <>
      {/* Structural column */}
      <mesh position={[cx, 1.35, cz]} castShadow>
        <boxGeometry args={[cw, 2.7, cd]} />
        <meshStandardMaterial color="#b9b4aa" />
      </mesh>

      {/* Partially open TV/storage divider: volumes intentionally schematic. */}
      <group position={[3.65, 0, 3.85]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.95, 0.84, 0.36]} />
          <meshStandardMaterial color="#c9c1b3" />
        </mesh>
        <mesh position={[-0.78, 1.46, 0]} castShadow>
          <boxGeometry args={[0.38, 1.25, 0.36]} />
          <meshStandardMaterial color="#c9c1b3" />
        </mesh>
        <mesh position={[0.73, 1.35, 0]} castShadow>
          <boxGeometry args={[0.42, 0.12, 0.36]} />
          <meshStandardMaterial color="#c9c1b3" />
        </mesh>
      </group>

      {/* Kitchen massing */}
      <mesh position={[5.9, 0.45, 1.05]} castShadow>
        <boxGeometry args={[2.15, 0.9, 0.65]} />
        <meshStandardMaterial color="#d8d4ca" />
      </mesh>
      <mesh position={[6.47, 1.3, 2.2]} castShadow>
        <boxGeometry args={[0.7, 2.6, 1.6]} />
        <meshStandardMaterial color="#d3cec4" />
      </mesh>

      {/* Sofa + dining table massing */}
      <mesh position={[5.25, 0.38, 3.6]} castShadow>
        <boxGeometry args={[2.25, 0.76, 0.88]} />
        <meshStandardMaterial color="#d7d1c7" />
      </mesh>
      <mesh position={[1.75, 0.38, 1.6]} castShadow>
        <cylinderGeometry args={[0.68, 0.68, 0.76, 32]} />
        <meshStandardMaterial color="#cfc5b4" />
      </mesh>

      {/* Bathroom laundry stack and screen */}
      <mesh position={[0.53, 0.86, 6.15]} castShadow>
        <boxGeometry args={[0.62, 1.72, 0.66]} />
        <meshStandardMaterial color="#ecebe7" />
      </mesh>
      <mesh position={[0.92, 1.05, 6.15]} castShadow>
        <boxGeometry args={[0.06, 2.1, 0.9]} />
        <meshStandardMaterial color="#c8bea9" />
      </mesh>

      {/* Bed massing */}
      <mesh position={[1.75, 0.28, 10.9]} castShadow>
        <boxGeometry args={[1.75, 0.56, 2.0]} />
        <meshStandardMaterial color="#ddd7cf" />
      </mesh>

      {/* Walk-in wardrobe massing on sides and bottom. */}
      <mesh position={[4.55, 1.1, 10.1]} castShadow>
        <boxGeometry args={[0.55, 2.2, 3.8]} />
        <meshStandardMaterial color="#cfc8bb" />
      </mesh>
      <mesh position={[6.85, 1.1, 10.1]} castShadow>
        <boxGeometry args={[0.55, 2.2, 3.8]} />
        <meshStandardMaterial color="#cfc8bb" />
      </mesh>
      <mesh position={[5.7, 1.1, 12.28]} castShadow>
        <boxGeometry args={[2.85, 2.2, 0.48]} />
        <meshStandardMaterial color="#cfc8bb" />
      </mesh>
    </>
  );
}

function HouseShell({ activeRoom }: { activeRoom: RoomId }) {
  return (
    <group>
      {roomGeometry.map((room) => (
        <Floor key={room.roomId} roomId={room.roomId} active={room.roomId === activeRoom} />
      ))}

      {/* External shell. Main gaps are represented by transparent window panels. */}
      <Wall x={3.6} z={0} length={7.2} />
      <Wall x={3.6} z={12.6} length={7.2} />
      <Wall x={0} z={6.3} length={12.6} axis="z" />
      <Wall x={7.2} z={6.3} length={12.6} axis="z" />

      {/* Internal partitions with approximate door gaps from the 1:50 drawing. */}
      <Wall x={1.25} z={5.5} length={2.5} />
      <Wall x={2.95} z={5.5} length={0.8} />
      <Wall x={3.35} z={7.1} length={3.0} axis="z" />
      <Wall x={1.2} z={8.55} length={2.4} />
      <Wall x={3.55} z={8.55} length={1.3} />
      <Wall x={4.2} z={10.5} length={4.2} axis="z" />
      <Wall x={4.95} z={7.45} length={1.5} />
      <Wall x={6.65} z={7.45} length={1.1} />
      <Wall x={5.75} z={6.0} length={2.0} axis="z" />

      {/* Window markers on the facade shown in the architect plan. */}
      <WindowPanel x={0.001} z={1.55} width={1.35} />
      <WindowPanel x={0.001} z={4.25} width={1.25} />
      <WindowPanel x={0.001} z={6.9} width={0.95} />
      <WindowPanel x={0.001} z={9.9} width={1.35} />

      {/* Approximate circulation openings */}
      <DoorMarker x={3.0} z={5.49} />
      <DoorMarker x={3.0} z={8.54} />
      <DoorMarker x={5.8} z={7.44} />

      <FurnitureVolumes />
    </group>
  );
}

export function House3D({ activeRoom }: Props) {
  return (
    <div className="house-3d">
      <Canvas
        shadows
        camera={{ position: [10.8, 11.5, 15.5], fov: 38, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#ebe9e3"]} />
        <ambientLight intensity={1.35} />
        <directionalLight position={[5, 10, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
        <HouseShell activeRoom={activeRoom} />
        <gridHelper args={[18, 36, "#bcb8af", "#d8d5ce"]} position={[3.6, -0.025, 6.3]} />
        <OrbitControls
          makeDefault
          target={[3.6, 1.0, 6.3]}
          minDistance={8}
          maxDistance={24}
          maxPolarAngle={Math.PI / 2.08}
          enablePan
        />
      </Canvas>
      <div className="viewer-badge">
        <strong>Modello volumetrico M1</strong>
        <span>Trascina per ruotare · rotella per zoom · tasto destro per spostare</span>
      </div>
    </div>
  );
}
