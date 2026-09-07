# Casa Milano — Geometry Audit v1

Source: architect plan dated 03/09/2026, scale 1:50. No CAD/DWG available.

## Purpose

This audit replaces the previous approximate geometry used by the volumetric M1 model. Static architectural renders must consume these constraints; renders never become the source of truth themselves.

## Global anchors

- Ceiling height: 2.70 m (confirmed by user)
- Apartment reference area: 65 m² (user-provided overall apartment reference; treated as commercial/gross reference, not used to inflate room geometry)
- Scaled internal envelope visible on the master plan: approx. 5.09 m × 10.97 m
- Source quality: 1:50 PDF drawing; suitable for visualization, not construction documentation

## Day zone — audited relationships

- Dining table and sofa both belong to the living/dining zone.
- The kitchen is a distinct part of the same open-plan room, located south of the living/dining furniture.
- A partially open TV/storage unit separates living/dining from the kitchen visually; it is not a full wall.
- The structural column is a separate fixed element adjacent to the TV/storage filter.
- Parquet is a required visible base material in day-zone renders: board direction, joints and tonal variation must be legible.

### Scaled furniture footprints from drawing

- Oval dining table: approx. 0.99 m × 1.76 m
- Sofa overall footprint: approx. 2.24 m × 1.58 m
- TV/storage filter width: approx. 2.67 m
- Kitchen base depth: use 0.60 m standard where the drawing does not provide a written dimension

These values are visualization calibration values. They should not override explicit dimensions supplied later by the architect.

## Bathroom — audited relationships

- Internal bathroom rectangle from the drawing: approx. 3.37 m × 1.65 m
- Shower is on the west/left end of the bathroom.
- Shower depth: 1.46 m (explicit plan dimension / user-confirmed)
- Shower width from scaled drawing: approx. 0.66 m
- Therefore the shower occupies only part of the bathroom and must never be rendered as spanning the entire bathroom wall.
- Washer and dryer are stacked vertically and screened from guest view by a configurable separator.

## Bedroom / wardrobe

- Bedroom from scaled drawing: approx. 3.37 m × 3.39 m
- Previous 13 m² assumption has been removed because it was not supported by the latest master plan.
- Walk-in wardrobe is the lower-right zone highlighted by the user, approx. 1.63 m × 3.00 m from the scaled drawing.
- Section C'-C' must not be used as a wardrobe reference; it is a living-room section viewed with the kitchen behind the observer.

## Rendering rule

Before any render is accepted:

1. Check furniture relationships against the master plan.
2. Check visible room scale against the calibrated dimensions.
3. Check fixed structural elements (column, openings).
4. Check room-specific constraints (e.g. shower footprint).
5. Only then assess style, materials and lighting.

A beautiful render that fails geometry is rejected and must not update House State.
