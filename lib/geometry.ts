import type { RoomId } from "@/lib/house";

export type Point2D = [number, number];

export interface RoomGeometry {
  roomId: RoomId;
  polygon: Point2D[];
  source: "architect-plan-1:50";
  confidence: "scaled" | "inferred";
  notes?: string;
}

/**
 * Geometry audit - 03/09/2026 architect plan, scale 1:50.
 *
 * IMPORTANT:
 * - The 1:50 drawing is the geometric source of truth for the MVP.
 * - The user-provided 65 m² is stored as the apartment commercial/gross reference,
 *   not used to stretch the plan or invent larger rooms.
 * - Measurements below are read from the scaled PDF drawing; dimensions not explicitly
 *   written by the architect remain approximate and must not be treated as construction data.
 * - Ceiling height 2.70 m and shower depth 1.46 m are user/plan-confirmed anchors.
 *
 * Local origin: north-west internal corner of the apartment.
 * x grows east, z grows south. Units are metres.
 */
export const calibrationAnchors = {
  source: "architect-plan-03-09-2026-1:50" as const,
  ceilingHeightM: 2.70,
  apartmentReferenceAreaM2: 65,
  areaReferenceType: "user-provided-commercial-or-gross-reference" as const,
  planInternalEnvelopeApprox: {
    widthM: 5.09,
    lengthM: 10.97,
  },
  showerDepthConfirmedM: 1.46,
  caveat: "Plan-scale audit for visualization only. CAD/DWG is unavailable; inferred dimensions are approximate.",
};

const Z = {
  north: 0,
  daySouth: 5.72,
  bathNorth: 5.82,
  bathSouth: 7.47,
  bedroomNorth: 7.58,
  wardrobeNorth: 7.97,
  south: 10.97,
};

const X = {
  west: 0,
  nightPartition: 3.37,
  wardrobeWest: 3.46,
  east: 5.09,
};

export const roomGeometry: RoomGeometry[] = [
  {
    roomId: "soggiorno-cucina",
    polygon: [[0, 0], [5.09, 0], [5.09, 5.72], [0, 5.72]],
    source: "architect-plan-1:50",
    confidence: "scaled",
    notes: "Day zone occupies the north portion of the plan. Dining table and sofa are both in the living zone; the kitchen sits to the south of them behind the TV/storage filter.",
  },
  {
    roomId: "bagno-lavanderia",
    polygon: [[0, Z.bathNorth], [X.nightPartition, Z.bathNorth], [X.nightPartition, Z.bathSouth], [0, Z.bathSouth]],
    source: "architect-plan-1:50",
    confidence: "scaled",
    notes: "Approx. 3.37 m x 1.65 m internal rectangle. Shower is a partial left-side zone, not a full-wall shower.",
  },
  {
    roomId: "camera",
    polygon: [[0, Z.bedroomNorth], [X.nightPartition, Z.bedroomNorth], [X.nightPartition, Z.south], [0, Z.south]],
    source: "architect-plan-1:50",
    confidence: "scaled",
    notes: "Approx. 3.37 m x 3.39 m from the scaled drawing. Previous 13 m² assumption has been removed.",
  },
  {
    roomId: "cabina-armadio",
    polygon: [[X.wardrobeWest, Z.wardrobeNorth], [X.east, Z.wardrobeNorth], [X.east, Z.south], [X.wardrobeWest, Z.south]],
    source: "architect-plan-1:50",
    confidence: "scaled",
    notes: "Approx. 1.63 m x 3.00 m lower-right zone identified by the user. Section C'-C' is not a wardrobe section.",
  },
  {
    roomId: "disimpegno",
    polygon: [[X.nightPartition, Z.daySouth], [X.east, Z.daySouth], [X.east, Z.wardrobeNorth], [X.wardrobeWest, Z.wardrobeNorth], [X.wardrobeWest, Z.bedroomNorth], [X.nightPartition, Z.bedroomNorth]],
    source: "architect-plan-1:50",
    confidence: "inferred",
    notes: "Irregular east-side distribution zone; exact door-clearance outline should be taken visually from the master plan rather than simplified to a rectangle.",
  },
  {
    roomId: "ingresso",
    polygon: [[4.05, 3.35], [5.09, 3.35], [5.09, 5.82], [4.05, 5.82]],
    source: "architect-plan-1:50",
    confidence: "inferred",
    notes: "Semantic entrance zone only; shares circulation with the day-area edge and the east-side disimpegno.",
  },
];

export const auditedDayZone = {
  diningTable: {
    centerApprox: [0.68, 1.73] as Point2D,
    footprintApproxM: [0.99, 1.76] as Point2D,
    orientation: "long-axis-north-south" as const,
    relationship: "living-zone; west of sofa; north of kitchen" as const,
  },
  sofa: {
    centerApprox: [2.97, 0.80] as Point2D,
    footprintApproxM: [2.24, 1.58] as Point2D,
    relationship: "living-zone; north-east; faces TV divider; not adjacent to kitchen" as const,
  },
  tvStorageFilter: {
    centerApprox: [2.15, 3.51] as Point2D,
    widthApproxM: 2.67,
    depthApproxM: 0.38,
    relationship: "between living/dining and kitchen; partially open; never a full wall" as const,
  },
  structuralColumn: {
    relationship: "separate structural element adjacent to the TV/storage filter; must remain visually distinct" as const,
    confidence: "inferred-from-plan-and-architect-renders" as const,
  },
  kitchen: {
    zone: "south side of day room, behind TV/storage filter" as const,
    layout: "L-shaped as drawn; long run on bathroom-side wall plus west-side return" as const,
    standardBaseDepthM: 0.60,
    relationship: "separate from sofa/table zone while remaining part of the open-plan room" as const,
  },
  floor: {
    materialBase: "parquet" as const,
    renderRequirement: "wood-board direction, joints and material variation must be visibly readable" as const,
  },
};

export const auditedBathroom = {
  internalApproxM: [3.37, 1.65] as Point2D,
  shower: {
    position: "west/left end" as const,
    depthConfirmedM: 1.46,
    widthApproxM: 0.66,
    confidence: "depth-confirmed-width-scaled" as const,
    constraint: "occupies only part of the bathroom; never extend across the full wall" as const,
  },
  laundry: {
    configuration: "stacked-washer-dryer" as const,
    visibility: "screened-from-guests" as const,
  },
};

// Kept for future 3D/tour work; static renders consume the audited semantic layout first.
export const fixedGeometry = {
  ceilingHeightM: calibrationAnchors.ceilingHeightM,
  tvPartitionLiving: {
    id: "tv-partition",
    position: auditedDayZone.tvStorageFilter.centerApprox,
    widthM: auditedDayZone.tvStorageFilter.widthApproxM,
    depthM: auditedDayZone.tvStorageFilter.depthApproxM,
    confidence: "scaled" as const,
  },
};
