# Studio sala — prima versione

Entry: `/sala/index.html`; available as static public assets on the existing Next/Vercel app. The home page links to it. Existing workspace is retained.

## Geometry contract

`public/sala/scene.json` contains the complete approved procedural model, in metres, with source SHA256 `8454e31c60f0bf9e6e3d0c9de46f63b91593201bdb6fc3d779f65cc5444dfff7`. X east, Y north, Z up. It supersedes the older inferred floorplan only inside this new studio. The legacy workspace and generative renders remain separate.

Rendering selects the living area and sections boundary walls for presentation only. Full source vertices remain unchanged. All three fixed orthographic cameras use the same scene. WebGL depth testing resolves occlusion. Rendering is local, with no image-generation costs. This is a schematic raster view, not a photorealistic or physically based renderer. Lighting controls alter tint and intensity; they do not simulate individual luminaires. Fabric appearance is approximate.

Allowed changes: sofa upholstery color/material, original sofa or same base without chaise extension, global lighting appearance. Sofa legs and all other objects stay unchanged. The linear variant removes two chaise components, not a newly invented sofa. Position/orientation/structure cannot be supplied through the patch schema. Room geometry is never sent to the language model for regeneration.

## Prompts

Exact suggested commands work without credentials. Other requests call `/api/sala-edit`, using the existing `AI_GATEWAY_API_KEY` and optional `SALA_TEXT_MODEL` (default `openai/gpt-4.1-mini`). Provider availability must be verified on deployment. No secret reaches the browser. The language model returns a restricted patch, validated on server and client. Every prompt-generated patch is shown for confirmation before applying. Unsupported/ambiguous changes should return clarification. Semantic interpretation can still be wrong, hence the proposal review; schema cannot express geometry changes. Direct controls apply immediately and are undoable.

No arbitrary catalog lookup, new lamps, free furniture repositioning or photorealistic rendering in this release. Those require a separate asset and rendering integration.

## Sharing

The share link encodes only validated configuration values in its URL fragment. Visitors load the same base model with those overrides; changes are independent. No shared multi-user editing or server persistence. PNG links download the currently shown original/variant image. Vercel deployment protection still governs access to the site.

## Verification

Run `node --test tests/sala.test.mjs`. Tests cover immutable geometry, non-sofa invariance, scoped chaise removal, invalid patch rejection, compound prompt handling and share-state validation. Production build and TypeScript checks passed locally. Browser visual QA and a live AI Gateway request still need verification on the deployment. Keep AI endpoint access/cost policies aligned with the existing app before broad public use.
