"use client";

import { useEffect, useMemo, useState } from "react";
import { FloorPlan } from "@/components/FloorPlan";
import { House3D } from "@/components/House3D";
import { initialHouseState, type RoomId } from "@/lib/house";

export function HouseWorkspace() {
  const [activeRoom, setActiveRoom] = useState<RoomId>("soggiorno-cucina");
  const [showPlan, setShowPlan] = useState(false);
  const [show3D, setShow3D] = useState(true);
  const [focusMode, setFocusMode] = useState(true);
  const [activeViewpointId, setActiveViewpointId] = useState<string | undefined>("living-1");
  const [prompt, setPrompt] = useState("");
  const [activity, setActivity] = useState<string[]>([]);

  const room = useMemo(
    () => initialHouseState.rooms.find((item) => item.id === activeRoom)!,
    [activeRoom]
  );

  const roomElements = initialHouseState.elements.filter((item) => item.roomId === activeRoom);

  useEffect(() => {
    setActiveViewpointId(room.viewpoints[0]?.id);
  }, [room]);

  const selectRoom = (roomId: RoomId) => {
    setActiveRoom(roomId);
    setShow3D(true);
    setFocusMode(true);
  };

  const submitPrompt = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setActivity((current) => [
      `Richiesta registrata per ${room.name}: “${trimmed}”`,
      ...current,
    ].slice(0, 4));
    setPrompt("");
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Casa Milano</p>
          <h1>Digital House MVP</h1>
          <p className="muted">
            Altezza {initialHouseState.ceilingHeightM.toFixed(2)} m · scala sorgente {initialHouseState.sourceScale}
          </p>
        </div>

        <nav className="room-list" aria-label="Ambienti">
          {initialHouseState.rooms.map((item, index) => (
            <button
              className={item.id === activeRoom ? "room-link active" : "room-link"}
              key={item.id}
              onClick={() => selectRoom(item.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-actions">
          <button className="secondary-button" onClick={() => setShowPlan((value) => !value)}>
            {showPlan ? "Chiudi planimetria" : "Apri planimetria"}
          </button>
          <button className="secondary-button" onClick={() => setShow3D((value) => !value)}>
            {show3D ? "Nascondi modello 3D" : "Mostra modello 3D"}
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Ambiente</p>
            <h2>{room.name}</h2>
            <p className="muted room-description">{room.description}</p>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setShow3D(true);
              setFocusMode(true);
              setActiveViewpointId(room.viewpoints[0]?.id);
            }}
          >
            Avvia visita in 3D
          </button>
        </header>

        {showPlan && (
          <section className="plan-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">M0 / Geometria</p>
                <h3>Planimetria interattiva preliminare</h3>
              </div>
              <p className="muted">Clicca un ambiente per aprirlo.</p>
            </div>
            <FloorPlan activeRoom={activeRoom} onSelectRoom={selectRoom} />
          </section>
        )}

        {show3D && (
          <section className="viewer-panel">
            <div className="section-heading viewer-heading">
              <div>
                <p className="eyebrow">M1 / Digital House</p>
                <h3>{focusMode ? "Focus ambiente" : "Modello 3D completo"}</h3>
              </div>
              <div className="viewer-actions">
                <button
                  className={focusMode ? "toggle-button active" : "toggle-button"}
                  onClick={() => setFocusMode((value) => !value)}
                >
                  {focusMode ? "Mostra tutta la casa" : "Focus ambiente"}
                </button>
                <button className="text-button" onClick={() => setActiveViewpointId(undefined)}>
                  Vista generale
                </button>
              </div>
            </div>
            <House3D activeRoom={activeRoom} activeViewpointId={activeViewpointId} focusMode={focusMode} />
          </section>
        )}

        <section className="strategic-views">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Viste dell'ambiente</p>
              <h3>{room.viewpoints.length} angoli strategici</h3>
            </div>
            <p className="muted">Clicca una vista: la camera 3D si posiziona nello stesso punto previsto per i futuri render.</p>
          </div>

          <div className="viewpoint-grid">
            {room.viewpoints.map((viewpoint, index) => (
              <button
                key={viewpoint.id}
                className={activeViewpointId === viewpoint.id ? "viewpoint-card active" : "viewpoint-card"}
                onClick={() => {
                  setShow3D(true);
                  setFocusMode(true);
                  setActiveViewpointId(viewpoint.id);
                }}
              >
                <span>Vista {index + 1}</span>
                <strong>{viewpoint.name}</strong>
                <small>{viewpoint.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="actions-grid">
          <div className="prompt-card">
            <div>
              <p className="eyebrow">Modifica con AI</p>
              <h3>Chiedi una modifica a {room.name}</h3>
            </div>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Es. Rendi il parquet più chiaro, cambia il mobile TV o modifica la cucina."
              rows={4}
            />
            <div className="prompt-actions">
              <button
                className="secondary-button"
                onClick={() => setActivity((current) => current.slice(1))}
                disabled={activity.length === 0}
              >
                Annulla ultima modifica
              </button>
              <button className="primary-button" onClick={submitPrompt}>Invia</button>
            </div>
            {activity.length > 0 && (
              <div className="activity-log">
                {activity.map((item) => <p key={item}>{item}</p>)}
              </div>
            )}
          </div>

          <div className="ideas-card">
            <p className="eyebrow">Ispirazione</p>
            <h3>Esplora idee</h3>
            <p className="muted">
              In M3 mostrerà 3 soluzioni online simili per spazio, layout o stile, sempre con link al post originale.
            </p>
            <button className="secondary-button">Esplora 3 idee</button>
          </div>
        </section>

        <section className="model-summary">
          <div>
            <p className="eyebrow">House State</p>
            <h3>Elementi modellati in questo ambiente</h3>
          </div>
          <div className="chips">
            {roomElements.length > 0 ? roomElements.map((item) => (
              <span className="chip" key={item.id}>
                {item.name}{item.configurable ? " · modificabile" : " · fisso"}
              </span>
            )) : <span className="muted">Gli elementi puntuali verranno aggiunti durante la calibrazione geometrica.</span>}
          </div>
        </section>
      </section>
    </main>
  );
}
