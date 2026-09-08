export type SceneState = {color:string;material:string;sofa:string;light:string};
export const initial: Readonly<SceneState>;
export function validatePatch(p:unknown):Partial<SceneState>;
export function applyPatch(s:SceneState,p:unknown):SceneState;
export function localPrompt(s:string):Partial<SceneState>|null;
export function describe(p:unknown):string;
