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

/**
 * Strategic cameras for M1.
 *
 * They are intentionally stored separately from the semantic viewpoint labels in
 * lib/house.ts. The semantic layer describes what the user should see; this file
 * translates that intent into camera coordinates for Three.js.
 *
 * Coordinates use the same local reference system as lib/geometry.ts and are
 * preliminary because the source is a 1:50 PDF rather than CAD/DWG geometry.
 */
export const strategicViewpoints: StrategicViewpoint3D[] = [
  {
    id: "living-1",
    roomId: "soggiorno-cucina",
    position: [6.55, 1.58, 4.9],
    target: [3.55, 1.05, 3.2],
    fov: 58,
    confidence: "preliminary",
    purpose: "Dall'ingresso: leggere insieme living, mobile TV aperto e rapporto con la cucina.",
  },
  {
    id: "living-2",
    roomId: "soggiorno-cucina",
    position: [1.0, 1.55, 1.0],
    target: [4.15, 1.0, 3.35],
    fov: 56,
    confidence: "preliminary",
    purpose: "Dalla zona pranzo: mostrare tavolo, soggiorno, colonna e profondità dell'open space.",
  },
  {
    id: "living-3",
    roomId: "soggiorno-cucina",
    position: [6.2, 1.58, 1.3],
    target: [3.55, 1.05, 3.7],
    fov: 58,
    confidence: "preliminary",
    purpose: "Con la cucina alle spalle: leggere il soggiorno come nella sezione C'-C'.",
  },
  {
    id: "ingresso-1",
    roomId: "ingresso",
    position: [6.75, 1.56, 6.05],
    target: [4.55, 1.05, 4.55],
    fov: 60,
    confidence: "preliminary",
    purpose: "Dalla porta d'ingresso verso la zona giorno.",
  },
  {
    id: "ingresso-2",
    roomId: "ingresso",
    position: [5.0, 1.56, 4.8],
    target: [6.45, 1.05, 6.05],
    fov: 60,
    confidence: "preliminary",
    purpose: "Dal living verso ingresso e distribuzione alla zona notte.",
  },
  {
    id: "disimpegno-1",
    roomId: "disimpegno",
    position: [5.25, 1.55, 5.75],
    target: [4.25, 1.05, 7.2],
    fov: 62,
    confidence: "preliminary",
    purpose: "Leggere il disimpegno evidenziato nel render e il raccordo verso la zona notte.",
  },
  {
    id: "disimpegno-2",
    roomId: "disimpegno",
    position: [4.4, 1.55, 7.05],
    target: [5.25, 1.05, 5.55],
    fov: 62,
    confidence: "preliminary",
    purpose: "Vista di ritorno dal disimpegno verso la zona giorno.",
  },
  {
    id: "bagno-1",
    roomId: "bagno-lavanderia",
    position: [3.0, 1.55, 5.9],
    target: [1.25, 1.0, 7.15],
    fov: 62,
    confidence: "preliminary",
    purpose: "Dall'ingresso: mostrare doccia, sanitari e schermatura lavanderia.",
  },
  {
    id: "bagno-2",
    roomId: "bagno-lavanderia",
    position: [0.72, 1.52, 8.0],
    target: [2.45, 1.0, 6.55],
    fov: 62,
    confidence: "preliminary",
    purpose: "Dalla zona doccia verso lavabo, ingresso e colonna lavatrice/asciugatrice.",
  },
  {
    id: "camera-1",
    roomId: "camera",
    position: [3.75, 1.55, 8.95],
    target: [1.8, 0.95, 10.85],
    fov: 58,
    confidence: "preliminary",
    purpose: "Dall'ingresso verso letto matrimoniale e parete di fondo.",
  },
  {
    id: "camera-2",
    roomId: "camera",
    position: [0.75, 1.55, 9.25],
    target: [2.35, 1.0, 10.85],
    fov: 58,
    confidence: "preliminary",
    purpose: "Dall'angolo finestra verso letto e accesso alla cabina armadio.",
  },
  {
    id: "camera-3",
    roomId: "camera",
    position: [1.75, 1.55, 11.55],
    target: [3.75, 1.05, 9.9],
    fov: 58,
    confidence: "preliminary",
    purpose: "Dalla zona letto verso l'accesso alla cabina armadio.",
  },
  {
    id: "cabina-1",
    roomId: "cabina-armadio",
    position: [5.7, 1.55, 7.9],
    target: [5.7, 1.05, 11.35],
    fov: 60,
    confidence: "preliminary",
    purpose: "Dall'ingresso della cabina verso armadiature laterali e fondo.",
  },
  {
    id: "cabina-2",
    roomId: "cabina-armadio",
    position: [5.7, 1.55, 11.75],
    target: [5.7, 1.05, 8.25],
    fov: 60,
    confidence: "preliminary",
    purpose: "Dal fondo della cabina verso ingresso e armadiature laterali.",
  },
];

export const overviewViewpoint = {
  id: "overview",
  position: [11.4, 11.5, 16.2] as Vector3Tuple,
  target: [3.6, 0.85, 6.3] as Vector3Tuple,
  fov: 38,
};

export function getStrategicViewpoint(id?: string) {
  if (!id) return undefined;
  return strategicViewpoints.find((viewpoint) => viewpoint.id === id);
}
