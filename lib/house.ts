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
      description: "Ingresso principale e accesso alla zona giorno.",
      viewpoints: [
        { id: "ingresso-1", roomId: "ingresso", name: "Verso la zona giorno", description: "Dalla porta di ingresso verso soggiorno e cucina." },
        { id: "ingresso-2", roomId: "ingresso", name: "Verso la zona notte", description: "Dalla zona giorno verso ingresso e distribuzione notte." },
      ],
    },
    {
      id: "disimpegno",
      name: "Disimpegno",
      description: "Spazio di raccordo verso bagno e zona notte.",
      viewpoints: [
        { id: "disimpegno-1", roomId: "disimpegno", name: "Passaggio", description: "Vista lungo il disimpegno verso la zona notte." },
        { id: "disimpegno-2", roomId: "disimpegno", name: "Ritorno", description: "Vista dal fondo del disimpegno verso la zona giorno." },
      ],
    },
    {
      id: "soggiorno-cucina",
      name: "Soggiorno / Cucina",
      description: "Open space con living, pranzo e cucina; colonna portante centrale e mobile TV contenitivo parzialmente aperto.",
      viewpoints: [
        { id: "living-1", roomId: "soggiorno-cucina", name: "Ingresso → living", description: "Dall'ingresso verso TV, divano e cucina." },
        { id: "living-2", roomId: "soggiorno-cucina", name: "Pranzo → living", description: "Dalla zona tavolo verso living e cucina." },
        { id: "living-3", roomId: "soggiorno-cucina", name: "Cucina → soggiorno", description: "Con la cucina alle spalle, verso soggiorno e mobile TV." },
      ],
    },
    {
      id: "bagno-lavanderia",
      name: "Bagno / Lavanderia",
      description: "Bagno con doccia e colonna lavatrice-asciugatrice schermata alla vista degli ospiti.",
      viewpoints: [
        { id: "bagno-1", roomId: "bagno-lavanderia", name: "Ingresso bagno", description: "Dalla porta verso doccia e sanitari." },
        { id: "bagno-2", roomId: "bagno-lavanderia", name: "Zona doccia", description: "Dalla zona doccia verso lavabo e ingresso." },
      ],
    },
    {
      id: "camera",
      name: "Camera matrimoniale",
      description: "Camera matrimoniale con accesso alla cabina armadio.",
      viewpoints: [
        { id: "camera-1", roomId: "camera", name: "Ingresso → letto", description: "Dall'ingresso verso il letto matrimoniale." },
        { id: "camera-2", roomId: "camera", name: "Finestra → letto", description: "Dall'angolo finestra verso letto e cabina armadio." },
        { id: "camera-3", roomId: "camera", name: "Letto → cabina", description: "Dalla zona letto verso la cabina armadio." },
      ],
    },
    {
      id: "cabina-armadio",
      name: "Cabina armadio",
      description: "Cabina con armadiature laterali e sul fondo e passaggio centrale.",
      viewpoints: [
        { id: "cabina-1", roomId: "cabina-armadio", name: "Ingresso cabina", description: "Dall'ingresso verso le armadiature sul fondo." },
        { id: "cabina-2", roomId: "cabina-armadio", name: "Fondo cabina", description: "Dal fondo verso ingresso e armadiature laterali." },
      ],
    },
  ],
  elements: [
    { id: "living-column", name: "Colonna portante soggiorno", category: "structure", roomId: "soggiorno-cucina", configurable: false },
    { id: "tv-partition", name: "Mobile TV divisorio aperto", category: "furniture", roomId: "soggiorno-cucina", configurable: true, notes: "Elemento contenitivo con parti aperte per preservare la continuità visiva della zona giorno." },
    { id: "kitchen", name: "Cucina modulare", category: "kitchen", roomId: "soggiorno-cucina", configurable: true },
    { id: "shower", name: "Doccia", category: "bathroom", roomId: "bagno-lavanderia", configurable: true, notes: "Zona doccia indicata in planimetria con quota 1,46 m." },
    { id: "washer", name: "Lavatrice", category: "appliance", roomId: "bagno-lavanderia", configurable: true },
    { id: "dryer", name: "Asciugatrice", category: "appliance", roomId: "bagno-lavanderia", configurable: true, notes: "Posizionata sopra la lavatrice nella configurazione base." },
    { id: "laundry-screen", name: "Separatore lavanderia", category: "furniture", roomId: "bagno-lavanderia", configurable: true, notes: "Nasconde lavatrice e asciugatrice alla vista degli ospiti." },
    { id: "wardrobe", name: "Cabina armadio modulare", category: "furniture", roomId: "cabina-armadio", configurable: true },
  ],
};
