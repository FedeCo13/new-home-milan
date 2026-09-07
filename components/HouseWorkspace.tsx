"use client";

import { useMemo, useState } from "react";
import { initialHouseState, type RoomId } from "@/lib/house";
import { scenesForRoom } from "@/lib/render-scenes";
import { calibrationAnchors, auditedBathroom } from "@/lib/geometry";

export function HouseWorkspace() {
  const [activeRoom, setActiveRoom] = useState<RoomId>("soggiorno-cucina");
  const [activeSceneId, setActiveSceneId] = useState("living-01");
  const [prompt, setPrompt] = useState("");
  const [activity, setActivity] = useState<string[]>([]);
  const [renderImages, setRenderImages] = useState<Record<string, string>>({});
  const [rendering, setRendering] = useState<Record<string, boolean>>({});
  const [renderError, setRenderError] = useState<string | null>(null);

  const room = useMemo(
    () => initialHouseState.rooms.find((item) => item.id === activeRoom)!,
    [activeRoom]
  );

  const scenes = useMemo(() => scenesForRoom(activeRoom), [activeRoom]);
  const activeScene = scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];
  const roomElements = initialHouseState.elements.filter((item) => item.roomId === activeRoom);

  const selectRoom = (roomId: RoomId) => {
    setActiveRoom(roomId);
    setRenderError(null);
    const first = scenesForRoom(roomId)[0];
    if (first) setActiveSceneId(first.id);
  };

  const generateRender = async (sceneId: string, userPrompt?: string) => {
    setRendering((current) => ({ ...current, [sceneId]: true }));
    setRenderError(null);
    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneId, prompt: userPrompt }),
      });
      const data = await response.json();
      if (!response.ok || !data.image) throw new Error(data.error ?? "Render generation failed.");
      setRenderImages((current) => ({ ...current, [sceneId]: data.image }));
      return true;
    } catch (error) {
      setRenderError(error instanceof Error ? error.message : "Errore durante la generazione del render.");
      return false;
    } finally {
      setRendering((current) => ({ ...current, [sceneId]: false }));
    }
  };

  const generateRoomRenders = async () => {
    for (const scene of scenes) {
      // Sequential calls reduce concurrency pressure and make failures easier to isolate.
      const ok = await generateRender(scene.id);
      if (!ok) break;
    }
  };

  const submitPrompt = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || !activeScene) return;
    setActivity((current) => [
      `Modifica richiesta su “${activeScene.title}”: ${trimmed}`,
      ...current,
    ].slice(0, 4));
    const ok = await generateRender(activeScene.id, trimmed);
    if (ok) setPrompt("");
  };

  const activeImage = activeScene ? renderImages[activeScene.id] ?? activeScene.imageSrc : undefined;
  const activeIsRendering = activeScene ? Boolean(rendering[activeScene.id]) : false;
  const anyRoomRenderRunning = scenes.some((scene) => rendering[scene.id]);

  return (
    <main className="app-shell render-first-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Casa Milano</p>
          <h1>Digital House</h1>
          <p className="muted">Render-first · altezza {initialHouseState.ceilingHeightM.toFixed(2)} m · master plan 1:50</p>
        </div>

        <nav className="room-list" aria-label="Ambienti">
          {initialHouseState.rooms.map((item, index) => (
            <button className={item.id === activeRoom ? "room-link active" : "room-link"} key={item.id} onClick={() => selectRoom(item.id)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <p className="eyebrow">Regola M1</p>
          <p>Render statici ad alta fedeltà, generati da blueprint geometrici e vincoli del master plan.</p>
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
            <span>geometria auditata · scala credibile · materiali · luce</span>
          </div>
        </header>

        <section className="geometry-audit-card">
          <div>
            <p className="eyebrow">Geometry audit</p>
            <h3>Geometria ricalibrata sulla tavola 1:50</h3>
            <p className="muted">Il render usa un blueprint geometrico come riferimento e non può aggiornare automaticamente House State.</p>
          </div>
          <div className="audit-grid">
            <div><span>Appartamento</span><strong>{calibrationAnchors.apartmentReferenceAreaM2} m²</strong><small>riferimento complessivo</small></div>
            <div><span>Inviluppo interno</span><strong>{calibrationAnchors.planInternalEnvelopeApprox.widthM.toFixed(2)} × {calibrationAnchors.planInternalEnvelopeApprox.lengthM.toFixed(2)} m</strong><small>lettura scalata del PDF</small></div>
            <div><span>Altezza</span><strong>{calibrationAnchors.ceilingHeightM.toFixed(2)} m</strong><small>confermata</small></div>
            <div><span>Doccia</span><strong>{auditedBathroom.shower.widthApproxM.toFixed(2)} × {auditedBathroom.shower.depthConfirmedM.toFixed(2)} m</strong><small>solo porzione laterale</small></div>
          </div>
          {activeRoom === "soggiorno-cucina" && (
            <div className="audit-callout"><strong>Zona giorno:</strong> tavolo e divano nel living; cucina distinta; elemento 3 = mobile contenitivo; mobile TV separato; colonna portante separata; parquet leggibile.</div>
          )}
          {activeRoom === "bagno-lavanderia" && (
            <div className="audit-callout"><strong>Bagno:</strong> doccia solo sul lato sinistro; lavatrice e asciugatrice impilate e schermate.</div>
          )}
        </section>

        {activeScene && (
          <section className="hero-render-card">
            <div className="render-stage">
              {activeImage ? (
                <img src={activeImage} alt={activeScene.title} />
              ) : (
                <div className="render-pending">
                  <span>{activeIsRendering ? "Generazione in corso" : "Pronto per il render"}</span>
                  <strong>{activeScene.title}</strong>
                  <p>{activeScene.cameraIntent}</p>
                  <small>{activeIsRendering ? "Il render può richiedere alcuni secondi." : "La geometria è stata auditata. Puoi generare questa vista o tutte le viste dell'ambiente."}</small>
                </div>
              )}
            </div>
            <div className="render-generation-bar">
              <div>
                <strong>{activeImage ? "Render disponibile" : "Render non ancora generato"}</strong>
                <span>{activeIsRendering ? "Generazione AI in corso…" : "Usa il blueprint geometrico + vincoli della vista selezionata."}</span>
              </div>
              <div className="render-generation-actions">
                <button className="secondary-button" disabled={activeIsRendering || anyRoomRenderRunning} onClick={() => generateRender(activeScene.id)}>{activeImage ? "Rigenera vista" : "Genera vista"}</button>
                <button className="primary-button" disabled={anyRoomRenderRunning} onClick={generateRoomRenders}>{anyRoomRenderRunning ? "Generazione…" : `Genera ${scenes.length} render`}</button>
              </div>
            </div>
            {renderError && <div className="render-error"><strong>Errore:</strong> {renderError}</div>}
            <div className="render-meta">
              <div>
                <p className="eyebrow">Deve mostrare</p>
                <div className="chips left">{activeScene.mustShow.map((item) => <span className="chip" key={item}>{item}</span>)}</div>
              </div>
              <div>
                <p className="eyebrow">Vincoli di fedeltà</p>
                <ul className="fidelity-list">{activeScene.fidelityNotes.map((note) => <li key={note}>{note}</li>)}</ul>
              </div>
            </div>
          </section>
        )}

        <section className="static-scenes-section">
          <div className="section-heading">
            <div><p className="eyebrow">Viste statiche</p><h3>{scenes.length} render per questo ambiente</h3></div>
            <p className="muted">Gli angoli restano fissi; le modifiche AI rigenerano la vista selezionata.</p>
          </div>
          <div className="static-scenes-grid">
            {scenes.map((scene, index) => {
              const image = renderImages[scene.id] ?? scene.imageSrc;
              return (
                <button key={scene.id} className={activeScene?.id === scene.id ? "static-scene-card active" : "static-scene-card"} onClick={() => setActiveSceneId(scene.id)}>
                  <div className="scene-thumbnail">{image ? <img src={image} alt="" /> : rendering[scene.id] ? <span className="scene-loading">…</span> : <span>{String(index + 1).padStart(2, "0")}</span>}</div>
                  <div><strong>{scene.title}</strong><small>{scene.cameraIntent}</small></div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="actions-grid">
          <div className="prompt-card">
            <div>
              <p className="eyebrow">Modifica con AI</p>
              <h3>Modifica {activeScene ? `“${activeScene.title}”` : room.name}</h3>
              <p className="muted">La richiesta rigenera la vista selezionata mantenendo scala, muri e relazioni geometriche come vincoli.</p>
            </div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Es. Mantieni il layout, ma usa un parquet in rovere naturale più chiaro e ante cucina bianco caldo opaco." rows={4} />
            <div className="prompt-actions">
              <button className="secondary-button" onClick={() => setActivity((current) => current.slice(1))} disabled={activity.length === 0}>Annulla ultima richiesta</button>
              <button className="primary-button" onClick={submitPrompt} disabled={activeIsRendering || !prompt.trim()}>{activeIsRendering ? "Rigenerazione…" : "Applica e rigenera"}</button>
            </div>
            {activity.length > 0 && <div className="activity-log">{activity.map((item) => <p key={item}>{item}</p>)}</div>}
          </div>

          <div className="ideas-card">
            <p className="eyebrow">Ispirazione</p><h3>Esplora idee</h3>
            <p className="muted">Mostrerà 3 soluzioni comparabili per layout, spazio o stile, ciascuna con link al post originale.</p>
            <button className="secondary-button">Esplora 3 idee</button>
          </div>
        </section>

        <section className="model-summary">
          <div><p className="eyebrow">House State</p><h3>Elementi rilevanti</h3></div>
          <div className="chips">{roomElements.length > 0 ? roomElements.map((item) => <span className="chip" key={item.id}>{item.name}{item.configurable ? " · modificabile" : " · fisso"}</span>) : <span className="muted">Nessun elemento puntuale ancora codificato.</span>}</div>
        </section>
      </section>
    </main>
  );
}
