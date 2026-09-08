import {objectAppearance} from './policy.mjs';
const sub=(a,b)=>a.map((v,i)=>v-b[i]), dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], norm=a=>{const n=Math.hypot(...a);return a.map(v=>v/(n||1));};
export const views=[{name:'Sala e tavolo',eye:[9,-9,9],target:[2.5,-1.8,0.8]}, {name:'Dal lato finestra',eye:[-7,-6,7],target:[2.5,-1.8,.8]}, {name:'Dall’alto',eye:[2.5,-1.8,15],target:[2.5,-1.8,0]}];
function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
// Presentation cutaway only. Full, unmodified apartment stays in scene.json.
export function roomObjects(scene){return scene.objects.filter(o=>o.kind!=='ceiling'&&Math.max(...o.vertices.map(v=>v[1]))>=-3.72&&Math.min(...o.vertices.map(v=>v[1]))<=.15).map(o=>({...o,vertices:o.vertices.map(v=>[v[0],Math.max(-3.72,Math.min(.15,v[1])),o.kind==='wall'?Math.min(v[2],.65):v[2]])}));}
export function createRenderer(canvas,scene,view){
 const gl=canvas.getContext('webgl',{antialias:true,preserveDrawingBuffer:true});if(!gl)throw Error('WebGL non disponibile: abilita l’accelerazione grafica nel browser.');
 const program=gl.createProgram();
 gl.attachShader(program,shader(gl,gl.VERTEX_SHADER,`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;attribute float aFabric;uniform vec3 uRight;uniform vec3 uUp;uniform vec3 uForward;uniform vec2 uMid;uniform vec2 uScale;varying vec3 color;varying vec3 normal;varying vec3 world;varying float fabric;void main(){vec2 q=vec2(dot(aPosition,uRight),dot(aPosition,uUp));gl_Position=vec4((q-uMid)*uScale,(dot(aPosition,uForward)+10.0)/30.0,1.0);color=aColor;normal=aNormal;world=aPosition;fabric=aFabric;}`));
 gl.attachShader(program,shader(gl,gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 color;varying vec3 normal;varying vec3 world;varying float fabric;uniform vec3 uTint;uniform float uLight;void main(){vec3 n=normalize(normal);float d=max(dot(n,normalize(vec3(-3.0,-4.0,9.0))),0.0);float texture=1.0;if(fabric>0.5&&fabric<1.5)texture=.97+.03*sin(world.x*400.0)*sin(world.z*400.0);if(fabric>1.5&&fabric<2.5)texture=.92+.08*abs(dot(n,normalize(vec3(1.0,1.0,1.0))));if(fabric>2.5)texture=.94+.06*pow(d,12.0);vec3 c=color*(.58+.42*d)*texture*uTint*uLight;gl_FragColor=vec4(c,1.0);}`));
 gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Errore nel motore di visualizzazione.');gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
 const objects=roomObjects(scene),fw=norm(sub(view.target,view.eye)),right=norm(cross(fw,Math.abs(fw[2])>.999?[0,1,0]:[0,0,1])),up=cross(right,fw);
 const points=objects.flatMap(o=>o.vertices),xs=points.map(p=>dot(p,right)),ys=points.map(p=>dot(p,up));const xlo=Math.min(...xs),xhi=Math.max(...xs),ylo=Math.min(...ys),yhi=Math.max(...ys);
 const scale=Math.min(canvas.width*.85/(xhi-xlo),canvas.height*.85/(yhi-ylo));
 for(const [key,value] of [['uRight',right],['uUp',up],['uForward',fw]])gl.uniform3fv(gl.getUniformLocation(program,key),value);
 gl.uniform2fv(gl.getUniformLocation(program,'uMid'),[(xhi+xlo)/2,(yhi+ylo)/2]);gl.uniform2fv(gl.getUniformLocation(program,'uScale'),[2*scale/canvas.width,2*scale/canvas.height]);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 for(const [name,n,offset] of [['aPosition',3,0],['aNormal',3,12],['aColor',3,24],['aFabric',1,36]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,40,offset);}
 return state=>{
  const data=[];
  for(const o of objects){const appearance=objectAppearance(o,state);if(!appearance.visible)continue;const c=appearance.color?appearance.color.match(/[a-f0-9]{2}/gi).map(x=>parseInt(x,16)/255):scene.materials[o.material];const f=({tessuto:1,velluto:2,pelle:3})[appearance.material]||0;
   for(const face of o.faces)for(let i=1;i<face.length-1;i++){const tri=[o.vertices[face[0]],o.vertices[face[i]],o.vertices[face[i+1]]],normal=norm(cross(sub(tri[1],tri[0]),sub(tri[2],tri[0])));for(const p of tri)data.push(...p,...normal,...c,f);}
  }
  gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.93,.94,.94,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);
  gl.uniform3fv(gl.getUniformLocation(program,'uTint'),state.light==='calda'?[1,.88,.73]:[1,1,1]);gl.uniform1f(gl.getUniformLocation(program,'uLight'),state.light==='spenta'?.65:state.light==='giorno'?1.05:.95);gl.drawArrays(gl.TRIANGLES,0,data.length/10);
 };
}
