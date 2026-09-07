# Casa Milano — Technical Architecture

## MVP goal
Create a public desktop-first web application that lets users:

1. Explore 2–3 strategic views for each room.
2. Request home changes in natural language.
3. Let the AI ask clarification questions when needed.
4. Apply changes to a central House State.
5. Explore exactly 3 online inspiration references with original post links.
6. Start an on-demand guided 3D visit of the current house configuration.

## Initial stack

- GitHub: repository and version control.
- Vercel: public deployment.
- Next.js + React: web application.
- Three.js / React Three Fiber: future guided 3D visit.
- LLM + web search: prompt interpretation and Explore Ideas.
- No database in the initial MVP.

## Core architectural rule
The AI must not directly manipulate 3D geometry. Natural-language requests are translated into structured actions, validated against the House State and geometric constraints, then rendered by the application.

`Prompt → interpretation → clarification if required → structured action → House State → views / 3D`

## House representation
Every relevant element has both:

- semantic information for the AI (room, category, relationships, intent);
- geometric information for the renderer (position, dimensions, rotation).

The first checked-in model is intentionally semantic-first. Exact geometric coordinates will be calibrated from the architectural drawing at scale 1:50.

## Fixed in MVP

- apartment perimeter;
- walls and structural elements;
- ceiling height: 2.70 m;
- structural column in living room;
- positions of wall openings unless explicitly promoted to structural editing later.

## Configurable in MVP

- surfaces and finishes;
- doors and windows as products/finishes;
- kitchen modules and appliances;
- bathroom elements;
- furniture;
- lighting;
- sockets, switches and points once architectural legend is clarified;
- laundry separator;
- partially open TV/storage divider.

## Rooms

- Ingresso
- Disimpegno
- Soggiorno / Cucina
- Bagno / Lavanderia
- Camera matrimoniale
- Cabina armadio

## Known unresolved item
The architectural electrical labels `SK`, `AL`, `VCIT`, `Q.E.`, `2`, and `3` remain raw labels until the architect provides the legend.

## Delivery milestones

### M0 — Digital House
Calibrate the master plan and encode rooms, structural elements, configurable elements and viewpoints.

### M1 — Explore
Public desktop UI with room navigation, overview and strategic render placeholders / images.

### M2 — Modify
Prompt → clarification → structured action → House State → updated room views. Include Undo.

### M3 — Explore Ideas
Search public web/social sources and return exactly 3 relevant examples with original links and explanation of similarity.

### M4 — Visit
Guided 3D tour generated from the current House State, with play/pause, previous/next and go-to-room controls.
