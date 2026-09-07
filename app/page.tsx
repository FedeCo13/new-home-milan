import { initialHouseState } from "@/lib/house";

export default function HomePage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Casa Milano</p>
          <h1>Digital House MVP</h1>
          <p className="muted">Altezza {initialHouseState.ceilingHeightM.toFixed(2)} m · scala sorgente {initialHouseState.sourceScale}</p>
        </div>

        <nav className="room-list" aria-label="Ambienti">
          {initialHouseState.rooms.map((room, index) => (
            <a className={index === 2 ? "room-link active" : "room-link"} href={`#${room.id}`} key={room.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {room.name}
            </a>
          ))}
        </nav>

        <button className="secondary-button">Apri planimetria</button>
      </aside>

      <section className="workspace" id="soggiorno-cucina">
        <header className="topbar">
          <div>
            <p className="eyebrow">Ambiente</p>
            <h2>Soggiorno / Cucina</h2>
          </div>
          <button className="primary-button">Avvia visita in 3D</button>
        </header>

        <section className="hero-grid">
          <div className="render-placeholder large">
            <span>Vista principale</span>
            <strong>Ingresso → living</strong>
          </div>
          <div className="thumbnail-column">
            <div className="render-placeholder"><span>Vista 2</span><strong>Pranzo → living</strong></div>
            <div className="render-placeholder"><span>Vista 3</span><strong>Cucina → soggiorno</strong></div>
          </div>
        </section>

        <section className="actions-grid">
          <div className="prompt-card">
            <div>
              <p className="eyebrow">Modifica con AI</p>
              <h3>Chiedi una modifica alla casa</h3>
            </div>
            <textarea placeholder="Es. Rendi il parquet più chiaro e apri maggiormente il mobile dietro la TV." rows={4} />
            <div className="prompt-actions">
              <button className="secondary-button">Annulla ultima modifica</button>
              <button className="primary-button">Invia</button>
            </div>
          </div>

          <div className="ideas-card">
            <p className="eyebrow">Ispirazione</p>
            <h3>Esplora idee</h3>
            <p className="muted">Trova 3 soluzioni online simili per spazio, layout o stile, sempre con link al post originale.</p>
            <button className="secondary-button">Esplora idee</button>
          </div>
        </section>

        <section className="model-summary">
          <div>
            <p className="eyebrow">House State</p>
            <h3>Elementi già modellati</h3>
          </div>
          <div className="chips">
            {initialHouseState.elements.filter((item) => item.roomId === "soggiorno-cucina").map((item) => (
              <span className="chip" key={item.id}>{item.name}{item.configurable ? " · modificabile" : " · fisso"}</span>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
