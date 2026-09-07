import type { RoomId } from "@/lib/house";

export type RenderStatus = "pending" | "ready" | "regenerating";

export interface StaticRenderScene {
  id: string;
  roomId: RoomId;
  title: string;
  cameraIntent: string;
  mustShow: string[];
  fidelityNotes: string[];
  status: RenderStatus;
  imageSrc?: string;
}

/**
 * M1.1: static-render-first experience.
 * Each scene is a fixed architectural view designed to remain stable across AI edits.
 */
export const staticRenderScenes: StaticRenderScene[] = [
  {
    id: "living-01",
    roomId: "soggiorno-cucina",
    title: "Zona giorno completa",
    cameraIntent: "Vista ampia dalla zona ingresso/disimpegno verso soggiorno, pranzo e filtro TV, con cucina leggibile dietro il mobile aperto.",
    mustShow: ["divano", "tavolo ovale", "mobile TV aperto", "colonna portante", "cucina sullo sfondo", "parquet"],
    fidelityNotes: ["Tavolo e divano appartengono alla zona giorno", "La cucina resta distinta tramite il mobile TV/filtro", "Il mobile non deve essere reso come una parete piena"],
    status: "pending",
  },
  {
    id: "living-02",
    roomId: "soggiorno-cucina",
    title: "Pranzo e cucina",
    cameraIntent: "Vista dalla zona living verso il tavolo ovale e la cucina, mostrando chiaramente la separazione visiva creata dal mobile TV aperto.",
    mustShow: ["tavolo ovale", "sedie", "cucina a L", "mobile TV aperto", "finestre", "parquet"],
    fidelityNotes: ["Il tavolo è vicino alla cucina ma resta nella zona giorno", "Cucina in posizione coerente con la planimetria"],
    status: "pending",
  },
  {
    id: "living-03",
    roomId: "soggiorno-cucina",
    title: "Living e mobile TV",
    cameraIntent: "Vista con cucina alle spalle verso divano e mobile TV, coerente con la lettura della sezione C'-C'.",
    mustShow: ["TV", "moduli contenitivi", "vani aperti", "colonna", "divano", "parquet"],
    fidelityNotes: ["Il filtro deve lasciare passaggi visivi", "La colonna è strutturale e distinta dal mobile"],
    status: "pending",
  },
  {
    id: "bath-01",
    roomId: "bagno-lavanderia",
    title: "Bagno dall'ingresso",
    cameraIntent: "Vista dalla porta del bagno verso lavabo, sanitari e zona doccia laterale.",
    mustShow: ["doccia laterale", "lavabo/mobile", "WC", "bidet", "lavanderia schermata"],
    fidelityNotes: ["La doccia occupa solo parte del lato sinistro", "Quota di riferimento 1,46 m", "Lavatrice e asciugatrice non devono essere direttamente visibili agli ospiti"],
    status: "pending",
  },
  {
    id: "bath-02",
    roomId: "bagno-lavanderia",
    title: "Doccia e lavanderia",
    cameraIntent: "Vista interna che chiarisce la profondità della doccia e la soluzione di schermatura della colonna lavatrice/asciugatrice.",
    mustShow: ["box doccia", "schermatura lavanderia", "lavatrice", "asciugatrice", "mobile lavabo"],
    fidelityNotes: ["La schermatura è un elemento progettuale modificabile", "Nessuna doccia a tutta parete"],
    status: "pending",
  },
  {
    id: "bedroom-01",
    roomId: "camera",
    title: "Camera dall'ingresso",
    cameraIntent: "Vista dall'ingresso verso letto matrimoniale e parete di fondo.",
    mustShow: ["letto", "testata", "comodini", "finestra", "pavimento"],
    fidelityNotes: ["Proporzioni coerenti con la camera da circa 13 m²"],
    status: "pending",
  },
  {
    id: "bedroom-02",
    roomId: "camera",
    title: "Camera e cabina",
    cameraIntent: "Vista dalla zona finestra/letto verso l'accesso alla cabina armadio.",
    mustShow: ["letto", "accesso cabina", "disimpegno interno", "pavimento"],
    fidelityNotes: ["La cabina è lo spazio dedicato in basso a destra della planimetria"],
    status: "pending",
  },
  {
    id: "wardrobe-01",
    roomId: "cabina-armadio",
    title: "Cabina armadio",
    cameraIntent: "Vista dall'accesso verso armadiature laterali e moduli sul fondo.",
    mustShow: ["armadiatura sinistra", "armadiatura destra", "moduli fondo", "passaggio centrale"],
    fidelityNotes: ["Non usare la sezione C'-C' come riferimento della cabina"],
    status: "pending",
  },
  {
    id: "hall-01",
    roomId: "disimpegno",
    title: "Disimpegno zona notte",
    cameraIntent: "Vista del passaggio evidenziato nei render, tra zona giorno, bagno e camera.",
    mustShow: ["passaggio", "porte", "continuità pavimento", "luce"],
    fidelityNotes: ["Il disimpegno è percepibile nei render anche se meno evidente nella sola planimetria"],
    status: "pending",
  },
  {
    id: "entry-01",
    roomId: "ingresso",
    title: "Ingresso verso casa",
    cameraIntent: "Vista dalla porta d'ingresso verso la zona giorno e il raccordo con il disimpegno.",
    mustShow: ["porta ingresso", "zona giorno", "disimpegno", "pavimento"],
    fidelityNotes: ["Mantenere la geometria delle porte coerente con la tavola"],
    status: "pending",
  },
];

export function scenesForRoom(roomId: RoomId) {
  return staticRenderScenes.filter((scene) => scene.roomId === roomId);
}
