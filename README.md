# Casa Milano

Desktop-first MVP for exploring and simulating the future Milan home.

## Current status

The repository contains the first technical scaffold:

- Next.js / React application shell;
- desktop-first room navigation;
- initial semantic `HouseState`;
- living-room strategic view placeholders;
- AI modification prompt UI placeholder;
- `Esplora idee` placeholder limited to 3 results;
- guided 3D visit CTA placeholder;
- documented MVP architecture and milestones.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## MVP architecture

See [`docs/architecture.md`](docs/architecture.md).

## Source of truth

The current house geometry is based on the latest architectural hypothesis supplied for the project and will be calibrated from the 1:50 drawing. Ceiling height is set to 2.70 m.

Known unresolved item: the electrical-plan labels still require the architect's legend before they are translated into semantic electrical elements.

## Next build step

M1: replace view placeholders with the first calibrated digital-house representation and strategic room views, then connect room navigation to actual room states.
