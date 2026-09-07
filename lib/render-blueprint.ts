const esc = (value: string) => value.replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&apos;"}[char] ?? char));

function shell(title: string, content: string, camera: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
    <rect width="1536" height="1024" fill="#faf9f5"/>
    <text x="70" y="72" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#171717">${esc(title)}</text>
    <text x="70" y="112" font-family="Arial, sans-serif" font-size="20" fill="#555">Geometry reference only · proportions and relationships are constraints, not style</text>
    ${content}
    <rect x="70" y="900" width="1396" height="70" rx="12" fill="#eeeae2" stroke="#9f998f"/>
    <text x="95" y="930" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#252525">CAMERA INTENT</text>
    <text x="95" y="956" font-family="Arial, sans-serif" font-size="17" fill="#444">${esc(camera)}</text>
  </svg>`;
}

function livingBlueprint(camera: string) {
  return shell("Zona giorno / cucina · 5.09 × 5.72 m", `
    <g transform="translate(160 165)">
      <rect x="0" y="0" width="815" height="610" fill="#fff" stroke="#111" stroke-width="12"/>
      <text x="22" y="36" font-family="Arial" font-size="18" fill="#666">NORD / ZONA LIVING</text>
      <text x="22" y="588" font-family="Arial" font-size="18" fill="#666">SUD / ZONA CUCINA</text>

      <!-- dining table, ~0.99 x 1.76 m -->
      <ellipse cx="165" cy="188" rx="78" ry="134" fill="#e6d6bd" stroke="#765d43" stroke-width="4"/>
      <text x="105" y="193" font-family="Arial" font-size="20" font-weight="700" fill="#413526">TAVOLO</text>

      <!-- sofa, ~2.24 x 1.58 m, living area -->
      <path d="M438 60 H748 V205 H690 V142 H438 Z" fill="#d9d4cc" stroke="#57534d" stroke-width="4"/>
      <text x="520" y="125" font-family="Arial" font-size="22" font-weight="700" fill="#333">DIVANO</text>
      <path d="M505 218 L585 250 L665 218" fill="none" stroke="#333" stroke-width="4"/>
      <text x="520" y="278" font-family="Arial" font-size="17" fill="#444">rivolto verso TV</text>

      <!-- structural column -->
      <rect x="650" y="315" width="44" height="44" fill="#4b4b49"/>
      <text x="704" y="343" font-family="Arial" font-size="17" fill="#333">COLONNA</text>

      <!-- living composition separating living from kitchen -->
      <rect x="275" y="330" width="365" height="58" fill="#b89a76" stroke="#604c37" stroke-width="4"/>
      <text x="294" y="367" font-family="Arial" font-size="19" font-weight="700" fill="#30261d">3 · MOBILE CONTENITIVO</text>
      <rect x="360" y="296" width="200" height="26" fill="#7d7368" stroke="#373330" stroke-width="3"/>
      <text x="388" y="288" font-family="Arial" font-size="18" font-weight="700" fill="#242424">MOBILE TV distinto</text>
      <text x="280" y="420" font-family="Arial" font-size="16" fill="#555">composizione aperta / continuità visiva</text>

      <!-- kitchen zone, L shaped -->
      <rect x="42" y="490" width="548" height="78" fill="#cfc7bb" stroke="#554e46" stroke-width="4"/>
      <rect x="42" y="405" width="82" height="163" fill="#cfc7bb" stroke="#554e46" stroke-width="4"/>
      <text x="220" y="538" font-family="Arial" font-size="24" font-weight="700" fill="#332f2b">CUCINA A L</text>
      <text x="170" y="568" font-family="Arial" font-size="16" fill="#555">profondità basi ≈ 0.60 m</text>

      <line x1="0" y1="466" x2="815" y2="466" stroke="#a8a39a" stroke-width="2" stroke-dasharray="9 8"/>
      <text x="605" y="458" font-family="Arial" font-size="16" fill="#777">kitchen zone</text>
    </g>
    <g transform="translate(1050 190)">
      <text x="0" y="0" font-family="Arial" font-size="22" font-weight="700" fill="#222">VINCOLI</text>
      ${["65 m² è l'intero appartamento: non ingrandire artificialmente la stanza.","Soffitto 2.70 m.","Tavolo e divano sono entrambi nella zona living.","Cucina distinta a sud, non accanto al divano.","Elemento 3 = mobile contenitivo.","Mobile TV = elemento separato sopra/nella composizione.","Colonna portante separata dai mobili.","Parquet: tavole e giunti chiaramente visibili.","No fisheye / no grandangolo estremo."].map((t,i)=>`<text x="0" y="${45+i*55}" font-family="Arial" font-size="18" fill="#444">• ${esc(t)}</text>`).join("")}
    </g>
  `, camera);
}

function bathroomBlueprint(camera: string) {
  return shell("Bagno / lavanderia · circa 3.37 × 1.65 m", `
    <g transform="translate(160 240)">
      <rect x="0" y="0" width="880" height="430" fill="#fff" stroke="#111" stroke-width="12"/>
      <rect x="18" y="24" width="375" height="172" fill="#d7e3e5" stroke="#4f656b" stroke-width="4"/>
      <text x="100" y="110" font-family="Arial" font-size="26" font-weight="700" fill="#30464d">DOCCIA</text>
      <text x="75" y="145" font-family="Arial" font-size="18" fill="#4a6269">≈ 0.66 × 1.46 m</text>
      <text x="38" y="225" font-family="Arial" font-size="17" fill="#555">solo porzione sinistra: NON a tutta parete</text>

      <ellipse cx="535" cy="150" rx="58" ry="38" fill="#eee" stroke="#555" stroke-width="3"/>
      <text x="505" y="155" font-family="Arial" font-size="18" fill="#333">WC</text>
      <ellipse cx="690" cy="150" rx="58" ry="38" fill="#eee" stroke="#555" stroke-width="3"/>
      <text x="650" y="155" font-family="Arial" font-size="18" fill="#333">BIDET</text>
      <rect x="470" y="295" width="245" height="72" rx="8" fill="#c8b497" stroke="#594e40" stroke-width="3"/>
      <text x="515" y="340" font-family="Arial" font-size="20" font-weight="700" fill="#332c24">LAVABO</text>

      <rect x="770" y="42" width="82" height="105" fill="#e6e6e4" stroke="#555" stroke-width="3"/>
      <rect x="770" y="152" width="82" height="105" fill="#e6e6e4" stroke="#555" stroke-width="3"/>
      <text x="752" y="288" font-family="Arial" font-size="16" fill="#444">washer + dryer</text>
      <line x1="744" y1="22" x2="744" y2="278" stroke="#7a624b" stroke-width="12"/>
      <text x="720" y="310" font-family="Arial" font-size="16" fill="#555">schermatura</text>
    </g>
    <g transform="translate(1120 260)">
      <text x="0" y="0" font-family="Arial" font-size="22" font-weight="700" fill="#222">VINCOLI</text>
      ${["Soffitto 2.70 m.","Bagno stretto e realistico: non ampliare la stanza.","Doccia solo a sinistra.","Lavatrice e asciugatrice impilate.","Colonna lavanderia schermata ai guest.","No fisheye / no grandangolo estremo."].map((t,i)=>`<text x="0" y="${45+i*58}" font-family="Arial" font-size="18" fill="#444">• ${esc(t)}</text>`).join("")}
    </g>
  `, camera);
}

function bedroomBlueprint(camera: string) {
  return shell("Camera matrimoniale · circa 3.37 × 3.39 m", `
    <g transform="translate(250 190)">
      <rect x="0" y="0" width="650" height="650" fill="#fff" stroke="#111" stroke-width="12"/>
      <rect x="185" y="275" width="280" height="330" fill="#ded8d0" stroke="#5c554d" stroke-width="4"/>
      <rect x="168" y="570" width="314" height="35" fill="#b6a38e"/>
      <text x="265" y="440" font-family="Arial" font-size="26" font-weight="700" fill="#333">LETTO</text>
      <rect x="88" y="520" width="70" height="70" fill="#c9baa8" stroke="#665b4f"/>
      <rect x="492" y="520" width="70" height="70" fill="#c9baa8" stroke="#665b4f"/>
      <text x="90" y="625" font-family="Arial" font-size="17" fill="#555">comodini</text>
      <path d="M650 120 h-70 v90" fill="none" stroke="#222" stroke-width="5"/>
      <text x="490" y="105" font-family="Arial" font-size="17" fill="#555">accesso / cabina</text>
    </g>
    <g transform="translate(1040 260)">
      <text x="0" y="0" font-family="Arial" font-size="22" font-weight="700" fill="#222">VINCOLI</text>
      ${["Dimensioni percepite ~3.37 × 3.39 m.","Soffitto 2.70 m.","Letto matrimoniale in scala reale.","Non trasformare la stanza in una suite ampia.","No fisheye / no grandangolo estremo."].map((t,i)=>`<text x="0" y="${45+i*58}" font-family="Arial" font-size="18" fill="#444">• ${esc(t)}</text>`).join("")}
    </g>
  `, camera);
}

function wardrobeBlueprint(camera: string) {
  return shell("Cabina armadio · circa 1.63 × 3.00 m", `
    <g transform="translate(330 200)">
      <rect x="0" y="0" width="390" height="620" fill="#fff" stroke="#111" stroke-width="12"/>
      <rect x="20" y="35" width="90" height="540" fill="#c7b9a8" stroke="#5e5245" stroke-width="3"/>
      <rect x="280" y="35" width="90" height="540" fill="#c7b9a8" stroke="#5e5245" stroke-width="3"/>
      <rect x="115" y="500" width="160" height="75" fill="#c7b9a8" stroke="#5e5245" stroke-width="3"/>
      <text x="142" y="280" font-family="Arial" font-size="24" font-weight="700" fill="#333" transform="rotate(90 142 280)">PASSAGGIO</text>
    </g>
    <g transform="translate(900 280)">
      <text x="0" y="0" font-family="Arial" font-size="22" font-weight="700" fill="#222">VINCOLI</text>
      ${["Spazio stretto: ~1.63 m di larghezza.","Armadiature su entrambi i lati e fondo.","Soffitto 2.70 m.","Non usare la sezione C'-C' come riferimento."].map((t,i)=>`<text x="0" y="${45+i*60}" font-family="Arial" font-size="18" fill="#444">• ${esc(t)}</text>`).join("")}
    </g>
  `, camera);
}

function circulationBlueprint(title: string, camera: string) {
  return shell(title, `
    <g transform="translate(280 220)">
      <rect x="0" y="0" width="480" height="560" fill="#fff" stroke="#111" stroke-width="12"/>
      <path d="M120 0 v190 h250 v160 h-170 v210" fill="none" stroke="#d1c7b8" stroke-width="100"/>
      <path d="M120 0 v190 h250 v160 h-170 v210" fill="none" stroke="#555" stroke-width="3" stroke-dasharray="12 8"/>
      <text x="90" y="300" font-family="Arial" font-size="24" font-weight="700" fill="#333">CIRCOLAZIONE</text>
    </g>
    <g transform="translate(900 300)"><text x="0" y="0" font-family="Arial" font-size="22" font-weight="700" fill="#222">VINCOLI</text><text x="0" y="55" font-family="Arial" font-size="18" fill="#444">• Soglie, porte e passaggi devono apparire in scala reale.</text><text x="0" y="110" font-family="Arial" font-size="18" fill="#444">• Soffitto 2.70 m; evitare grandangoli estremi.</text></g>
  `, camera);
}

export function buildRenderBlueprint(sceneId: string, cameraIntent: string) {
  if (sceneId.startsWith("living-")) return livingBlueprint(cameraIntent);
  if (sceneId.startsWith("bath-")) return bathroomBlueprint(cameraIntent);
  if (sceneId.startsWith("bedroom-")) return bedroomBlueprint(cameraIntent);
  if (sceneId.startsWith("wardrobe-")) return wardrobeBlueprint(cameraIntent);
  if (sceneId.startsWith("entry-")) return circulationBlueprint("Ingresso", cameraIntent);
  return circulationBlueprint("Disimpegno", cameraIntent);
}
