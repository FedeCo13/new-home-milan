"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { roomGeometry, fixedGeometry } from "@/lib/geometry";
import { getStrategicViewpoint, overviewViewpoint } from "@/lib/viewpoints";
import type { RoomId } from "@/lib/house";

type Props = { activeRoom: RoomId; activeViewpointId?: string; focusMode?: boolean };

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
    if (camera instanceof THREE.PerspectiveCamera) { camera.fov = preset.fov; camera.updateProjectionMatrix(); }
    controlsRef.current?.target.set(...preset.target);
    controlsRef.current?.update();
  }, [camera, preset]);
  return <OrbitControls ref={controlsRef} makeDefault target={preset.target} minDistance={0.8} maxDistance={20} maxPolarAngle={Math.PI / 2.01} enablePan />;
}

function Floor({ roomId, active, focusMode }: { roomId: RoomId; active: boolean; focusMode: boolean }) {
  const data = roomGeometry.find((room) => room.roomId === roomId)!;
  const shape = new THREE.Shape();
  data.polygon.forEach(([x, z], index) => index === 0 ? shape.moveTo(x, z) : shape.lineTo(x, z));
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape); geometry.rotateX(Math.PI / 2);
  const dimmed = focusMode && !active;
  return <mesh geometry={geometry} position={[0, active ? 0.014 : 0, 0]} receiveShadow><meshStandardMaterial color={active ? "#cbbda8" : roomTones[roomId]} roughness={0.94} transparent={dimmed} opacity={dimmed ? 0.18 : 1} /></mesh>;
}

function Wall({ x, z, length, axis = "x", focusMode = false }: { x: number; z: number; length: number; axis?: "x" | "z"; focusMode?: boolean }) {
  return <mesh position={[x, 1.35, z]} castShadow={!focusMode} receiveShadow><boxGeometry args={axis === "x" ? [length, 2.7, 0.14] : [0.14, 2.7, length]} /><meshStandardMaterial color="#f5f2ec" roughness={0.96} transparent={focusMode} opacity={focusMode ? 0.32 : 1} depthWrite={!focusMode} /></mesh>;
}

function WindowPanel({ x, z, width, focusMode }: { x: number; z: number; width: number; focusMode: boolean }) {
  return <group position={[x, 1.47, z]}><mesh><boxGeometry args={[0.035, 1.28, width]} /><meshPhysicalMaterial color="#dce8ea" transparent opacity={focusMode ? 0.18 : 0.45} roughness={0.14} transmission={0.18} /></mesh><mesh><boxGeometry args={[0.05, 1.38, 0.055]} /><meshStandardMaterial color="#aaa59b" /></mesh></group>;
}

function DoorLeaf({ x, z, width = 0.8, focusMode }: { x: number; z: number; width?: number; focusMode: boolean }) {
  return <group position={[x, 0, z]}><mesh position={[width / 2, 1.05, 0]} castShadow={!focusMode}><boxGeometry args={[width, 2.1, 0.045]} /><meshStandardMaterial color="#e5e0d7" transparent={focusMode} opacity={focusMode ? 0.4 : 1} /></mesh><mesh position={[width - 0.11, 1.02, -0.04]}><sphereGeometry args={[0.035, 14, 14]} /><meshStandardMaterial color="#6d6961" metalness={0.5} /></mesh></group>;
}

function Cabinet({ position, size, color = "#d7d0c5" }: { position: [number, number, number]; size: [number, number, number]; color?: string }) {
  return <group position={position}><mesh castShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.8} /></mesh><mesh position={[0, 0, size[2] / 2 + 0.006]}><boxGeometry args={[size[0] * 0.82, 0.018, 0.012]} /><meshStandardMaterial color="#8f887e" /></mesh></group>;
}

function Kitchen() {
  return <group>
    <Cabinet position={[4.73, 0.45, 0.62]} size={[0.72, 0.9, 0.6]} />
    <Cabinet position={[4.73, 0.45, 1.22]} size={[0.72, 0.9, 0.6]} />
    <Cabinet position={[4.73, 0.45, 1.82]} size={[0.72, 0.9, 0.6]} />
    <Cabinet position={[3.7, 0.45, 0.42]} size={[0.62, 0.9, 0.68]} />
    <Cabinet position={[4.32, 0.45, 0.42]} size={[0.62, 0.9, 0.68]} />
    <mesh position={[4.34, 0.93, 1.18]} castShadow><boxGeometry args={[1.65, 0.06, 2.0]} /><meshStandardMaterial color="#8f8a82" roughness={0.55} /></mesh>
    <mesh position={[4.7, 0.97, 1.15]}><boxGeometry args={[0.48, 0.018, 0.44]} /><meshStandardMaterial color="#252525" /></mesh>
    {[[-0.13,-0.12],[0.13,-0.12],[-0.13,0.12],[0.13,0.12]].map(([dx,dz], i) => <mesh key={i} position={[4.7 + dx, 0.986, 1.15 + dz]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.065, 0.085, 18]} /><meshStandardMaterial color="#666" /></mesh>)}
    <mesh position={[3.87, 0.98, 0.72]}><boxGeometry args={[0.48, 0.04, 0.34]} /><meshStandardMaterial color="#a8a49d" metalness={0.25} /></mesh>
    <mesh position={[4.72, 1.35, 2.45]} castShadow><boxGeometry args={[0.82, 2.7, 0.72]} /><meshStandardMaterial color="#c9c1b5" /></mesh>
    <mesh position={[4.73, 1.35, 2.08]}><boxGeometry args={[0.54, 0.76, 0.025]} /><meshStandardMaterial color="#6f7475" metalness={0.15} /></mesh>
  </group>;
}

function Sofa() {
  return <group position={[2.68, 0, 4.78]}>
    <mesh position={[0, 0.27, 0]} castShadow><boxGeometry args={[2.2, 0.32, 0.88]} /><meshStandardMaterial color="#c8c1b8" roughness={0.96} /></mesh>
    <mesh position={[0, 0.62, 0.33]} rotation={[-0.16,0,0]} castShadow><boxGeometry args={[2.16, 0.58, 0.18]} /><meshStandardMaterial color="#bfb8af" /></mesh>
    <mesh position={[-0.55, 0.48, -0.08]} castShadow><boxGeometry args={[0.95, 0.19, 0.62]} /><meshStandardMaterial color="#d3ccc3" /></mesh>
    <mesh position={[0.55, 0.48, -0.08]} castShadow><boxGeometry args={[0.95, 0.19, 0.62]} /><meshStandardMaterial color="#d3ccc3" /></mesh>
    <mesh position={[-1.05, 0.48, 0]}><boxGeometry args={[0.14, 0.55, 0.86]} /><meshStandardMaterial color="#bbb4ab" /></mesh>
    <mesh position={[1.05, 0.48, 0]}><boxGeometry args={[0.14, 0.55, 0.86]} /><meshStandardMaterial color="#bbb4ab" /></mesh>
  </group>;
}

function DiningSet() {
  const chairs: Array<[number, number, number]> = [[0,0,-1.05],[0,0,1.05],[-0.95,0,0],[0.95,0,0]];
  return <group position={[1.22, 0, 1.65]}>
    <mesh position={[0,0.78,0]} scale={[1,1,1.45]} castShadow><cylinderGeometry args={[0.68,0.68,0.08,40]} /><meshStandardMaterial color="#b99772" /></mesh>
    <mesh position={[0,0.39,0]}><cylinderGeometry args={[0.11,0.14,0.72,20]} /><meshStandardMaterial color="#6f665d" /></mesh>
    {chairs.map(([x,y,z], i) => <group key={i} position={[x,y,z]} rotation={[0, i < 2 ? 0 : Math.PI/2, 0]}><mesh position={[0,0.47,0]}><boxGeometry args={[0.42,0.08,0.42]} /><meshStandardMaterial color="#7f6653" /></mesh><mesh position={[0,0.78,0.18]} rotation={[-0.15,0,0]}><boxGeometry args={[0.42,0.6,0.08]} /><meshStandardMaterial color="#7f6653" /></mesh></group>)}
  </group>;
}

function TvDivider() {
  const [tx, tz] = fixedGeometry.tvPartitionLiving.position;
  return <group position={[tx,0,tz]}>
    <mesh position={[0,0.34,0]} castShadow><boxGeometry args={[fixedGeometry.tvPartitionLiving.widthM,0.68,fixedGeometry.tvPartitionLiving.depthM]} /><meshStandardMaterial color="#c3ae92" /></mesh>
    <mesh position={[-1.05,1.42,0]} castShadow><boxGeometry args={[0.3,1.5,0.34]} /><meshStandardMaterial color="#c3ae92" /></mesh>
    <mesh position={[1.05,1.2,0]} castShadow><boxGeometry args={[0.3,1.05,0.34]} /><meshStandardMaterial color="#c3ae92" /></mesh>
    <mesh position={[0.63,1.82,0]}><boxGeometry args={[0.55,0.1,0.34]} /><meshStandardMaterial color="#c3ae92" /></mesh>
    <mesh position={[0,1.32,-0.02]}><boxGeometry args={[1.16,0.68,0.055]} /><meshStandardMaterial color="#222" roughness={0.35} /></mesh>
  </group>;
}

function LivingFurniture() {
  const [cx, cz] = fixedGeometry.structuralColumnLiving.position; const [cw, cd] = fixedGeometry.structuralColumnLiving.footprintM;
  return <><mesh position={[cx,1.35,cz]} castShadow><boxGeometry args={[cw,2.7,cd]} /><meshStandardMaterial color="#a6a19a" /></mesh><TvDivider /><Kitchen /><Sofa /><DiningSet /></>;
}

function LaundryMachine({ y }: { y: number }) {
  return <group position={[3.55,y,6.65]}><mesh castShadow><boxGeometry args={[0.62,0.82,0.64]} /><meshStandardMaterial color="#ecebe7" /></mesh><mesh position={[0,0,-0.326]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[0.18,0.025,12,28]} /><meshStandardMaterial color="#777" /></mesh><mesh position={[0,0,-0.35]}><circleGeometry args={[0.145,28]} /><meshStandardMaterial color="#3d484c" /></mesh></group>;
}

function BathroomFurniture() {
  return <>
    <mesh position={[0.73,0.025,6.95]}><boxGeometry args={[1.46,0.05,1.05]} /><meshStandardMaterial color="#d7ddd9" /></mesh>
    <mesh position={[1.45,1.05,6.95]}><boxGeometry args={[0.025,2.05,1.05]} /><meshPhysicalMaterial color="#d9e6e8" transparent opacity={0.38} transmission={0.18} /></mesh>
    <mesh position={[0.25,1.85,6.95]}><cylinderGeometry args={[0.025,0.025,1.2,12]} /><meshStandardMaterial color="#777" /></mesh><mesh position={[0.25,2.3,6.95]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.16,0.16,0.035,20]} /><meshStandardMaterial color="#777" /></mesh>
    <mesh position={[2.0,0.42,6.25]} castShadow><boxGeometry args={[1.15,0.72,0.45]} /><meshStandardMaterial color="#bba58a" /></mesh><mesh position={[2.0,0.82,6.25]}><sphereGeometry args={[0.24,24,16]} /><meshStandardMaterial color="#efeeea" /></mesh><mesh position={[2.0,1.72,6.19]}><boxGeometry args={[0.95,0.82,0.035]} /><meshStandardMaterial color="#aeb6b7" metalness={0.2} roughness={0.22} /></mesh>
    {[2.35,3.0].map((x,i)=><group key={x} position={[x,0,7.42]}><mesh position={[0,0.33,0]} castShadow><cylinderGeometry args={[0.27,0.3,0.55,28]} /><meshStandardMaterial color="#f0efeb" /></mesh><mesh position={[0,0.62,-0.03]} scale={[1,0.42,1.25]}><sphereGeometry args={[0.31,24,14]} /><meshStandardMaterial color="#f4f3ef" /></mesh>{i===0&&<mesh position={[0,0.91,0.1]}><boxGeometry args={[0.5,0.08,0.36]} /><meshStandardMaterial color="#f1f0ec" /></mesh>}</group>)}
    <LaundryMachine y={0.43} /><LaundryMachine y={1.27} />
    <mesh position={[3.12,1.08,6.62]} castShadow><boxGeometry args={[0.055,2.16,1.0]} /><meshStandardMaterial color="#9f8b73" /></mesh>
  </>;
}

function BedroomFurniture() {
  return <group>
    <mesh position={[1.75,0.18,10.55]} castShadow><boxGeometry args={[1.82,0.3,2.1]} /><meshStandardMaterial color="#9f8c78" /></mesh>
    <mesh position={[1.75,0.48,10.52]} castShadow><boxGeometry args={[1.72,0.32,2.0]} /><meshStandardMaterial color="#e3dfd8" /></mesh>
    <mesh position={[1.75,1.02,11.49]} castShadow><boxGeometry args={[1.9,1.1,0.12]} /><meshStandardMaterial color="#b5a18b" /></mesh>
    <mesh position={[1.32,0.72,11.05]} rotation={[0.06,0,0]}><boxGeometry args={[0.7,0.16,0.4]} /><meshStandardMaterial color="#f1eee8" /></mesh><mesh position={[2.18,0.72,11.05]} rotation={[0.06,0,0]}><boxGeometry args={[0.7,0.16,0.4]} /><meshStandardMaterial color="#f1eee8" /></mesh>
    {[0.55,2.95].map(x=><group key={x} position={[x,0,10.95]}><mesh position={[0,0.32,0]}><boxGeometry args={[0.42,0.64,0.42]} /><meshStandardMaterial color="#b9aa98" /></mesh><mesh position={[0,0.91,0]}><cylinderGeometry args={[0.16,0.25,0.36,20]} /><meshStandardMaterial color="#d9d0c4" /></mesh></group>)}
  </group>;
}

function WardrobeFurniture() {
  const unit = (x:number,z:number,w:number,d:number,key:string) => <group key={key} position={[x,0,z]}><mesh position={[0,1.1,0]} castShadow><boxGeometry args={[w,2.2,d]} /><meshStandardMaterial color="#c5b6a4" /></mesh>{[0.55,1.1,1.65].map(y=><mesh key={y} position={[0,y,-d/2-0.006]}><boxGeometry args={[w*0.86,0.028,0.025]} /><meshStandardMaterial color="#8d7e6d" /></mesh>)}</group>;
  return <>{unit(3.78,10.25,0.48,2.55,"l")}{unit(5.06,10.25,0.48,2.55,"r")}{unit(4.42,11.34,1.55,0.48,"b")}<mesh position={[4.42,1.52,10.15]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.025,0.025,1.25,12]} /><meshStandardMaterial color="#67625b" /></mesh></>;
}

function HouseShell({ activeRoom, focusMode }: { activeRoom: RoomId; focusMode: boolean }) {
  return <group>
    {roomGeometry.map(room => <Floor key={room.roomId} roomId={room.roomId} active={room.roomId === activeRoom} focusMode={focusMode} />)}
    <Wall x={2.665} z={0} length={5.33} focusMode={focusMode} /><Wall x={2.665} z={11.6} length={5.33} focusMode={focusMode} /><Wall x={0} z={5.8} length={11.6} axis="z" focusMode={focusMode} /><Wall x={5.33} z={5.8} length={11.6} axis="z" focusMode={focusMode} />
    <Wall x={1.55} z={5.95} length={3.1} focusMode={focusMode} /><Wall x={3.78} z={5.95} length={0.54} focusMode={focusMode} /><Wall x={4.05} z={6.95} length={1.9} axis="z" focusMode={focusMode} /><Wall x={1.15} z={7.9} length={2.3} focusMode={focusMode} /><Wall x={3.15} z={7.9} length={0.72} focusMode={focusMode} /><Wall x={3.51} z={9.9} length={3.4} axis="z" focusMode={focusMode} /><Wall x={4.12} z={8.85} length={1.22} focusMode={focusMode} /><Wall x={5.03} z={8.85} length={0.6} focusMode={focusMode} /><Wall x={4.55} z={5.3} length={1.5} axis="z" focusMode={focusMode} />
    {[1.3,4.15,6.85,9.62].map((z,i)=><WindowPanel key={z} x={0.001} z={z} width={[1.28,1.22,0.92,1.28][i]} focusMode={focusMode} />)}
    <DoorLeaf x={3.12} z={5.94} width={0.82} focusMode={focusMode} /><DoorLeaf x={2.55} z={7.89} width={0.8} focusMode={focusMode} /><DoorLeaf x={4.42} z={8.84} width={0.72} focusMode={focusMode} />
    {(!focusMode || activeRoom === "soggiorno-cucina") && <LivingFurniture />}{(!focusMode || activeRoom === "bagno-lavanderia") && <BathroomFurniture />}{(!focusMode || activeRoom === "camera") && <BedroomFurniture />}{(!focusMode || activeRoom === "cabina-armadio") && <WardrobeFurniture />}
  </group>;
}

export function House3D({ activeRoom, activeViewpointId, focusMode = true }: Props) {
  const activePreset = getStrategicViewpoint(activeViewpointId);
  return <div className="house-3d"><Canvas shadows camera={{ position: overviewViewpoint.position, fov: overviewViewpoint.fov, near: 0.1, far: 100 }} dpr={[1,1.5]}><color attach="background" args={["#eeeae3"]} /><ambientLight intensity={1.25} /><hemisphereLight intensity={0.65} groundColor="#b8afa2" /><directionalLight position={[4,9,3]} intensity={2.1} castShadow shadow-mapSize={[1024,1024]} /><rectAreaLight position={[0.3,2.1,2.0]} intensity={3.2} width={2.2} height={2.2} rotation={[0,-Math.PI/2,0]} /><HouseShell activeRoom={activeRoom} focusMode={focusMode} />{!focusMode && <gridHelper args={[15,30,"#bdb8af","#dad6ce"]} position={[2.665,-0.025,5.8]} />}<ContactShadows position={[2.665,0.025,5.8]} opacity={0.22} scale={14} blur={2.2} far={8} /><CameraRig viewpointId={activeViewpointId} /></Canvas><div className="viewer-badge"><strong>{activePreset ? "Vista strategica · modello leggibile" : "Casa completa · modello leggibile"}</strong><span>{activePreset ? activePreset.purpose : "Geometria calibrata 1:50 · arredi illustrativi, non ancora fotorealistici"}</span></div></div>;
}
