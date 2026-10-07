/* easura – App-Logik */
(function(){
"use strict";
let LANG="de";
try{const sl=localStorage.getItem("easura.lang");if(sl&&TX[sl])LANG=sl;else{const nl=(navigator.language||"de").slice(0,2).toLowerCase();if(TX[nl])LANG=nl;}}catch(e){}
function t(k,v){let s=(TX[LANG]&&TX[LANG][k]!=null)?TX[LANG][k]:(TX.de[k]!=null?TX.de[k]:k);if(v)for(const [a,b] of Object.entries(v))s=s.split("{"+a+"}").join(b);return s;}

function applyCatLang(){
  const tx=CAT_TX[LANG]||CAT_TX.de;
  CATS.forEach(c=>{const x=tx[c.key]||CAT_TX.de[c.key];
    c.name=x.name;c.sub=x.sub;c.agSub=x.agSub||null;c.what=x.what;c.tip=x.tip;
    const n=x.need;c.need=Array.isArray(n)?(p)=>(p[n[0]]?n[1]:n[2]):()=>n;});
  PROMOS.forEach(p=>{const x=(PROMO_TX[LANG]||PROMO_TX.de)[p.id];if(x){p.title=x[0];p.text=x[1];p.price=x[2];p.per=x[3];}});
}

const PDFJS = window.pdfjsLib || null;
if (PDFJS) PDFJS.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

/* ---------- icons ---------- */
const I = {
  kvg:'<path d="M12 21s-7-4.4-9-9.2C1.7 8.4 3.8 5 7.2 5c2 0 3.4 1 4.8 2.6C13.4 6 14.8 5 16.8 5c3.4 0 5.5 3.4 4.2 6.8C19 16.6 12 21 12 21z"/><path d="M12 10v5M9.5 12.5h5"/>',
  vvg:'<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M12 9v6M9 12h6"/>',
  haftpflicht:'<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  hausrat:'<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
  auto:'<path d="M5 16V12l2-5h10l2 5v4"/><path d="M3 16h18v2H3z"/><circle cx="7.5" cy="13" r="1"/><circle cx="16.5" cy="13" r="1"/><path d="M6 18v2M18 18v2"/>',
  rechtsschutz:'<path d="M12 4v16M7 20h10"/><path d="M5 8h14"/><path d="M5 8 3 13a2.5 2.5 0 0 0 4 0zM19 8l-2 5a2.5 2.5 0 0 0 4 0z"/>',
  reise:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  leben:'<path d="M12 21V11"/><path d="M12 11c0-4 3-7 7-7 0 4-3 7-7 7z"/><path d="M12 14c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z"/><path d="M8 21h8"/>',
  unfall:'<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="M10.5 10.5h.01M13.5 13.5h.01M10.5 13.5h.01M13.5 10.5h.01"/>',
  gebaeude:'<path d="M4 20V8l6-4 6 4v12"/><path d="M16 11h4v9"/><path d="M8 10h4M8 14h4M3 20h18"/>',
  tier:'<circle cx="7" cy="10" r="1.6"/><circle cx="11" cy="6.5" r="1.6"/><circle cx="15.5" cy="7" r="1.6"/><circle cx="18" cy="11" r="1.6"/><path d="M12.5 12c-2.5 0-5 3.5-5 5.5 0 1.6 1.5 2.5 3 2 1-.3 2-.3 3 0 1.5.5 3-.4 3-2 0-2-2.5-5.5-4-5.5z"/>',
  geraete:'<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>'
};
const svg = (k)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(I[k]||'')+'</svg>';
const CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

const LOGOS=window.EASURA_LOGOS||{};
/* ---------- categories ---------- */
const CATS = [
 {key:"kvg", name:"Krankenkasse", sub:"Grundversicherung (KVG)",
  rel:()=>"pflicht",
  what:"Zahlt Arztbesuche, Spital (allgemeine Abteilung) und Medikamente auf der offiziellen Liste. Die Leistungen sind bei allen Kassen gleich, nur die Prämie unterscheidet sich.",
  need:()=>"Ja. Für alle, die in der Schweiz wohnen, ist sie Pflicht, spätestens 3 Monate nach Zuzug oder Geburt.",
  tip:"Bis 25 zahlst du meist weniger. Eine höhere Franchise oder ein Hausarzt- bzw. Telmed-Modell senken die Prämie. Wechseln kannst du auf den 1. Januar, die Kündigung muss bis 30. November bei der Kasse sein.",
  kw:[["grundversicherung",3],["obligatorische krankenpflege",3],["\\bkvg\\b",3],["krankenpflegeversicherung",3],["hausarztmodell",2],["telmed",2],["\\bhmo\\b",1],["franchise",1],["assurance obligatoire des soins",3],["assicurazione obbligatoria delle cure",3]]},
 {key:"vvg", name:"Zusatzversicherung", sub:"Krankenkasse (VVG)",
  rel:()=>"optional",
  what:"Ergänzt die Grundversicherung, zum Beispiel für Zahnkorrekturen, Brillen, Komplementärmedizin, Fitness-Beiträge oder ein halbprivates Spitalzimmer.",
  need:()=>"Freiwillig. Lohnt sich, wenn du die Leistungen auch wirklich nutzt.",
  tip:"Hier darf dich die Kasse wegen Gesundheitsfragen ablehnen. Kündige die alte Zusatzversicherung deshalb erst, wenn die neue schriftlich bestätigt ist.",
  min:6,neg:/(keine|ohne|nicht abgeschlossen)[^.]{0,30}zusatzversicherung|zusatzversicherung(en)?[^.:]{0,25}:\s*(keine|nein|-)/,
  kw:[["zusatzversicherung",3],["\\bvvg\\b",1],["spitalversicherung",3],["spital halbprivat|halbprivat",3],["komplementärmedizin",2],["alternativmedizin",2],["assurance complémentaire",3],["assicurazione complementare",3]]},
 {key:"haftpflicht", name:"Privathaftpflicht", sub:"Schäden an anderen",
  rel:()=>"empfohlen",
  what:"Zahlt, wenn du aus Versehen jemand anderem einen Schaden machst. Zum Beispiel wenn dir das Handy einer Kollegin runterfällt oder deine Waschmaschine die Wohnung unter dir unter Wasser setzt.",
  need:()=>"Sehr empfohlen. Gesetzlich keine Pflicht, aber viele Vermieter verlangen sie, und Schäden an Personen können sehr teuer werden.",
  tip:"Kostet oft unter CHF 100 pro Jahr und lässt sich günstig mit der Hausrat kombinieren. Solange du bei deinen Eltern wohnst, bist du oft über ihre Police mitversichert, frag nach.",
  kw:[["privathaftpflicht",4],["privat-haftpflicht",4],["haftpflichtversicherung privat",4],["haftpflicht privat",3],["privathaftpflichtversicherung",4],["responsabilité civile privée",4],["responsabilita civile privata",4],["responsabilità civile privata",4]]},
 {key:"hausrat", name:"Hausrat", sub:"Deine Sachen zuhause",
  rel:(p)=>p.flat?"empfohlen":"optional",
  what:"Deckt deine Sachen, also Möbel, Laptop, Kleider oder Velo, bei Feuer, Wasser, Einbruch und Diebstahl.",
  need:(p)=>p.flat?"Empfohlen, sobald du eine eigene Wohnung oder ein WG-Zimmer hast. In einigen Kantonen ist die Feuerdeckung für Hausrat sogar Pflicht.":"Wohnst du noch bei deinen Eltern, sind deine Sachen meist über deren Hausrat versichert.",
  tip:"Schätze die Versicherungssumme realistisch, sonst gibt es bei Unterversicherung weniger Geld. Prüfe, ob «einfacher Diebstahl auswärts» (z.B. Velo, Laptop unterwegs) drin ist.",
  kw:[["hausrat",4],["mobiliarversicherung",2],["einfacher diebstahl",2],["assurance ménage",4],["inventaire du ménage",3],["economia domestica",4]]},
 {key:"auto", name:"Auto & Motorrad", sub:"Motorfahrzeugversicherung",
  rel:(p)=>p.car?"pflicht":"irrelevant",
  what:"Die Haftpflicht zahlt Schäden, die du anderen mit dem Fahrzeug machst. Teil- und Vollkasko decken Schäden am eigenen Fahrzeug.",
  need:()=>"Die Haftpflicht ist Pflicht, ohne sie gibt es keine Nummernschilder. Kasko ist freiwillig.",
  tip:"Junge Lenkerinnen und Lenker zahlen oft Zuschläge. Vollkasko lohnt sich vor allem bei neuen Fahrzeugen, bei Leasing ist sie meist Pflicht.",
  kw:[["motorfahrzeug",3],["autoversicherung",4],["fahrzeugversicherung",4],["teilkasko",3],["vollkasko",3],["kollisionskasko",3],["kontrollschild",3],["stammnummer",2],["fahrgestell",2],["motorradversicherung",4],["véhicule à moteur",3],["casco",2]]},
 {key:"rechtsschutz", name:"Rechtsschutz", sub:"Anwalt & Gericht",
  rel:()=>"optional",
  what:"Übernimmt Anwalts- und Gerichtskosten bei Streit, zum Beispiel mit dem Vermieter, dem Arbeitgeber oder nach einem Online-Kauf.",
  need:()=>"Freiwillig. Praktisch, wenn du mietest oder angestellt bist und einen Streit nicht selbst finanzieren möchtest.",
  tip:"Es gibt Privat- und Verkehrsrechtsschutz. Achte darauf, welche Rechtsgebiete eingeschlossen sind.",
  kw:[["rechtsschutz",4],["protection juridique",4],["protezione giuridica",4]]},
 {key:"reise", name:"Reiseversicherung", sub:"Annullierung & Assistance",
  rel:()=>"optional",
  what:"Zahlt, wenn du wegen Krankheit nicht verreisen kannst (Annullierungskosten), und hilft im Notfall im Ausland, zum Beispiel mit einem Rücktransport.",
  need:()=>"Freiwillig. Prüfe vorher, ob deine Kreditkarte oder Zusatzversicherung das schon abdeckt.",
  tip:"Die Grundversicherung zahlt im Ausland nur Notfälle und höchstens das Doppelte der Kosten in der Schweiz. Für Reisen in die USA lohnt sich eine zusätzliche Deckung.",
  kw:[["reiseversicherung",4],["annullierungskosten",3],["annullationskosten",3],["reiseassistance",3],["personen-assistance",3],["assistance voyage",3],["frais d'annulation",3],["\\betivoyage|livret eti|\\beti\\b",2]]},
 {key:"leben", name:"Leben & Säule 3a", sub:"Vorsorge",
  rel:()=>"optional",
  what:"Sichert Angehörige finanziell ab, wenn dir etwas passiert, oder hilft beim Sparen fürs Alter. Die Säule 3a gibt dir dabei einen Steuerabzug.",
  need:()=>"Für die meisten jungen Leute ohne Kinder oder Hypothek keine Pflicht. Die Säule 3a geht auch als Bankkonto oder mit Fonds, das ist oft flexibler als eine Versicherungslösung.",
  tip:"Eine 3a-Versicherung bindet dich über viele Jahre. Wer früh aussteigt, verliert oft Geld. Lass dir den Rückkaufswert zeigen.",
  kw:[["lebensversicherung",4],["todesfallkapital",3],["todesfallrisiko",3],["säule 3a",4],["saeule 3a",4],["gebundene vorsorge",4],["erwerbsunfähigkeit",2],["rückkaufswert",2],["assurance vie",4],["pilier 3a",4],["assicurazione sulla vita",4]]},
 {key:"unfall", name:"Unfallversicherung", sub:"UVG, z.B. Suva", agSub:"Über deinen Arbeitgeber (UVG, z.B. Suva)",
  rel:(p)=>p.work?"ag":"empfohlen",
  what:"Zahlt Heilungskosten und Lohnausfall nach einem Unfall.",
  need:(p)=>p.work?"Arbeitest du mindestens 8 Stunden pro Woche beim selben Arbeitgeber, bist du über ihn obligatorisch nach UVG versichert, auch in der Freizeit. Je nach Branche läuft das über die Suva oder eine private Versicherung, das steht auf deiner Lohnabrechnung oder im Arbeitsvertrag.":"Studierst du oder arbeitest du weniger als 8 Stunden pro Woche, muss die Unfalldeckung in deiner Krankenkasse eingeschlossen sein.",
  tip:"Bist du über den Arbeitgeber versichert, kannst du die Unfalldeckung in der Krankenkasse ausschliessen und sparst Prämie.",
  kw:[["unfallversicherung",4],["\\buvg\\b",3],["\\bsuva\\b",3],["nichtberufsunfall",3],["unfalldeckung",2],["assurance accidents",4]]},
 {key:"gebaeude", name:"Gebäudeversicherung", sub:"Haus oder Wohnung selbst",
  rel:(p)=>p.owner?"pflicht":"irrelevant",
  what:"Deckt Schäden am Gebäude selbst, etwa durch Feuer, Sturm oder Hochwasser.",
  need:()=>"Für Eigentümer in den meisten Kantonen Pflicht, oft über die kantonale Gebäudeversicherung. Als Mieterin oder Mieter brauchst du sie nicht.",
  tip:"Bei Stockwerkeigentum läuft sie meist über die Eigentümergemeinschaft.",
  kw:[["gebäudeversicherung",4],["gebaeudeversicherung",4],["elementarschaden",2],["versicherungswert des gebäudes",3],["assurance bâtiment",4],["assurance immobilière",3]]},
 {key:"tier", name:"Tierversicherung", sub:"Tierarztkosten",
  rel:(p)=>p.pet?"optional":"irrelevant",
  what:"Zahlt Tierarztkosten, wenn dein Haustier krank wird oder einen Unfall hat.",
  need:()=>"Freiwillig. Tierarztrechnungen können aber schnell mehrere tausend Franken kosten.",
  tip:"Für Hunde verlangen einige Kantone eine Haftpflichtversicherung. Prüfe, ob deine Privathaftpflicht dein Tier einschliesst.",
  kw:[["tierversicherung",4],["tierkrankenversicherung",4],["tierarzt",2],["hundeversicherung",4],["katzenversicherung",4],["assurance animaux",4]]},
 {key:"geraete", name:"Handy & Elektronik", sub:"Geräteversicherung",
  rel:()=>"optional",
  what:"Deckt Display-Bruch, Wasserschaden oder Diebstahl von Handy, Laptop und Co.",
  need:()=>"Freiwillig und im Verhältnis zum Gerätewert oft teuer.",
  tip:"Diebstahl ist manchmal schon über die Hausrat (einfacher Diebstahl auswärts) gedeckt.",
  kw:[["geräteversicherung",4],["handyversicherung",4],["smartphone-versicherung",4],["elektronikversicherung",4],["displaybruch",3],["bildschirmbruch",3]]}
];
const CAT = Object.fromEntries(CATS.map(c=>[c.key,c]));

/* ---------- insurers ---------- */
const HEALTH = "health";
const INSURERS = [
 ["CSS",["\\bcss\\b","css versicherung","css kranken"],HEALTH],["Helsana",["helsana"],HEALTH],["SWICA",["swica"],HEALTH],
 ["Sanitas",["sanitas"],HEALTH],["Concordia",["concordia"],HEALTH],["Visana",["visana"],HEALTH],
 ["Groupe Mutuel",["groupe mutuel","groupemutuel"],HEALTH],["Assura",["\\bassura\\b"],HEALTH],["KPT",["\\bkpt\\b"],HEALTH],
 ["Atupri",["atupri"],HEALTH],["Sympany",["sympany","vivao"],HEALTH],["ÖKK",["\\bökk\\b","\\boekk\\b"],HEALTH],
 ["EGK",["\\begk\\b"],HEALTH],["Aquilana",["aquilana"],HEALTH],["Agrisano",["agrisano"],HEALTH],["Galenos",["galenos"],HEALTH],
 ["Sumiswalder",["sumiswalder"],HEALTH],["Rhenusana",["rhenusana"],HEALTH],["Easy Sana",["easy ?sana"],HEALTH],
 ["Arcosana",["arcosana"],HEALTH],["Intras",["intras"],HEALTH],["Vita Surselva",["vita surselva"],HEALTH],["sodalis",["sodalis"],HEALTH],
 ["Suva",["\\bsuva\\b"]],["Die Mobiliar",["mobiliar","mobilière","mobiliare"]],["AXA",["\\baxa\\b"]],["Zurich",["zurich versicherung","zurich insurance","zurich lebensversicherung","zurich\\.ch","zürich versicherung"]],
 ["Allianz Travel",["allianz travel","allianz partners"]],["Allianz Suisse",["allianz suisse","allianz versicherung","\\ballianz\\b"]],
 ["Generali",["generali"]],["Baloise",["baloise","bâloise","basler versicherung"]],["Helvetia",["helvetia"]],
 ["Vaudoise",["vaudoise"]],["Smile",["smile\\.direct","smile versicherung","smile insurance"]],["TCS",["\\btcs\\b","touring club"]],
 ["Emmental Versicherung",["emmental versicherung"]],["Appenzeller Versicherungen",["appenzeller versicherung"]],
 ["Swiss Life",["swiss ?life"]],["Pax",["\\bpax\\b"]],["ERV",["europäische reiseversicherung","\\berv\\b"]],
 ["Coop Rechtsschutz",["coop rechtsschutz","coop protection juridique"]],["Protekta",["protekta"]],["Dextra",["dextra"]],
 ["CAP Rechtsschutz",["cap rechtsschutz","cap protection juridique"]],["Orion",["orion rechtsschutz","orion protection"]],
 ["AXA-ARAG",["axa-arag","axa arag"]],["Animalia",["animalia"]],["Epona",["epona"]],["Simpego",["simpego"]],["wefox",["wefox"]],
 ["Gebäudeversicherung Bern (GVB)",["\\bgvb\\b","gebäudeversicherung bern"]],["Gebäudeversicherung Kanton Zürich (GVZ)",["\\bgvz\\b","gebäudeversicherung kanton zürich"]],
 ["Aargauische Gebäudeversicherung",["aargauische gebäudeversicherung"]],["Gebäudeversicherung Luzern",["gebäudeversicherung luzern"]],
 ["Gebäudeversicherung St. Gallen",["gebäudeversicherung st\\. ?gallen"]],
 ["Sanagate",["sanagate"],HEALTH],["Philos",["\\bphilos\\b"],HEALTH],["Supra-1846",["supra-1846","\\bsupra\\b"],HEALTH],
 ["HDI",["\\bhdi\\b"]],["Chubb",["\\bchubb\\b"]],["Nationale Suisse",["nationale suisse"]],
 ["UBS",["\\bubs\\b"],"bank"],["Credit Suisse",["credit suisse"],"bank"],["PostFinance",["postfinance"],"bank"],["ZKB",["zürcher kantonalbank","\\bzkb\\b"],"bank"],
 ["Raiffeisen",["raiffeisen"],"bank"],["Migros Bank",["migros ?bank"],"bank"],["Cembra",["cembra"],"bank"],["BCV",["\\bbcv\\b","banque cantonale vaudoise"],"bank"],
 ["BCGE",["\\bbcge\\b","banque cantonale de genève"],"bank"],["Baloise Bank",["baloise bank"],"bank"],["WIR Bank",["wir bank"],"bank"],
 ["Hypothekarbank Lenzburg",["hypothekarbank lenzburg"],"bank"],["Clientis",["clientis"],"bank"],["Luzerner KB",["luzerner kantonalbank","\\blukb\\b"],"bank"],
 ["St.Galler KB",["st\\.? ?galler kantonalbank","\\bsgkb\\b"],"bank"],["BEKB",["berner kantonalbank","\\bbekb\\b"],"bank"],["AEK Bank",["aek bank"],"bank"],
 ["Thurgauer KB",["thurgauer kantonalbank","\\btkb\\b"],"bank"],["Schaffhauser KB",["schaffhauser kantonalbank","\\bshkb\\b"],"bank"],
 ["Appenzeller KB",["appenzeller kantonalbank","\\bappkb\\b"],"bank"],["Graubündner KB",["graubündner kantonalbank","\\bgkb\\b"],"bank"],
 ["Nidwaldner KB",["nidwaldner kantonalbank","\\bnkb\\b"],"bank"],["Obwaldner KB",["obwaldner kantonalbank","\\bokb\\b"],"bank"],
 ["Solothurner KB",["solothurner kantonalbank"],"bank"],["Urner KB",["urner kantonalbank"],"bank"],["Zuger KB",["zuger kantonalbank"],"bank"],
 ["Valiant",["valiant"],"bank"],["Bank Cler",["bank cler"],"bank"],["Cornèr Bank",["cornèr","corner bank"],"bank"],["Julius Bär",["julius b(ä|ae)r"],"bank"],
 ["Pictet",["pictet"],"bank"],["Rothschild & Co",["rothschild"],"bank"],["Syz Bank",["\\bsyz\\b"],"bank"],["Vontobel",["vontobel"],"bank"],
 ["Mirabaud",["mirabaud"],"bank"],["LGT",["\\blgt\\b"],"bank"],["EFG International",["efg international","\\befg bank"],"bank"],["BCI",["\\bbci\\b"],"bank"],["Reyl",["\\breyl\\b"],"bank"]
].map(([name,pats,kind])=>({name,kind:kind||"",re:pats.map(p=>new RegExp(p,"gi"))}));

/* ---------- state ---------- */
const KEY="easynow.v1";
const today=()=>new Date().toISOString().slice(0,10);
const EXAMPLES=[
 {id:"ex1",cats:["kvg"],insurer:"CSS",policyNo:"Beispiel",premium:312.4,period:"Monat",validUntil:null,source:"beispiel",fileName:"Versicherungsausweis.pdf",summary:"Grundversicherung mit Franchise CHF 2500 und Hausarztmodell."},
 {id:"ex2",cats:["hausrat","haftpflicht"],insurer:"Die Mobiliar",policyNo:"Beispiel",premium:289,period:"Jahr",validUntil:null,source:"beispiel",fileName:"Police_Hausrat.pdf",summary:"Kombi-Police: deine Sachen zuhause und Schäden, die du anderen verursachst."},
 {id:"ex3",cats:["rechtsschutz"],insurer:"Coop Rechtsschutz",policyNo:"Beispiel",premium:180,period:"Jahr",validUntil:"2026-06-30",source:"beispiel",fileName:"Rechtsschutz_2025.pdf",summary:"Privat- und Verkehrsrechtsschutz, Vertrag ausgelaufen."}
];
let S={policies:EXAMPLES.slice(),profile:{flat:true,car:false,work:true,pet:false,owner:false},examples:true,user:null,offers:{}};
try{const raw=localStorage.getItem(KEY);if(raw){const v=JSON.parse(raw);if(v&&Array.isArray(v.policies))S=Object.assign(S,v);}}catch(e){}
(function cleanup(){const seen=new Map();const out=[];
  for(const p of S.policies){const k=(p.source==="beispiel"?"b":"")+String(p.insurer||"").toLowerCase()+"|"+(p.policyNo||"")+"|"+p.cats.slice().sort().join()+"|"+(p.fileName||"");
    if(seen.has(k)){out[seen.get(k)]=p;}else{seen.set(k,out.length);out.push(p);}}
  S.policies=out;})();
if(!S.offers||typeof S.offers!=="object")S.offers={};
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=(s)=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const chf=(n)=>"CHF "+Number(n).toLocaleString("de-CH",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});
const dmy=(iso)=>iso?iso.split("-").reverse().join("."):"";

function addPolicy(p){
  if(S.examples){S.policies=S.policies.filter(x=>x.source!=="beispiel");S.examples=false;}
  const norm=(x)=>String(x||"").toLowerCase().replace(/\s+/g,"");
  const same=S.policies.find(x=>x.source!=="beispiel"&&(
    (p.fileKey&&x.fileKey===p.fileKey)||
    (p.policyNo&&x.policyNo&&norm(x.policyNo)===norm(p.policyNo))||
    (norm(x.insurer)===norm(p.insurer)&&x.cats.slice().sort().join()===p.cats.slice().sort().join())));
  if(same){p.id=same.id;S.policies=S.policies.map(x=>x===same?p:x);}
  else S.policies.push(p);
  applyCats(p.cats);save();render();
}
function applyCats(cats){
  if(cats.includes("auto"))S.profile.car=true;
  if(cats.includes("tier"))S.profile.pet=true;
  if(cats.includes("gebaeude"))S.profile.owner=true;
  if(cats.includes("hausrat"))S.profile.flat=true;
}

/* ---------- status ---------- */
const isActive=(p)=>!p.validUntil||p.validUntil>=today();
function statusOf(c){
  const ps=S.policies.filter(p=>p.cats.includes(c.key));
  const rel=c.rel(S.profile);
  if(ps.some(isActive))return {s:"aktiv",label:t("st_aktiv"),ps,rel};
  if(ps.length)return {s:"abgelaufen",label:t("st_abgelaufen"),ps,rel};
  if(rel==="ag")return {s:"ag",label:t("st_ag"),ps,rel};
  if(rel==="pflicht")return {s:"fehlt",label:t("st_pflicht"),ps,rel};
  if(rel==="empfohlen")return {s:"fehlt",label:t("st_empf"),ps,rel};
  if(rel==="irrelevant")return {s:"irrelevant",label:"",ps,rel};
  return {s:"optional",label:t("st_none"),ps,rel};
}

/* ---------- render ---------- */
const PROFILE=[["flat","pr_flat"],["work","pr_work"],["car","pr_car"],["pet","pr_pet"],["owner","pr_owner"]];
const TICK='<svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
function renderChips(){
  const el=document.getElementById("chips");el.innerHTML="";
  PROFILE.forEach(([k,l])=>{
    const b=document.createElement("button");b.type="button";b.className="chip";b.id="chip-"+k;
    b.setAttribute("aria-pressed",S.profile[k]?"true":"false");
    b.innerHTML=(S.profile[k]?TICK:"")+esc(t(l));
    b.onclick=()=>{S.profile[k]=!S.profile[k];save();render();};
    el.appendChild(b);
  });
}
function policyCard(p,catKey){
  const act=isActive(p);
  const srcL=p.source?t("src_"+p.source):"";const isEx=p.source==="beispiel";
  let kv="";
  kv+=`<div><span>${esc(t("policy_no"))}</span>${esc(isEx?t("example"):(p.policyNo||"–"))}</div>`;
  kv+=`<div><span>${esc(t("premium"))}</span><span class="num" style="color:var(--ink);font-size:13.5px">${p.premium?esc(chf(p.premium))+" / "+esc(t("per_"+(p.period||"Jahr"))):"–"}</span></div>`;
  kv+=`<div><span>${esc(t("valid"))}</span>${p.validUntil?esc(dmy(p.validUntil))+(act?"":esc(t("expired_paren"))):esc(t("running"))}</div>`;
  if(p.cats.length>1)kv+=`<div><span>${esc(t("covers_also"))}</span>${esc(p.cats.map(k=>CAT[k]?CAT[k].name:k).join(", "))}</div>`;
  return `<div class="pol"><div class="pol-h"><span class="insname">${badge(p.insurer)}<b>${esc(p.insurer||t("unknown_ins"))}</b></span><span class="src">${esc(srcL)}</span></div>
    ${(isEx?t("ex_"+p.id):p.summary)?`<p class="sum">${esc(isEx?t("ex_"+p.id):p.summary)}</p>`:""}
    <div class="kv">${kv}</div>
    <div style="display:flex;gap:16px;flex-wrap:wrap">${p.fileName?`<span class="muted" style="font-size:12.5px">${esc(t("source",{f:p.fileName}))}</span>`:""}
    ${p.cats.length>1&&catKey?`<button class="linkbtn" type="button" data-uncat="${esc(p.id)}" data-cat="${esc(catKey)}">${esc(t("not_included",{c:CAT[catKey].name}))}</button>`:""}
    <button class="linkbtn danger" type="button" data-del="${esc(p.id)}">${esc(t("remove_policy"))}</button></div></div>`;
}
const BPAL=[["#1D63E8","#4FA3F7"],["#0F8A6A","#3FD3A0"],["#C2410C","#F59E52"],["#6D28D9","#A78BFA"],["#0E7490","#38BDF8"],["#B91C1C","#F87171"],["#4D7C0F","#A3E635"],["#9D174D","#F472B6"],["#1E3A8A","#60A5FA"],["#A16207","#FACC15"]];
const SHAPES=[
 (a,b)=>`<rect x="1" y="1" width="30" height="30" rx="9" fill="${a}"/><circle cx="25" cy="7" r="9" fill="${b}" opacity=".55"/>`,
 (a,b)=>`<circle cx="16" cy="16" r="15" fill="${a}"/><circle cx="23" cy="22" r="9" fill="${b}" opacity=".6"/>`,
 (a,b)=>`<path d="M16 1 31 16 16 31 1 16Z" fill="${a}"/><path d="M16 1 31 16H16Z" fill="${b}" opacity=".55"/>`,
 (a,b)=>`<path d="M16 1 29 8.5v15L16 31 3 23.5v-15Z" fill="${a}"/><path d="M16 1 29 8.5 16 16Z" fill="${b}" opacity=".6"/>`,
 (a,b)=>`<rect x="1" y="1" width="30" height="30" rx="9" fill="${a}"/><path d="M1 22 31 10v12a9 9 0 0 1-9 9H10a9 9 0 0 1-9-9Z" fill="${b}" opacity=".5"/>`,
 (a,b)=>`<path d="M16 1c8 0 15 3 15 3v11c0 8-7 14-15 16C8 29 1 23 1 15V4s7-3 15-3Z" fill="${a}"/><path d="M16 1c8 0 15 3 15 3v11c0 3-1 6-3 8L16 1Z" fill="${b}" opacity=".5"/>`,
 (a,b)=>`<rect x="1" y="1" width="30" height="30" rx="15" fill="${a}"/><rect x="1" y="1" width="15" height="30" rx="7.5" fill="${b}" opacity=".45"/>`,
 (a,b)=>`<rect x="1" y="1" width="30" height="30" rx="7" fill="${a}"/><circle cx="7" cy="25" r="10" fill="${b}" opacity=".5"/><circle cx="27" cy="5" r="6" fill="${b}" opacity=".35"/>`
];
function initials(name){
  const words=String(name).replace(/\(.*?\)/g,"").split(/[\s-]+/).filter(w=>w&&!/^(die|der|das|la|le)$/i.test(w));
  const w0=words[0]||"?";
  if(/^[A-ZÄÖÜ]{2,4}$/.test(w0))return w0.slice(0,2);
  return (words.length>1?w0[0]+words[1][0]:w0.slice(0,2)).toUpperCase();
}
function logoFor(name){
  if(!name)return null;
  if(LOGOS[name])return LOGOS[name];
  const t=String(name).toLowerCase();
  for(const ins of INSURERS){if(LOGOS[ins.name]&&ins.re.some(r=>{r.lastIndex=0;return r.test(t);}))return LOGOS[ins.name];}
  return null;
}
function badge(name,sm){
  if(!name)return "";
  const lg=logoFor(name);
  if(lg)return `<img class="ibadge logo-img${sm?" sm":""}" src="${lg}" alt="">`;
  let h=0;for(const c of String(name))h=(h*31+c.charCodeAt(0))>>>0;
  const [a,b]=BPAL[h%BPAL.length], shape=SHAPES[(h>>>4)%SHAPES.length];
  const ini=initials(name);
  return `<svg class="ibadge${sm?" sm":""}" viewBox="0 0 32 32" aria-hidden="true">${shape(a,b)}<text x="16" y="16.5" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="Outfit,system-ui,sans-serif" font-weight="700" font-size="${ini.length>1?12.5:15}">${esc(ini)}</text></svg>`;
}
const openSet=new Set();
function offerOK(st){return st.s!=="ag"&&st.s!=="irrelevant";}
function offerSwitch(c,st){
  const on=!!S.offers[c.key];
  const why=st.s==="aktiv"?t("offer_aktiv"):st.s==="abgelaufen"?t("offer_abgelaufen"):t("offer_other");
  return `<div class="offer"><div class="offer-t"><b>${esc(t("offer_title"))}</b><span>${esc(why)}</span></div>
    <button type="button" class="switch" role="switch" aria-checked="${on}" data-offer="${c.key}" aria-label="${esc(t("offer_title"))}: ${esc(c.name)}">
      <span class="sw-no">${esc(t("no"))}</span><span class="sw-yes">${esc(t("yes"))}</span><span class="knob" aria-hidden="true"></span></button></div>`;
}
function row(c0,st){
  let c=c0;
  const UNK=t("unknown");const names=[...new Set(st.ps.map(p=>p.insurer||UNK))];
  if(!st.ps.length&&st.s==="ag"&&c.agSub)c={...c,sub:c.agSub};
  const ins=st.ps.length?'<span class="subline">'+names.map(n=>'<span>'+badge(n===UNK?"":n,true)+esc(n)+'</span>').join("")+'</span>':esc(c.sub);
  const pill=`<span class="pill p-${st.s}">${esc(st.label)}</span>`;
  return `<details class="ins st-${st.s}" data-k="${c.key}"${openSet.has(c.key)?" open":""}><summary>
    <span class="ico s-${st.s}">${svg(c.key)}</span>
    <span class="t"><b>${esc(c.name)}</b><span class="sub">${ins}</span>${offerOK(st)&&S.offers[c.key]?'<span class="offer-tag">'+esc(t("offer_title"))+'</span>':""}</span>${pill}${CHEV}</summary>
    <div class="body">${offerOK(st)?offerSwitch(c,st):""}${st.ps.map(p=>policyCard(p,c.key)).join("")}
      <div class="info"><div><h3>${esc(t("what_h"))}</h3><p>${esc(c.what)}</p></div>
      <div><h3>${esc(t("need_h"))}</h3><p>${esc(c.need(S.profile))}</p></div>
      <div class="tip"><b>${esc(t("tip"))}</b> ${esc(c.tip)}</div></div>
    </div></details>`;
}
function render(){
  renderChips();
  const rows=CATS.map(c=>({c,st:statusOf(c)}));
  const groups=[
    [t("g_ok"),rows.filter(r=>r.st.s==="aktiv"||r.st.s==="ag"),"grp-ok"],
    [t("g_open"),rows.filter(r=>r.st.s==="fehlt"||r.st.s==="abgelaufen"),"grp-open"],
    [t("g_opt"),rows.filter(r=>r.st.s==="optional"),"grp-opt"]
  ];
  const irr=rows.filter(r=>r.st.s==="irrelevant");
  let h="";
  groups.forEach(([l,rs,gid])=>{if(rs.length)h+=`<div class="group-label" id="${gid}">${esc(l)}</div>`+rs.map(r=>row(r.c,r.st)).join("");});
  if(irr.length)h+=`<div class="irrel">${esc(t("irrel",{l:irr.map(r=>r.c.name).join(", ")}))}</div>`;
  const list=document.getElementById("list");list.innerHTML=h;
  list.querySelectorAll("details.ins").forEach(d=>d.addEventListener("toggle",()=>{d.open?openSet.add(d.dataset.k):openSet.delete(d.dataset.k)}));
  list.querySelectorAll("[data-del]").forEach(b=>b.onclick=(e)=>{e.preventDefault();removePolicy(b.dataset.del);});
  list.querySelectorAll("[data-offer]").forEach(b=>b.onclick=(e)=>{e.preventDefault();
    const k=b.dataset.offer;S.offers[k]=!S.offers[k];save();render();
    const nb=document.querySelector(`[data-offer="${k}"]`);if(nb)nb.focus();
    toast(t(S.offers[k]?"offer_on":"offer_off",{c:CAT[k].name}));});
  list.querySelectorAll("[data-uncat]").forEach(b=>b.onclick=(e)=>{e.preventDefault();
    const p=S.policies.find(x=>x.id===b.dataset.uncat);if(!p)return;
    p.cats=p.cats.filter(k=>k!==b.dataset.cat);save();render();toast(t("cat_removed",{c:CAT[b.dataset.cat].name}));});

  // stats
  const active=S.policies.filter(isActive);
  const yearly=active.reduce((a,p)=>a+(p.premium?(p.period==="Monat"?p.premium*12:p.premium):0),0);
  const nAct=rows.filter(r=>r.st.s==="aktiv").length;
  document.getElementById("st-active").textContent=String(nAct);
  document.querySelector(".kpi.good .kpi-l").textContent=t(nAct===1?"act_one":"act_many");
  document.getElementById("st-premium").textContent=yearly?chf(Math.round(yearly)):"CHF 0";
  document.getElementById("st-month").textContent=yearly?chf(Math.round(yearly/12)):"–";
  document.getElementById("st-open").textContent=String(groups[1][1].length);
  document.querySelector(".kpi.bad").classList.toggle("zero",groups[1][1].length===0);
  const nOpen=groups[1][1].length;
  document.querySelector(".kpi.bad .kpi-l").textContent=t(nOpen===0?"open_zero":nOpen===1?"open_one":"open_many");
  renderMe();
  if(typeof promoOrder!=="undefined"&&document.getElementById("promo-track").childElementCount)renderPromo();
  const imp=rows.filter(r=>["pflicht","empfohlen","ag"].includes(r.st.rel));
  const cov=imp.filter(r=>r.st.s==="aktiv"||r.st.s==="ag").length;
  const C=2*Math.PI*50, frac=imp.length?cov/imp.length:0;
  document.getElementById("ring-arc").setAttribute("stroke-dasharray",(C*frac).toFixed(1)+" "+C.toFixed(1));
  document.getElementById("ring-num").textContent=cov+"/"+imp.length;
  document.getElementById("ring").setAttribute("aria-label",t("ring_aria",{a:cov,b:imp.length}));
  document.getElementById("banner").hidden=!S.examples;
  document.getElementById("reset").hidden=S.examples||!S.policies.length;
}
let pendingDelete=null;
function removePolicy(id){
  const p=S.policies.find(x=>x.id===id);if(!p)return;
  S.policies=S.policies.filter(x=>x.id!==id);
  if(p.source==="beispiel"&&!S.policies.some(x=>x.source==="beispiel"))S.examples=false;
  save();render();
  pendingDelete=p;toast(t("removed",{x:p.insurer||t("policy")}),t("undo"),()=>{if(pendingDelete){S.policies.push(pendingDelete);pendingDelete=null;save();render();}});
}
let toastT;
function toast(msg,actLabel,act){
  const t=document.getElementById("toast");t.innerHTML=esc(msg);
  if(actLabel){const b=document.createElement("button");b.type="button";b.className="linkbtn";b.style.cssText="margin-left:12px;color:var(--mint)";b.textContent=actLabel;b.onclick=()=>{act();t.hidden=true;};t.appendChild(b);}
  t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},5000);
}

/* ---------- local detection ---------- */
function norm(t){return t.toLowerCase().replace(/ /g," ").replace(/[ \t]+/g," ");}
function detectLocal(text){
  const t=norm(text);
  // insurer: most mentions wins
  let best=null,bestN=0;
  const scan=(list)=>list.forEach(ins=>{let n=0;ins.re.forEach(r=>{r.lastIndex=0;const m=t.match(r);if(m)n+=m.length;});if(n>bestN){bestN=n;best=ins;}});
  scan(INSURERS.filter(i=>i.kind!=="bank"));
  if(!best)scan(INSURERS.filter(i=>i.kind==="bank"));
  const cats=[];
  CATS.forEach(c=>{let s=0;c.kw.forEach(([p,w])=>{if(new RegExp(p,"i").test(t))s+=w;});if(s>=(c.min||3)&&!(c.neg&&c.neg.test(t)))cats.push(c.key);});
  // a health insurer + "krankenversicherung"/"versicherungsausweis" without other hints -> basic insurance
  if(best&&best.kind===HEALTH&&!cats.includes("kvg")&&/(krankenversicherung|versicherungsausweis|versichertenkarte|krankenkasse)/.test(t)&&!cats.includes("vvg"))cats.push("kvg");
  // health documents often mention supplementary products in the fine print: keep VVG only if one is priced
  if(cats.includes("kvg")&&cats.includes("vvg")&&!/(zusatz|spital|halbprivat|privat|komplementär|alternativ|ambulant|zahn|brille)[^.]{0,60}(chf|fr\.)\s*\d/.test(t))cats.splice(cats.indexOf("vvg"),1);
  // a health-insurance document mentions accident cover inside KVG; that is not a separate accident insurance
  if(cats.includes("kvg")&&cats.includes("unfall")&&!/suva|unfallversicherung nach uvg|uvg-police/.test(t))cats.splice(cats.indexOf("unfall"),1);
  // auto-policies mention "haftpflicht" too: keep privathaftpflicht only with explicit wording (handled by keywords)
  let premium=null,period=null;
  const pm=t.match(/(jahresprämie|monatsprämie|prämie|total prämie|zu bezahlen|betrag)[^0-9]{0,40}?(?:chf|fr\.)\s*([0-9][0-9'’ ]*(?:[.,][0-9]{2})?)/);
  if(pm){premium=parseFloat(pm[2].replace(/['’ ]/g,"").replace(",","."));
    const ctx=t.slice(Math.max(0,pm.index-30),pm.index+pm[0].length+40);
    period=/monat|mensuel/.test(pm[1]+ctx)?"Monat":"Jahr";
    if(!(premium>0&&premium<100000)){premium=null;period=null;}}
  let validUntil=null;
  const dm=t.match(/(?:gültig bis|ablauf(?:datum)?|vertragsende|vertragsablauf|läuft bis|dauer bis|versicherungsdauer[^0-9]{0,40}?bis|bis und mit)[^0-9]{0,25}(\d{1,2})\.(\d{1,2})\.(\d{4})/)
        ||t.match(/vom\s*\d{1,2}\.\d{1,2}\.\d{4}\s*(?:bis|-|–)\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if(dm){const d=dm[1].padStart(2,"0"),m=dm[2].padStart(2,"0"),y=dm[3];if(+m>=1&&+m<=12&&+d>=1&&+d<=31)validUntil=`${y}-${m}-${d}`;}
  let policyNo=null;
  const pn=text.match(/(?:Police(?:n)?[\s-]*(?:Nr\.?|Nummer)|Vertrags[\s-]*(?:Nr\.?|nummer)|Versicherten[\s-]*(?:Nr\.?|nummer)|N° de police)\s*:?\s*([A-Z0-9][A-Z0-9.\-\/]{3,24})/i);
  if(pn)policyNo=pn[1];
  return {insurer:best?best.name:null,cats,premium,period,validUntil,policyNo};
}
function localSummary(cats){
  if(!cats.length)return "";
  return t("recognized_as",{l:cats.map(k=>CAT[k].name).join(t("and"))});
}

/* ---------- PDF ---------- */
async function readPdf(file){
  if(!PDFJS)throw new Error("pdf");
  const buf=await file.arrayBuffer();
  const doc=await PDFJS.getDocument({data:buf}).promise;
  let text="";const n=Math.min(doc.numPages,6);
  for(let i=1;i<=n;i++){const pg=await doc.getPage(i);const tc=await pg.getTextContent();text+=tc.items.map(it=>it.str).join(" ")+"\n";}
  return {doc,text};
}
async function pdfToImages(doc,max){
  const out=[];
  for(let i=1;i<=Math.min(doc.numPages,max);i++){
    const pg=await doc.getPage(i);const v0=pg.getViewport({scale:1});const sc=Math.min(2.2,1500/v0.width);
    const v=pg.getViewport({scale:sc});const cv=document.createElement("canvas");cv.width=v.width;cv.height=v.height;
    await pg.render({canvasContext:cv.getContext("2d"),viewport:v}).promise;
    out.push(await new Promise(r=>cv.toBlob(r,"image/jpeg",0.85)));
  }
  return out.filter(Boolean);
}

/* ---------- OCR (Tesseract.js, runs in the browser) ---------- */
let ocrWorker=null,ocrBroken=false,ocrProgress=null;
async function getOcr(){
  if(ocrBroken||!window.Tesseract)throw new Error("ocr-unavailable");
  if(!ocrWorker){
    const opts={logger:m=>{if(m.status==="recognizing text"&&ocrProgress)ocrProgress(Math.round(m.progress*100));}};
    if(window.EASURA_TESSDATA)opts.langPath=window.EASURA_TESSDATA;
    ocrWorker=Tesseract.createWorker(["deu","fra","ita","eng"],1,opts).catch(e=>{ocrBroken=true;ocrWorker=null;throw e;});
  }
  return ocrWorker;
}
async function ocrBlobs(blobs,onProgress){
  const w=await getOcr();let text="";
  for(const b of blobs){ocrProgress=onProgress;const r=await w.recognize(b);text+=(r&&r.data&&r.data.text||"")+"\n";}
  ocrProgress=null;return text;
}
async function imageFileToBlobs(file){return [file];}
async function runOcr(job,file,blobs,ctx){
  job.busy();job.msg(t("ocr_loading"));
  let text="";
  try{text=await ocrBlobs(blobs,(p)=>job.msg(t("ocr_running",{p})));}
  catch(e){return false;}
  if(text.replace(/\s+/g,"").length<30){job.msg(t("ocr_nothing"));return false;}
  if(ctx&&ctx.want)mergeHolder(ctx,localHolder(text));
  const r=detectLocal(text);
  if(!r.cats.length)return false;
  const id=uid();
  addPolicy({id,fileKey:fkey(file),cats:r.cats,insurer:r.insurer,policyNo:r.policyNo,premium:r.premium,period:r.period,validUntil:r.validUntil,source:"ocr",fileName:file.name,summary:localSummary(r.cats)});
  job.msg(t("res_ocr")+r.cats.map(k=>CAT[k].name).join(", ")+(r.insurer?t("at")+r.insurer:"")+".","ok");
  job.extra(sample?wrapNodes(aiButton(t("ai_check"),()=>runAI(job,file,"text",text,null,id))):null);
  job.done();return true;
}

/* ---------- AI (Claude) ---------- */
let sample=null,imgCaps=null;
(async()=>{try{if(window.claude&&window.claude.use){sample=await window.claude.use("sample");if(sample){const l=await sample.limits().catch(()=>null);imgCaps=l&&l.images?l.images:null;}}}catch(e){sample=null;}
  if(!sample&&document.getElementById("privacy"))document.getElementById("privacy").textContent="Text-PDFs werden direkt auf deinem Gerät gelesen. Für Fotos und Scans steht die KI-Analyse hier nicht zur Verfügung, du kannst sie aber manuell zuordnen. Gespeichert werden nur die erkannten Angaben, nicht deine Dateien.";
})();
const CAT_LIST=CATS.map(c=>`${c.key} = ${CAT_TX.de[c.key].name} (${CAT_TX.de[c.key].sub})`).join("; ");
function aiPrompt(kind,text,wantProfile){
  return `Du analysierst ein Schweizer Versicherungsdokument (Police, Versicherungsausweis oder Prämienrechnung). ${kind==="text"?"Hier ist der aus dem PDF gelesene Text:\n\n\"\"\"\n"+text.slice(0,12000)+"\n\"\"\"":"Das Dokument ist als Bild beigefügt."}

Antworte NUR mit einem JSON-Objekt in genau dieser Form:
{"insurer": string|null, "categories": string[], "policyNumber": string|null, "premium": number|null, "premiumPeriod": "Jahr"|"Monat"|null, "validUntil": "YYYY-MM-DD"|null, "summary": string}

Erlaubte Werte für categories (eine Police kann mehrere enthalten, z.B. Hausrat + Privathaftpflicht): ${CAT_LIST}.
Regeln:
- insurer: Name der Versicherungsgesellschaft (nicht der Versicherungsnehmer, nicht der Broker).
- premium: die Prämie in CHF als Zahl, inkl. Stempelabgabe falls als Total ausgewiesen; premiumPeriod passend dazu.
- validUntil: Vertragsende oder Ablaufdatum. null, wenn sich der Vertrag automatisch verlängert oder kein Ende steht.
- Die Grundversicherung (KVG) und Zusatzversicherungen (VVG) getrennt angeben, wenn beide vorkommen.
- Nur Kategorien angeben, die in diesem Dokument tatsächlich abgeschlossen sind (mit Deckung oder Prämie). Nicht angeben, was nur erwähnt, ausgeschlossen, als Angebot beworben oder in den allgemeinen Bedingungen genannt wird. "vvg" nur, wenn eine Zusatzversicherung wirklich versichert ist. "unfall" nicht für die Unfalldeckung innerhalb der Krankenkasse.
- summary: ein kurzer Satz in ${t("ai_summary_lang")}, was diese Police deckt.
- Wenn es kein Versicherungsdokument ist: categories [] und summary erklärt kurz, was es stattdessen ist.
${wantProfile?`- Die Person hat zugestimmt, dass aus der Police ihr Profil erstellt wird. Füge deshalb zusätzlich das Feld "holder" hinzu: {"firstName": string|null, "lastName": string|null, "birthDate": "YYYY-MM-DD"|null, "street": string|null, "zip": string|null, "city": string|null, "canton": zweistelliges Kantonskürzel wie "ZH"|null, "vehicle": "auto"|"moto"|null, "pet": "hund"|"katze"|"anderes"|null, "franchise": number|null}. Gemeint ist die versicherte Person bzw. der Versicherungsnehmer, nicht die Versicherung. Keine AHV-Nummer, keine Konto- oder Kartennummern.`:"- Keine persönlichen Daten wie Name, Adresse oder AHV-Nummer in die Antwort übernehmen."}`;
}
async function askAI(kind,text,images,wantProfile){
  const opts={modelTier:"default"};
  if(images&&images.length)opts.images=images.slice(0,imgCaps?imgCaps.maxCount:1);
  const r=await sample.json(aiPrompt(kind,text,wantProfile),opts);
  if(!r||typeof r!=="object")throw {code:"invalid_json"};
  const cats=Array.isArray(r.categories)?[...new Set(r.categories.map(String).filter(k=>CAT[k]))]:[];
  let vu=typeof r.validUntil==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(r.validUntil)?r.validUntil:null;
  const prem=typeof r.premium==="number"&&r.premium>0?Math.round(r.premium*100)/100:null;
  return {insurer:r.insurer?String(r.insurer).slice(0,60):null,cats,policyNo:r.policyNumber?String(r.policyNumber).slice(0,30):null,
    premium:prem,period:prem?(r.premiumPeriod==="Monat"?"Monat":"Jahr"):null,validUntil:vu,summary:r.summary?String(r.summary).slice(0,240):"",holder:(wantProfile&&r.holder&&typeof r.holder==="object")?r.holder:null};
}
function aiErr(e){
  const c=e&&e.code;
  if(c==="not_granted"||c==="sampling_disabled"||c==="capability_disabled"||c==="not_declared"){sample=null;return t("e_not_granted");}
  if(c==="rate_limited")return t("e_rate");
  if(c==="image_rejected")return t("e_image");
  if(c==="invalid_json")return t("e_json");
  if(c==="cancelled")return t("e_cancel");
  return t("e_other");
}

/* ---------- jobs ---------- */
function makeJob(name){
  const el=document.createElement("div");el.className="job";
  el.innerHTML=`<div class="row"><span class="spin"></span><span class="name"></span><button class="linkbtn" type="button" data-x hidden>${esc(t("close"))}</button></div><div class="msg"></div><div class="extra"></div>`;
  el.querySelector(".name").textContent=name;
  el.querySelector("[data-x]").onclick=()=>el.remove();
  document.getElementById("jobs").prepend(el);
  const api={
    msg(t,cls){const m=el.querySelector(".msg");m.textContent=t;m.className="msg"+(cls?" "+cls:"");},
    done(){el.querySelector(".spin").style.visibility="hidden";el.querySelector("[data-x]").hidden=false;},
    busy(){el.querySelector(".spin").style.visibility="visible";},
    extra(node){const x=el.querySelector(".extra");x.innerHTML="";if(node)x.appendChild(node);},
    el
  };
  return api;
}
function manualForm(job,fileName,prefill){
  const f=document.createElement("form");f.className="manual";
  const sid="m-"+uid();
  f.innerHTML=`<label class="muted" for="${sid}-c" style="font-size:13px">${esc(t("m_type"))}</label>
    <select id="${sid}-c">${CATS.map(c=>`<option value="${c.key}">${esc(c.name)}</option>`).join("")}</select>
    <input type="text" id="${sid}-i" list="${sid}-l" placeholder="${esc(t("m_ins_ph"))}" style="flex:1;min-width:140px">
    <datalist id="${sid}-l">${INSURERS.map(i=>`<option value="${esc(i.name)}">`).join("")}</datalist>
    <button class="btn small" type="submit">${esc(t("save"))}</button>`;
  if(prefill&&prefill.insurer)f.querySelector("#"+sid+"-i").value=prefill.insurer;
  f.addEventListener("submit",(e)=>{e.preventDefault();
    const cat=f.querySelector("#"+sid+"-c").value, ins=f.querySelector("#"+sid+"-i").value.trim();
    addPolicy({id:uid(),cats:[cat],insurer:ins||null,policyNo:prefill&&prefill.policyNo||null,premium:prefill&&prefill.premium||null,period:prefill&&prefill.period||null,validUntil:prefill&&prefill.validUntil||null,source:"manuell",fileName:fileName||"",summary:""});
    if(job){job.msg(t("saved_as",{c:CAT[cat].name}),"ok");job.extra(null);job.done();}
    toast(t("added",{c:CAT[cat].name}));
  });
  return f;
}
function aiButton(label,fn){const b=document.createElement("button");b.type="button";b.className="btn small ghost";b.textContent=label;b.onclick=fn;return b;}
function wrapNodes(...nodes){const d=document.createElement("div");d.className="actions";d.style.justifyContent="flex-start";nodes.forEach(n=>n&&d.appendChild(n));return d;}
function resultText(r,src){
  const names=r.cats.map(k=>CAT[k].name).join(", ");
  return t(src==="ki"?"res_ki":"res_local")+names+(r.insurer?t("at")+r.insurer:"")+".";
}
async function runAI(job,file,kind,text,images,replaceId,ctx){
  if(!sample){job.msg(t("ai_unavail"));job.extra(manualForm(job,file.name));job.done();return;}
  job.busy();job.extra(null);job.msg(t("ai_reading"));
  try{
    const r=await askAI(kind,text,images,!!(ctx&&ctx.want));
    if(ctx&&ctx.want&&r.holder)mergeHolder(ctx,r.holder);
    if(!r.cats.length){job.msg(r.summary||t("no_ins_found"),"err");job.extra(manualForm(job,file.name,r));job.done();return;}
    const p={id:replaceId||uid(),fileKey:fkey(file),cats:r.cats,insurer:r.insurer,policyNo:r.policyNo,premium:r.premium,period:r.period,validUntil:r.validUntil,source:"ki",fileName:file.name,summary:r.summary};
    if(replaceId&&S.policies.some(x=>x.id===replaceId)){S.policies=S.policies.map(x=>x.id===replaceId?p:x);save();render();}
    else addPolicy(p);
    job.msg(resultText(r,"ki"),"ok");job.done();
  }catch(e){job.msg(aiErr(e),"err");job.extra(wrapNodes(sample?aiButton(t("retry"),()=>runAI(job,file,kind,text,images,replaceId,ctx)):null));job.el.querySelector(".extra").appendChild(manualForm(job,file.name));job.done();}
}
async function handleFile(file,ctx){
  const job=makeJob(file.name);
  const isPdf=file.type==="application/pdf"||/\.pdf$/i.test(file.name);
  const isImg=/^image\/(jpeg|png|webp|gif)$/.test(file.type);
  if(!isPdf&&!isImg){job.msg(t("bad_format"),"err");job.done();return;}
  if(isImg){
    if(await runOcr(job,file,[file],ctx))return;
    if(sample&&imgCaps){await runAI(job,file,"image","",[file],null,ctx);}
    else{job.msg(t("img_noai"));job.extra(manualForm(job,file.name));job.done();}
    return;
  }
  job.msg(t("read_pdf"));
  let doc,text;
  try{({doc,text}=await readPdf(file));}catch(e){job.msg(t("pdf_open_err"),"err");job.extra(manualForm(job,file.name));job.done();return;}
  const clean=text.replace(/\s+/g," ").trim();
  if(clean.length<80){ // scanned PDF
    let imgs=null;try{imgs=await pdfToImages(doc,3);}catch(e){}
    if(imgs&&imgs.length&&await runOcr(job,file,imgs,ctx))return;
    if(sample&&imgCaps){job.msg(t("scan_prep"));
      try{const im2=(imgs&&imgs.length?imgs:await pdfToImages(doc,3)).slice(0,Math.min(2,imgCaps.maxCount||1));await runAI(job,file,"image","",im2,null,ctx);}catch(e){job.msg(t("scan_err"),"err");job.extra(manualForm(job,file.name));job.done();}}
    else{job.msg(t("scan_noai"));job.extra(manualForm(job,file.name));job.done();}
    return;
  }
  if(ctx&&ctx.want){
    if(sample){await runAI(job,file,"text",text,null,null,ctx);return;}
    mergeHolder(ctx,localHolder(text));
  }
  const r=detectLocal(text);
  if(r.cats.length){
    const id=uid();
    addPolicy({id,fileKey:fkey(file),cats:r.cats,insurer:r.insurer,policyNo:r.policyNo,premium:r.premium,period:r.period,validUntil:r.validUntil,source:"lokal",fileName:file.name,summary:localSummary(r.cats)});
    job.msg(resultText(r,"lokal"),"ok");
    job.extra(sample?wrapNodes(aiButton(t("ai_check"),()=>runAI(job,file,"text",text,null,id))):null);
    job.done();
  } else if(sample){
    await runAI(job,file,"text",text,null,null,ctx);
  } else {
    job.msg(t("no_type",{i:r.insurer?t("ins_paren",{i:r.insurer}):""}));
    job.extra(manualForm(job,file.name,r));job.done();
  }
}

/* ---------- wiring ---------- */
const fileIn=document.getElementById("file"),drop=document.getElementById("drop");
document.getElementById("pick").onclick=()=>fileIn.click();
let staged=[];
function stage(fs){
  for(const f of fs){if(!staged.some(x=>fkey(x)===fkey(f)))staged.push(f);}
  renderStaged();
}
function renderStaged(){
  const box=document.getElementById("staged"),ul=document.getElementById("staged-list");
  ul.innerHTML="";
  staged.forEach((f,i)=>{
    const li=document.createElement("li");
    const kb=f.size>1048576?(f.size/1048576).toFixed(1)+" MB":Math.max(1,Math.round(f.size/1024))+" KB";
    li.innerHTML=`<span class="fi" aria-hidden="true">${/pdf$/i.test(f.name)||f.type==="application/pdf"?"PDF":esc(t("file_img"))}</span><span class="fn"></span><span class="fs">${kb}</span><button type="button" class="x" aria-label="${esc(t("remove"))}">×</button>`;
    li.querySelector(".fn").textContent=f.name;
    li.querySelector("button").onclick=()=>{staged.splice(i,1);renderStaged();};
    ul.appendChild(li);
  });
  box.hidden=!staged.length;document.getElementById("go").hidden=!staged.length;
  document.getElementById("pick").hidden=!!staged.length;
  const go=document.getElementById("go");
  go.textContent=staged.length>1?t("go_many",{n:staged.length}):t("go_one");
  if(staged.length)go.focus();
}
document.getElementById("go").onclick=async()=>{const fs=staged.slice();staged=[];renderStaged();await processFiles(fs);};
fileIn.onchange=()=>{const fs=[...fileIn.files];fileIn.value="";stage(fs);};
["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("over");}));
["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("over");}));
drop.addEventListener("drop",e=>{const fs=[...(e.dataTransfer?e.dataTransfer.files:[])];stage(fs);});
let askedThisVisit=false,askOpen=null,busyKeys=new Set();
function fkey(f){return f?[f.name,f.size,f.lastModified].join("|"):"";}
async function processFiles(fs){
  if(!fs.length)return;
  const fresh=[];
  for(const f of fs){
    const k=fkey(f);
    if(busyKeys.has(k)||S.policies.some(p=>p.fileKey===k)||fresh.some(x=>fkey(x)===k)){
      const j=makeJob(f.name);j.done();j.el.querySelector(".spin").style.display="none";
      j.msg(t("dup_file"));
      setTimeout(()=>j.el.remove(),6000);continue;
    }
    fresh.push(f);
  }
  if(!fresh.length)return;
  fresh.forEach(f=>busyKeys.add(fkey(f)));
  const ctx={want:false,holder:{}};
  if(!S.user&&!askedThisVisit){
    if(askOpen){ctx.want=await askOpen;}
    else{askOpen=askProfile(fresh.length);ctx.want=await askOpen;askOpen=null;askedThisVisit=true;}
  }
  try{for(const f of fresh)await handleFile(f,ctx);}finally{fresh.forEach(f=>busyKeys.delete(fkey(f)));}
  if(ctx.want)openReg(ctx.holder,true);
}
function askProfile(n){
  return new Promise(res=>{
    const el=document.createElement("div");el.className="ask";
    el.innerHTML=`<b>${esc(t(n>1?"ask_many":"ask_one"))}</b><p>${esc(t("ask_p"))}</p>`;
    const yes=aiButton(t("ask_yes"),()=>{el.remove();res(true);});yes.className="btn";
    const no=aiButton(t("ask_no"),()=>{el.remove();res(false);});
    el.appendChild(wrapNodes(yes,no));
    document.getElementById("jobs").prepend(el);
    yes.focus();
  });
}
function mergeHolder(ctx,h){
  if(!h)return;
  for(const [k,v] of Object.entries(h)){if(v!=null&&v!==""&&ctx.holder[k]==null)ctx.holder[k]=v;}
}
function localHolder(text){
  const h={};
  const b=text.match(/(?:geburtsdatum|geb\.|geboren am|date de naissance)\s*:?\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/i);
  if(b)h.birthDate=`${b[3]}-${b[2].padStart(2,"0")}-${b[1].padStart(2,"0")}`;
  return h;
}

/* ---------- promo carousel ---------- */
const $id=(x)=>document.getElementById(x);
const PROMOS=[
 {id:"kombi",cats:["hausrat","haftpflicht"],icon:"hausrat",title:"Hausrat + Privathaftpflicht für unter 26",text:"Ideal für die erste Wohnung oder das WG-Zimmer.",price:"ab CHF 12.–",per:"pro Monat"},
 {id:"recht",cats:["rechtsschutz"],icon:"rechtsschutz",title:"Rechtsschutz Privat & Verkehr",text:"Hilfe bei Streit mit Vermieter, Arbeitgeber oder Online-Shop.",price:"3 Monate gratis",per:""},
 {id:"reise",cats:["reise"],icon:"reise",title:"Reiseversicherung fürs ganze Jahr",text:"Annullierung und Hilfe im Ausland, für alle Reisen.",price:"ab CHF 8.–",per:"pro Monat"},
 {id:"auto",cats:["auto"],icon:"auto",title:"Autoversicherung für Neulenker",text:"Faire Prämie im ersten Jahr nach der Fahrprüfung.",price:"10 % Rabatt",per:"im ersten Jahr"},
 {id:"partner",cats:[],icon:"vvg",partner:true,title:"Ihr Angebot hier",text:"Versicherer und Banken können diesen Platz für ihre Angebote mieten.",price:"",per:""}
];
let promoIdx=0,promoTimer=null,promoPaused=false,promoOrder=[];
function renderPromo(){
  const open=new Set(CATS.filter(c=>{const st=statusOf(c);return st.s==="fehlt"||st.s==="abgelaufen";}).map(c=>c.key));
  const wanted=new Set(Object.keys(S.offers||{}).filter(k=>S.offers[k]));
  const score=(p)=>p.partner?-1:(p.cats.some(k=>open.has(k))?2:0)+(p.cats.some(k=>wanted.has(k))?1:0);
  const curId=promoOrder[promoIdx]&&promoOrder[promoIdx].id;
  promoOrder=PROMOS.slice().sort((a,b)=>score(b)-score(a));
  promoIdx=Math.max(0,promoOrder.findIndex(p=>p.id===curId));
  const track=$id("promo-track"),dots=$id("promo-dots");
  track.innerHTML=promoOrder.map((p,i)=>{
    const fit=p.cats.some(k=>open.has(k))?'<span class="tag fit">'+esc(t("fit_open"))+'</span>':p.cats.some(k=>wanted.has(k))?'<span class="tag fit">'+esc(t("fit_offer"))+'</span>':"";
    const price=p.price?` · <strong>${esc(p.price)}${p.per?" "+esc(p.per):""}</strong>`:"";
    return `<article class="slide${i===promoIdx?" on":""}" aria-roledescription="${esc(t("offer_role"))}" aria-label="${esc(t("slide_aria",{i:i+1,n:promoOrder.length}))}" ${i===promoIdx?"":'aria-hidden="true"'}>
      <span class="mini-ico" aria-hidden="true">${svg(p.icon)}</span>
      <div class="slide-t"><div class="l1"><span class="tag">${esc(t(p.partner?"tag_space":"tag_ad"))}</span>${fit}<b>${esc(p.title)}</b></div>
        <div class="l2">${esc(p.text)}${price}</div></div>
      <button type="button" class="btn small ghost cta" data-promo="${p.id}" ${i===promoIdx?"":'tabindex="-1"'}>${esc(t(p.partner?"cta_partner":"cta_offer"))}</button>
      <div class="promo-info" data-info="${p.id}" hidden></div></article>`;}).join("");
  dots.innerHTML=promoOrder.map((p,i)=>`<button type="button" class="dot" aria-label="${esc(t("dot",{i:i+1}))}" ${i===promoIdx?'aria-current="true"':""} data-dot="${i}"></button>`).join("");
  dots.querySelectorAll("[data-dot]").forEach(d=>d.onclick=()=>{goPromo(+d.dataset.dot);restartPromo();});
  track.querySelectorAll("[data-promo]").forEach(b=>b.onclick=()=>{
    const p=PROMOS.find(x=>x.id===b.dataset.promo),info=track.querySelector(`[data-info="${p.id}"]`);
    info.textContent=t(p.partner?"promo_info_partner":"promo_info_ex");
    info.hidden=false;promoPaused=true;
  });
}
function goPromo(i){
  const n=promoOrder.length;promoIdx=(i+n)%n;
  $id("promo-track").querySelectorAll(".slide").forEach((el,j)=>{const on=j===promoIdx;el.classList.toggle("on",on);if(on)el.removeAttribute("aria-hidden");else el.setAttribute("aria-hidden","true");el.querySelectorAll("button").forEach(b=>b.tabIndex=on?0:-1);});
  $id("promo-dots").querySelectorAll(".dot").forEach((d,j)=>{if(j===promoIdx)d.setAttribute("aria-current","true");else d.removeAttribute("aria-current");});
}
function restartPromo(){
  clearInterval(promoTimer);
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  promoTimer=setInterval(()=>{if(!promoPaused&&!document.hidden)goPromo(promoIdx+1);},6500);
}
$id("promo-prev").onclick=()=>{goPromo(promoIdx-1);restartPromo();};
$id("promo-next").onclick=()=>{goPromo(promoIdx+1);restartPromo();};
$id("promo").addEventListener("mouseenter",()=>promoPaused=true);
$id("promo").addEventListener("mouseleave",()=>{promoPaused=false;});
$id("promo").addEventListener("focusin",()=>promoPaused=true);
$id("promo").addEventListener("focusout",()=>promoPaused=false);
renderPromo();restartPromo();

/* ---------- day / night ---------- */
const TKEY="easura.theme";
function currentTheme(){const t=document.documentElement.dataset.theme;if(t==="dark"||t==="light")return t;return window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}
function setTheme(t,store){
  document.documentElement.dataset.theme=t;
  if(store){try{localStorage.setItem(TKEY,t)}catch(e){}}
  document.getElementById("th-light").setAttribute("aria-pressed",t==="light"?"true":"false");
  document.getElementById("th-dark").setAttribute("aria-pressed",t==="dark"?"true":"false");
}
(function(){let saved=null;try{saved=localStorage.getItem(TKEY)}catch(e){}
  setTheme(saved==="dark"||saved==="light"?saved:currentTheme(),false);
  if(window.matchMedia)matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",()=>{let sv=null;try{sv=localStorage.getItem(TKEY)}catch(e){}if(!sv)setTheme(currentTheme(),false);});
})();
document.getElementById("th-light").onclick=()=>setTheme("light",true);
document.getElementById("th-dark").onclick=()=>setTheme("dark",true);

/* ---------- registration ---------- */
const KANTONE=[["AG","Aargau"],["AI","Appenzell Innerrhoden"],["AR","Appenzell Ausserrhoden"],["BE","Bern"],["BL","Basel-Landschaft"],["BS","Basel-Stadt"],["FR","Freiburg"],["GE","Genf"],["GL","Glarus"],["GR","Graubünden"],["JU","Jura"],["LU","Luzern"],["NE","Neuenburg"],["NW","Nidwalden"],["OW","Obwalden"],["SG","St. Gallen"],["SH","Schaffhausen"],["SO","Solothurn"],["SZ","Schwyz"],["TG","Thurgau"],["TI","Tessin"],["UR","Uri"],["VD","Waadt"],["VS","Wallis"],["ZG","Zug"],["ZH","Zürich"]];
function fillCantons(){const el=document.getElementById("r-canton"),v=el.value;el.innerHTML=`<option value="">${esc(t("choose"))}</option>`+KANTONE.map(([k],i)=>`<option value="${k}">${esc((KANTON_NAMES[LANG]||KANTON_NAMES.de)[i])}</option>`).join("");el.value=v;}
fillCantons();
const F=(id)=>document.getElementById(id);
const REGF={first:"r-first",last:"r-last",mail:"r-mail",phone:"r-phone",birth:"r-birth",civil:"r-civil",street:"r-street",zip:"r-zip",city:"r-city",canton:"r-canton",home:"r-home",work:"r-work",car:"r-car",pet:"r-pet",kids:"r-kids",franchise:"r-franchise"};
let lastFocus=null;
function openReg(holder,fromPolicy){
  lastFocus=document.activeElement;
  const u=Object.assign({},S.user||{});
  if(!S.user){u.car=S.profile.car?"auto":"kein";u.pet=S.profile.pet?"anderes":"kein";if(S.profile.owner)u.home="eigentum";}
  if(holder){
    const map={firstName:"first",lastName:"last",birthDate:"birth",street:"street",zip:"zip",city:"city",canton:"canton",vehicle:"car",pet:"pet",franchise:"franchise"};
    for(const [k,f] of Object.entries(map)){const v=holder[k];if(v!=null&&v!==""&&!u[f])u[f]=String(v);}
    if(holder.vehicle)u.car=String(holder.vehicle);if(holder.pet)u.pet=String(holder.pet);
    if(u.canton)u.canton=String(u.canton).toUpperCase().slice(0,2);
  }
  for(const [k,id] of Object.entries(REGF)){const el=F(id);const v=u[k];if(el.tagName==="SELECT"){el.value=v!=null?String(v):el.options[0].value;if(el.value!==String(v??el.options[0].value))el.value=el.options[0].value;}else el.value=v||"";}
  F("r-ok").checked=!!(S.user&&S.user.consent);
  F("reg-h").textContent=t(S.user?"reg_yours":"reg_create");
  const got=holder&&Object.values(holder).some(v=>v!=null&&v!=="");
  const note=F("reg-note");
  if(fromPolicy){note.className="sheet-note from";note.textContent=t(got?"note_got":"note_none");}
  else{note.className="sheet-note";note.textContent=t("note_default");}
  F("reg-del").hidden=!S.user;F("reg-err").hidden=true;
  document.querySelectorAll(".fgrid label.bad").forEach(l=>l.classList.remove("bad"));
  const fresh=!S.user;
  F("step1").hidden=!fresh;F("step2").hidden=fresh;F("reg-via").hidden=true;authMethod=S.user&&S.user.method||null;
  F("a-err").hidden=true;F("a-pw").value="";F("a-pw2").value="";F("a-mail").value=u.mail||"";
  if(fresh)F("reg-h").textContent=t(fromPolicy?"acc_create_check":"acc_create");
  F("reg").hidden=false;setTimeout(()=>(fresh?F("a-mail"):F("r-first")).focus(),30);
}
let authMethod=null;
function toStep2(method,mail){
  authMethod=method;
  F("step1").hidden=true;F("step2").hidden=false;
  F("reg-h").textContent=t("reg_create");
  const via=F("reg-via");
  if(method==="E-Mail"){via.hidden=false;via.textContent=t("via_mail",{m:mail});if(!F("r-mail").value)F("r-mail").value=mail;}
  else{via.hidden=false;via.textContent=t("via_sso",{p:method});}
  setTimeout(()=>F("r-first").focus(),30);
}
document.querySelectorAll("[data-sso]").forEach(b=>b.onclick=()=>toStep2(b.dataset.sso));
F("a-next").onclick=()=>{
  const m=F("a-mail").value.trim(),pw=F("a-pw").value,pw2=F("a-pw2").value,err=F("a-err");
  let msg="";
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m))msg=t("err_mail");
  else if(pw.length<8)msg=t("err_pw_len");
  else if(pw!==pw2)msg=t("err_pw_match");
  if(msg){err.textContent=msg;err.hidden=false;return;}
  err.hidden=true;F("a-pw").value="";F("a-pw2").value="";
  toStep2("E-Mail",m);
};
function closeReg(){F("reg").hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus();}
F("reg-btn").onclick=()=>openReg(null,false);
F("reg-close").onclick=closeReg;F("reg-cancel").onclick=closeReg;
F("reg").addEventListener("click",e=>{if(e.target.id==="reg")closeReg();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!F("reg").hidden)closeReg();});
let delArmed=false;
F("reg-del").onclick=(e)=>{const b=e.currentTarget;if(!delArmed){delArmed=true;b.textContent=t("del_confirm");setTimeout(()=>{delArmed=false;b.textContent=t("del_profile");},4000);return;}
  delArmed=false;b.textContent=t("del_profile");S.user=null;save();closeReg();render();toast(t("profile_deleted"));};
F("reg-form").addEventListener("submit",e=>{
  e.preventDefault();
  const u={};for(const [k,id] of Object.entries(REGF))u[k]=F(id).value.trim();
  const errs=[];
  document.querySelectorAll(".fgrid label.bad").forEach(l=>l.classList.remove("bad"));
  const need=["first","last","mail","birth","zip","city","canton","home","work"];
  need.forEach(k=>{if(!u[k]){errs.push(k);F(REGF[k]).closest("label").classList.add("bad");}});
  if(u.mail&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(u.mail)){errs.push("mail");F("r-mail").closest("label").classList.add("bad");}
  if(u.zip&&!/^[1-9]\d{3}$/.test(u.zip)){errs.push("zip");F("r-zip").closest("label").classList.add("bad");}
  const err=F("reg-err");
  if(errs.length){err.textContent=t("err_fields");err.hidden=false;return;}
  if(!F("r-ok").checked){err.textContent=t("err_consent");err.hidden=false;return;}
  u.consent=true;u.method=authMethod||(S.user&&S.user.method)||"E-Mail";
  const isNew=!S.user;
  S.user=u;
  S.profile.flat=u.home!=="eltern";
  S.profile.owner=u.home==="eigentum";
  S.profile.work=u.work==="ag8"||u.work==="lehre";
  S.profile.car=u.car!=="kein"||S.policies.some(p=>p.cats.includes("auto"));
  S.profile.pet=u.pet!=="kein"||S.policies.some(p=>p.cats.includes("tier"));
  save();closeReg();render();
  toast(isNew?t("welcome",{n:u.first}):t("profile_updated"));
});
function ageOf(iso){if(!iso)return null;const b=new Date(iso),n=new Date();let a=n.getFullYear()-b.getFullYear();const m=n.getMonth()-b.getMonth();if(m<0||(m===0&&n.getDate()<b.getDate()))a--;return a>=0&&a<120?a:null;}
function renderMe(){
  const u=S.user, me=F("hero-me"), btn=F("reg-btn");
  F("h1").textContent=u&&u.first?t("hello_name",{n:u.first}):t("hello");
  btn.textContent=t(u?"my_profile":"register");
  if(!u){me.hidden=true;me.innerHTML="";return;}
  const a=ageOf(u.birth),ki=KANTONE.findIndex(x=>x[0]===u.canton),k=ki>=0?[u.canton,(KANTON_NAMES[LANG]||KANTON_NAMES.de)[ki]]:null;
  const bits=[];
  if(a!=null)bits.push(`<span>${esc(t("me_age",{a}))}</span>`);
  if(k)bits.push(`<span>${esc(t("me_canton",{k:k[1]}))}</span>`);
  if(a!=null&&a>=19&&a<=25)bits.push(`<span class="ok">${esc(t("me_young"))}</span>`);
  me.innerHTML=bits.join("");me.hidden=!bits.length;
}
document.getElementById("clear-examples").onclick=()=>{S.policies=S.policies.filter(p=>p.source!=="beispiel");S.examples=false;save();render();};
let resetArmed=false,resetT;
document.getElementById("reset").onclick=(e)=>{const b=e.currentTarget;
  if(!resetArmed){resetArmed=true;b.textContent=t("reset_confirm");resetT=setTimeout(()=>{resetArmed=false;b.textContent=t("reset");},4000);return;}
  clearTimeout(resetT);resetArmed=false;b.textContent=t("reset");S.policies=[];save();render();toast(t("all_deleted"));};

function applyStatic(){
  document.documentElement.lang=LANG;
  document.querySelectorAll("[data-i18n]").forEach(el=>{el.textContent=t(el.dataset.i18n);});
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{el.innerHTML=t(el.dataset.i18nHtml);});
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{el.placeholder=t(el.dataset.i18nPh);});
  document.querySelectorAll("[data-i18n-aria]").forEach(el=>{el.setAttribute("aria-label",t(el.dataset.i18nAria));});
  document.querySelectorAll("[data-i18n-title]").forEach(el=>{el.title=t(el.dataset.i18nTitle);});
  document.querySelectorAll("[data-i18n-role]").forEach(el=>{el.setAttribute("aria-roledescription",t(el.dataset.i18nRole));});
  document.getElementById("tagline").innerHTML=esc(t("tag1"))+"<br><em>"+esc(t("tag2"))+"</em>";
  document.querySelectorAll("[data-sso]").forEach(b=>{b.textContent=t("sso",{p:b.dataset.sso});});
  document.getElementById("reset").textContent=t("reset");
  document.getElementById("reg-del").textContent=t("del_profile");
  document.getElementById("lang").value=LANG;
}
function setLang(l){
  if(!TX[l])return;LANG=l;try{localStorage.setItem("easura.lang",l)}catch(e){}
  applyCatLang();applyStatic();fillCantons();renderStaged();render();
}
document.getElementById("lang").addEventListener("change",e=>setLang(e.target.value));
applyCatLang();applyStatic();fillCantons();renderStaged();
render();
})();
