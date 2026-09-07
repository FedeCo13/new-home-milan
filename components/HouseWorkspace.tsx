"use client";

import { useMemo, useState } from "react";
import { initialHouseState, type RoomId } from "@/lib/house";
import { scenesForRoom } from "@/lib/render-scenes";
import { calibrationAnchors, auditedBathroom, auditedDayZone } from "@/lib/geometry";

export function HouseWorkspace() {
  const [activeRoom, setActiveRoom] = useState<RoomId>("soggiorno-cucina");
  const [activeSceneId, setActiveSceneId] = useState("living-01");
  const [prompt, setPrompt] = useState("");
  const [activity, setActivity] = useState<string[]>([]);

  const room = useMemo(
    () => initialHouseState.rooms.find((item) => item.id === activeRoom)!,
    [activeRoom]
  );

  const scenes = useMemo(() => scenesForRoom(activeRoom), [activeRoom]);
  const activeScene = scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];
  const roomElements = initialHouseState.elements.filter((item) => item.roomId === activeRoom);

  const selectRoom = (roomId: RoomId) => {
    setActiveRoom(roomId);
    const first = scenesForRoom(roomId)[0];
    if (first) setActiveSceneId(first.id);
  };

  const submitPrompt = () => {
    const trimmed = prompt.trim();
    if (!trimmed || !activeScene) return;
    setActivity((current) => [
      `Modifica richiesta su “${activeScene.title}”: ${trimmed}`,
      ...current,
    ].slice(0, 4));
    setPrompt("");
  };

  return (
    <main className="app-shell render-first-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Casa Milano</p>
          <h1>Digital House</h1>
          <p className="muted">
            Render-first · altezza {initialHouseState.ceilingHeightM.toFixed(2)} m · master plan 1:50
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

        <div className="sidebar-note">
          <p className="eyebrow">Regola M1</p>
          <p>Prima si valida la geometria. Solo dopo si producono 2–3 render statici ad alta fedeltà per ambiente.</p>
        </div>
      </aside>

      <section className="workspace render-workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Ambiente</p>
            <h2>{room.name}</h2>
            <p className="muted room-description">{room.description}</p>
          </div>
          <div className="fidelity-badge">
            <strong>Target: render architettonico</strong>
            <span>geometria fedele · scala credibile · materiali · luce</span>
          </div>
        </header>

        <section className="geometry-audit-card">
          <div>
            <p className="eyebrow">Geometry audit</p>
            <h3>Geometria ricalibrata sulla tavola 1:50</h3>
            <p className="muted">Il precedente modello volumetrico non è più la fonte geometrica. I nuovi render dovranno rispettare questi vincoli prima di qualsiasi scelta estetica.</p>
          </div>
          <div className="audit-grid">
            <div><span>Appartamento</span><strong>{calibrationAnchors.apartmentReferenceAreaM2} m²</strong><small>riferimento complessivo utente</small></div>
            <div><span>Inviluppo interno</span><strong>{calibrationAnchors.planInternalEnvelopeApprox.widthM.toFixed(2)} × {calibrationAnchors.planInternalEnvelopeApprox.lengthM.toFixed(2)} m</strong><small>lettura scalata del PDF</small></div>
            <div><span>Altezza</span><strong>{calibrationAnchors.ceilingHeightM.toFixed(2)} m</strong><small>confermata</small></div>
            <div><span>Doccia</span><strong>{auditedBathroom.shower.widthApproxM.toFixed(2)} × {auditedBathroom.shower.depthConfirmedM.toFixed(2)} m</strong><small>solo porzione laterale del bagno</small></div>
          </div>
          {activeRoom === "soggiorno-cucina" && (
            <div className="audit-callout">
              <strong>Zona giorno:</strong> tavolo e divano sono entrambi nella zona living; la cucina resta distinta a sud, dietro il mobile TV/contenitivo aperto. Parquet sempre visibile e leggibile.
            </div>
          )}
          {activeRoom === "bagno-lavanderia" && (
            <div className="audit-callout">
              <strong>Bagno:</strong> la doccia occupa solo il lato sinistro, non tutta la parete. Lavatrice e asciugatrice sono impilate e schermate rispetto agli ospiti.
            </div>
          )}
        </section>

        {activeScene && (
          <section className="hero-render-card">
            <div className="render-stage">
              {activeScene.imageSrc ? (
                <img src={activeScene.imageSrc} alt={activeScene.title} />
              ) : (
                <div className="render-pending">
                  <span>Render bloccato fino a validazione geometrica</span>
                  <strong>{activeScene.title}</strong>
                  <p>{activeScene.cameraIntent}</p>
                  <small>Il prossimo render dovrà rispettare la geometria auditata; nessuna immagine generata liberamente aggiornerà House State.</small>
                </div>
              )}
            </div>
            <div className="render-meta">
              <div>
                <p className="eyebrow">Deve mostrare</p>
                <div className="chips left">
                  {activeScene.mustShow.map((item) => <span className="chip" key={item}>{item}</span>)}
                </div>
              </div>
              <div>
                <p className="eyebrow">Vincoli di fedeltà</p>
                <ul className="fidelity-list">
                  {activeScene.fidelityNotes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="static-scenes-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Viste statiche</p>
              <h3>{scenes.length} render per questo ambiente</h3>
            </div>
            <p className="muted">Gli angoli restano fissi; dopo ogni modifica AI si rigenerano le stesse viste.</p>
          </div>

          <div className="static-scenes-grid">
            {scenes.map((scene, index) => (
              <button
                key={scene.id}
                className={activeScene?.id === scene.id ? "static-scene-card active" : "static-scene-card"}
                onClick={() => setActiveSceneId(scene.id)}
              >
                <div className="scene-thumbnail">
                  {scene.imageSrc ? <img src={scene.imageSrc} alt="" /> : <span>{String(index + 1).padStart(2, "0")}</span>}
                </div>
                <div>
                  <strong>{scene.title}</strong>
                  <small>{scene.cameraIntent}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="actions-grid">
          <div className="prompt-card">
            <div>
              <p className="eyebrow">Modifica con AI</p>
              <h3>Modifica {activeScene ? `“${activeScene.title}”` : room.name}</h3>
              <p className="muted">La modifica potrà cambiare materiali, arredi e configurazioni consentite, ma non dovrà alterare silenziosamente muri, scala o relazioni spaziali auditati.</p>
            </div>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Es. Mantieni il layout, ma usa un parquet in rovere naturale più chiaro e ante cucina bianco caldo opaco."
              rows={4}
            />
            <div className="prompt-actions">
              <button className="secondary-button" onClick={() => setActivity((current) => current.slice(1))} disabled={activity.length === 0}>Annulla ultima richiesta</button>
              <button className="primary-button" onClick={submitPrompt}>Invia</button>
            </div>
            {activity.length > 0 && <div className="activity-log">{activity.map((item) => <p key={item}>{item}</p>)}</div>}
          </div>

          <div className="ideas-card">
            <p className="eyebrow">Ispirazione</p>
            <h3>Esplora idee</h3>
            <p className="muted">Mostrerà 3 soluzioni comparabili per layout, spazio o stile, ciascuna con link al post originale.</p>
            <button className="secondary-button">Esplora 3 idee</button>
          </div>
        </section>

        <section className="model-summary">
          <div><p className="eyebrow">House State</p><h3>Elementi rilevanti</h3></div>
          <div className="chips">
            {roomElements.length > 0 ? roomElements.map((item) => <span className="chip" key={item.id}>{item.name}{item.configurable ? " · modificabile" : " · fisso"}</span>) : <span className="muted">Nessun elemento puntuale ancora codificato.</span>}
          </div>
        </section>
      </section>
    </main>
  );
}
