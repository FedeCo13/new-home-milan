"use client";

import type { RoomId } from "@/lib/house";

type FloorPlanProps = {
  activeRoom: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
};

const roomLabels: Array<{ id: RoomId; label: string; x: number; y: number }> = [
  { id: "soggiorno-cucina", label: "Soggiorno / Cucina", x: 175, y: 140 },
  { id: "ingresso", label: "Ingresso", x: 318, y: 284 },
  { id: "disimpegno", label: "Disimpegno", x: 275, y: 350 },
  { id: "bagno-lavanderia", label: "Bagno / Lavanderia", x: 155, y: 355 },
  { id: "camera", label: "Camera", x: 145, y: 500 },
  { id: "cabina-armadio", label: "Cabina armadio", x: 277, y: 510 },
];

export function FloorPlan({ activeRoom, onSelectRoom }: FloorPlanProps) {
  const cls = (room: RoomId) => `plan-room ${activeRoom === room ? "active" : ""}`;

  return (
    <div className="floor-plan-wrap">
      <svg className="floor-plan" viewBox="0 0 390 620" role="img" aria-label="Planimetria interattiva calibrata di Casa Milano">
        <rect x="55" y="25" width="270" height="570" rx="2" className="outer-wall" />

        <path className={cls("soggiorno-cucina")} onClick={() => onSelectRoom("soggiorno-cucina")} d="M68 38 H312 V260 H276 V333 H253 V328 H68 Z" />
        <path className={cls("ingresso")} onClick={() => onSelectRoom("ingresso")} d="M276 260 H312 V354 H276 Z" />
        <path className={cls("disimpegno")} onClick={() => onSelectRoom("disimpegno")} d="M253 333 H276 V354 H312 V472 H222 V423 H253 Z" />
        <path className={cls("bagno-lavanderia")} onClick={() => onSelectRoom("bagno-lavanderia")} d="M68 328 H253 V423 H68 Z" />
        <path className={cls("camera")} onClick={() => onSelectRoom("camera")} d="M68 423 H222 V582 H68 Z" />
        <path className={cls("cabina-armadio")} onClick={() => onSelectRoom("cabina-armadio")} d="M222 472 H312 V582 H222 Z" />

        {/* Structural column and partially open TV divider. */}
        <rect x="240" y="205" width="15" height="15" className="structural-column" />
        <text x="263" y="216" className="plan-note">colonna</text>
        <rect x="172" y="205" width="112" height="14" rx="2" className="tv-partition" />
        <line x1="190" y1="212" x2="264" y2="212" className="open-detail" />

        {/* Simplified room fixtures aligned to calibrated geometry. */}
        <ellipse cx="123" cy="108" rx="32" ry="47" className="fixture" />
        <rect x="221" y="72" width="74" height="64" className="fixture" />
        <rect x="181" y="255" width="92" height="43" className="fixture" />

        {/* Bathroom: shower and laundry stack/screen. */}
        <rect x="70" y="347" width="66" height="58" rx="2" className="fixture" />
        <text x="83" y="379" className="plan-note">doccia 1,46 m</text>
        <rect x="219" y="340" width="26" height="40" rx="1" className="laundry-stack" />
        <line x1="211" y1="334" x2="211" y2="390" className="laundry-screen" />

        {/* Bedroom and walk-in wardrobe. */}
        <rect x="105" y="475" width="80" height="92" className="fixture" />
        <rect x="229" y="485" width="22" height="82" className="fixture" />
        <rect x="283" y="485" width="22" height="82" className="fixture" />
        <rect x="229" y="558" width="76" height="18" className="fixture" />

        {roomLabels.map((room) => (
          <text key={room.id} x={room.x} y={room.y} textAnchor="middle" className="room-label">{room.label}</text>
        ))}
      </svg>
      <div className="plan-legend">
        <span><i className="legend-square structural" /> Elemento strutturale</span>
        <span><i className="legend-square configurable" /> Ambiente selezionabile</span>
        <span className="muted">Calibrazione M1 dalla tavola 1:50: altezza 2,70 m, doccia 1,46 m e camera ≈13 m² usate come ancore. Non sostituisce un CAD esecutivo.</span>
      </div>
    </div>
  );
}
