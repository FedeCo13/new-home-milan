export const initial = Object.freeze({color:'#c2b8a6', material:'tessuto', sofa:'chaise', light:'giorno'});
const allowed = {color:v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v),material:v=>['tessuto','velluto','pelle'].includes(v),sofa:v=>['chaise','lineare'].includes(v),light:v=>['giorno','calda','neutra','spenta'].includes(v)};
export function validatePatch(p){
 if(!p||typeof p!=='object'||Array.isArray(p)||!Object.keys(p).length||Object.keys(p).some(k=>!Object.hasOwn(allowed,k)||!allowed[k](p[k])))throw Error('Modifica non consentita: struttura, posizione e dimensioni sono bloccate.');
 return {...p};
}
export function applyPatch(state,patch){return {...state,...validatePatch(patch)};}
// Only exact complete commands use the offline interpreter; everything else is proposed by the API.
export function localPrompt(raw){
 const s=raw.trim().toLowerCase().replace(/[.!]$/,'');
 const colors={'verde salvia':'#879b82','blu':'#41657d','beige':'#c2b8a6','grigio':'#858b90','terracotta':'#ae6751'};
 for(const [name,color] of Object.entries(colors))if(s===`rendi il divano ${name}`)return {color};
 for(const material of ['tessuto','velluto','pelle'])if(s===`rivesti il divano in ${material}`)return {material};
 if(s==='usa il divano lineare')return {sofa:'lineare'};
 if(s==='usa il divano con chaise longue')return {sofa:'chaise'};
 for(const light of ['calda','neutra','spenta'])if(s===`imposta luce ${light}`)return {light};
 if(s==='imposta luce giorno')return {light:'giorno'};
 return null;
}
export function describe(p){return Object.entries(validatePatch(p)).map(([k,v])=>`${({color:'Colore divano',material:'Rivestimento divano',sofa:'Configurazione divano',light:'Illuminazione'})[k]}: ${v}`).join(' · ');}
export function sofaObject(id){return id.startsWith('sofa_')&&!id.startsWith('sofa_leg_');}
export function objectAppearance(object,state){
 return {visible:!(state.sofa==='lineare'&&object.id.startsWith('sofa_chaise_')),color:sofaObject(object.id)?state.color:null,material:sofaObject(object.id)?state.material:null};
}
