import type { RoomId } from "@/lib/house";

export type Point2D = [number, number];

export interface RoomGeometry {
  roomId: RoomId;
  polygon: Point2D[];
  source: "architect-plan-1:50";
  confidence: "preliminary" | "confirmed";
  notes?: string;
}

/**
 * Preliminary normalized geometry for the MVP.
 * Coordinates are intentionally stored in a simple local 2D reference system.
 * They preserve the topology and relative proportions of the 1:50 architect plan,
 * but must not be treated as construction-grade measurements without CAD/DWG data.
 */
export const roomGeometry: RoomGeometry[] = [
  {
    roomId: "soggiorno-cucina",
    polygon: [[0, 0], [7.2, 0], [7.2, 5.0], [5.75, 5.0], [5.75, 5.45], [4.15, 5.45], [4.15, 5.15], [0, 5.15]],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Open space with central structural column and partially open TV storage divider.",
  },
  {
    roomId: "ingresso",
    polygon: [[5.75, 5.0], [7.2, 5.0], [7.2, 6.5], [5.75, 6.5]],
    source: "architect-plan-1:50",
    confidence: "preliminary",
  },
  {
    roomId: "disimpegno",
    polygon: [[4.15, 5.15], [5.75, 5.15], [5.75, 7.45], [4.2, 7.45], [4.2, 6.45], [3.35, 6.45], [3.35, 5.6], [4.15, 5.6]],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Semantically separated because the corridor is visible in the illustrative render although less evident in plan view.",
  },
  {
    roomId: "bagno-lavanderia",
    polygon: [[0, 5.6], [3.35, 5.6], [3.35, 8.55], [0, 8.55]],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Includes 1.46 m shower zone and stacked washer/dryer screened from guest view.",
  },
  {
    roomId: "camera",
    polygon: [[0, 8.55], [4.2, 8.55], [4.2, 12.6], [0, 12.6]],
    source: "architect-plan-1:50",
    confidence: "preliminary",
  },
  {
    roomId: "cabina-armadio",
    polygon: [[4.2, 7.45], [7.2, 7.45], [7.2, 12.6], [4.2, 12.6]],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Wardrobe zone identified from the user-highlighted plan detail, not from section C'-C'.",
  },
];

export const fixedGeometry = {
  ceilingHeightM: 2.7,
  structuralColumnLiving: {
    id: "living-column",
    position: [4.1, 3.65] as Point2D,
    footprintM: [0.38, 0.38] as Point2D,
    confidence: "preliminary" as const,
  },
};
