const $=s=>document.querySelector(s);
const NL=String.fromCharCode(10),CR=String.fromCharCode(13),BT=String.fromCharCode(96);
const LIMIT=262144,MAXFILE=10*1024*1024,MAXFILES=10;
const P={search:"M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",reply:"M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z",edit:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",pin:"M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z",sel:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",trash:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",more:"M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",palette:"M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4c3 0 5.5-2.5 5.5-5.5C22.9 6.3 18 3 12 3zM6.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",chev:"M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z",wrap:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z",copy:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",plus:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z",send:"M2 21l21-9L2 3v7l15 2-15 2z",close:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",download:"M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z",open:"M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z",prev:"M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z",next:"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",refresh:"M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z",img:"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5 11 16.5l3.5-4.5L19 18H5l3.5-4.5z",attach:"M16.5 6.5 9.41 13.59a2 2 0 1 0 2.83 2.83l7.09-7.09a4 4 0 1 0-5.66-5.66l-8.5 8.5a6 6 0 1 0 8.49 8.49l7.09-7.09-1.41-1.41-7.09 7.09a4 4 0 1 1-5.66-5.66l8.5-8.5a2 2 0 1 1 2.83 2.83l-7.09 7.09a.001.001 0 0 0 0 .01l7.09-7.09z",code:"M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zM14.6 16.6 19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",note:"M6 2h9l5 5v15H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm8 1.5V8h4.5L14 3.5zM8 12h8v-2H8v2zm0 4h8v-2H8v2z",info:"M11 17h2v-6h-2v6zm0-8h2V7h-2v2zm1-7C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z",person:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",place:"M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z",device:"M4 5h16v10H4V5zm-2-2v14h22V3H2zm7 16h6v2H9v-2z",clock:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5h-2v6l5 3 1-1.73-4-2.27V7z",back:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"};
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function ic(n){const s=el("span","ic");const d=P[n]||P.note;s.setAttribute("data-icon",String(n));if(!P[n])s.setAttribute("data-icon-fallback","note");s.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true"><path d="'+d+'"/></svg>';return s}
function fmtSize(n){n=Number(n)||0;if(n<1024)return n+" B";if(n<1048576)return (n/(1024)).toFixed(n<10240?1:0)+" KB";return (n/1048576).toFixed(1)+" MB"}
function fmtDate(t){return new Date(t*1000).toLocaleString()}
const EXT={
 image:["png","jpg","jpeg","gif","webp","avif","bmp","ico","svg"],
 video:["mp4","webm","mov","m4v","ogv"],
 audio:["mp3","wav","ogg","m4a","aac","flac","oga"],
 pdf:["pdf"],html:["html","htm"],markdown:["md","markdown"],csv:["csv","tsv"],json:["json","jsonl","geojson"],
 text:["txt","log","xml","yml","yaml","toml","ini","cfg","conf","env","js","mjs","ts","tsx","jsx","css","scss","py","rb","go","rs","java","kt","c","h","cpp","hpp","cs","php","sh","bash","zsh","sql","swift","lua","r","pl","bat","ps1","tex","srt","vtt","diff","patch","gitignore","dockerfile"]};
function extOf(n){const i=String(n||"").lastIndexOf(".");return i>0?n.slice(i+1).toLowerCase():""}
function kindOf(f){const t=String(f.content_type||"").toLowerCase(),e=extOf(f.filename);
 if(t.startsWith("image/")||EXT.image.includes(e))return "image";
 if(t.startsWith("video/")||EXT.video.includes(e))return "video";
 if(t.startsWith("audio/")||EXT.audio.includes(e))return "audio";
 if(t==="application/pdf"||e==="pdf")return "pdf";
 for(const k of ["html","markdown","csv","json"])if(EXT[k].includes(e))return k;
 if(t==="text/html")return "html";if(t==="application/json")return "json";if(t==="text/csv")return "csv";if(t==="text/markdown")return "markdown";
 if(t.startsWith("text/")||EXT.text.includes(e))return "text";
 return "other"}
function fileUrl(f,preview){return "/api/files/"+encodeURIComponent(f.file_id)+(preview?"?preview=1":"")}
function badge(f,big){const e=extOf(f.filename).toUpperCase().slice(0,4)||"FILE";const b=el("span","badge"+(big?" big":""),e);b.dataset.k=kindOf(f);return b}
function thumbFor(f){const k=kindOf(f);
 if(k==="image"){const i=el("img","att-img");i.loading="lazy";i.alt=f.filename;i.src=fileUrl(f,true);i.onerror=()=>i.replaceWith(badge(f,true));return i}
 if(k==="video"){const v=el("video","att-img");v.preload="metadata";v.muted=true;v.playsInline=true;v.src=fileUrl(f,true)+"#t=0.1";return v}
 return null}

/* ---------- icons on static buttons ---------- */
$("#attach").append(ic("plus"));$("#send").append(ic("send"));$("#vclose").append(ic("close"));
$("#vdl").append(ic("download"));$("#vopen").append(ic("open"));$("#vprev").append(ic("prev"));$("#vnext").append(ic("next"));
$("#refresh").append(ic("refresh"));$("#themeBtn").append(ic("palette"));$("#searchBtn").append(ic("search"));$("#selX").append(ic("close"));

/* ---------- api / session ---------- */
const loginBox=$("#login"),appBox=$("#app"),loginError=$("#loginError"),chatError=$("#chatError");
function showApp(on){loginBox.classList.toggle("hidden",on);appBox.classList.toggle("hidden",!on)}
async function api(path,opts={}){const r=await fetch(path,{credentials:"same-origin",...opts});if(r.status===423){location.replace("https://www.the-raghavan.com");throw Error("Temporarily locked")}return r}

/* ---------- theme: modes + palettes + device accent ---------- */
const BS=String.fromCharCode(92);
const PAL=[["device","Device accent"],["classic","Classic","#b4691f","#e8a765"],["blue","Material blue","#1a73e8","#8ab4f8"],["purple","Purple","#6750a4","#d0bcff"],["green","Green","#1e8e3e","#81c995"],["teal","Teal","#00796b","#4db6ac"],["rose","Rose","#c2185b","#f48fb1"],["orange","Orange","#e8710a","#fdc069"]];
const MODES=["light","dark","system"];
const TH={mode:"system",pal:"device",geo:false};
try{Object.assign(TH,JSON.parse(localStorage.getItem("ws.theme")||"{}"))}catch(e){}
const mq=matchMedia("(prefers-color-scheme: dark)");
function rgbOf(c){const m=String(c).match(/[0-9.]+/g);return m&&m.length>=3?m.slice(0,3).map(Number):null}
function hexRgb(h){return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16))}
function lum(a){return (0.2126*a[0]+0.7152*a[1]+0.0722*a[2])/255}
let DEV=null;
(function(){try{if(!CSS.supports("color","AccentColor"))return;const p=el("span");p.style.cssText="color:AccentColor;position:fixed;visibility:hidden";document.body.append(p);DEV=getComputedStyle(p).color;p.remove()}catch(e){}})();
function applyTheme(){
 const R=document.documentElement,dark=TH.mode==="system"?mq.matches:TH.mode==="dark";
 R.dataset.scheme=dark?"dark":"light";
 const ent=PAL.find(x=>x[0]===TH.pal)||PAL[0];R.dataset.palette=ent[0];
 let base,rgb,prim,l;
 if(ent[0]==="device"&&DEV){base=DEV;rgb=rgbOf(DEV)||[26,115,232];prim=dark?"color-mix(in srgb,"+DEV+" 62%,#fff)":DEV;l=dark?Math.min(1,lum(rgb)*0.62+0.38):lum(rgb)}
 else{base=ent[0]==="device"?(dark?"#8ab4f8":"#1a73e8"):(dark?ent[3]:ent[2]);prim=base;l=lum(hexRgb(base))}
 R.style.setProperty("--primary",prim);R.style.setProperty("--on-primary",l>0.55?"#15151a":"#fff");
 document.querySelectorAll("#themePanel .seg button").forEach(b=>b.classList.toggle("on",b.dataset.v===TH.mode));
 document.querySelectorAll("#themePanel .sw").forEach(b=>b.classList.toggle("on",b.dataset.v===TH.pal));
 try{localStorage.setItem("ws.theme",JSON.stringify(TH))}catch(e){}}
mq.addEventListener("change",()=>{if(TH.mode==="system")applyTheme()});
function getPos(){return new Promise((ok,no)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(ok,no,{timeout:8000,maximumAge:60000}):no({code:0}))}
function buildThemePanel(){
 const p=$("#themePanel");p.replaceChildren();
 p.append(el("h3","","Mode"));
 const seg=el("div","seg wide");MODES.forEach(m=>{const b=el("button","",m[0].toUpperCase()+m.slice(1));b.type="button";b.dataset.v=m;b.onclick=()=>{TH.mode=m;applyTheme()};seg.append(b)});p.append(seg);
 p.append(el("h3","","Color palette"));
 const sw=el("div","swatches");
 PAL.forEach(e=>{const b=el("button","sw");b.type="button";b.dataset.v=e[0];const dot=el("i");
  dot.style.background=e[0]==="device"?(DEV||"conic-gradient(#4285f4,#ea4335,#fbbc04,#34a853,#4285f4)"):e[2];
  b.append(dot,el("span","",e[1]));b.onclick=()=>{TH.pal=e[0];applyTheme()};sw.append(b)});
 p.append(sw,el("div","note",DEV?"Device accent detected: "+DEV:"This browser does not expose a device accent color, so Device accent falls back to Material blue."));
 p.append(el("h3","","Message details"));
 const row=el("label","toggle"),cb=document.createElement("input");cb.type="checkbox";cb.checked=!!TH.geo;
 const nt=el("div","note","Off by default. When on, your browser asks permission and your precise location is saved with each message you send.");
 cb.onchange=async()=>{
  if(!cb.checked){TH.geo=false;applyTheme();return}
  try{await getPos();TH.geo=true;TH.geoNever=false;nt.textContent="Location sharing is on."}
  catch(e){cb.checked=false;TH.geo=false;nt.textContent=e&&e.code===1?"Permission denied. Allow location for this site in your browser settings.":"Location is unavailable on this device."}
  applyTheme()};
 row.append(cb,el("span","","Share my location with messages"));p.append(row,nt)}
buildThemePanel();applyTheme();
$("#themeBtn").onclick=e=>{e.stopPropagation();$("#themePanel").classList.toggle("hidden")};
document.addEventListener("click",e=>{const p=$("#themePanel");if(!p.classList.contains("hidden")&&!p.contains(e.target))p.classList.add("hidden")});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;$("#themePanel").classList.add("hidden");$("#dl").classList.add("hidden")});

/* ---------- message details (collected in the browser; IP/ISP added by the server) ---------- */
function deviceLabel(ua,mob){
 const type=/iPad|Tablet/.test(ua)?"Tablet":(mob||/Mobi|iPhone|Android/.test(ua))?"Phone":"Desktop";
 const os=/iPhone|iPad|iPod/.test(ua)?"iOS":/Android/.test(ua)?"Android":/Mac OS X/.test(ua)?"macOS":/Windows/.test(ua)?"Windows":/CrOS/.test(ua)?"ChromeOS":/Linux/.test(ua)?"Linux":"";
 const br=/Edg[/]/.test(ua)?"Edge":/OPR[/]/.test(ua)?"Opera":/Firefox[/]/.test(ua)?"Firefox":/(Chrome|CriOS)[/]/.test(ua)?"Chrome":/Safari[/]/.test(ua)?"Safari":"Browser";
 return [type,os,br].filter(Boolean).join(" · ")}
async function collectDetails(){
 const n=navigator,sc=screen,cn=n.connection||n.mozConnection||n.webkitConnection||{},ua=n.userAgent||"";
 const d={screen:sc.width+"x"+sc.height,dpr:window.devicePixelRatio||1,viewport:innerWidth+"x"+innerHeight,
  language:n.language||"",languages:(n.languages||[]).slice(0,5),
  network:{type:cn.effectiveType||"",downlink:cn.downlink||0,rtt:cn.rtt||0,saveData:!!cn.saveData},
  timezone:(Intl.DateTimeFormat().resolvedOptions().timeZone)||"",tzOffset:-new Date().getTimezoneOffset(),
  device:deviceLabel(ua,n.userAgentData&&n.userAgentData.mobile)};
 const am=/Android [0-9.]+; ([^;)]+)/.exec(ua);
 if(am)d.model=am[1].trim();else if(/iPhone/.test(ua))d.model="iPhone";else if(/iPad/.test(ua))d.model="iPad";else if(/Macintosh/.test(ua))d.model="Mac";
 try{if(n.userAgentData&&n.userAgentData.getHighEntropyValues){const h=await n.userAgentData.getHighEntropyValues(["model"]);if(h.model)d.model=h.model}}catch(e){}
 if(TH.geo){try{const p=await getPos();d.geo={lat:p.coords.latitude,lon:p.coords.longitude,acc:p.coords.accuracy}}catch(e){d.geoError=e&&e.code===1?"denied":"unavailable"}}
 return d}
function netText(c,s){const n=c.network||{},p=[];if(n.type)p.push(n.type.toUpperCase());if(n.downlink)p.push(n.downlink+" Mbps");if(n.rtt)p.push(n.rtt+" ms RTT");if(n.saveData)p.push("Data saver");if(s.isp)p.push(s.isp);return p.join(" · ")||"Not exposed by browser"}
function detailGrid(d){
 const c=d.client||{},s=d.server||{},dl=el("dl","dpanel hidden"),off=c.tzOffset;
 const tz=c.timezone?c.timezone+(typeof off==="number"?" (UTC"+(off<0?"-":"+")+Math.floor(Math.abs(off)/60)+":"+String(Math.abs(off)%60).padStart(2,"0")+")":""):(s.timezone||"—");
 const area=[s.city,s.region,s.country].filter(Boolean).join(", ");
 let loc="Not shared",map=null;
 if(c.geo){loc=c.geo.lat.toFixed(5)+", "+c.geo.lon.toFixed(5)+" (±"+Math.round(c.geo.acc||0)+" m)";map="https://www.openstreetmap.org/?mlat="+c.geo.lat.toFixed(5)+"&mlon="+c.geo.lon.toFixed(5)}
 else if(c.geoError)loc="Not shared ("+c.geoError+")";
 const rows=[["Screen",c.screen?c.screen+" @"+(c.dpr||1)+"x · viewport "+c.viewport:"—"],
  ["Language",c.language?c.language+(c.languages&&c.languages.length>1?" ("+c.languages.join(", ")+")":""):"—"],
  ["Device",c.device||"—"],["Device model",c.model||"Not exposed by browser"],["Network",netText(c,s)],["Timezone",tz],
  ["Location",loc,map],["Approx. area",area||"—"],["IP address",s.ip||"—"]];
 for(const r of rows){dl.append(el("dt","",r[0]));const dd=el("dd","",String(r[1]));if(r[2]){const a=el("a","","Map");a.href=r[2];a.target="_blank";a.rel="noopener noreferrer";dd.append(" · ",a)}dl.append(dd)}
 return dl}

/* ---------- syntax highlighting + code cards ---------- */
const S=x=>new Set(x.split(" "));
const KW={js:S("const let var function return if else for while do switch case break continue new class extends import export from default async await try catch finally throw typeof instanceof in of this null undefined true false yield static super"),
 py:S("def class return if elif else for while in not and or is import from as with try except finally raise lambda None True False pass break continue yield global async await"),
 sh:S("if then else fi for do done while case esac function in"),
 sql:S("select from where insert into values update set delete create table drop alter join left right inner outer on group by order limit and or not null as primary key default"),
 json:S("true false null")};
const BI={js:S("console document window JSON Math Object Array Promise fetch Response Request"),py:S("print range len self str int float list dict set open"),sh:S("echo cd export open source alias")};
const LN={js:"js",mjs:"js",ts:"js",tsx:"js",jsx:"js",javascript:"js",typescript:"js",py:"py",python:"py",sh:"sh",bash:"sh",zsh:"sh",shell:"sh",console:"sh",sql:"sql",json:"json",jsonl:"json",geojson:"json",yml:"yaml",yaml:"yaml",toml:"yaml",ini:"yaml"};
const LBL={py:"PYTHON",sh:"SHELL",bash:"SHELL",zsh:"SHELL",js:"JAVASCRIPT",mjs:"JAVASCRIPT",ts:"TYPESCRIPT",md:"MARKDOWN",yml:"YAML",txt:"TEXT"};
function normLang(x){return LN[String(x||"").toLowerCase()]||"gen"}
function langLabel(x){x=String(x||"").toLowerCase();return LBL[x]||(x||"text").toUpperCase()}
function tokRe(l){
 const c=l==="js"?"//.*":(l==="py"||l==="sh"||l==="yaml")?"#.*":l==="sql"?"--.*":"(?!)";
 const q1='"(?:'+BS+BS+'.|[^"'+BS+BS+'])*"',q2="'(?:"+BS+BS+".|[^'"+BS+BS+"])*'",q3=BT+"[^"+BT+"]*"+BT;
 return new RegExp("("+c+")|("+q1+"|"+q2+"|"+q3+")|([A-Za-z_$][A-Za-z0-9_$]*)|([0-9]+(?:[.][0-9]+)?)","g")}
function hlInto(c,t,l,re){
 let pos=0,m;re.lastIndex=0;
 const add=(x,cls)=>{if(!x)return;if(cls)c.append(el("span","t-"+cls,x));else c.append(document.createTextNode(x))};
 while((m=re.exec(t))){
  add(t.slice(pos,m.index));const x=m[0];let cls=null;
  if(m[1])cls="com";
  else if(m[2])cls=(l==="json"&&t.slice(re.lastIndex).trimStart().startsWith(":"))?"num":"str";
  else if(m[3]){const pv=t.slice(0,m.index).trimEnd(),lw=pv.slice(pv.lastIndexOf(" ")+1);
   if(KW[l]&&KW[l].has(x))cls="kw";else if(BI[l]&&BI[l].has(x))cls="bi";
   else if(t[re.lastIndex]==="("||lw==="def"||lw==="function"||lw==="class")cls="fn"}
  else cls="num";
  add(x,cls);pos=re.lastIndex;if(!x.length)re.lastIndex++}
 add(t.slice(pos))}
function codeLines(code,l){
 const lines=String(code).split(NL),box=el("div","code"),re=tokRe(l);
 box.style.setProperty("--lnw",String(lines.length).length+"ch");
 lines.forEach(t=>{if(t.endsWith(CR))t=t.slice(0,-1);const ln=el("div","l"),c=el("span","c");hlInto(c,t,l,re);ln.append(c);box.append(ln)});
 return box}
function iconBtn(name,label,title){const b=el("button","cc-btn");b.type="button";b.title=title;b.append(ic(name));if(label)b.append(el("span","",label));return b}
function codeCard(o){
 const l=normLang(o.lang),card=el("div","cc"),h=el("div","cc-h"),dots=el("span","dots");dots.append(el("i"),el("i"),el("i"));
 const acts=el("span","cc-a"),bw=iconBtn("wrap","","Wrap lines"),bd=iconBtn("download","","Download"),bc=iconBtn("copy","Copy","Copy");
 acts.append(bw,bd,bc);
 h.append(dots,el("span","cc-n",o.name||"code"),el("span","cc-badge",langLabel(o.lang)),acts);
 const body=el("div","cc-body"),code=codeLines(o.code,l);body.append(code);card.append(h,body);
 bw.onclick=()=>{code.classList.toggle("wrap");bw.classList.toggle("on")};
 bd.onclick=()=>{o.onDownload?o.onDownload():askDownload({name:o.file||o.name||"snippet.txt",text:o.code,kind:"text"})};
 bc.onclick=async()=>{const sp=bc.querySelector("span");try{await navigator.clipboard.writeText(o.code);sp.textContent="Copied"}catch(e){sp.textContent="Failed"}setTimeout(()=>sp.textContent="Copy",1400)};
 return card}
function renderBody(content){
 const frag=document.createDocumentFragment(),lines=content.split(NL),fence=BT+BT+BT;let buf=[],i=0;
 const flush=()=>{const t=buf.join(NL);buf=[];if(t.trim())frag.append(el("div","body",t))};
 while(i<lines.length){
  const t=lines[i].trim();
  if(t.startsWith(fence)){flush();const lang=t.slice(3).trim(),code=[];i++;
   while(i<lines.length&&!lines[i].trim().startsWith(fence)){code.push(lines[i]);i++}i++;
   const ext={py:"py",js:"js",sh:"sh",json:"json",sql:"sql",yaml:"yml"}[normLang(lang)]||"txt";
   frag.append(codeCard({name:lang||"code",lang:lang||"text",code:code.join(NL),file:"snippet."+ext}));continue}
  buf.push(lines[i]);i++}
 flush();return frag}

/* ---------- download: ask whether to edit first ---------- */
function safeName(n){return String(n||"").split("/").join("_").split(BS).join("_").trim()||"download"}
function saveBlob(name,blob){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
function askDownload(o){
 const dlg=$("#dl"),inp=$("#dlName"),ta2=$("#dlText"),note=$("#dlNote"),now=$("#dlNow"),ed=$("#dlEditBtn");
 const textual=o.text!=null||["text","markdown","json","csv","html"].includes(o.kind);
 const canEdit=o.text!=null||(textual&&!!o.url&&o.size<=2097152);
 let editing=false;
 inp.value=o.name||"download";ta2.value="";ta2.classList.add("hidden");note.textContent="";
 $("#dlAsk").textContent=canEdit?"Do you want to edit this file before downloading?":"Set the file name, then download.";
 ed.classList.toggle("hidden",!canEdit);now.textContent="Download as-is";now.disabled=false;
 dlg.classList.remove("hidden");inp.focus();inp.select();
 const close=()=>dlg.classList.add("hidden");
 $("#dlCancel").onclick=close;dlg.onclick=e=>{if(e.target===dlg)close()};
 ed.onclick=async()=>{ed.disabled=true;note.textContent="";
  try{let t=o.text;if(t==null){const r=await api(o.url);if(!r.ok)throw Error("Could not load the file");t=await r.text()}
   ta2.value=t;ta2.classList.remove("hidden");editing=true;ed.classList.add("hidden");now.textContent="Download edited";$("#dlAsk").textContent="Edit below, then download your version.";ta2.focus()}
  catch(e){note.textContent=e.message||"Could not load the file"}finally{ed.disabled=false}};
 now.onclick=async()=>{now.disabled=true;note.textContent="";const name=safeName(inp.value);
  try{let blob;
   if(editing)blob=new Blob([ta2.value],{type:"text/plain;charset=utf-8"});
   else if(o.text!=null)blob=new Blob([o.text],{type:"text/plain;charset=utf-8"});
   else{const r=await api(o.url);if(!r.ok)throw Error("Download failed");blob=await r.blob()}
   saveBlob(name,blob);close()}
  catch(e){note.textContent=e.message||"Download failed"}finally{now.disabled=false}}}

/* ---------- session / sign-in details ---------- */
function describeSession(info){
 if(!info)return "Synced through Cloudflare";
 const place=[info.city,info.region,info.country].filter(Boolean).join(", ");
 const parts=[place||null,info.device||null].filter(Boolean);
 return parts.length?parts.join(" · "):"Synced through Cloudflare"}
async function loadSessionInfo(){
 try{const r=await api("/api/session");if(!r.ok)return;const d=await r.json();$("#syncInfo").textContent=describeSession(d.lastLogin)}
 catch{/* non-fatal: leave default label */}}

/* ---------- chat features: date chips, context menu, reply/edit/pin/select/tags, search ---------- */
let MSGS=[],REPLY=null,EDIT=null,SEL=null,SEARCHQ="",PIN_I=0,FORCE_BOTTOM=false;
const ART={},TAGS=["⭐","💡","🔥","⚡","📅","✅","❤️"],JSONH={"Content-Type":"application/json"};
function fmtTime(t){return new Date(t*1000).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}
function dayStart(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()}
function dayLabel(t){const d=new Date(t*1000),n=new Date(),diff=Math.round((dayStart(n)-dayStart(d))/86400000);
 if(diff===0)return "Today";if(diff===1)return "Yesterday";
 return d.toLocaleDateString(undefined,diff<7?{weekday:"long"}:{day:"numeric",month:"long",year:d.getFullYear()===n.getFullYear()?undefined:"numeric"})}
function snippet(m){return (m.content||"").trim().split(NL)[0].slice(0,90)||m.filename||"Message"}
async function act(path,method,body,errMsg){
 try{const r=await api(path,{method,headers:JSONH,body:body?JSON.stringify(body):undefined});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||errMsg);await loadMessages();return true}
 catch(e){chatError.textContent=e.message||errMsg;return false}}
const mpath=(m,a)=>"/api/messages/"+encodeURIComponent(m.id)+(a?"/"+a:"");
function showCtx(){const bar=$("#ctxbar");bar.replaceChildren();const cur=EDIT||REPLY;
 if(!cur){bar.classList.add("hidden");$("#attach").disabled=false;return}
 const x=el("button","icon sm");x.type="button";x.title="Cancel";x.append(ic("close"));
 x.onclick=()=>{if(EDIT){ta.value="";grow()}REPLY=null;EDIT=null;showCtx()};
 const t=el("div");t.append(el("b","",EDIT?"Editing message":"Reply to You"),el("span","",snippet(cur)));
 bar.append(ic(EDIT?"edit":"reply"),t,x);bar.classList.remove("hidden");$("#attach").disabled=!!EDIT}
function setReply(m){EDIT=null;REPLY=m;showCtx();ta.focus()}
function setEdit(m){REPLY=null;EDIT=m;ta.value=m.content||"";grow();showCtx();ta.focus()}
function scrollToMsg(id){const a=ART[id];if(!a){chatError.textContent="That message is hidden by the current search.";return}
 a.scrollIntoView({block:"center",behavior:"smooth"});a.classList.add("flash");setTimeout(()=>a.classList.remove("flash"),1300)}
async function delMsgs(ids){
 if(!ids.length||!confirm("Delete "+ids.length+(ids.length>1?" messages":" message")+"? Attached files are removed too."))return;
 if(await act("/api/messages/bulk-delete","POST",{ids},"Delete failed"))exitSelect()}
function syncSel(){const on=!!SEL;$("#messages").classList.toggle("selecting",on);$("#sendForm").classList.toggle("hidden",on);$("#selbar").classList.toggle("hidden",!on);
 for(const id in ART)ART[id].classList.toggle("sel",on&&SEL.has(id));
 if(on){$("#selCount").textContent=SEL.size+" selected";$("#selCopy").disabled=!SEL.size;$("#selDel").disabled=!SEL.size}}
function startSelect(m){SEL=new Set(m?[m.id]:[]);syncSel()}
function exitSelect(){SEL=null;syncSel()}
$("#selX").onclick=exitSelect;
$("#selDel").onclick=()=>delMsgs([...SEL]);
$("#selCopy").onclick=async()=>{const t=MSGS.filter(m=>SEL.has(m.id)&&m.content).map(m=>m.content).join(NL+NL);try{await navigator.clipboard.writeText(t);$("#selCopy").textContent="Copied"}catch(e){$("#selCopy").textContent="Failed"}setTimeout(()=>$("#selCopy").textContent="Copy",1400)};
function renderPinBar(){const bar=$("#pinbar"),pins=MSGS.filter(m=>m.pinned);bar.replaceChildren();
 if(!pins.length){bar.classList.add("hidden");return}
 const i=PIN_I%pins.length,m=pins[pins.length-1-i],t=el("div","pt");
 t.append(el("b","","Pinned message"+(pins.length>1?" #"+(i+1)+" of "+pins.length:"")),el("span","",snippet(m)));
 const x=el("button","icon sm");x.type="button";x.title="Unpin";x.append(ic("close"));
 x.onclick=e=>{e.stopPropagation();act(mpath(m,"pin"),"POST",{pinned:false},"Unpin failed")};
 bar.append(ic("pin"),t,x);bar.classList.remove("hidden");bar.onclick=()=>{scrollToMsg(m.id);PIN_I++;renderPinBar()}}
function closeMenu(){const m=$("#ctx");if(m)m.remove()}
function openMenu(m,x,y){
 closeMenu();const mn=el("div","ctxmenu glass");mn.id="ctx";
 mn.append(el("div","tagnote","Tag this message"));
 const tr=el("div","tagrow");
 TAGS.forEach(t=>{const b=el("button","tg"+(m.tag===t?" on":""),t);b.type="button";b.title=m.tag===t?"Remove tag":"Tag";b.onclick=()=>{closeMenu();act(mpath(m,"tag"),"POST",{tag:m.tag===t?"":t},"Could not tag")};tr.append(b)});
 mn.append(tr);
 const add=(icon,label,fn,o={})=>{const b=el("button","mi"+(o.danger?" danger":""));b.type="button";b.disabled=!!o.off;b.append(ic(icon),el("span","",label));b.onclick=()=>{closeMenu();fn()};mn.append(b)};
 add("reply","Reply",()=>setReply(m));
 add("edit","Edit",()=>setEdit(m));
 add("copy","Copy Text",async()=>{try{await navigator.clipboard.writeText(m.content)}catch(e){chatError.textContent="Copy failed"}},{off:!m.content});
 add("pin",m.pinned?"Unpin":"Pin",()=>act(mpath(m,"pin"),"POST",{pinned:!m.pinned},"Pin failed"));
 if(m.file_id)add("download","Download file",()=>askDownload({name:m.filename,url:fileUrl(m,false),size:Number(m.size_bytes),kind:kindOf(m)}));
 add("sel","Select",()=>startSelect(m));
 add("trash","Delete",()=>delMsgs([m.id]),{danger:true});
 document.body.append(mn);
 const w=mn.offsetWidth,h=mn.offsetHeight;mn.style.left=Math.max(8,Math.min(x,innerWidth-w-8))+"px";mn.style.top=Math.max(8,Math.min(y,innerHeight-h-8))+"px"}
document.addEventListener("click",e=>{const mn=$("#ctx");if(mn&&!mn.contains(e.target))closeMenu()});
document.addEventListener("scroll",closeMenu,true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenu();if(SEL)exitSelect()}});
function bindMenu(item,m){
 item.addEventListener("contextmenu",e=>{if(SEL)return;e.preventDefault();openMenu(m,e.clientX,e.clientY)});
 let tm=null,px=0,py=0;const cancel=()=>{if(tm){clearTimeout(tm);tm=null}};
 item.addEventListener("touchstart",e=>{if(SEL)return;const t=e.touches[0];px=t.clientX;py=t.clientY;tm=setTimeout(()=>{tm=null;openMenu(m,px,py)},550)},{passive:true});
 item.addEventListener("touchmove",cancel,{passive:true});item.addEventListener("touchend",cancel);item.addEventListener("touchcancel",cancel);
 item.addEventListener("click",e=>{if(!SEL)return;e.preventDefault();e.stopPropagation();SEL.has(m.id)?SEL.delete(m.id):SEL.add(m.id);syncSel()},true)}
function renderFeed(list){
 const box=$("#messages"),prev=box.scrollTop,atBottom=FORCE_BOTTOM||box.scrollHeight-prev-box.clientHeight<80;FORCE_BOTTOM=false;
 box.replaceChildren();for(const k in ART)delete ART[k];
 const byId={};MSGS.forEach(m=>{byId[m.id]=m});renderPinBar();
 const q=SEARCHQ.trim().toLowerCase();
 const shown=q?list.filter(m=>((m.content||"")+" "+(m.filename||"")+" "+(m.tag||"")).toLowerCase().includes(q)):list;
 if(!shown.length){box.append(el("div","empty",q?"No messages match your search.":"No messages yet. Send a message or drop a file to begin."));return}
 let lastDay=null;
 for(const m of shown){
  const key=dayStart(new Date(m.created_at*1000));
  if(key!==lastDay){lastDay=key;box.append(el("div","dsep",dayLabel(m.created_at)))}
  const item=el("article","msg"+(m.role==="user"?" user":""));item.dataset.id=m.id;ART[m.id]=item;
  item.append(el("span","chk"));
  if(m.reply_to){const o=byId[m.reply_to],qt=el("div","quote");qt.append(el("b","",o?"You":"Reply"),el("span","",o?snippet(o):"Deleted message"));qt.onclick=e=>{e.stopPropagation();if(o)scrollToMsg(o.id)};item.append(qt)}
  if(m.content)item.append(renderBody(m.content));
  if(m.file_id)item.append(attachCard(m));
  const st=el("div","stamp"),tm=el("span","",fmtTime(m.created_at));tm.title=fmtDate(m.created_at);st.append(tm);
  if(m.edited_at)st.append(el("span","","edited"));
  if(m.pinned){const p=el("span","pinned");p.title="Pinned";p.append(ic("pin"));st.append(p)}
  if(m.tag)st.append(el("span","tagbadge",m.tag));
  let panel=null;
  try{if(m.details)panel=detailGrid(JSON.parse(m.details))}catch(e){panel=null}
  if(panel){const tg=el("button","dtog");tg.type="button";tg.setAttribute("aria-expanded","false");tg.append(el("span","","Details"),ic("chev"));
   tg.onclick=()=>{const open=panel.classList.toggle("hidden")===false;tg.classList.toggle("open",open);tg.setAttribute("aria-expanded",String(open))};st.append(tg)}
  const mb=el("button","more");mb.type="button";mb.title="Message actions";mb.setAttribute("aria-label","Message actions");mb.append(ic("more"));
  mb.onclick=e=>{e.stopPropagation();const r=mb.getBoundingClientRect();openMenu(m,r.left-200,r.bottom+4)};st.append(mb);
  item.append(st);if(panel)item.append(panel);bindMenu(item,m);box.append(item)}
 box.scrollTop=atBottom?box.scrollHeight:prev;syncSel()}
$("#searchBtn").onclick=()=>{const b=$("#searchbar");b.classList.toggle("hidden");if(!b.classList.contains("hidden"))$("#q").focus();else{SEARCHQ="";$("#q").value="";renderFeed(MSGS)}};
$("#q").addEventListener("input",e=>{SEARCHQ=e.target.value;renderFeed(MSGS)});

/* ---------- ask for location when the user enters the page ---------- */
async function askLocationOnEntry(){
 const dlg=$("#geoAsk");if(TH.geoNever||!dlg.classList.contains("hidden"))return;
 let st="prompt";try{if(navigator.permissions)st=(await navigator.permissions.query({name:"geolocation"})).state}catch(e){}
 if(st==="denied"){TH.geo=false;applyTheme();return}
 if(TH.geo&&st==="granted")return;
 try{if(sessionStorage.getItem("ws.geoSkip"))return}catch(e){}
 const msg=$("#geoMsg");msg.textContent="";$("#geoNever").checked=false;dlg.classList.remove("hidden");
 const done=()=>{dlg.classList.add("hidden");buildThemePanel();applyTheme()};
 $("#geoNo").onclick=()=>{if($("#geoNever").checked)TH.geoNever=true;try{sessionStorage.setItem("ws.geoSkip","1")}catch(e){}TH.geo=false;done()};
 $("#geoYes").onclick=async()=>{const b=$("#geoYes");b.disabled=true;
  try{await getPos();TH.geo=true;TH.geoNever=false;done()}
  catch(e){TH.geo=false;msg.textContent=e&&e.code===1?"Permission was denied in the browser.":"Location is unavailable right now."}
  finally{b.disabled=false}}}

/* ---------- chat ---------- */
let files=[];
function attachCard(m){
 const b=el("button","att");b.type="button";b.title="Preview "+m.filename;
 const t=thumbFor(m);if(t)b.append(t);
 const meta=el("div","att-meta");const info=el("div");info.append(el("b","",m.filename),el("small","",kindOf(m).toUpperCase()+" · "+fmtSize(m.size_bytes)));
 meta.append(badge(m),info);b.append(meta);
 b.onclick=()=>openViewer(files,files.findIndex(x=>x.file_id===m.file_id));
 return b}
function renderGrid(){
 const g=$("#grid");g.replaceChildren();const list=files.slice().reverse();
 if(!list.length){g.append(el("div","empty","No files yet. Attach one from the chat."));return}
 list.forEach((f,i)=>{
  const t=el("button","tile");t.type="button";
  const th=el("div","thumb");const tn=thumbFor(f);th.append(tn||badge(f,true));
  t.append(th,el("b","",f.filename),el("small","",kindOf(f).toUpperCase()+" · "+fmtSize(f.size_bytes)));
  t.onclick=()=>openViewer(list,i);g.append(t)})}
async function loadMessages(){
 const r=await api("/api/messages");if(!r.ok)throw Error("Could not load messages");
 const data=await r.json();files=data.messages.filter(m=>m.file_id);
 $("#fileCount").textContent=files.length;MSGS=data.messages;renderFeed(MSGS);renderGrid()}
async function check(){try{const r=await api("/api/session");if(r.ok){showApp(true);$("#syncInfo").textContent=describeSession((await r.clone().json()).lastLogin);await loadMessages();askLocationOnEntry()}else showApp(false)}catch(e){if(!String(e).includes("Temporarily locked"))showApp(false)}}

/* ---------- refresh ---------- */
$("#refresh").onclick=async()=>{
 const b=$("#refresh");if(b.disabled)return;b.disabled=true;b.classList.add("spin");chatError.textContent="";
 try{await loadMessages()}catch(e){chatError.textContent=e.message||"Could not refresh"}
 finally{b.disabled=false;b.classList.remove("spin")}};

/* ---------- tabs ---------- */
function tab(name){const chat=name==="chat";$("#chatView").classList.toggle("hidden",!chat);$("#filesView").classList.toggle("hidden",chat);$("#tabChat").classList.toggle("on",chat);$("#tabFiles").classList.toggle("on",!chat)}
$("#tabChat").onclick=()=>tab("chat");$("#tabFiles").onclick=()=>tab("files");

/* ---------- composer (multiple attachments per message) ---------- */
let pendingFiles=[];
const ta=$("#message");
function grow(){ta.style.height="auto";ta.style.height=Math.min(ta.scrollHeight,180)+"px"}
ta.addEventListener("input",grow);
ta.addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();$("#sendForm").requestSubmit()}});
ta.addEventListener("paste",e=>{const fl=e.clipboardData&&e.clipboardData.files;if(fl&&fl.length){e.preventDefault();addPending(fl)}});
function renderPending(){
 const box=$("#pending");box.replaceChildren();
 if(!pendingFiles.length){box.classList.add("hidden");return}
 box.classList.remove("hidden");
 pendingFiles.forEach((entry,idx)=>{
  const file=entry.file;const meta={filename:file.name,content_type:file.type};let th;
  if(kindOf(meta)==="image"){if(!entry.url)entry.url=URL.createObjectURL(file);th=el("img","pthumb");th.src=entry.url;th.alt=""}else th=badge(meta);
  const info=el("div","pinfo");info.append(el("b","",file.name),el("small","",fmtSize(file.size)));
  const x=el("button","icon sm");x.type="button";x.title="Remove";x.append(ic("close"));
  x.onclick=()=>{if(entry.url)URL.revokeObjectURL(entry.url);pendingFiles.splice(idx,1);renderPending()};
  const row=el("div","pending-item");row.append(th,info,x);box.append(row)})}
function clearPending(){pendingFiles.forEach(e=>{if(e.url)URL.revokeObjectURL(e.url)});pendingFiles=[];renderPending();$("#file").value=""}
function addPending(fileList){
 chatError.textContent="";
 for(const file of fileList){
  if(pendingFiles.length>=MAXFILES){chatError.textContent="You can attach up to "+MAXFILES+" files at once";break}
  if(file.size>MAXFILE){chatError.textContent="Maximum file size is 10 MB (skipped "+file.name+")";continue}
  pendingFiles.push({file})}
 renderPending()}
$("#attach").onclick=()=>$("#file").click();
$("#file").addEventListener("change",e=>{addPending(e.target.files)});
let dragDepth=0;
window.addEventListener("dragenter",e=>{if(appBox.classList.contains("hidden"))return;e.preventDefault();dragDepth++;$("#drop").classList.remove("hidden")});
window.addEventListener("dragover",e=>e.preventDefault());
window.addEventListener("dragleave",()=>{dragDepth=Math.max(0,dragDepth-1);if(!dragDepth)$("#drop").classList.add("hidden")});
window.addEventListener("drop",e=>{e.preventDefault();dragDepth=0;$("#drop").classList.add("hidden");if(appBox.classList.contains("hidden"))return;const fl=e.dataTransfer&&e.dataTransfer.files;if(fl&&fl.length){tab("chat");addPending(fl)}});

$("#sendForm").addEventListener("submit",async e=>{
 e.preventDefault();chatError.textContent="";const b=$("#send");const msg=ta.value.trim();
 if(EDIT){
  if(!msg&&!EDIT.file_id){chatError.textContent="Message cannot be empty";return}
  b.disabled=true;
  try{const r=await api(mpath(EDIT),{method:"PATCH",headers:JSONH,body:JSON.stringify({content:ta.value})});
   const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"Edit failed");
   EDIT=null;showCtx();ta.value="";grow();await loadMessages()}
  catch(err){chatError.textContent=err.message||"Edit failed"}finally{b.disabled=false}
  return}
 if(!msg&&!pendingFiles.length)return;b.disabled=true;
 try{
  const det=JSON.stringify(await collectDetails()),rid=REPLY?REPLY.id:"";
  if(pendingFiles.length){
   for(let i=0;i<pendingFiles.length;i++){
    const fd=new FormData();fd.append("file",pendingFiles[i].file);if(i===0&&msg)fd.append("message",msg);if(i===0&&rid)fd.append("reply_to",rid);fd.append("details",det);
    const r=await api("/api/upload",{method:"POST",body:fd});const d=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(d.error||("Upload failed for "+pendingFiles[i].file.name))}
   clearPending()
  }else{
   const r=await api("/api/messages",{method:"POST",headers:JSONH,body:JSON.stringify({content:ta.value,details:det,reply_to:rid})});
   const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"Save failed")}
  REPLY=null;showCtx();FORCE_BOTTOM=true;ta.value="";grow();await loadMessages()
 }catch(err){chatError.textContent=err.message||"Unable to save"}finally{b.disabled=false}});

/* ---------- login / logout ---------- */
$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();const b=$("#submit");b.disabled=true;loginError.textContent="";
 try{const r=await api("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:$("#password").value})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok){if(d.locked||r.status===423){location.replace(d.redirect||"https://www.the-raghavan.com");return}
   loginError.textContent=r.status===429?"Too many attempts.":"Incorrect password. "+(d.attemptsLeft??"Try again")+" attempt(s) remaining.";return}
  $("#password").value="";showApp(true);await loadSessionInfo();await loadMessages();askLocationOnEntry()
 }catch{loginError.textContent="Unable to connect. Please try again."}finally{b.disabled=false}});
$("#logout").onclick=async()=>{await api("/api/logout",{method:"POST"});closeViewer();clearPending();showApp(false)};

/* ---------- viewer ---------- */
let vList=[],vIdx=0,vTok=0;
function note(t){return el("div","v-note",t)}
function openViewer(list,idx){if(idx<0)return;vList=list;vIdx=idx;$("#viewer").classList.remove("hidden");document.body.classList.add("noscroll");showFile()}
function closeViewer(){vTok++;$("#viewer").classList.add("hidden");$("#stage").replaceChildren();document.body.classList.remove("noscroll")}
function step(d){if(!vList.length) return;vIdx = (vIdx + d + vList.length) % vList.length;showFile();}
$("#vclose").onclick=closeViewer;$("#vprev").onclick=()=>step(-1);$("#vnext").onclick=()=>step(1);
$("#viewer").addEventListener("click",e=>{if(e.target.id==="viewer")closeViewer()});
document.addEventListener("keydown",e=>{if($("#viewer").classList.contains("hidden"))return;
 if(e.key==="Escape")closeViewer();else if(e.key==="ArrowLeft")step(-1);else if(e.key==="ArrowRight")step(1)});

async function showFile(){
 const f=vList[vIdx],k=kindOf(f),tok=++vTok;
 $("#vname").textContent=f.filename;
 $("#vmeta").textContent=[k.toUpperCase(),fmtSize(f.size_bytes),fmtDate(f.created_at)].join(" · ");
 $("#vcount").textContent=(vIdx+1)+" / "+vList.length;
 $("#vprev").disabled = vList.length <= 1;
$("#vnext").disabled = vList.length <= 1;
 $("#vdl").onclick=e=>{e.preventDefault();askDownload({name:f.filename,url:fileUrl(f,false),size:Number(f.size_bytes),kind:k})};
 const openable=["image","video","audio","pdf"].includes(k);
 $("#vopen").classList.toggle("hidden",!openable);$("#vopen").href=fileUrl(f,true);
 const stage=$("#stage");stage.replaceChildren(note("Loading preview…"));
 try{const node=await buildView(f,k);if(tok!==vTok)return;stage.replaceChildren(node)}
 catch(e){if(tok!==vTok)return;stage.replaceChildren(note("Preview failed: "+(e.message||"unknown error")+". You can still download the file."))}}

async function buildView(f,k){
 const url=fileUrl(f,true);
 if(k==="image"){const img=el("img","v-img");img.alt=f.filename;img.title="Click to toggle zoom";img.src=url;
  img.onclick=()=>img.classList.toggle("actual");img.onerror=()=>img.replaceWith(note("This image could not be displayed. Use Download to open it."));return img}
 if(k==="video"){const v=el("video","v-media");v.controls=true;v.playsInline=true;v.src=url;
  v.onerror=()=>v.replaceWith(note("Your browser cannot play this video format. Use Download."));return v}
 if(k==="audio"){const w=el("div","v-audio");w.append(badge(f,true),el("b","",f.filename));const a=document.createElement("audio");a.controls=true;a.src=url;
  a.onerror=()=>a.replaceWith(note("Your browser cannot play this audio format. Use Download."));w.append(a);return w}
 if(k==="pdf"){const fr=el("iframe","v-frame");fr.title=f.filename;fr.src=url;return fr}
 if(Number(f.size_bytes)===0)return note("This file is empty.");
 const r=await api(url,{headers:{Range:"bytes=0-"+(LIMIT-1)}});
 if(!r.ok&&r.status!==206)throw Error("could not load the file");
 let buf=new Uint8Array(await r.arrayBuffer());
 const truncated=Number(f.size_bytes)>LIMIT||buf.length>LIMIT;if(buf.length>LIMIT)buf=buf.slice(0,LIMIT);
 return docView(f,k,buf,truncated)}

function looksBinary(b){const n=Math.min(b.length,4000);if(!n)return false;let bad=0;
 for(let i=0;i<n;i++){const c=b[i];if(c===0)return true;if(c<9||(c>13&&c<32&&c!==27))bad++}return bad/n>0.05}
function hexDump(b){const out=[],n=Math.min(b.length,2048);
 for(let o=0;o<n;o+=16){let hx="",as="";
  for(let j=0;j<16;j++){if(o+j<n){const c=b[o+j];hx+=c.toString(16).padStart(2,"0")+" ";as+=(c>31&&c<127)?String.fromCharCode(c):"."}else hx+="   ";if(j===7)hx+=" "}
  out.push(o.toString(16).padStart(8,"0")+"  "+hx+" |"+as+"|")}
 return out.join(NL)}
function parseCSV(text,d){const rows=[];let row=[],cur="",q=false;
 for(let i=0;i<text.length&&rows.length<=500;i++){const c=text[i];
  if(q){if(c==='"'){if(text[i+1]==='"'){cur+='"';i++}else q=false}else cur+=c}
  else if(c==='"')q=true;
  else if(c===d){row.push(cur);cur=""}
  else if(c===NL){row.push(cur);rows.push(row);row=[];cur=""}
  else if(c!==CR)cur+=c}
 if(cur||row.length){row.push(cur);rows.push(row)}return rows}

function inline(parent,s){let i=0,buf="";
 const flush=()=>{if(buf){parent.append(document.createTextNode(buf));buf=""}};
 while(i<s.length){
  if(s[i]===BT){const j=s.indexOf(BT,i+1);if(j>i){flush();parent.append(el("code","",s.slice(i+1,j)));i=j+1;continue}}
  if(s.startsWith("**",i)){const j=s.indexOf("**",i+2);if(j>i){flush();const b=el("strong");inline(b,s.slice(i+2,j));parent.append(b);i=j+2;continue}}
  if(s[i]==="*"){const j=s.indexOf("*",i+1);if(j>i+1){flush();const b=el("em");inline(b,s.slice(i+1,j));parent.append(b);i=j+1;continue}}
  if(s[i]==="["){const j=s.indexOf("](",i);const k=j>0?s.indexOf(")",j):-1;
   if(j>i&&k>j){const u=s.slice(j+2,k);if(u.startsWith("https://")||u.startsWith("http://")){flush();const a=el("a","",s.slice(i+1,j));a.href=u;a.target="_blank";a.rel="noopener noreferrer";parent.append(a);i=k+1;continue}}}
  buf+=s[i];i++}
 flush()}
function mdRender(text){
 const root=document.createDocumentFragment(),lines=text.split(NL),fence=BT+BT+BT;let i=0,para=[],list=null,lt="";
 const endPara=()=>{if(para.length){const p=el("p");inline(p,para.join(" "));root.append(p);para=[]}};
 while(i<lines.length){
  const t=lines[i].trim();
  if(t.startsWith(fence)){endPara();list=null;const code=[];i++;while(i<lines.length&&!lines[i].trim().startsWith(fence)){code.push(lines[i]);i++}i++;root.append(el("pre","md-code",code.join(NL)));continue}
  if(!t){endPara();list=null;i++;continue}
  let h=0;while(h<t.length&&t[h]==="#")h++;
  if(h>0&&h<=6&&t[h]===" "){endPara();list=null;const e=el("h"+h);inline(e,t.slice(h+1));root.append(e);i++;continue}
  if(t==="---"||t==="***"){endPara();list=null;root.append(el("hr"));i++;continue}
  if(t.startsWith("> ")){endPara();list=null;const q=el("blockquote");inline(q,t.slice(2));root.append(q);i++;continue}
  const bullet=t.startsWith("- ")||t.startsWith("* "),dot=t.indexOf(". "),ordered=dot>0&&dot<4&&!isNaN(Number(t.slice(0,dot)));
  if(bullet||ordered){endPara();const type=bullet?"ul":"ol";if(!list||lt!==type){list=el(type);lt=type;root.append(list)}const li=el("li");inline(li,bullet?t.slice(2):t.slice(dot+2));list.append(li);i++;continue}
  list=null;para.push(t);i++}
 endPara();return root}

function docView(f,k,buf,truncated){
 const wrap=el("div","v-doc"),tools=el("div","v-tools"),body=el("div","v-body bare");wrap.append(tools,body);
 const dl=()=>askDownload({name:f.filename,url:fileUrl(f,false),size:Number(f.size_bytes),kind:k});
 if(k==="other"&&looksBinary(buf)){
  tools.append(el("span","chip","No visual preview · first "+Math.min(buf.length,2048)+" bytes as hex"));
  body.append(codeCard({name:f.filename,lang:"hex",code:hexDump(buf),onDownload:dl}));return wrap}
 const text=new TextDecoder("utf-8").decode(buf);
 const modes=k==="markdown"?["Rendered","Source"]:k==="html"?["Rendered","Source"]:k==="csv"?["Table","Source"]:k==="json"?["Formatted","Source"]:["Source"];
 let segs=[];
 const render=m=>{
  body.replaceChildren();body.classList.remove("flush");body.classList.add("bare");segs.forEach(b=>b.classList.toggle("on",b.dataset.m===m));
  if(m==="Rendered"&&k==="markdown"){body.classList.remove("bare");const d=el("div","md");d.append(mdRender(text));body.append(d);return}
  if(m==="Rendered"&&k==="html"){body.classList.remove("bare");body.classList.add("flush");const fr=document.createElement("iframe");fr.setAttribute("sandbox","allow-scripts");fr.setAttribute("referrerpolicy", "no-referrer");fr.srcdoc=text;fr.title="HTML preview";body.append(fr);return}
  if(m==="Table"){body.classList.remove("bare");const rows=parseCSV(text,extOf(f.filename)==="tsv"?String.fromCharCode(9):",");
   if(!rows.length){body.append(note("No rows found."));return}
   const t=el("table","tbl"),head=el("tr");rows[0].forEach(c=>head.append(el("th","",c)));t.append(head);
   rows.slice(1,501).forEach(r=>{const tr=el("tr");r.forEach(c=>tr.append(el("td","",c)));t.append(tr)});body.append(t);return}
  let out=text;
  if(m==="Formatted"&&!truncated){try{out=JSON.stringify(JSON.parse(text),null,2)}catch(e){}}
  body.append(codeCard({name:f.filename,lang:extOf(f.filename),code:out,onDownload:dl}))};
 if(modes.length>1){const sg=el("div","seg");modes.forEach(m=>{const b=el("button","",m);b.type="button";b.dataset.m=m;b.onclick=()=>render(m);segs.push(b);sg.append(b)});tools.append(sg)}
 if(truncated)tools.append(el("span","chip","Showing first "+fmtSize(LIMIT)+" of "+fmtSize(f.size_bytes)));
 render(modes[0]);return wrap}

/* ---------- extra icons ---------- */
Object.assign(P,{
 device:"M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z",
 screen:"M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z",
 wifi:"M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
 place:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
 globe:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
 clock:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
 lang:"M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z",
 check:"M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
 person:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
 lock:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
});
 
/* Inter = closest free stand-in for San Francisco on non-Apple devices */
(function(){const l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";document.head.append(l)})();
 
/* ---------- loading & progress indicators ---------- */
const LP=el("div","lp");LP.setAttribute("role","progressbar");LP.setAttribute("aria-label","Loading");LP.append(el("i"),el("i"));document.body.append(LP);
let _busy=0;
function busy(d){
 _busy=Math.max(0,_busy+d);
 if(_busy>0)LP.classList.add("on");
 else{LP.classList.remove("on");setTimeout(()=>{if(!_busy){LP.classList.remove("det");LP.style.setProperty("--p",0)}},350)}}
function setProg(p){LP.classList.add("det");LP.style.setProperty("--p",Math.max(0,Math.min(1,p)))}
function spin(sz){
 const s=el("span","cpw");s.style.setProperty("--sz",(sz||40)+"px");
 s.innerHTML='<svg class="cp" viewBox="0 0 48 48" aria-hidden="true"><circle class="t" cx="24" cy="24" r="18"/><circle class="i" cx="24" cy="24" r="18"/></svg>';return s}
 
/* every api() call drives the top bar; uploads use XHR so the bar becomes determinate */
const _apiBase=window.api;
function xhrUpload(path,opts){
 return new Promise((res,rej)=>{
  const x=new XMLHttpRequest();x.open(opts.method||"POST",path);
  x.upload.onprogress=e=>{if(e.lengthComputable)setProg(e.loaded/e.total)};
  x.onload=()=>{
   setProg(1);
   if(x.status===423){location.replace("https://www.the-raghavan.com");rej(Error("Temporarily locked"));return}
   res(new Response(x.responseText,{status:x.status||500,headers:{"Content-Type":"application/json"}}))};
  x.onerror=()=>rej(Error("Network error"));
  x.send(opts.body)})}
window.api=async function(path,opts={}){
 busy(1);
 try{
  if(path==="/api/upload"&&typeof FormData!=="undefined"&&opts.body instanceof FormData)return await xhrUpload(path,opts);
  return await _apiBase(path,opts)}
 finally{busy(-1)}};
 
/* loading states with circular indicators */
(function(){const e=$("#messages").querySelector(".empty");if(e){e.classList.add("load");e.replaceChildren(spin(48),el("span","","Loading messages…"))}})();
window.note=function(t){
 const d=el("div","v-note");
 if(/^Loading/.test(t)){d.classList.add("load");d.append(spin(48),el("div","",t))}else d.textContent=t;
 return d};
 
/* ---------- appearance & settings → M3 side sheet (bottom sheet on phones) ---------- */
const SCRIM=el("div","scrim");document.body.append(SCRIM);
const TP=$("#themePanel");
function sheetHead(){
 const h=el("div","sheet-h"),x=el("button","icon sm");x.type="button";x.title="Close";x.setAttribute("aria-label","Close");x.append(ic("close"));
 x.onclick=e=>{e.stopPropagation();TP.classList.add("hidden")};
 h.append(el("div","sheet-handle"),el("b","","Appearance & settings"),x);return h}
const _btp=window.buildThemePanel;
window.buildThemePanel=function(){_btp();TP.prepend(sheetHead())};
buildThemePanel();applyTheme();
new MutationObserver(()=>SCRIM.classList.toggle("on",!TP.classList.contains("hidden"))).observe(TP,{attributes:true,attributeFilter:["class"]});
 
/* ---------- account menu (user details) — M3 menu ---------- */
let LAST=null;
const _ds=window.describeSession;
window.describeSession=function(i){if(i)LAST=i;return _ds(i)};
function ago(t){
 const s=Math.max(0,Math.floor(Date.now()/1000-t));if(s<60)return "Just now";
 const m=Math.floor(s/60);if(m<60)return m+" min ago";
 const h=Math.floor(m/60);if(h<24)return h+(h===1?" hour":" hours")+" ago";
 const d=Math.floor(h/24);return d+(d===1?" day":" days")+" ago"}
function mrow(icon,label,value){const r=el("div","mrow"),t=el("div");t.append(el("small","",label),el("b","",value));r.append(ic(icon),t);return r}
function openAccount(btn){
 closeMenu();
 const mn=el("div","ctxmenu glass wide");mn.id="ctx";mn.dataset.acct="1";
 const place=LAST?[LAST.city,LAST.region,LAST.country].filter(Boolean).join(", "):"";
 const hd=el("div","mhead"),av=el("span","mav"),ht=el("div");
 av.append(ic("person"));ht.append(el("b","","Admin"),el("small","",place?"Signed in from "+place:"Private workspace"));hd.append(av,ht);mn.append(hd);
 mn.append(el("div","msec","Last sign-in"),
  mrow("place","Location",place||"Not available"),
  mrow("device","Browser",(LAST&&LAST.device)||"Not available"),
  mrow("clock","When",LAST&&LAST.created_at?ago(LAST.created_at)+" · "+fmtDate(LAST.created_at):"Not available"));
 const n=navigator;
 mn.append(el("div","msec","This device"),
  mrow("device","Device",deviceLabel(n.userAgent||"",n.userAgentData&&n.userAgentData.mobile)),
  mrow("screen","Screen",screen.width+"×"+screen.height+" @"+(window.devicePixelRatio||1)+"x"),
  mrow("lang","Language",n.language||"—"),
  mrow("clock","Timezone",(Intl.DateTimeFormat().resolvedOptions().timeZone)||"—"));
 mn.append(el("div","mdiv"));
 const item=(icon,label,fn,o={})=>{
  const b=el("button","mi"+(o.danger?" danger":""));b.type="button";b.append(ic(icon),el("span","",label));
  if(o.tr)b.append(el("span","tr",o.tr));
  /* run after the click finishes so outside-click handlers don't close what we open */
  b.onclick=()=>{closeMenu();setTimeout(fn,0)};mn.append(b)};
 item("palette","Appearance & settings",()=>$("#themeBtn").click(),{tr:TH.mode[0].toUpperCase()+TH.mode.slice(1)});
 item("search","Search messages",()=>$("#searchBtn").click());
 item("refresh","Refresh",()=>$("#refresh").click());
 mn.append(el("div","mdiv"));
 item("lock","Lock workspace",()=>$("#logout").click(),{danger:true});
 document.body.append(mn);
 const w=mn.offsetWidth,r=btn.getBoundingClientRect();
 mn.style.left=Math.max(8,Math.min(r.right-w,innerWidth-w-8))+"px";
 mn.style.top=(r.bottom+6)+"px";mn.style.transformOrigin="top right"}
const AB=el("button","icon acct");AB.type="button";AB.id="acctBtn";AB.title="Account";AB.setAttribute("aria-label","Account");AB.append(ic("person"));
$("#searchBtn").before(AB);
AB.onclick=e=>{e.stopPropagation();const o=$("#ctx");if(o&&o.dataset.acct){closeMenu();return}openAccount(AB)};
 
/* scrolling inside a menu/sheet must not close it */
const _cm=window.closeMenu;
window.closeMenu=function(){
 const m=$("#ctx"),ev=window.event;
 if(m&&ev&&ev.type==="scroll"&&ev.target&&ev.target!==document&&m.contains(ev.target))return;
 _cm()};

/* ---------- highlight.js (loaded on demand; re-renders when ready) ---------- */
(function(){
 const s=document.createElement("script");
 s.src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js";
 s.async=true;
 s.onload=()=>{try{if(typeof MSGS!=="undefined"&&MSGS.length)renderFeed(MSGS)}catch(e){}};
 document.head.append(s);
})();

const _origCodeLines=window.codeLines;
const LANG_DOT={py:"#3776ab",python:"#3776ab",js:"#f7df1e",javascript:"#f7df1e",mjs:"#f7df1e",jsx:"#61dafb",ts:"#3178c6",typescript:"#3178c6",tsx:"#3178c6",sh:"#4eaa25",bash:"#4eaa25",zsh:"#4eaa25",shell:"#4eaa25",json:"#cbcb41",html:"#e34c26",css:"#7e57c2",sql:"#e38c00",yml:"#cb171e",yaml:"#cb171e",go:"#00add8",rs:"#dea584",rust:"#dea584",java:"#b07219",c:"#6e8bb5",cpp:"#f34b7d",php:"#8892bf",md:"#519aba",markdown:"#519aba"};

/* split highlight.js html into per-line html, re-opening spans that cross line breaks */
function hlLines(html){
 const out=[],stack=[],re=/<span[^>]*>|<\/span>/g;
 for(const raw of html.split(NL)){
  let line=stack.join("")+raw,m;re.lastIndex=0;
  while((m=re.exec(raw)))m[0]==="</span>"?stack.pop():stack.push(m[0]);
  out.push(line+"</span>".repeat(stack.length))}
 return out}

window.codeLines=function(code,l,rawLang){
 const lang=String(rawLang||"").toLowerCase(),H=window.hljs;
 if(H&&lang&&lang!=="hex"&&H.getLanguage(lang)&&code.length<200000){
  try{
   const html=H.highlight(String(code).split(CR).join(""),{language:lang,ignoreIllegals:true}).value;
   const rows=hlLines(html),box=el("div","code");
   box.style.setProperty("--lnw",String(rows.length).length+"ch");
   rows.forEach(h=>{const ln=el("div","l"),c=el("span","c hljs");c.innerHTML=h||" ";ln.append(c);box.append(ln)});
   return box}catch(e){}}
 return _origCodeLines(code,l)};

/* ---------- code card v2 ---------- */
window.codeCard=function(o){
 const l=normLang(o.lang),lang=String(o.lang||"").toLowerCase(),lines=String(o.code).split(NL).length;
 const card=el("div","cc"),h=el("div","cc-h");
 const chip=el("span","cc-lang"),dot=el("i");
 dot.style.setProperty("--ld",LANG_DOT[lang]||"var(--primary)");
 chip.append(dot,el("span","",langLabel(o.lang)));
 const acts=el("span","cc-a"),bw=iconBtn("wrap","","Wrap lines"),bd=iconBtn("download","","Download"),bc=iconBtn("copy","Copy","Copy");
 bc.classList.add("copy");acts.append(bw,bd,bc);
 h.append(chip,el("span","cc-n",o.name||"code"),el("span","cc-meta",lines+(lines===1?" line":" lines")),acts);
 const view=el("div","cc-view"),body=el("div","cc-body"),code=window.codeLines(o.code,l,lang);
 body.append(code);view.append(body,el("div","cc-fade"));card.append(h,view);
 /* collapse long snippets in chat (viewer passes onDownload and stays expanded) */
 if(!o.onDownload&&lines>18){
  card.classList.add("collapsed");
  const more=el("button","cc-more");more.type="button";
  const lab=el("span","","Show all "+lines+" lines");more.append(lab,ic("chev"));
  more.onclick=()=>{const c=card.classList.toggle("collapsed");lab.textContent=c?"Show all "+lines+" lines":"Show less";if(c)body.scrollTop=0};
  card.append(more)}
 bw.onclick=()=>{code.classList.toggle("wrap");bw.classList.toggle("on")};
 bd.onclick=()=>{o.onDownload?o.onDownload():askDownload({name:o.file||o.name||"snippet.txt",text:o.code,kind:"text"})};
 bc.onclick=async()=>{
  const set=(t,ok)=>{bc.replaceChildren(ic(ok?"check":"copy"),el("span","",t));bc.classList.toggle("done",!!ok)};
  try{await navigator.clipboard.writeText(o.code);set("Copied",true)}catch(e){set("Failed",false)}
  setTimeout(()=>set("Copy",false),1600)};
 return card};
Object.assign(P,{
 back:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
 settings:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
 note:"M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
 attach:"M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z",
 code:"M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
 img:"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
 info:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
});
/* ---------- details dropdown ---------- */
window.detailGrid=function(d){
 const c=d.client||{},s=d.server||{},off=c.tzOffset;
 const tz=c.timezone?c.timezone+(typeof off==="number"?" (UTC"+(off<0?"-":"+")+Math.floor(Math.abs(off)/60)+":"+String(Math.abs(off)%60).padStart(2,"0")+")":""):(s.timezone||"—");
 const area=[s.city,s.region,s.country].filter(Boolean).join(", ");
 let loc="Not shared",map=null;
 if(c.geo){loc=c.geo.lat.toFixed(5)+", "+c.geo.lon.toFixed(5)+" (±"+Math.round(c.geo.acc||0)+" m)";map="https://www.openstreetmap.org/?mlat="+c.geo.lat.toFixed(5)+"&mlon="+c.geo.lon.toFixed(5)}
 else if(c.geoError)loc="Not shared ("+c.geoError+")";
 const rows=[
  ["device","Device",c.device||"—"],
  ["device","Device model",c.model||"Not exposed by browser"],
  ["screen","Screen",c.screen?c.screen+" @"+(c.dpr||1)+"x · viewport "+c.viewport:"—"],
  ["lang","Language",c.language?c.language+(c.languages&&c.languages.length>1?" ("+c.languages.join(", ")+")":""):"—"],
  ["wifi","Network",netText(c,s)],
  ["clock","Timezone",tz],
  ["place","Location",loc,map],
  ["place","Approx. area",area||"—"],
  ["globe","IP address",s.ip||"—"]];
 const wrap=el("div","dwrap"),inner=el("div","dinner"),head=el("div","dhead"),grid=el("div","dgrid");
 const cp=el("button","dcopy");cp.type="button";cp.append(ic("copy"),el("span","","Copy"));
 cp.onclick=async()=>{
  const set=(t,ok)=>{cp.replaceChildren(ic(ok?"check":"copy"),el("span","",t));cp.classList.toggle("done",!!ok)};
  try{await navigator.clipboard.writeText(rows.map(r=>r[1]+": "+r[2]).join(NL));set("Copied",true)}catch(e){set("Failed",false)}
  setTimeout(()=>set("Copy",false),1600)};
 head.append(el("span","","Message details"),cp);
 rows.forEach((r,i)=>{
  const row=el("div","drow"),ico=el("span","dico"),tx=el("div","dtx"),v=el("b","",String(r[2]));
  row.style.setProperty("--i",i);ico.append(ic(r[0]));
  if(r[3]){const a=el("a","","Map");a.href=r[3];a.target="_blank";a.rel="noopener noreferrer";v.append(a)}
  tx.append(el("small","",r[1]),v);row.append(ico,tx);grid.append(row)});
 inner.append(head,grid);wrap.append(inner);
 /* renderFeed toggles the "hidden" class; map that to an animated open/close instead */
 wrap.classList.toggle=function(cls){
  if(cls!=="hidden")return DOMTokenList.prototype.toggle.apply(this,arguments);
  const open=!wrap.classList.contains("open");
  DOMTokenList.prototype.toggle.call(wrap.classList,"open",open);
  return !open};
 return wrap};

/* ---------- ripple ---------- */
document.addEventListener("pointerdown",e=>{
 const t=e.target.closest(".btn,.ghost,.icon,.tabs button,.mi,.sw,.tile,.att,.tg,.cc-btn,.cc-more,.dcopy,.dtog,.seg button,.pinbar");
 if(!t||t.disabled)return;
 const r=t.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement("span");
 s.className="rip";
 s.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";
 t.append(s);setTimeout(()=>s.remove(),650)});

/* m3-patch-3.js — paste ABOVE the final (after patch 2). */

Object.assign(P,{
 back:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
 settings:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
 note:"M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
 attach:"M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z",
 code:"M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
 img:"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
 info:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
});

/* ---------- text size (M3 slider) ---------- */
TH.ts=Number(TH.ts)||1;
const _at=window.applyTheme;
window.applyTheme=function(){
 _at();document.documentElement.style.setProperty("--ts",TH.ts);
 document.querySelectorAll(".sl").forEach(w=>{
  const i=w.querySelector("input"),o=w.querySelector("output");
  i.value=TH.ts;i.style.setProperty("--p",(TH.ts-i.min)/(i.max-i.min)*100+"%");o.textContent=Math.round(TH.ts*100)+"%"})};
function makeSlider(){
 const w=el("div","sl"),a=el("span","","A"),b=el("span","","A"),i=document.createElement("input"),o=el("output");
 a.style.fontSize="12px";b.style.fontSize="20px";
 i.type="range";i.min=.85;i.max=1.5;i.step=.05;i.setAttribute("aria-label","Text size");
 i.oninput=()=>{TH.ts=Number(i.value);applyTheme()};
 w.append(a,i,b,o);return w}
const _btp2=window.buildThemePanel;
window.buildThemePanel=function(){
 _btp2();const s=TP.querySelector(".seg");
 if(s)s.after(el("h3","","Text size"),makeSlider());
 applyTheme()};
buildThemePanel();

/* ---------- settings menu (replaces "Admin") ---------- */
AB.replaceChildren(ic("settings"));AB.title="Settings";AB.setAttribute("aria-label","Settings");
window.openAccount=function(btn){
 closeMenu();
 const mn=el("div","ctxmenu glass wide");mn.id="ctx";mn.dataset.acct="1";
 const hd=el("div","mhead"),av=el("span","mav"),ht=el("div");
 av.append(ic("settings"));ht.append(el("b","","Settings"),el("small","","Appearance, session and device"));hd.append(av,ht);mn.append(hd);
 mn.append(el("div","msec","Appearance"));
 const seg=el("div","seg wide"),sp=el("div","mpad");
 const bs=MODES.map(m=>{
  const b=el("button",TH.mode===m?"on":"",m[0].toUpperCase()+m.slice(1));b.type="button";
  b.onclick=()=>{TH.mode=m;applyTheme();bs.forEach(x=>x.classList.toggle("on",x===b))};seg.append(b);return b});
 sp.append(seg);
 const sp2=el("div","mpad");sp2.append(makeSlider());
 mn.append(sp,sp2);applyTheme();
 const item=(icon,label,fn,o={})=>{
  const b=el("button","mi"+(o.danger?" danger":""));b.type="button";b.append(ic(icon),el("span","",label));
  if(o.tr)b.append(el("span","tr",o.tr));
  b.onclick=()=>{closeMenu();setTimeout(fn,0)};mn.append(b)};
 item("palette","More appearance options",()=>$("#themeBtn").click(),{tr:"Colors, location"});
 mn.append(el("div","mdiv"));
 item("search","Search messages",()=>$("#searchBtn").click());
 item("refresh","Refresh",()=>$("#refresh").click());
 mn.append(el("div","mdiv"));
 const place=LAST?[LAST.city,LAST.region,LAST.country].filter(Boolean).join(", "):"";
 const n=navigator;
 mn.append(el("div","msec","Last sign-in"),
  mrow("place","Location",place||"Not available"),
  mrow("device","Browser",(LAST&&LAST.device)||"Not available"),
  mrow("clock","When",LAST&&LAST.created_at?ago(LAST.created_at)+" · "+fmtDate(LAST.created_at):"Not available"),
  el("div","msec","This device"),
  mrow("device","Device",deviceLabel(n.userAgent||"",n.userAgentData&&n.userAgentData.mobile)),
  mrow("screen","Screen",screen.width+"×"+screen.height+" @"+(window.devicePixelRatio||1)+"x"),
  mrow("clock","Timezone",(Intl.DateTimeFormat().resolvedOptions().timeZone)||"—"),
  el("div","mdiv"));
 item("lock","Lock workspace",()=>$("#logout").click(),{danger:true});
 document.body.append(mn);
 const w=mn.offsetWidth,r=btn.getBoundingClientRect();
 mn.style.left=Math.max(8,Math.min(r.right-w,innerWidth-w-8))+"px";
 mn.style.top=(r.bottom+6)+"px";mn.style.transformOrigin="top right"};

/* ---------- message actions: one M3 menu ---------- */
window.openMenu=function(m,x,y){
 closeMenu();const mn=el("div","ctxmenu glass");mn.id="ctx";
 const add=(icon,label,fn,o={})=>{
  const b=el("button","mi"+(o.danger?" danger":""));b.type="button";b.disabled=!!o.off;b.append(ic(icon),el("span","",label));
  b.onclick=()=>{closeMenu();setTimeout(fn,0)};mn.append(b)};
 mn.append(el("div","msec","Sent "+fmtDate(m.created_at)));
 add("reply","Reply",()=>setReply(m));
 add("edit","Edit",()=>setEdit(m));
 add("copy","Copy text",async()=>{try{await navigator.clipboard.writeText(m.content)}catch(e){chatError.textContent="Copy failed"}},{off:!m.content});
 mn.append(el("div","mdiv"));
 add("info","Details",()=>{const t=ART[m.id]&&ART[m.id].querySelector(".dtog");if(t)t.click()},{off:!m.details});
 add("pin",m.pinned?"Unpin":"Pin",()=>act(mpath(m,"pin"),"POST",{pinned:!m.pinned},"Pin failed"));
 if(m.file_id)add("download","Download file",()=>askDownload({name:m.filename,url:fileUrl(m,false),size:Number(m.size_bytes),kind:kindOf(m)}));
 add("sel","Select",()=>startSelect(m));
 mn.append(el("div","mdiv"),el("div","tagnote","Tag"));
 const tr=el("div","tagrow");
 TAGS.forEach(t=>{const b=el("button","tg"+(m.tag===t?" on":""),t);b.type="button";b.title=m.tag===t?"Remove tag":"Tag";b.onclick=()=>{closeMenu();act(mpath(m,"tag"),"POST",{tag:m.tag===t?"":t},"Could not tag")};tr.append(b)});
 mn.append(tr);
 add("trash","Delete",()=>delMsgs([m.id]),{danger:true});
 document.body.append(mn);
 const w=mn.offsetWidth,h=mn.offsetHeight;
 mn.style.left=Math.max(8,Math.min(x,innerWidth-w-8))+"px";mn.style.top=Math.max(8,Math.min(y,innerHeight-h-8))+"px"};

/* ---------- chat feed as an M3 list ---------- */
const KIC=m=>m.file_id?(kindOf(m)==="image"?"img":"attach"):((m.content||"").includes(BT+BT+BT)?"code":"note");
window.renderFeed=function(list){
 const box=$("#messages"),prev=box.scrollTop,atBottom=FORCE_BOTTOM||box.scrollHeight-prev-box.clientHeight<80;FORCE_BOTTOM=false;
 box.replaceChildren();for(const k in ART)delete ART[k];
 const byId={};MSGS.forEach(m=>{byId[m.id]=m});renderPinBar();
 const q=SEARCHQ.trim().toLowerCase();
 const shown=q?list.filter(m=>((m.content||"")+" "+(m.filename||"")+" "+(m.tag||"")).toLowerCase().includes(q)):list;
 if(!shown.length){box.append(el("div","empty",q?"No messages match your search.":"No messages yet. Send a message or drop a file to begin."));return}
 let last=null;
 for(const m of shown){
  const key=dayStart(new Date(m.created_at*1000));
  if(key!==last){last=key;box.append(el("div","dsep",dayLabel(m.created_at)))}
  const it=el("article","msg li"+(m.role==="user"?" user":""));it.dataset.id=m.id;ART[m.id]=it;
  const lead=el("div","li-lead");lead.dataset.kind=KIC(m);lead.append(ic(KIC(m)));
  const main=el("div","li-main"),head=el("div","li-head"),tm=el("span","li-time",fmtTime(m.created_at));tm.title=fmtDate(m.created_at);
  head.append(el("b","li-title",m.role==="user"?"You":String(m.role||"Message")),tm);main.append(head);
  if(m.reply_to){const o=byId[m.reply_to],qt=el("div","quote");qt.append(el("b","",o?"You":"Reply"),el("span","",o?snippet(o):"Deleted message"));qt.onclick=e=>{e.stopPropagation();if(o)scrollToMsg(o.id)};main.append(qt)}
  if(m.content)main.append(renderBody(m.content));
  if(m.file_id)main.append(attachCard(m));
  const foot=el("div","stamp li-foot");
  if(m.edited_at)foot.append(el("span","li-chip","edited"));
  if(m.pinned){const p=el("span","pinned");p.title="Pinned";p.append(ic("pin"));foot.append(p)}
  if(m.tag)foot.append(el("span","tagbadge",m.tag));
  let panel=null;
  try{if(m.details)panel=detailGrid(JSON.parse(m.details))}catch(e){panel=null}
  if(panel){const tg=el("button","dtog");tg.type="button";tg.setAttribute("aria-expanded","false");tg.append(el("span","","Details"),ic("chev"));
   tg.onclick=()=>{const open=panel.classList.toggle("hidden")===false;tg.classList.toggle("open",open);tg.setAttribute("aria-expanded",String(open))};foot.append(tg)}
  main.append(foot);if(panel)main.append(panel);
  const trail=el("div","li-trail"),mb=el("button","icon sm more");mb.type="button";mb.title="Message actions";mb.setAttribute("aria-label","Message actions");mb.append(ic("more"));
  mb.onclick=e=>{e.stopPropagation();const r=mb.getBoundingClientRect();openMenu(m,r.left-200,r.bottom+4)};trail.append(mb);
  it.append(el("span","chk"),lead,main,trail);bindMenu(it,m);box.append(it)}
 box.scrollTop=atBottom?box.scrollHeight:prev;syncSel()};

/* ---------- file preview: full page + M3 top app bar + editor ---------- */
const VH=$(".vhead"),VE=el("button","icon vnav");
VE.type="button";VE.id="vedit";VE.title="Edit file";VE.append(ic("edit"));$("#vopen").before(VE);
["#vprev","#vcount","#vnext","#vopen","#vdl"].forEach(s=>$(s).classList.add("vnav"));
$("#vclose").replaceChildren(ic("back"));$("#vclose").title="Back";$("#vclose").setAttribute("aria-label","Back");
const VS=el("button","btn vsave vedt");VS.type="button";VS.textContent="Save";
const VD=el("button","icon vedt");VD.type="button";VD.title="Download edited copy";VD.append(ic("download"));
VH.append(VD,VS);
const EDITABLE=["text","markdown","json","csv","html"];
let ED=null;
const _sf=window.showFile,_step=window.step,_cv=window.closeViewer;
window.showFile=function(){
 ED=null;VH.classList.remove("editing","lifted");
 const f=vList[vIdx];
 VE.classList.toggle("hidden",!(f&&EDITABLE.includes(kindOf(f))&&Number(f.size_bytes)<=2097152));
 return _sf()};
window.step=function(d){if(ED)return;_step(d)};
function exitEdit(){if(ED.dirty()&&!confirm("Discard unsaved changes?"))return;ED=null;showFile()}
window.closeViewer=function(){if(ED){exitEdit();return}_cv()};
$("#vclose").onclick=()=>closeViewer();
$("#stage").addEventListener("scroll",e=>VH.classList.toggle("lifted",e.target.scrollTop>2),true);

VE.onclick=async()=>{
 const f=vList[vIdx],stage=$("#stage");
 stage.replaceChildren(note("Loading file…"));
 let text;
 try{const r=await api(fileUrl(f,false));if(!r.ok)throw Error("Could not load the file");text=await r.text()}
 catch(e){stage.replaceChildren(note(e.message||"Could not load the file"));return}
 const ta=document.createElement("textarea");ta.className="ed-ta";ta.value=text;ta.spellcheck=false;ta.setAttribute("aria-label","File editor");
 const pos=el("span","","Ln 1, Col 1"),msg=el("span","ed-msg"),wr=el("label","toggle"),cb=document.createElement("input");
 cb.type="checkbox";wr.append(cb,el("span","","Wrap"));
 const bar=el("div","ed-bar");bar.append(pos,msg,el("span","spacer"),wr);
 const wrap=el("div","ed");wrap.append(ta,bar);stage.replaceChildren(wrap);
 let orig=text;ED={dirty:()=>ta.value!==orig};
 VH.classList.add("editing");$("#vname").textContent="Editing "+f.filename;
 const upd=()=>{
  const v=ta.value,ln=v.slice(0,ta.selectionStart).split(NL);
  pos.textContent="Ln "+ln.length+", Col "+(ln[ln.length-1].length+1)+" · "+v.length+" chars";
  $("#vmeta").textContent=ED.dirty()?"Unsaved changes":"No changes";VS.disabled=!ED.dirty()};
 ["input","keyup","click"].forEach(t=>ta.addEventListener(t,upd));
 cb.onchange=()=>ta.classList.toggle("wrapl",cb.checked);
 ta.addEventListener("keydown",e=>{
  if(e.key==="Tab"&&!e.shiftKey){e.preventDefault();ta.setRangeText("  ",ta.selectionStart,ta.selectionEnd,"end");upd()}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();VS.click()}});
 VS.onclick=async()=>{
  msg.className="ed-msg";msg.textContent="";VS.disabled=true;
  try{
   const r=await api(fileUrl(f,false),{method:"PUT",headers:{"Content-Type":"text/plain;charset=utf-8"},body:ta.value});
   if(!r.ok){const d=await r.json().catch(()=>({}));throw Error(r.status===404&&(d.error||"")==="Not found"?"The server can't save files yet (add the PUT route). Use Download instead.":(d.error||"Save failed"))}
   orig=ta.value;f.size_bytes=new Blob([orig]).size;upd();msg.className="ed-msg ok";msg.textContent="Saved";loadMessages().catch(()=>{})}
  catch(e){msg.className="ed-msg bad";msg.textContent=e.message||"Save failed";VS.disabled=false}};
 VD.onclick=()=>saveBlob(safeName(f.filename),new Blob([ta.value],{type:"text/plain;charset=utf-8"}));
 upd();ta.focus()};


(function(){
/* mini attachment: small thumbnail in the badge slot + side pill */
 attachCard=function(m){
  const k=kindOf(m),b=el("button","att");b.type="button";b.title="Preview "+m.filename;
  let lead;
  if(k==="image"){lead=el("img","att-mini");lead.loading="lazy";lead.alt="";lead.src=fileUrl(m,true);lead.onerror=()=>lead.replaceWith(badge(m))}
  else if(k==="video"){lead=el("video","att-mini");lead.preload="metadata";lead.muted=true;lead.playsInline=true;lead.src=fileUrl(m,true)+"#t=0.1"}
  else lead=badge(m);
  const info=el("div","info");info.append(el("b","",m.filename),el("small","",k.toUpperCase()+" · "+fmtSize(m.size_bytes)));
  const pill=el("span","att-pill");pill.dataset.k=k;pill.append(el("i"),document.createTextNode(extOf(m.filename).toUpperCase().slice(0,4)||"FILE"));
  const meta=el("div","att-meta");meta.append(lead,info,pill);b.append(meta);
  b.onclick=()=>openViewer(files,files.findIndex(x=>x.file_id===m.file_id));
  return b};

 /* modal singleton */
 let DM=null,lastFocus=null;
 window.closeDetails=function(){
  if(!DM)return;
  DM.remove();
  DM=null;
  document.removeEventListener("keydown",onKey,true);
  if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}
 };
 function onKey(e){
  if(e.key==="Escape"){
   e.stopPropagation();
   window.closeDetails();
  }
 }
 window.openDetails=function(m,panel){
  window.closeDetails();
  lastFocus=document.activeElement;
  const root=el("div","dm"),card=el("div","dm-card"),head=el("div","dm-head"),ico=el("span","dm-ico"),t=el("div"),body=el("div","dm-body"),foot=el("div","dm-foot");
  root.setAttribute("role","dialog");
  root.setAttribute("aria-modal","true");
  root.setAttribute("aria-label","Message details");
  ico.append(ic("info"));
  t.append(el("b","","Message details"),el("small","",fmtDate(m.created_at)));
  head.append(ico,t);
  const inner=panel&&panel.querySelector(".dinner");
  if(inner)body.append(inner);
  const close=el("button","ghost","Close");
  close.type="button";
  close.onclick=window.closeDetails;
  foot.append(close);
  card.append(head,body,foot);
  root.append(card);
  root.addEventListener("pointerdown",e=>{if(e.target===root)window.closeDetails()});
  document.body.append(root);
  DM=root;
  document.addEventListener("keydown",onKey,true);
  close.focus();
 };

 /* feed: chat bubbles, details in a modal */
 window.renderFeed=function(list){
  const box=$("#messages"),prev=box.scrollTop,atBottom=FORCE_BOTTOM||box.scrollHeight-prev-box.clientHeight<80;FORCE_BOTTOM=false;
  box.replaceChildren();for(const k in ART)delete ART[k];
  const byId={};MSGS.forEach(m=>{byId[m.id]=m});renderPinBar();
  const q=SEARCHQ.trim().toLowerCase();
  const shown=q?list.filter(m=>((m.content||"")+" "+(m.filename||"")+" "+(m.tag||"")).toLowerCase().includes(q)):list;
  if(!shown.length){box.append(el("div","empty",q?"No messages match your search.":"No messages yet. Send a message or drop a file to begin."));return}
  let last=null,grp=null;
  for(const m of shown){
   const key=dayStart(new Date(m.created_at*1000));
   if(key!==last){last=key;grp=el("div","day");grp.append(el("div","dsep",dayLabel(m.created_at)));box.append(grp)}
   const it=el("article","msg li"+(m.role==="user"?" user":""));it.dataset.id=m.id;ART[m.id]=it;
   const main=el("div","li-main");
   if(m.reply_to){const o=byId[m.reply_to],qt=el("div","quote");qt.append(el("b","",o?"You":"Reply"),el("span","",o?snippet(o):"Deleted message"));qt.onclick=e=>{e.stopPropagation();if(o)scrollToMsg(o.id)};main.append(qt)}
   if(m.content)main.append(renderBody(m.content));
   if(m.file_id)main.append(attachCard(m));
   const foot=el("div","stamp li-foot"),tm=el("span","li-time",fmtTime(m.created_at));tm.title=fmtDate(m.created_at);foot.append(tm);
   if(m.edited_at)foot.append(el("span","li-chip","edited"));
   if(m.pinned){const p=el("span","pinned");p.title="Pinned";p.append(ic("pin"));foot.append(p)}
   if(m.tag)foot.append(el("span","tagbadge",m.tag));
   let panel=null;
   try{if(m.details)panel=detailGrid(JSON.parse(m.details))}catch(e){panel=null}
   if(panel){const tg=el("button","dtog");tg.type="button";tg.setAttribute("aria-haspopup","dialog");tg.append(ic("info"),el("span","","Details"));
    tg.onclick=e=>{e.stopPropagation();window.openDetails(m,detailGrid(JSON.parse(m.details)))};foot.append(tg)}
   const mb=el("button","icon sm more");mb.type="button";mb.title="Message actions";mb.setAttribute("aria-label","Message actions");mb.append(ic("more"));
   mb.onclick=e=>{e.stopPropagation();const r=mb.getBoundingClientRect();openMenu(m,r.left-200,r.bottom+4)};foot.append(mb);
   main.append(foot);
   it.append(el("span","chk"),main);bindMenu(it,m);grp.append(it)}
  box.scrollTop=atBottom?box.scrollHeight:prev;syncSel()};
})();

(function(){
  var css = [
    /* feed + date label */
    ".feed{gap:0;padding:0 0 8px}",
    ".feed .day{display:flex;flex-direction:column;gap:0;align-self:stretch}",
    ".feed .dsep{align-self:stretch;position:sticky;top:0;z-index:3;margin:0;padding:14px 16px 6px;text-align:left;background:var(--bg);color:var(--primary);border:0;border-radius:0;box-shadow:none;font:500 13px var(--font-d);letter-spacing:.4px;animation:none}",

    /* message row */
    ".msg.li,.msg.li.user{display:flex;gap:16px;align-items:flex-start;align-self:stretch;max-width:none;width:auto;padding:12px 8px 12px 16px;border-radius:0;background:transparent;color:var(--text);position:relative}",
    ".msg.li:hover,.msg.li.user:hover{background:var(--glass2)}",
    ".msg.li::after{display:block;content:\"\";position:absolute;left:72px;right:0;bottom:0;height:1px;background:var(--edge)}",
    ".day .msg.li:last-child::after{display:none}",
    ".msg.li.sel{background:var(--pc);outline:0}",
    ".msg.li .li-main{display:block;flex:1;min-width:0}",
    ".li-lead{flex:0 0 40px;width:40px;height:40px;min-width:40px;min-height:40px;border-radius:50%;background:var(--pc);color:var(--text);display:flex;align-items:center;justify-content:center;margin-top:2px;position:relative;z-index:1;visibility:visible;opacity:1} .li-lead .ic{display:flex!important;width:22px;height:22px;align-items:center;justify-content:center;visibility:visible;opacity:1}.li-lead .ic svg{display:block!important;width:22px;height:22px;visibility:visible;opacity:1;fill:currentColor}",
    ".msg.li .li-head{display:flex;align-items:baseline;gap:8px}",
    ".msg.li .li-title{font:500 14px var(--font-d)}",
    ".msg.li .li-head .li-time{margin-left:auto;font-size:12px;letter-spacing:0;color:var(--text3);white-space:nowrap}",
    ".msg.li .body{font-size:calc(15px*var(--ts));margin-top:2px}",
    ".msg.li .li-foot{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;min-height:0}",
    ".msg.li .li-foot:empty{display:none}",
    ".msg.li .li-chip,.msg.li.user .li-chip{font-size:12px;color:var(--text3)}",
    ".li-trail{flex:none}",
    ".li-trail .more{opacity:0;transition:opacity var(--d-short)}",
    ".msg.li:hover .li-trail .more,.li-trail .more:focus-visible{opacity:1}",
    "@media (hover:none){.li-trail .more{opacity:1}}",

    /* Details chip */
    ".msg.li .dtog{display:inline-flex;align-items:center;gap:2px;height:28px;padding:0 6px 0 12px;border:0;border-radius:var(--r-full);background:var(--pc);color:var(--text);font:500 12px var(--font-d);letter-spacing:.2px;cursor:pointer}",
    ".msg.li .dtog.open{background:var(--primary);color:var(--on-primary)}",
    ".msg.li .dtog .ic svg{width:18px;height:18px;transition:transform var(--d-long) var(--emph)}",
    ".msg.li .dtog.open .ic svg{transform:rotate(180deg)!important}",
    ".msec {font: 500 11px var(--font-d);letter-spacing: .6px;text-transform: uppercase;color: var(--text3);padding: 14px 16px 4px;}",
    /* selection mode */
    ".feed.selecting .msg.li{padding-right:8px;cursor:pointer}",
    ".feed.selecting .msg.li .chk{position:static;order:-1;flex:none;margin:10px 0 0;top:auto;right:auto}"
  ].join("");

  var st = document.createElement("style");
  st.textContent = css;
  document.head.append(st);


/* message list */
 window.renderFeed=function(list){
  var box=$("#messages"),prev=box.scrollTop,atBottom=FORCE_BOTTOM||box.scrollHeight-prev-box.clientHeight<80;FORCE_BOTTOM=false;
  box.replaceChildren();for(var k in ART)delete ART[k];
  var byId={};MSGS.forEach(function(m){byId[m.id]=m});renderPinBar();
  var q=SEARCHQ.trim().toLowerCase();
  var shown=q?list.filter(function(m){return ((m.content||"")+" "+(m.filename||"")+" "+(m.tag||"")).toLowerCase().indexOf(q)>=0}):list;
  if(!shown.length){box.append(el("div","empty",q?"No messages match your search.":"No messages yet. Send a message or drop a file to begin."));return}
  var last=null,grp=null;
  shown.forEach(function(m){
   var key=dayStart(new Date(m.created_at*1000));
   if(key!==last){last=key;grp=el("div","day");grp.append(el("div","dsep",dayLabel(m.created_at)));box.append(grp)}
   var it=el("article","msg li"+(m.role==="user"?" user":""));it.dataset.id=m.id;ART[m.id]=it;
   var lead=el("div","li-lead");lead.dataset.kind=KIC(m);lead.append(ic(KIC(m)));
   var main=el("div","li-main"),head=el("div","li-head"),tm=el("span","li-time",fmtTime(m.created_at));tm.title=fmtDate(m.created_at);
   head.append(el("b","li-title",m.role==="user"?"You":String(m.role||"Message")),tm);main.append(head);
   if(m.reply_to){
    var o=byId[m.reply_to],qt=el("div","quote");
    qt.append(el("b","",o?"You":"Reply"),el("span","",o?snippet(o):"Deleted message"));
    qt.onclick=function(e){e.stopPropagation();if(o)scrollToMsg(o.id)};main.append(qt)}
   if(m.content)main.append(renderBody(m.content));
   if(m.file_id)main.append(attachCard(m));
   var foot=el("div","stamp li-foot");
   if(m.edited_at)foot.append(el("span","li-chip","edited"));
   if(m.pinned){var p=el("span","pinned");p.title="Pinned";p.append(ic("pin"));foot.append(p)}
   if(m.tag)foot.append(el("span","tagbadge",m.tag));
   var panel=null;
   try{if(m.details)panel=detailGrid(JSON.parse(m.details))}catch(e){panel=null}
   if(panel){
    var tg=el("button","dtog");tg.type="button";tg.setAttribute("aria-expanded","false");
    tg.append(el("span","","Details"),ic("chev"));
    tg.onclick=function(e){e.stopPropagation();var open=panel.classList.toggle("hidden")===false;tg.classList.toggle("open",open);tg.setAttribute("aria-expanded",String(open))};
    foot.append(tg)}
   main.append(foot);if(panel)main.append(panel);
   var trail=el("div","li-trail"),mb=el("button","icon sm more");
   mb.type="button";mb.title="Message actions";mb.setAttribute("aria-label","Message actions");mb.append(ic("more"));
   mb.onclick=function(e){e.stopPropagation();var r=mb.getBoundingClientRect();openMenu(m,r.left-200,r.bottom+4)};
   trail.append(mb);
   it.append(el("span","chk"),lead,main,trail);bindMenu(it,m);grp.append(it)});
  box.scrollTop=atBottom?box.scrollHeight:prev;syncSel()};
});
/* ===== PATCH 2 of 3 — CLIENT JS =====
   Paste on the line directly ABOVE the final  check();  inside PAGE's <script>.
   Additive only. No backticks and no dollar-brace sequences (safe inside the PAGE template literal). */

/* ---------- icons ---------- */
Object.assign(P,{
 home:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
 chat:"M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z",
 contacts:"M20 0H4v2h16V0zM4 24h16v-2H4v2zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z",
 folder:"M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
});

/* ---------- views: Home + Contacts (Chat and Files already exist) ---------- */
const HV=el("section","view hidden");HV.id="homeView";
const CV=el("section","view hidden");CV.id="contactsView";
const CF=el("iframe","cframe");CF.id="contactsFrame";CF.title="Contacts";CF.setAttribute("referrerpolicy","no-referrer");CV.append(CF);
$("#filesView").after(HV,CV);

/* ---------- M3 navigation bar / rail ---------- */
const NAV=[["home","Home","home"],["chat","Chat","chat"],["contacts","Contacts","contacts"],["files","Files","folder"]];
const NB=el("nav","navbar");NB.id="navbar";NB.setAttribute("aria-label","Primary");
NAV.forEach(function(n){
 const b=el("button","nd");b.type="button";b.dataset.v=n[0];b.setAttribute("aria-label",n[1]);
 const pi=el("span","pi");pi.append(ic(n[2]));b.append(pi,el("span","nl",n[1]));
 if(n[0]==="files"){const bd=el("span","nb hidden");bd.id="navFilesBadge";b.append(bd)}
 b.onclick=function(){tab(n[0])};NB.append(b)});
$("#app").append(NB);
document.addEventListener("pointerdown",function(e){
 const p=e.target.closest&&e.target.closest(".nd");if(!p)return;
 const t=p.querySelector(".pi"),r=t.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement("span");
 s.className="rip";s.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";
 t.append(s);setTimeout(function(){s.remove()},650)});
function updBadge(){const b=$("#navFilesBadge");if(!b)return;b.textContent=files.length>99?"99+":String(files.length);b.classList.toggle("hidden",!files.length)}

/* ---------- tab(): four destinations (old chat/files calls keep working) ---------- */
const VIEWS={home:HV,chat:$("#chatView"),contacts:CV,files:$("#filesView")};
window.tab=function(name){
 if(!VIEWS[name])name="home";
 for(const k in VIEWS)VIEWS[k].classList.toggle("hidden",k!==name);
 $("#tabChat").classList.toggle("on",name==="chat");$("#tabFiles").classList.toggle("on",name==="files");
 document.querySelectorAll("#navbar .nd").forEach(function(b){const on=b.dataset.v===name;b.classList.toggle("on",on);b.setAttribute("aria-current",on?"page":"false")});
 if(name==="contacts")loadContacts();
 if(name==="home")renderHome();
 try{sessionStorage.setItem("ws.tab",name)}catch(e){}};

/* ---------- Contacts: lazy load with M3 circular + linear progress ---------- */
let CLOADED=false,CBUSY=false;
function loadContacts(){
 if(CLOADED)return;CLOADED=true;
 const ld=el("div","cload");ld.append(spin(48),el("span","","Loading contacts…"));CV.append(ld);
 busy(1);CBUSY=true;
 const fin=function(){if(!CBUSY)return;CBUSY=false;busy(-1);ld.remove()};
 CF.onload=fin;setTimeout(fin,15000);
 CF.src="/contacts"}

/* ---------- M3 modal bottom sheet ---------- */
function sheetKey(e){if(e.key==="Escape"){e.stopPropagation();closeSheet()}}
function closeSheet(){
 document.querySelectorAll(".sheet-scrim,.msheet").forEach(function(n){n.remove()});
 document.removeEventListener("keydown",sheetKey,true)}
function openSheet(title,build){
 closeSheet();
 const sc=el("div","scrim on sheet-scrim"),sh=el("div","msheet");
 sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");sh.setAttribute("aria-label",title);
 const hd=el("div","ms-h"),x=el("button","icon sm");
 x.type="button";x.title="Close";x.setAttribute("aria-label","Close");x.append(ic("close"));x.onclick=closeSheet;
 hd.append(el("b","",title),x);
 const body=el("div","ms-body");build(body);
 sh.append(el("div","ms-handle"),hd,body);
 sc.onclick=closeSheet;
 document.body.append(sc,sh);document.addEventListener("keydown",sheetKey,true);x.focus()}

/* ---------- Home ---------- */
let HOME_READY=false;
function greet(){const h=new Date().getHours();return h<5?"Good night":h<12?"Good morning":h<17?"Good afternoon":"Good evening"}
function favCount(){try{return (JSON.parse(localStorage.getItem("min")||"{}").favs||[]).length}catch(e){return 0}}
function secHead(title,label,fn){const h=el("div","h-sec");h.append(el("b","",title));if(label){const b=el("button","",label);b.type="button";b.onclick=fn;h.append(b)}return h}
function homeItem(icon,title,sub,fn){
 const b=el("button","h-li");b.type="button";
 const l=el("span","lead");l.append(ic(icon));
 const t=el("div","tx");t.append(el("b","",title),el("small","",sub));
 b.append(l,t);b.onclick=fn;return b}
function showMsgSheet(m){
 openSheet("Message",function(body){
  body.append(el("div","ms-text",(m.content||"").slice(0,600)||m.filename||"(no text)"));
  const add=function(icon,label,fn){const b=el("button","mi");b.type="button";b.append(ic(icon),el("span","",label));b.onclick=function(){closeSheet();setTimeout(fn,0)};body.append(b)};
  add("note","Open in chat",function(){tab("chat");setTimeout(function(){scrollToMsg(m.id)},80)});
  add("copy","Copy text",async function(){try{await navigator.clipboard.writeText(m.content||"")}catch(e){chatError.textContent="Copy failed"}});
  add("pin",m.pinned?"Unpin":"Pin",function(){act(mpath(m,"pin"),"POST",{pinned:!m.pinned},"Pin failed")})})}
function renderHome(){
 HV.replaceChildren();
 const root=el("div","home");
 if(!HOME_READY){const l=el("div","h-load");l.append(spin(48),el("span","","Loading your workspace…"));root.append(l);HV.append(root);return}
 const hero=el("div","h-hero"),ht=el("div","h-ht"),hb=el("div","h-hb");
 ht.append(el("div","h-hi",greet()),el("div","h-date",new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"})));
 const rf=el("button","icon");rf.type="button";rf.title="Refresh";rf.setAttribute("aria-label","Refresh");rf.append(ic("refresh"));
 rf.onclick=function(){rf.disabled=true;rf.classList.add("spin");loadMessages().catch(function(){chatError.textContent="Could not refresh"}).finally(function(){rf.disabled=false;rf.classList.remove("spin")})};
 const st=el("button","icon");st.type="button";st.title="Appearance & settings";st.setAttribute("aria-label","Appearance and settings");st.append(ic("palette"));
 st.onclick=function(e){e.stopPropagation();$("#themeBtn").click()};
 hb.append(rf,st);hero.append(ht,hb);root.append(hero);

 const acts=el("div","h-acts");
 const qa=function(icon,t,s,fn){const b=el("button","h-act");b.type="button";const i=el("span","ico");i.append(ic(icon));const w=el("div");w.append(el("b","",t),el("small","",s));b.append(i,w);b.onclick=fn;acts.append(b)};
 const fc=favCount();
 qa("edit","New message","Write in chat",function(){tab("chat");ta.focus()});
 qa("attach","Attach file","Upload to workspace",function(){tab("chat");$("#file").click()});
 qa("contacts","Contacts",fc+(fc===1?" favorite":" favorites"),function(){tab("contacts")});
 qa("folder","Files",files.length+" saved",function(){tab("files")});
 root.append(acts);

 const imp=MSGS.filter(function(m){return m.pinned||m.tag}).slice(-6).reverse();
 root.append(secHead("Important",imp.length?"Open chat":"",function(){tab("chat")}));
 const lst=el("div","h-list");
 if(!imp.length)lst.append(el("div","h-empty","Pin or tag a message in Chat and it shows up here."));
 imp.forEach(function(m){lst.append(homeItem(m.pinned?"pin":"note",snippet(m),(m.tag?m.tag+" · ":"")+dayLabel(m.created_at)+", "+fmtTime(m.created_at),function(){showMsgSheet(m)}))});
 root.append(lst);

 const rec=files.slice().reverse();
 root.append(secHead("Recent files",rec.length?"All files":"",function(){tab("files")}));
 const fg=el("div","h-files");
 if(!rec.length)fg.append(el("div","h-empty","No files yet. Attach one from Chat."));
 rec.slice(0,4).forEach(function(f,i){
  const t=el("button","tile");t.type="button";
  const th=el("div","thumb");th.append(thumbFor(f)||badge(f,true));
  t.append(th,el("b","",f.filename),el("small","",kindOf(f).toUpperCase()+" · "+fmtSize(f.size_bytes)));
  t.onclick=function(){openViewer(rec,i)};fg.append(t)});
 root.append(fg);

 if(LAST){
  const place=[LAST.city,LAST.region,LAST.country].filter(Boolean).join(", ");
  const c=el("div","h-card"),l=el("span","lead"),t=el("div","tx");
  l.append(ic("lock"));
  t.append(el("b","","Last sign-in"),el("small","",[place,LAST.device,LAST.created_at?ago(LAST.created_at):""].filter(Boolean).join(" · ")||"Not available"));
  c.append(l,t);root.append(secHead("Security"),c)}
 HV.append(root)}

/* refresh Home + badge whenever messages reload */
const _lmH=window.loadMessages;
window.loadMessages=async function(){
 try{const r=await _lmH.apply(this,arguments);HOME_READY=true;updBadge();renderHome();return r}
 catch(e){HOME_READY=true;renderHome();throw e}};

/* locking clears the private contacts frame and returns to Home */
$("#logout").addEventListener("click",function(){
 HOME_READY=false;CLOADED=false;closeSheet();CF.src="about:blank";tab("home")});

/* start on Home (or the last tab used this session) */
(function(){let t="home";try{t=sessionStorage.getItem("ws.tab")||"home"}catch(e){}tab(t)})();
check();
