"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { roomGeometry, fixedGeometry } from "@/lib/geometry";
import { getStrategicViewpoint, overviewViewpoint } from "@/lib/viewpoints";
import type { RoomId } from "@/lib/house";

type Props = {
  activeRoom: RoomId;
  activeViewpointId?: string;
  focusMode?: boolean;
};

const roomTones: Record<RoomId, string> = {
  ingresso: "#ddd8cf",
  disimpegno: "#e7e2d9",
  "soggiorno-cucina": "#e7e0d5",
  "bagno-lavanderia": "#dce4e1",
  camera: "#e8e1d9",
  "cabina-armadio": "#ded6ca",
};

function CameraRig({ viewpointId }: { viewpointId?: string }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const preset = useMemo(() => getStrategicViewpoint(viewpointId) ?? overviewViewpoint, [viewpointId]);

  useEffect(() => {
    camera.position.set(...preset.position);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = preset.fov;
      camera.updateProjectionMatrix();
    }
    controlsRef.current?.target.set(...preset.target);
    controlsRef.current?.update();
  }, [camera, preset]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={preset.target}
      minDistance={0.8}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2.01}
      enablePan
    />
  );
}

function Floor({ roomId, active, focusMode }: { roomId: RoomId; active: boolean; focusMode: boolean }) {
  const geometry = roomGeometry.find((room) => room.roomId === roomId)!;
  const shape = new THREE.Shape();
  geometry.polygon.forEach(([x, z], index) => index === 0 ? shape.moveTo(x, z) : shape.lineTo(x, z));
  shape.closePath();
  const shapeGeometry = new THREE.ShapeGeometry(shape);
  shapeGeometry.rotateX(Math.PI / 2);

  const dimmed = focusMode && !active;

  return (
    <mesh geometry={shapeGeometry} position={[0, active ? 0.014 : 0, 0]} receiveShadow>
      <meshStandardMaterial
        color={active ? "#cbbda8" : roomTones[roomId]}
        roughness={0.94}
        transparent={dimmed}
        opacity={dimmed ? 0.18 : 1}
      />
    </mesh>
  );
}

function Wall({
  x,
  z,
  length,
  axis = "x",
  height = 2.7,
  thickness = 0.14,
  focusMode = false,
}: {
  x: number;
  z: number;
  length: number;
  axis?: "x" | "z";
  height?: number;
  thickness?: number;
  focusMode?: boolean;
}) {
  return (
    <mesh position={[x, height / 2, z]} castShadow={!focusMode} receiveShadow>
      <boxGeometry args={axis === "x" ? [length, height, thickness] : [thickness, height, length]} />
      <meshStandardMaterial
        color="#f5f2ec"
        roughness={0.96}
        transparent={focusMode}
        opacity={focusMode ? 0.34 : 1}
        depthWrite={!focusMode}
      />
    </mesh>
  );
}

function WindowPanel({ x, z, width, focusMode }: { x: number; z: number; width: number; focusMode: boolean }) {
  return (
    <group position={[x, 1.47, z]}>
      <mesh>
        <boxGeometry args={[0.035, 1.28, width]} />
        <meshPhysicalMaterial color="#dbe6e8" transparent opacity={focusMode ? 0.20 : 0.45} roughness={0.15} transmission={0.16} />
      </mesh>
      <mesh position={[0.02, 0, 0]}>
        <boxGeometry args={[0.045, 1.38, 0.055]} />
        <meshStandardMaterial color="#aaa59b" transparent={focusMode} opacity={focusMode ? 0.38 : 1} />
      </mesh>
    </group>
  );
}

function DoorLeaf({ x, z, rotation = 0, width = 0.8, focusMode }: { x: number; z: number; rotation?: number; width?: number; focusMode: boolean }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[width / 2, 1.05, 0]} castShadow={!focusMode}>
        <boxGeometry args={[width, 2.1, 0.045]} />
        <meshStandardMaterial color="#e5e0d7" transparent={focusMode} opacity={focusMode ? 0.42 : 1} />
      </mesh>
    </group>
  );
}

function LivingFurniture() {
  const [cx, cz] = fixedGeometry.structuralColumnLiving.position;
  const [cw, cd] = fixedGeometry.structuralColumnLiving.footprintM;
  const [tx, tz] = fixedGeometry.tvPartitionLiving.position;

  return (
    <>
      <mesh position={[cx, 1.35, cz]} castShadow>
        <boxGeometry args={[cw, 2.7, cd]} />
        <meshStandardMaterial color="#a9a49c" />
      </mesh>

      <group position={[tx, 0, tz]}>
        <mesh position={[0, 0.36, 0]} castShadow>
          <boxGeometry args={[fixedGeometry.tvPartitionLiving.widthM, 0.72, fixedGeometry.tvPartitionLiving.depthM]} />
          <meshStandardMaterial color="#c6bba9" />
        </mesh>
        <mesh position={[-1.02, 1.45, 0]} castShadow>
          <boxGeometry args={[0.34, 1.55, 0.34]} />
          <meshStandardMaterial color="#c6bba9" />
        </mesh>
        <mesh position={[1.02, 1.30, 0]} castShadow>
          <boxGeometry args={[0.34, 1.15, 0.34]} />
          <meshStandardMaterial color="#c6bba9" />
        </mesh>
        <mesh position={[0, 1.33, -0.02]}>
          <boxGeometry args={[1.12, 0.66, 0.06]} />
          <meshStandardMaterial color="#2c2c2a" roughness={0.55} />
        </mesh>
      </group>

      <mesh position={[4.73, 0.45, 1.30]} castShadow>
        <boxGeometry args={[0.72, 0.9, 2.25]} />
        <meshStandardMaterial color="#d6d0c5" />
      </mesh>
      <mesh position={[3.95, 0.45, 0.42]} castShadow>
        <boxGeometry args={[1.75, 0.9, 0.68]} />
        <meshStandardMaterial color="#d9d3c8" />
      </mesh>
      <mesh position={[4.68, 1.35, 2.45]} castShadow>
        <boxGeometry args={[0.82, 2.7, 0.74]} />
        <meshStandardMaterial color="#cec7bb" />
      </mesh>

      <mesh position={[2.68, 0.38, 4.78]} castShadow>
        <boxGeometry args={[2.18, 0.76, 0.88]} />
        <meshStandardMaterial color="#d5cec3" />
      </mesh>
      <mesh position={[1.22, 0.39, 1.65]} scale={[1, 1, 1.55]} castShadow>
        <cylinderGeometry args={[0.68, 0.68, 0.76, 40]} />
        <meshStandardMaterial color="#cfc3b1" />
      </mesh>
    </>
  );
}

function BathroomFurniture() {
  return (
    <>
      <mesh position={[0.73, 0.025, 6.95]} receiveShadow>
        <boxGeometry args={[1.46, 0.05, 1.05]} />
        <meshStandardMaterial color="#d6ddd9" />
      </mesh>
      <mesh position={[1.45, 1.05, 6.95]}>
        <boxGeometry args={[0.025, 2.05, 1.05]} />
        <meshPhysicalMaterial color="#d9e6e8" transparent opacity={0.34} transmission={0.15} />
      </mesh>

      <mesh position={[2.0, 0.45, 6.25]} castShadow>
        <boxGeometry args={[1.15, 0.78, 0.45]} />
        <meshStandardMaterial color="#d4cabc" />
      </mesh>
      <mesh position={[2.3, 0.35, 7.45]} castShadow>
        <cylinderGeometry args={[0.28, 0.3, 0.7, 28]} />
        <meshStandardMaterial color="#f0efeb" />
      </mesh>
      <mesh position={[3.05, 0.35, 7.45]} castShadow>
        <cylinderGeometry args={[0.28, 0.3, 0.7, 28]} />
        <meshStandardMaterial color="#f0efeb" />
      </mesh>

      <mesh position={[3.55, 0.86, 6.65]} castShadow>
        <boxGeometry args={[0.62, 1.72, 0.66]} />
        <meshStandardMaterial color="#ecebe7" />
      </mesh>
      <mesh position={[3.12, 1.05, 6.62]} castShadow>
        <boxGeometry args={[0.055, 2.1, 1.0]} />
        <meshStandardMaterial color="#bfb39f" />
      </mesh>
    </>
  );
}

function BedroomFurniture() {
  return (
    <>
      <mesh position={[1.75, 0.30, 10.55]} castShadow>
        <boxGeometry args={[1.72, 0.60, 2.02]} />
        <meshStandardMaterial color="#ddd7cf" />
      </mesh>
      <mesh position={[1.75, 0.95, 11.48]} castShadow>
        <boxGeometry args={[1.84, 1.15, 0.12]} />
        <meshStandardMaterial color="#c7bba9" />
      </mesh>
      <mesh position={[0.55, 0.34, 10.95]} castShadow>
        <boxGeometry args={[0.42, 0.68, 0.42]} />
        <meshStandardMaterial color="#cfc6b8" />
      </mesh>
      <mesh position={[2.95, 0.34, 10.95]} castShadow>
        <boxGeometry args={[0.42, 0.68, 0.42]} />
        <meshStandardMaterial color="#cfc6b8" />
      </mesh>
    </>
  );
}

function WardrobeFurniture() {
  return (
    <>
      <mesh position={[3.78, 1.1, 10.25]} castShadow>
        <boxGeometry args={[0.48, 2.2, 2.55]} />
        <meshStandardMaterial color="#cec6b9" />
      </mesh>
      <mesh position={[5.06, 1.1, 10.25]} castShadow>
        <boxGeometry args={[0.48, 2.2, 2.55]} />
        <meshStandardMaterial color="#cec6b9" />
      </mesh>
      <mesh position={[4.42, 1.1, 11.34]} castShadow>
        <boxGeometry args={[1.55, 2.2, 0.48]} />
        <meshStandardMaterial color="#cec6b9" />
      </mesh>
    </>
  );
}

function HouseShell({ activeRoom, focusMode }: { activeRoom: RoomId; focusMode: boolean }) {
  return (
    <group>
      {roomGeometry.map((room) => (
        <Floor key={room.roomId} roomId={room.roomId} active={room.roomId === activeRoom} focusMode={focusMode} />
      ))}

      <Wall x={2.665} z={0} length={5.33} focusMode={focusMode} />
      <Wall x={2.665} z={11.60} length={5.33} focusMode={focusMode} />
      <Wall x={0} z={5.80} length={11.60} axis="z" focusMode={focusMode} />
      <Wall x={5.33} z={5.80} length={11.60} axis="z" focusMode={focusMode} />

      <Wall x={1.55} z={5.95} length={3.10} focusMode={focusMode} />
      <Wall x={3.78} z={5.95} length={0.54} focusMode={focusMode} />
      <Wall x={4.05} z={6.95} length={1.90} axis="z" focusMode={focusMode} />
      <Wall x={1.15} z={7.90} length={2.30} focusMode={focusMode} />
      <Wall x={3.15} z={7.90} length={0.72} focusMode={focusMode} />
      <Wall x={3.51} z={9.90} length={3.40} axis="z" focusMode={focusMode} />
      <Wall x={4.12} z={8.85} length={1.22} focusMode={focusMode} />
      <Wall x={5.03} z={8.85} length={0.60} focusMode={focusMode} />
      <Wall x={4.55} z={5.30} length={1.50} axis="z" focusMode={focusMode} />

      <WindowPanel x={0.001} z={1.30} width={1.28} focusMode={focusMode} />
      <WindowPanel x={0.001} z={4.15} width={1.22} focusMode={focusMode} />
      <WindowPanel x={0.001} z={6.85} width={0.92} focusMode={focusMode} />
      <WindowPanel x={0.001} z={9.62} width={1.28} focusMode={focusMode} />

      <DoorLeaf x={3.12} z={5.94} width={0.82} focusMode={focusMode} />
      <DoorLeaf x={2.55} z={7.89} width={0.80} focusMode={focusMode} />
      <DoorLeaf x={4.42} z={8.84} width={0.72} focusMode={focusMode} />

      {(!focusMode || activeRoom === "soggiorno-cucina") && <LivingFurniture />}
      {(!focusMode || activeRoom === "bagno-lavanderia") && <BathroomFurniture />}
      {(!focusMode || activeRoom === "camera") && <BedroomFurniture />}
      {(!focusMode || activeRoom === "cabina-armadio") && <WardrobeFurniture />}
    </group>
  );
}

export function House3D({ activeRoom, activeViewpointId, focusMode = true }: Props) {
  const activePreset = getStrategicViewpoint(activeViewpointId);

  return (
    <div className="house-3d">
      <Canvas
        shadows
        camera={{ position: overviewViewpoint.position, fov: overviewViewpoint.fov, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={[focusMode ? "#f0eee8" : "#ebe9e3"]} />
        <ambientLight intensity={focusMode ? 1.65 : 1.45} />
        <hemisphereLight intensity={0.72} groundColor="#c7c0b5" />
        <directionalLight
          position={[4, 9, 3]}
          intensity={2.15}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <HouseShell activeRoom={activeRoom} focusMode={focusMode} />
        <ContactShadows
          position={[2.665, -0.015, 5.8]}
          scale={12}
          opacity={focusMode ? 0.20 : 0.32}
          blur={2.8}
          far={8}
        />
        {!activePreset && !focusMode && (
          <gridHelper args={[15, 30, "#bbb6ad", "#d8d4cc"]} position={[2.665, -0.025, 5.8]} />
        )}
        <CameraRig viewpointId={activeViewpointId} />
      </Canvas>
      <div className="viewer-badge">
        <strong>
          {focusMode
            ? `Focus ambiente · ${activeRoom === "soggiorno-cucina" ? "Soggiorno / Cucina" : activeRoom}`
            : activePreset
              ? "Vista strategica calibrata"
              : "Modello volumetrico M1"}
        </strong>
        <span>
          {activePreset
            ? activePreset.purpose
            : "Trascina per ruotare · rotella per zoom · tasto destro per spostare"}
        </span>
      </div>
    </div>
  );
}
