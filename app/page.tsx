'use client';
import { useState } from 'react';
const rooms=[
 {id:'soggiorno',name:'Soggiorno',description:'Divano, tavolo da pranzo e mobile TV.'},
 {id:'cucina',name:'Cucina',description:'La cucina a L e i suoi elementi.'},
 {id:'zona-giorno',name:'Soggiorno + cucina',description:'Una vista d’insieme della zona giorno e della relazione fra gli spazi.'},
 {id:'bagno',name:'Bagno',description:'Doccia, sanitari, lavabo e colonna lavanderia schermata.'},
 {id:'camera',name:'Camera da letto',description:'Letto matrimoniale, comodini e cassettiera.'},
 {id:'cabina',name:'Cabina armadio',description:'I due lati attrezzati e il mobile di fondo.'},
];
const views=['Prima prospettiva','Prospettiva opposta','Vista dall’alto'];
export default function HomePage(){
 const [active,setActive]=useState(0);const room=rooms[active];
 return <div className="gallery-shell"><aside className="gallery-sidebar"><a className="brand" href="/">CASA MILANO</a><div><p className="eyebrow">Il progetto</p><h1>La casa, ambiente per ambiente.</h1></div><nav aria-label="Ambienti">{rooms.map((r,i)=><button key={r.id} aria-current={active===i?'page':undefined} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span>{r.name}</button>)}</nav><p className="sidebar-note">6 ambienti · 18 viste<br/>Modello approvato</p></aside><main className="gallery-main"><header className="gallery-heading"><div><p className="eyebrow">Ambiente {String(active+1).padStart(2,'0')} / 06</p><h2>{room.name}</h2><p>{room.description}</p></div><span className="fixed-label">Viste statiche</span></header><p className="view-note">Pareti sezionate e soffitto nascosto per leggere gli spazi. Arredi e finiture sono schematici; disposizione e dimensioni restano quelle del modello.</p><section className="gallery-grid" aria-label={`Tre viste: ${room.name}`} key={room.id}>{views.map((view,i)=><figure key={view}><div className="room-image" role="img" aria-label={`${room.name}: ${view}`} style={{backgroundPosition:`${i*50}% ${active*20}%`}}/><figcaption><span>0{i+1}</span><h3>{view}</h3></figcaption></figure>)}</section><footer>Casa Milano · Planimetria e arredi del modello approvato</footer></main></div>;
}
