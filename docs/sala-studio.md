# Casa Milano — galleria statica

La pagina `/` presenta sei ambienti, con tre viste fisse per ambiente: soggiorno, cucina, zona giorno completa, bagno, camera e cabina armadio.

Le diciotto immagini sono generate dal modello approvato, senza rigenerazione AI. Sono confezionate in `public/gallery/rooms.webp` (griglia di tre colonne e sei righe). Ogni riquadro è una vista statica da 1100 × 760 pixel, selezionata dal CSS. Il browser non richiede WebGL o chiavi API.

`/sala/index.html` rimanda alla pagina principale. Entrambi gli endpoint precedenti di generazione/modifica restituiscono HTTP 410 e non chiamano servizi AI. Non ci sono prompt, varianti o controlli di modifica nell'interfaccia.

## Riproducibilità

Il modello sorgente rimane `public/sala/scene.json`. `scripts/render_gallery.py` usa `render_geometry.py`, Python, NumPy, Pillow e SciPy per produrre le viste. Pareti perimetrali sezionate a 55 cm e soffitto escluso solo dalla presentazione. Arredi originali invariati; viste schematiche, non fotorealistiche. `scripts/gallery-provenance.json` registra sorgente e selezione degli ambienti.

Verifiche: diciotto riquadri controllati visivamente, hash del modello invariato, build Next.js e controllo TypeScript riusciti. Nessuna verifica interattiva browser effettuata.
