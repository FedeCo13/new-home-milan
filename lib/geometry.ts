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
 * M1 calibrated local geometry.
 *
 * The apartment is reconstructed from the 03/09/2026 architect plan at 1:50.
 * There is no CAD/DWG source, so these dimensions are suitable for the digital
 * simulation MVP, not for construction documents.
 *
 * Calibration logic:
 * - room proportions were re-read directly from the 1:50 plan;
 * - the bedroom is calibrated to approximately 13 m², consistent with the plan;
 * - the shower dimension marked 1.46 m is used as an additional visual anchor;
 * - the ceiling height 2.70 m is user-confirmed.
 *
 * Local origin: north-west internal corner of the apartment.
 * x grows east, z grows south. Units are metres.
 */
export const roomGeometry: RoomGeometry[] = [
  {
    roomId: "soggiorno-cucina",
    polygon: [
      [0, 0],
      [5.33, 0],
      [5.33, 4.55],
      [4.55, 4.55],
      [4.55, 6.05],
      [4.05, 6.05],
      [4.05, 5.95],
      [0, 5.95],
    ],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Open space calibrated from the latest plan. Includes dining area, living, kitchen edge, structural column and partially open TV/storage divider.",
  },
  {
    roomId: "ingresso",
    polygon: [
      [4.55, 4.55],
      [5.33, 4.55],
      [5.33, 6.45],
      [4.55, 6.45],
    ],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Entrance band on the east side of the apartment, separated semantically from the living area.",
  },
  {
    roomId: "disimpegno",
    polygon: [
      [4.05, 6.05],
      [4.55, 6.05],
      [4.55, 6.45],
      [5.33, 6.45],
      [5.33, 8.85],
      [3.51, 8.85],
      [3.51, 7.90],
      [4.05, 7.90],
    ],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Distribution area toward bathroom, bedroom and wardrobe; treated as a distinct semantic space because it is clearly perceived in the illustrative render.",
  },
  {
    roomId: "bagno-lavanderia",
    polygon: [
      [0, 5.95],
      [4.05, 5.95],
      [4.05, 7.90],
      [0, 7.90],
    ],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Bathroom with confirmed shower zone and stacked washer/dryer screened from guest view.",
  },
  {
    roomId: "camera",
    polygon: [
      [0, 7.90],
      [3.51, 7.90],
      [3.51, 11.60],
      [0, 11.60],
    ],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Bedroom calibrated to approximately 13.0 m² from the latest plan proportions.",
  },
  {
    roomId: "cabina-armadio",
    polygon: [
      [3.51, 8.85],
      [5.33, 8.85],
      [5.33, 11.60],
      [3.51, 11.60],
    ],
    source: "architect-plan-1:50",
    confidence: "preliminary",
    notes: "Wardrobe area identified from the user-highlighted plan detail; section C'-C' is not used for this room.",
  },
];

export const calibrationAnchors = {
  source: "architect-plan-03-09-2026-1:50" as const,
  ceilingHeightM: 2.70,
  showerMarkedDimensionM: 1.46,
  bedroomApproxAreaM2: 13.0,
  apartmentInternalWidthM: 5.33,
  apartmentInternalLengthM: 11.60,
  caveat: "Approximate digital-model calibration only; CAD/DWG is unavailable.",
};

export const fixedGeometry = {
  ceilingHeightM: calibrationAnchors.ceilingHeightM,
  structuralColumnLiving: {
    id: "living-column",
    position: [3.85, 3.58] as Point2D,
    footprintM: [0.32, 0.32] as Point2D,
    confidence: "preliminary" as const,
  },
  tvPartitionLiving: {
    id: "tv-partition",
    position: [2.62, 3.62] as Point2D,
    widthM: 2.48,
    depthM: 0.34,
    confidence: "preliminary" as const,
  },
};
