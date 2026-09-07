import type { RoomId } from "@/lib/house";

export type Vector3Tuple = [number, number, number];

export interface StrategicViewpoint3D {
  id: string;
  roomId: RoomId;
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
  confidence: "preliminary" | "confirmed";
  purpose: string;
}

/** Strategic camera presets recalibrated on the M1 geometry. */
export const strategicViewpoints: StrategicViewpoint3D[] = [
  { id: "living-1", roomId: "soggiorno-cucina", position: [5.02, 1.58, 4.65], target: [2.85, 1.02, 3.25], fov: 60, confidence: "preliminary", purpose: "Dall'ingresso: leggere insieme living, mobile TV aperto e rapporto con la cucina." },
  { id: "living-2", roomId: "soggiorno-cucina", position: [0.72, 1.55, 0.78], target: [3.15, 1.0, 3.05], fov: 58, confidence: "preliminary", purpose: "Dalla zona pranzo: mostrare tavolo, soggiorno, colonna e profondità dell'open space." },
  { id: "living-3", roomId: "soggiorno-cucina", position: [4.82, 1.58, 1.15], target: [2.72, 1.02, 3.72], fov: 60, confidence: "preliminary", purpose: "Con la cucina alle spalle: leggere il soggiorno come nella sezione C'-C'." },
  { id: "ingresso-1", roomId: "ingresso", position: [5.03, 1.56, 5.95], target: [3.55, 1.02, 4.65], fov: 62, confidence: "preliminary", purpose: "Dalla porta d'ingresso verso la zona giorno." },
  { id: "ingresso-2", roomId: "ingresso", position: [3.9, 1.56, 4.75], target: [5.0, 1.05, 5.85], fov: 62, confidence: "preliminary", purpose: "Dal living verso ingresso e distribuzione alla zona notte." },
  { id: "disimpegno-1", roomId: "disimpegno", position: [4.38, 1.55, 6.25], target: [4.05, 1.02, 8.0], fov: 64, confidence: "preliminary", purpose: "Leggere il disimpegno evidenziato nel render e il raccordo verso la zona notte." },
  { id: "disimpegno-2", roomId: "disimpegno", position: [4.0, 1.55, 8.35], target: [4.35, 1.02, 6.15], fov: 64, confidence: "preliminary", purpose: "Vista di ritorno dal disimpegno verso la zona giorno." },
  { id: "bagno-1", roomId: "bagno-lavanderia", position: [3.65, 1.55, 6.15], target: [1.4, 1.0, 7.1], fov: 64, confidence: "preliminary", purpose: "Dall'ingresso: mostrare doccia, sanitari e schermatura lavanderia." },
  { id: "bagno-2", roomId: "bagno-lavanderia", position: [0.55, 1.52, 7.55], target: [2.9, 1.0, 6.55], fov: 64, confidence: "preliminary", purpose: "Dalla zona doccia verso lavabo, ingresso e colonna lavatrice/asciugatrice." },
  { id: "camera-1", roomId: "camera", position: [3.18, 1.55, 8.25], target: [1.75, 0.92, 10.65], fov: 60, confidence: "preliminary", purpose: "Dall'ingresso verso letto matrimoniale e parete di fondo." },
  { id: "camera-2", roomId: "camera", position: [0.55, 1.55, 8.55], target: [1.9, 1.0, 10.65], fov: 60, confidence: "preliminary", purpose: "Dall'angolo finestra verso letto e accesso alla cabina armadio." },
  { id: "camera-3", roomId: "camera", position: [1.75, 1.55, 11.05], target: [3.15, 1.02, 9.15], fov: 60, confidence: "preliminary", purpose: "Dalla zona letto verso l'accesso alla cabina armadio." },
  { id: "cabina-1", roomId: "cabina-armadio", position: [4.42, 1.55, 9.15], target: [4.42, 1.05, 11.15], fov: 62, confidence: "preliminary", purpose: "Dall'ingresso della cabina verso armadiature laterali e fondo." },
  { id: "cabina-2", roomId: "cabina-armadio", position: [4.42, 1.55, 11.2], target: [4.42, 1.05, 9.2], fov: 62, confidence: "preliminary", purpose: "Dal fondo della cabina verso ingresso e armadiature laterali." },
];

export const overviewViewpoint = {
  id: "overview",
  position: [9.1, 10.0, 14.3] as Vector3Tuple,
  target: [2.67, 0.85, 5.8] as Vector3Tuple,
  fov: 39,
};

export function getStrategicViewpoint(id?: string) {
  if (!id) return undefined;
  return strategicViewpoints.find((viewpoint) => viewpoint.id === id);
}
