"use client";

import type { RoomId } from "@/lib/house";

type FloorPlanProps = {
  activeRoom: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
};

const roomLabels: Array<{ id: RoomId; label: string; x: number; y: number }> = [
  { id: "soggiorno-cucina", label: "Soggiorno / Cucina", x: 190, y: 105 },
  { id: "ingresso", label: "Ingresso", x: 330, y: 220 },
  { id: "disimpegno", label: "Disimpegno", x: 260, y: 268 },
  { id: "bagno-lavanderia", label: "Bagno / Lavanderia", x: 146, y: 330 },
  { id: "camera", label: "Camera", x: 145, y: 485 },
  { id: "cabina-armadio", label: "Cabina armadio", x: 292, y: 475 },
];

export function FloorPlan({ activeRoom, onSelectRoom }: FloorPlanProps) {
  const cls = (room: RoomId) => `plan-room ${activeRoom === room ? "active" : ""}`;

  return (
    <div className="floor-plan-wrap">
      <svg
        className="floor-plan"
        viewBox="0 0 390 600"
        role="img"
        aria-label="Planimetria interattiva preliminare di Casa Milano"
      >
        <rect x="40" y="30" width="310" height="535" rx="2" className="outer-wall" />

        {/* Soggiorno/cucina: grande ambiente a nord. Geometria preliminare da tavola 1:50. */}
        <path
          className={cls("soggiorno-cucina")}
          onClick={() => onSelectRoom("soggiorno-cucina")}
          d="M55 45 H335 V245 H278 V265 H215 V252 H55 Z"
        />

        {/* Ingresso a est. */}
        <path
          className={cls("ingresso")}
          onClick={() => onSelectRoom("ingresso")}
          d="M278 245 H335 V305 H278 Z"
        />

        {/* Disimpegno di raccordo verso zona notte. */}
        <path
          className={cls("disimpegno")}
          onClick={() => onSelectRoom("disimpegno")}
          d="M215 252 H278 V345 H218 V305 H185 V270 H215 Z"
        />

        {/* Bagno + lavanderia. */}
        <path
          className={cls("bagno-lavanderia")}
          onClick={() => onSelectRoom("bagno-lavanderia")}
          d="M55 270 H185 V390 H55 Z"
        />

        {/* Camera matrimoniale. */}
        <path
          className={cls("camera")}
          onClick={() => onSelectRoom("camera")}
          d="M55 390 H218 V550 H55 Z"
        />

        {/* Cabina armadio sul lato destro della camera. */}
        <path
          className={cls("cabina-armadio")}
          onClick={() => onSelectRoom("cabina-armadio")}
          d="M218 345 H335 V550 H218 Z"
        />

        {/* Colonna portante living */}
        <rect x="205" y="178" width="16" height="16" className="structural-column" />
        <text x="228" y="190" className="plan-note">colonna</text>

        {/* Mobile TV divisorio: volutamente non a tutta parete */}
        <rect x="151" y="181" width="78" height="14" rx="2" className="tv-partition" />
        <line x1="160" y1="188" x2="220" y2="188" className="open-detail" />

        {/* Lavanderia verticale e separatore */}
        <rect x="65" y="279" width="27" height="38" rx="1" className="laundry-stack" />
        <line x1="97" y1="275" x2="97" y2="324" className="laundry-screen" />

        {/* Indicazione schematica doccia */}
        <rect x="57" y="326" width="62" height="55" rx="2" className="fixture" />
        <text x="67" y="358" className="plan-note">doccia</text>

        {roomLabels.map((room) => (
          <text key={room.id} x={room.x} y={room.y} textAnchor="middle" className="room-label">
            {room.label}
          </text>
        ))}
      </svg>
      <div className="plan-legend">
        <span><i className="legend-square structural" /> Elemento strutturale</span>
        <span><i className="legend-square configurable" /> Ambiente selezionabile</span>
        <span className="muted">Geometria preliminare calibrata sulla tavola 1:50; non sostituisce un CAD esecutivo.</span>
      </div>
    </div>
  );
}
