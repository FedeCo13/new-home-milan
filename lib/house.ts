export type RoomId =
  | "ingresso"
  | "disimpegno"
  | "soggiorno-cucina"
  | "bagno-lavanderia"
  | "camera"
  | "cabina-armadio";

export type HouseElementCategory =
  | "structure"
  | "surface"
  | "opening"
  | "electrical"
  | "lighting"
  | "kitchen"
  | "bathroom"
  | "furniture"
  | "appliance";

export interface HouseElement {
  id: string;
  name: string;
  category: HouseElementCategory;
  roomId: RoomId;
  configurable: boolean;
  notes?: string;
}

export interface Viewpoint {
  id: string;
  roomId: RoomId;
  name: string;
  description: string;
}

export interface Room {
  id: RoomId;
  name: string;
  description: string;
  viewpoints: Viewpoint[];
}

export interface HouseState {
  projectName: string;
  ceilingHeightM: number;
  sourceScale: "1:50";
  rooms: Room[];
  elements: HouseElement[];
  unresolvedArchitectLabels: string[];
}

export const initialHouseState: HouseState = {
  projectName: "Casa Milano",
  ceilingHeightM: 2.7,
  sourceScale: "1:50",
  unresolvedArchitectLabels: ["SK", "AL", "VCIT", "Q.E.", "2", "3"],
  rooms: [
    {
      id: "ingresso",
      name: "Ingresso",
      description: "Ingresso principale sul lato destro della planimetria, con accesso alla zona giorno e raccordo verso il disimpegno.",
      viewpoints: [],
    },
    {
      id: "disimpegno",
      name: "Disimpegno",
      description: "Passaggio verso bagno e zona notte, chiaramente percepibile nei render illustrativi condivisi.",
      viewpoints: [],
    },
    {
      id: "soggiorno-cucina",
      name: "Zona giorno / Cucina",
      description: "Grande zona giorno con tavolo ovale e divano; la cucina occupa una porzione distinta dell'open space ed è filtrata dal mobile TV contenitivo parzialmente aperto. Colonna portante centrale fissa.",
      viewpoints: [],
    },
    {
      id: "bagno-lavanderia",
      name: "Bagno / Lavanderia",
      description: "Bagno con doccia laterale che occupa solo parte del lato sinistro, sanitari e lavabo; colonna lavatrice-asciugatrice schermata alla vista degli ospiti.",
      viewpoints: [],
    },
    {
      id: "camera",
      name: "Camera matrimoniale",
      description: "Camera matrimoniale di circa 13 m² con accesso alla cabina armadio dedicata.",
      viewpoints: [],
    },
    {
      id: "cabina-armadio",
      name: "Cabina armadio",
      description: "Cabina armadio identificata nello spazio dedicato in basso a destra della planimetria, con armadiature laterali e sul fondo.",
      viewpoints: [],
    },
  ],
  elements: [
    { id: "living-parquet", name: "Parquet zona giorno", category: "surface", roomId: "soggiorno-cucina", configurable: true, notes: "Deve essere sempre chiaramente leggibile nei render della zona giorno." },
    { id: "living-column", name: "Colonna portante soggiorno", category: "structure", roomId: "soggiorno-cucina", configurable: false, notes: "Elemento strutturale centrale distinto dal mobile TV." },
    { id: "tv-partition", name: "Mobile TV divisorio aperto", category: "furniture", roomId: "soggiorno-cucina", configurable: true, notes: "Mobile contenitivo/filtro tra cucina e zona divano-tavolo; non è una parete piena e deve mantenere continuità visiva." },
    { id: "dining-table", name: "Tavolo ovale zona giorno", category: "furniture", roomId: "soggiorno-cucina", configurable: true, notes: "È nella zona giorno; vicino alla cucina ma non dentro la cucina." },
    { id: "sofa", name: "Divano zona living", category: "furniture", roomId: "soggiorno-cucina", configurable: true, notes: "Rimane sul lato living del filtro TV." },
    { id: "kitchen", name: "Cucina modulare", category: "kitchen", roomId: "soggiorno-cucina", configurable: true, notes: "Configurazione modificabile via prompt; posizione base deve seguire la planimetria master." },
    { id: "shower", name: "Doccia laterale", category: "bathroom", roomId: "bagno-lavanderia", configurable: true, notes: "Zona doccia sul lato sinistro con quota di riferimento 1,46 m; non occupa tutta la parete." },
    { id: "bath-vanity", name: "Mobile lavabo", category: "bathroom", roomId: "bagno-lavanderia", configurable: true },
    { id: "wc", name: "WC", category: "bathroom", roomId: "bagno-lavanderia", configurable: true },
    { id: "bidet", name: "Bidet", category: "bathroom", roomId: "bagno-lavanderia", configurable: true },
    { id: "washer", name: "Lavatrice", category: "appliance", roomId: "bagno-lavanderia", configurable: true },
    { id: "dryer", name: "Asciugatrice", category: "appliance", roomId: "bagno-lavanderia", configurable: true, notes: "Posizionata sopra la lavatrice nella configurazione base." },
    { id: "laundry-screen", name: "Separatore lavanderia", category: "furniture", roomId: "bagno-lavanderia", configurable: true, notes: "Nasconde lavatrice e asciugatrice alla vista degli ospiti." },
    { id: "bedroom-floor", name: "Pavimento camera", category: "surface", roomId: "camera", configurable: true },
    { id: "bed", name: "Letto matrimoniale", category: "furniture", roomId: "camera", configurable: true },
    { id: "wardrobe", name: "Cabina armadio modulare", category: "furniture", roomId: "cabina-armadio", configurable: true },
  ],
};
