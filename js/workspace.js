/* Unified Settings menu: appearance + colors + location (runs after script.js).
   "Lock workspace" was removed from this menu (the header Lock button still works).
   Search and Refresh were removed from this menu (search now lives in the chat tools menu). */
document.addEventListener("DOMContentLoaded",function(){
 var TB=document.getElementById("themeBtn"),AB=document.getElementById("acctBtn")||TB;
 if(!AB||typeof el!=="function")return;
 window.openAccount=function(btn){
  closeMenu();
  var mn=el("div","ctxmenu glass wide");mn.id="ctx";mn.dataset.acct="1";
  var hd=el("div","mhead"),av=el("span","mav"),ht=el("div");
  av.append(ic("settings"));ht.append(el("b","","Settings"),el("small","","Appearance, color and location"));hd.append(av,ht);mn.append(hd);

  mn.append(el("div","msec","Appearance"));
  var seg=el("div","seg wide"),sp=el("div","mpad"),segBtns=[];
  MODES.forEach(function(m){
   var b=el("button",TH.mode===m?"on":"",m.charAt(0).toUpperCase()+m.slice(1));b.type="button";
   b.onclick=function(){TH.mode=m;applyTheme();segBtns.forEach(function(x){x.classList.toggle("on",x===b)})};
   seg.append(b);segBtns.push(b)});
  sp.append(seg);
  var sp2=el("div","mpad");sp2.append(makeSlider());
  mn.append(sp,sp2);

  mn.append(el("div","msec","Color"));
  var sw=el("div","swatches compact mpad"),swBtns=[];
  PAL.forEach(function(e){
   var b=el("button","sw compact"+(TH.pal===e[0]?" on":""));b.type="button";b.title=e[1];b.setAttribute("aria-label",e[1]);
   var dot=el("i");dot.style.background=e[0]==="device"?(DEV||"conic-gradient(#4285f4,#ea4335,#fbbc04,#34a853,#4285f4)"):e[2];
   b.append(dot);
   b.onclick=function(){TH.pal=e[0];applyTheme();swBtns.forEach(function(x){x.classList.toggle("on",x===b)})};
   sw.append(b);swBtns.push(b)});
  mn.append(sw);

  mn.append(el("div","msec","Location"));
  var lp=el("div","mpad"),row=el("label","toggle"),cb=document.createElement("input");
  cb.type="checkbox";cb.checked=!!TH.geo;
  var off="Off by default. When on, your browser asks permission and your precise location is saved with each message you send.";
  var nt=el("div","note",TH.geo?"Location sharing is on.":off);
  cb.onchange=async function(){
   if(!cb.checked){TH.geo=false;nt.textContent=off;applyTheme();return}
   try{await getPos();TH.geo=true;TH.geoNever=false;nt.textContent="Location sharing is on.";paintLoc("granted")}
   catch(e){cb.checked=false;TH.geo=false;paintLoc(e&&e.code===1?"denied":"prompt");nt.textContent=e&&e.code===1?"Permission denied. Allow location for this site in your browser settings.":"Location is unavailable on this device."}
   applyTheme()};
  row.append(cb,el("span","","Share my location with messages"));
  /* permission status: granted -> shown; otherwise offer "Ask again" */
  var ls=el("div","locstat"),ldot=el("i"),ltx=el("span"),lask=el("button","ghost","Ask again");
  lask.type="button";ls.append(ldot,ltx,lask);
  function paintLoc(st){
   ls.dataset.s=st;
   if(st==="granted"){ltx.textContent="Location access granted";lask.classList.add("hidden")}
   else{ltx.textContent=st==="denied"?"Location access blocked":"Location access not granted";lask.classList.remove("hidden")}}
  lask.onclick=async function(){
   lask.disabled=true;
   try{await getPos();TH.geo=true;TH.geoNever=false;cb.checked=true;nt.textContent="Location sharing is on.";paintLoc("granted");applyTheme()}
   catch(e){
    var blocked=e&&e.code===1;
    paintLoc(blocked?"denied":"prompt");
    nt.textContent=blocked?"Your browser blocked it. Allow location for this site in browser settings, then tap Ask again.":"Location is unavailable on this device."}
   lask.disabled=false};
  lp.append(row,nt,ls);mn.append(lp);
  if(navigator.permissions&&navigator.permissions.query){
   navigator.permissions.query({name:"geolocation"}).then(function(pm){paintLoc(pm.state);pm.onchange=function(){paintLoc(pm.state)}}).catch(function(){paintLoc("prompt")})}
  else paintLoc("prompt");

  mn.append(el("div","msec","Security"));
  var pkp=el("div","mpad"),pkb2=el("button","ghost","Passkeys\u2026");
  pkb2.type="button";pkb2.style.width="100%";
  pkb2.onclick=function(){closeMenu();if(window.openPasskeys)setTimeout(window.openPasskeys,0)};
  pkp.append(pkb2);mn.append(pkp);

  document.body.append(mn);applyTheme();
  var w=mn.offsetWidth,h=mn.offsetHeight,r=btn.getBoundingClientRect();
  mn.style.left=Math.max(8,Math.min(r.right-w,innerWidth-w-8))+"px";
  mn.style.top=Math.max(8,Math.min(r.bottom+6,innerHeight-h-8))+"px";
  mn.style.transformOrigin="top right"};
 /* the old palette button (and the Home screen shortcut) now open the same menu */
 if(TB)TB.onclick=function(e){
  e.stopPropagation();
  var o=document.getElementById("ctx");
  if(o&&o.dataset.acct){closeMenu();return}
  window.openAccount(AB)};
});

/* Back-to-bottom, Files search/filter header, scroll reveal (runs after script.js) */
document.addEventListener("DOMContentLoaded",function(){
 if(typeof el!=="function"||typeof renderGrid!=="function")return;

 /* ---------- back to bottom ---------- */
 var box=$("#messages"),tb=$("#toBottom");
 tb.append(ic("chev"));
 /* scroll-progress ring around the button */
 var ring=document.createElementNS("http://www.w3.org/2000/svg","svg");
 ring.setAttribute("viewBox","0 0 44 44");ring.setAttribute("class","tbring");ring.setAttribute("aria-hidden","true");
 ring.innerHTML='<circle class="tbr-t" cx="22" cy="22" r="20"></circle><circle class="tbr-p" cx="22" cy="22" r="20"></circle>';
 tb.prepend(ring);
 var tbP=ring.querySelector(".tbr-p"),tbC=2*Math.PI*20;
 tbP.style.strokeDasharray=tbC.toFixed(2);tbP.style.strokeDashoffset=tbC.toFixed(2);
 var tbRaf=0;
 function tbUpd(){
  tbRaf=0;
  var mx=box.scrollHeight-box.clientHeight,pr=mx>0?Math.max(0,Math.min(1,box.scrollTop/mx)):1;
  tbP.style.strokeDashoffset=(tbC*(1-pr)).toFixed(2);
  tb.title="Back to bottom · "+Math.round(pr*100)+"%";
  tb.classList.toggle("show",box.scrollHeight-box.scrollTop-box.clientHeight>260)}
 function tbSched(){if(!tbRaf)tbRaf=requestAnimationFrame(tbUpd)}
 box.addEventListener("scroll",tbSched,{passive:true});
 new MutationObserver(tbSched).observe(box,{childList:true});
 window.addEventListener("resize",tbSched);
 tb.onclick=function(){box.scrollTo({top:box.scrollHeight,behavior:"smooth"})};

 /* ---------- files: search + extension / time / sort / group ---------- */
 var FV=$("#filesView"),G=$("#grid"),FQI=$("#fq"),FCL=$("#fclear"),CH=$("#fchips"),SUM=$("#fsum");
 var F={q:"",ext:"all",time:"any",sort:"newest",group:"none"},SEEN=new Set(),DAY=86400;
 $("#fico").append(ic("search"));FCL.append(ic("close"));

 function ex(f){return extOf(f.filename)||"file"}
 function inTime(f){
  if(F.time==="any")return true;
  var t=f.created_at,now=Date.now()/1000;
  if(F.time==="today")return dayStart(new Date(t*1000))===dayStart(new Date());
  if(F.time==="7")return now-t<=7*DAY;
  if(F.time==="30")return now-t<=30*DAY;
  if(F.time==="year")return new Date(t*1000).getFullYear()===new Date().getFullYear();
  return true}
 function textOk(f){
  var terms=F.q.trim().toLowerCase().split(" ").filter(Boolean);
  if(!terms.length)return true;
  var hay=((f.filename||"")+" "+ex(f)+" "+kindOf(f)+" "+(f.content||"")+" "+(f.tag||"")).toLowerCase();
  return terms.every(function(t){return hay.indexOf(t)>=0})}
 var SORTS={
  newest:function(a,b){return b.created_at-a.created_at},
  oldest:function(a,b){return a.created_at-b.created_at},
  az:function(a,b){return (a.filename||"").localeCompare(b.filename||"")},
  za:function(a,b){return (b.filename||"").localeCompare(a.filename||"")},
  big:function(a,b){return Number(b.size_bytes)-Number(a.size_bytes)},
  small:function(a,b){return Number(a.size_bytes)-Number(b.size_bytes)}};

 function buildChips(base){
  var cnt={},order=[];
  base.forEach(function(f){var e=ex(f);if(!cnt[e]){cnt[e]=0;order.push(e)}cnt[e]++});
  if(F.ext!=="all"&&!cnt[F.ext]){cnt[F.ext]=0;order.push(F.ext)}
  order.sort(function(a,b){return cnt[b]-cnt[a]||a.localeCompare(b)});
  CH.replaceChildren();
  function add(key,label,n,kind){
   var b=el("button","fchip"+(F.ext===key?" on":""));b.type="button";
   if(kind){b.dataset.k=kind;b.append(el("i"))}
   b.append(el("span","",label),el("small","",String(n)));
   b.onclick=function(){F.ext=key;SEEN.clear();renderGrid()};
   CH.append(b)}
  add("all","All",base.length,"");
  order.forEach(function(e){add(e,"."+e,cnt[e],kindOf({filename:"x."+e,content_type:""}))})}

 function resetFilters(){
  F.q="";F.ext="all";F.time="any";FQI.value="";FCL.classList.add("hidden");
  $("#ftime").value="any";SEEN.clear();renderGrid()}

 /* parallax + reveal-up while scrolling */
 var io=null,vis=new Set(),raf=0;
 function parallax(){
  raf=0;
  var rb=FV.getBoundingClientRect(),mid=rb.top+rb.height/2;
  vis.forEach(function(t){
   var m=t.querySelector(".att-img");if(!m)return;
   var r=t.getBoundingClientRect(),off=Math.max(-16,Math.min(16,(r.top+r.height/2-mid)*0.06));
   m.style.setProperty("--py",off.toFixed(1)+"px")})}
 function sched(){if(!raf)raf=requestAnimationFrame(parallax)}
 FV.addEventListener("scroll",sched,{passive:true});
 function observe(){
  if(io)io.disconnect();
  vis.clear();
  var tiles=G.querySelectorAll(".tile");
  if(!("IntersectionObserver" in window)){tiles.forEach(function(t){t.classList.add("in")});return}
  io=new IntersectionObserver(function(es){
   var k=0;
   es.forEach(function(e){
    var t=e.target;
    if(e.isIntersecting){
     vis.add(t);
     if(t.classList.contains("rv")&&!t.classList.contains("in")){
      t.style.setProperty("--dl",Math.min(k++,8)*70+"ms");
      t.classList.add("in");SEEN.add(t.dataset.id)}
    }else vis.delete(t)});
   sched()},{root:FV,threshold:0.06});
  tiles.forEach(function(t){io.observe(t)})}

 window.renderGrid=function(){
  var base=files.filter(function(f){return textOk(f)&&inTime(f)});
  buildChips(base);
  var list=base.filter(function(f){return F.ext==="all"||ex(f)===F.ext}).sort(SORTS[F.sort]||SORTS.newest);
  var bytes=list.reduce(function(s,f){return s+(Number(f.size_bytes)||0)},0);
  SUM.textContent=!list.length?"No files":(list.length===files.length?list.length+(list.length===1?" file":" files"):list.length+" of "+files.length+" files")+" · "+fmtSize(bytes);

  var groups=[];
  if(F.group==="none")groups.push({t:"",items:list});
  else{
   var idx=Object.create(null);
   list.forEach(function(f){
    var k=F.group==="ext"?ex(f).toUpperCase():dayLabel(f.created_at);
    if(!(k in idx)){idx[k]=groups.length;groups.push({t:k,items:[]})}
    groups[idx[k]].items.push(f)})}
  var flat=[];
  groups.forEach(function(g){g.items.forEach(function(f){flat.push(f)})});

  G.replaceChildren();
  if(!list.length){
   var em=el("div","empty",files.length?"No files match your search or filters.":"No files yet. Attach one from the chat.");
   if(files.length){var rb=el("button","ghost","Reset filters");rb.type="button";rb.onclick=resetFilters;em.append(rb)}
   G.append(em);observe();return}
  var pos=0;
  groups.forEach(function(g){
   if(g.t){var h=el("div","gsec");h.append(el("span","",g.t),el("small","",String(g.items.length)));G.append(h)}
   g.items.forEach(function(f){
    var i=pos++,t=el("button","tile"),th=el("div","thumb");
    t.type="button";t.dataset.id=f.file_id;
    th.append(thumbFor(f)||badge(f,true));
    t.append(th,el("b","",f.filename),el("small","",kindOf(f).toUpperCase()+" · "+fmtSize(f.size_bytes)),el("small","tdate",ago(f.created_at)));
    if(!SEEN.has(f.file_id))t.classList.add("rv");
    t.onclick=function(){openViewer(flat,i)};
    G.append(t)})});
  observe()};

 function clearQ(){FQI.value="";F.q="";FCL.classList.add("hidden");SEEN.clear();renderGrid()}
 FQI.addEventListener("input",function(){F.q=FQI.value;FCL.classList.toggle("hidden",!F.q);SEEN.clear();renderGrid()});
 FQI.addEventListener("keydown",function(e){if(e.key==="Escape")clearQ()});
 FCL.onclick=function(){clearQ();FQI.focus()};
 [["#ftime","time"],["#fsort","sort"],["#fgroup","group"]].forEach(function(p){
  var s=$(p[0]);s.onchange=function(){F[p[1]]=s.value;SEEN.clear();renderGrid()}});

 /* ---------- hidden header search button: kept so other code can still trigger it.
    Searches whatever tab you are on (chat messages, or the Files search box). ---------- */
 $("#searchBtn").onclick=function(){
  if(!FV.classList.contains("hidden")){FV.scrollTo({top:0,behavior:"smooth"});FQI.focus();FQI.select();return}
  var wasHidden=$("#chatView").classList.contains("hidden");
  if(wasHidden)tab("chat");
  var b=$("#searchbar");
  if(wasHidden||b.classList.contains("hidden")){b.classList.remove("hidden");$("#q").focus()}
  else{b.classList.add("hidden");SEARCHQ="";$("#q").value="";renderFeed(MSGS)}};

 window.renderGrid();
});

document.addEventListener("DOMContentLoaded",function(){
 var app=document.getElementById("app"),bar=document.querySelector(".bar");
 if(!app||!bar)return;

 /* ---- header: hamburger ---- */
 var h=document.createElement("button");h.type="button";h.className="icon hmb";h.setAttribute("aria-label","Toggle navigation");h.style.marginLeft="15px";
 h.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
 h.onclick=function(){
  app.classList.toggle("rail-min");
  if(window.matchMedia("(min-width: 900px)").matches){
   document.querySelectorAll(".view").forEach(function(view){
    view.style.borderRadius=app.classList.contains("rail-min")?"28px 28px 0 0":""})}};
 bar.insertBefore(h,bar.firstChild);

 /* ---- editor highlighting + line numbers ---- */
 var LANG={js:"javascript",mjs:"javascript",cjs:"javascript",jsx:"javascript",ts:"typescript",tsx:"typescript",json:"json",html:"xml",htm:"xml",xml:"xml",svg:"xml",css:"css",scss:"scss",md:"markdown",py:"python",sh:"bash",bash:"bash",yml:"yaml",yaml:"yaml",sql:"sql",java:"java",c:"c",h:"c",cpp:"cpp",cs:"csharp",go:"go",rs:"rust",php:"php",rb:"ruby",kt:"kotlin",swift:"swift",toml:"ini",ini:"ini",txt:"plaintext",csv:"plaintext"};
 function lang(){var n=(document.getElementById("vname")||{}).textContent||"",i=n.lastIndexOf(".");return i>0?(LANG[n.slice(i+1).toLowerCase()]||""):""}
 function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
 function setupEditor(ta){
  if(ta.dataset.hl)return;ta.dataset.hl="1";
  var wrap=document.createElement("div");wrap.className="ed-wrap";
  var pre=document.createElement("pre");pre.className="ed-hl";pre.setAttribute("aria-hidden","true");
  var code=document.createElement("code");code.className="hljs";pre.append(code);
  var ln=document.createElement("div");ln.className="ed-ln";ln.setAttribute("aria-hidden","true");
  ta.parentNode.insertBefore(wrap,ta);wrap.append(ln,pre,ta);
  var last=null,lastN=0;
  function sync(){
   var w=ta.classList.contains("wrapl");
   pre.classList.toggle("wrapl",w);wrap.classList.toggle("wrapl",w);
   pre.scrollTop=ta.scrollTop;pre.scrollLeft=ta.scrollLeft;ln.scrollTop=ta.scrollTop}
  function paint(){
   var v=ta.value;if(v===last){sync();return}last=v;
   var html,L=lang();
   try{
    if(!window.hljs||v.length>300000)html=esc(v);
    else if(L&&hljs.getLanguage(L))html=hljs.highlight(v,{language:L,ignoreIllegals:true}).value;
    else if(v.length<60000)html=hljs.highlightAuto(v).value;
    else html=esc(v)}
   catch(e){html=esc(v)}
   code.innerHTML=html+"\n";
   var n=v.split("\n").length;
   if(n!==lastN){lastN=n;var s=new Array(n);for(var i=0;i<n;i++)s[i]=i+1;ln.textContent=s.join("\n")}
   sync()}
  ta.addEventListener("input",paint);
  ta.addEventListener("scroll",sync,{passive:true});
  new MutationObserver(sync).observe(ta,{attributes:true,attributeFilter:["class"]});
  paint();
  var iv=setInterval(function(){if(!document.body.contains(ta)){clearInterval(iv);return}paint()},250)}
 var vw=document.getElementById("viewer");
 function scan(){document.querySelectorAll(".ed-ta:not([data-hl])").forEach(setupEditor)}
 if(vw)new MutationObserver(scan).observe(vw,{childList:true,subtree:true});

 /* ---- confirm before replacing the file on the server ---- */
 var modal=null;
 function closeModal(){if(modal){modal.remove();modal=null}}
 function say(txt,ok){var m=document.querySelector(".ed-msg");if(!m)return;m.textContent=txt;m.className="ed-msg "+(ok?"ok":"bad")}
 async function doSave(ta){
  var a=document.getElementById("vopen")||document.getElementById("vdl");
  var m=a&&(a.getAttribute("href")||"").match(/\/api\/files\/([^?#]+)/);
  if(!m){say("Could not find the file id.",false);return}
  say("Saving…",true);
  try{
   var r=await fetch("/api/files/"+m[1],{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"text/plain;charset=utf-8"},body:ta.value});
   var d={};try{d=await r.json()}catch(e){}
   if(!r.ok)throw new Error(d.error||"Save failed ("+r.status+")");
   say("Saved. The old file was replaced.",true)}
  catch(e){say(e.message,false)}}
 function confirmSave(){
  var ta=document.querySelector(".ed-ta");if(!ta||modal)return;
  modal=document.createElement("div");modal.className="dm";modal.style.zIndex="96";
  modal.setAttribute("role","alertdialog");modal.setAttribute("aria-modal","true");
  modal.innerHTML='<div class="dm-card"><div class="dm-head"><span class="dm-ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg></span><div><b>Replace file on server?</b><small></small></div></div><div class="dm-body"><p style="color:var(--text2);margin:8px 0 4px">Your edited version will overwrite the existing file. The old file will be lost permanently and cannot be recovered.</p></div><div class="dm-foot" style="gap:8px"><button type="button" class="ghost" data-a="no">Cancel</button><button type="button" class="btn" data-a="ok" style="height:40px;padding:0 22px;font-size:14px">OK, replace</button></div></div>';
  modal.querySelector("small").textContent=(document.getElementById("vname")||{}).textContent||"";
  modal.addEventListener("click",function(e){
   var b=e.target.closest("button");
   if(b&&b.dataset.a==="ok"){closeModal();doSave(ta)}
   else if((b&&b.dataset.a==="no")||e.target===modal)closeModal()});
  document.body.append(modal);
  modal.querySelector('[data-a="no"]').focus()}
 document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest(".vsave");
  if(b){e.preventDefault();e.stopImmediatePropagation();confirmSave()}},true);
 document.addEventListener("keydown",function(e){
  if(modal&&e.key==="Escape"){e.stopImmediatePropagation();closeModal();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"&&e.target.classList&&e.target.classList.contains("ed-ta")){
   e.preventDefault();e.stopImmediatePropagation();confirmSave()}},true);
});

/* Chat tools: dropdown (search / go to top / jump to date), Telegram-style calendar, long-message clamp */
document.addEventListener("DOMContentLoaded",function(){
 var box=document.getElementById("messages"),more=document.getElementById("tmore");
 if(!box||!more)return;

 var SVG={
  more:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>'};
 more.innerHTML=SVG.more;

 /* ---------- dropdown ---------- */
 function closeTMenu(){var m=document.getElementById("tmenu");if(m)m.remove();more.setAttribute("aria-expanded","false")}
 function openTMenu(){
  if(document.getElementById("tmenu")){closeTMenu();return}
  var mn=document.createElement("div");mn.id="tmenu";mn.className="ctxmenu glass";mn.setAttribute("role","menu");
  function item(icon,label,fn){
   var b=document.createElement("button");b.type="button";b.className="mi";b.setAttribute("role","menuitem");
   var s=document.createElement("span");s.className="ic";s.innerHTML=SVG[icon];
   var t=document.createElement("span");t.textContent=label;
   b.append(s,t);b.onclick=function(){closeTMenu();setTimeout(fn,0)};mn.append(b)}
  item("search","Search messages",function(){var s=document.getElementById("searchBtn");if(s)s.click()});
  item("up","Go to top",function(){box.scrollTo({top:0,behavior:"smooth"})});
  item("cal","Jump to date",function(){openCal(null)});
  document.body.append(mn);
  more.setAttribute("aria-expanded","true");
  var r=more.getBoundingClientRect(),w=mn.offsetWidth,hh=mn.offsetHeight;
  mn.style.left=Math.max(8,Math.min(r.right-w,innerWidth-w-8))+"px";
  mn.style.top=Math.max(8,Math.min(r.bottom+6,innerHeight-hh-8))+"px";
  mn.style.transformOrigin="top right"}
 more.addEventListener("click",function(e){e.stopPropagation();openTMenu()});
 document.addEventListener("click",function(e){
  var m=document.getElementById("tmenu");
  if(m&&!m.contains(e.target)&&e.target!==more&&!more.contains(e.target))closeTMenu()});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")closeTMenu()});

 /* ---------- day <-> separator mapping ---------- */
 function keyOf(ts){var d=new Date(ts*1000);return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
 function dv(k){var p=k.split("-");return new Date(+p[0],+p[1]-1,+p[2]).getTime()}
 function dayMap(){
  var map={},seps=[].slice.call(box.querySelectorAll(".dsep"));
  if(typeof MSGS==="undefined"||!seps.length)return {map:map,order:[]};
  var keys=[],seen={},first={};
  MSGS.forEach(function(m){var k=keyOf(m.created_at);if(!seen[k]){seen[k]=1;keys.push(k);first[k]=m.created_at}});
  keys.sort(function(a,b){return dv(a)-dv(b)});
  if(keys.length===seps.length){keys.forEach(function(k,i){map[k]=seps[i]})}
  else if(typeof dayLabel==="function"){
   keys.forEach(function(k){
    var lb=dayLabel(first[k]);
    for(var i=0;i<seps.length;i++){if(seps[i].textContent.trim()===lb){map[k]=seps[i];break}}})}
  return {map:map,order:keys.filter(function(k){return map[k]})}}

 function jumpTo(sep){
  var day=sep.closest(".day")||sep;
  var top=day.getBoundingClientRect().top-box.getBoundingClientRect().top+box.scrollTop-4;
  box.scrollTo({top:Math.max(0,top),behavior:"smooth"});
  var m=day.querySelector(".msg");
  if(m){m.classList.remove("flash");void m.offsetWidth;m.classList.add("flash");setTimeout(function(){m.classList.remove("flash")},1400)}}

 /* ---------- calendar ---------- */
 var cal=null;
 function closeCal(){if(cal){cal.remove();cal=null}}
 function openCal(fromSep){
  closeCal();
  var dm=dayMap(),map=dm.map,order=dm.order;
  if(!order.length)return;
  var curKey=null;
  if(fromSep){order.forEach(function(k){if(map[k]===fromSep)curKey=k})}
  var firstD=new Date(dv(order[0])),lastD=new Date(dv(order[order.length-1]));
  var minM=firstD.getFullYear()*12+firstD.getMonth(),maxM=lastD.getFullYear()*12+lastD.getMonth();
  var startD=new Date(dv(curKey||order[order.length-1]));
  var vm=startD.getFullYear()*12+startD.getMonth();
  var todayKey=keyOf(Date.now()/1000);

  cal=document.createElement("div");cal.className="dm";cal.style.zIndex="97";
  cal.setAttribute("role","dialog");cal.setAttribute("aria-modal","true");cal.setAttribute("aria-label","Jump to date");
  var card=document.createElement("div");card.className="dm-card cal-card";
  var top=document.createElement("div");top.className="cal-top";
  var title=document.createElement("b");
  var pb=document.createElement("button");pb.type="button";pb.className="icon sm";pb.setAttribute("aria-label","Previous month");pb.innerHTML=SVG.prev;
  var nb=document.createElement("button");nb.type="button";nb.className="icon sm";nb.setAttribute("aria-label","Next month");nb.innerHTML=SVG.next;
  top.append(title,pb,nb);
  var wd=document.createElement("div");wd.className="cal-wd";
  ["S","M","T","W","T","F","S"].forEach(function(c){var s=document.createElement("span");s.textContent=c;wd.append(s)});
  var grid=document.createElement("div");grid.className="cal-grid";
  var foot=document.createElement("div");foot.className="cal-foot";
  var hint=document.createElement("small");hint.textContent="Highlighted days have messages";
  var close=document.createElement("button");close.type="button";close.className="ghost";close.textContent="Close";
  foot.append(hint,close);
  card.append(top,wd,grid,foot);cal.append(card);

  function pick(ts){
   var tgt=null;
   for(var i=0;i<order.length;i++){if(dv(order[i])>=ts){tgt=order[i];break}}
   if(!tgt)tgt=order[order.length-1];
   closeCal();
   setTimeout(function(){jumpTo(map[tgt])},30)}

  function render(){
   var y=Math.floor(vm/12),mo=vm%12;
   title.textContent=new Date(y,mo,1).toLocaleDateString(undefined,{month:"long",year:"numeric"});
   pb.disabled=vm<=minM;nb.disabled=vm>=maxM;
   grid.replaceChildren();
   var blanks=new Date(y,mo,1).getDay(),dim=new Date(y,mo+1,0).getDate();
   for(var i=0;i<blanks;i++)grid.append(document.createElement("span"));
   for(var d=1;d<=dim;d++){
    (function(d){
     var k=y+"-"+(mo+1)+"-"+d,b=document.createElement("button");
     b.type="button";b.textContent=String(d);
     b.className="cal-d"+(map[k]?" has":"")+(k===curKey?" cur":"")+(k===todayKey?" today":"");
     b.onclick=function(){pick(new Date(y,mo,d).getTime())};
     grid.append(b)})(d)}}
  pb.onclick=function(){if(vm>minM){vm--;render()}};
  nb.onclick=function(){if(vm<maxM){vm++;render()}};
  close.onclick=closeCal;
  cal.addEventListener("click",function(e){if(e.target===cal)closeCal()});
  render();
  document.body.append(cal);
  close.focus()}
 document.addEventListener("keydown",function(e){if(cal&&e.key==="Escape"){e.stopImmediatePropagation();closeCal()}},true);

 /* click on a day separator -> calendar (like Telegram) */
 box.addEventListener("click",function(e){
  var s=e.target.closest&&e.target.closest(".dsep");
  if(!s||box.classList.contains("selecting"))return;
  e.stopPropagation();openCal(s)});

 /* ---------- long message bodies: View more / View less ----------
    A body is collapsed when its text is longer than LIMIT characters OR has more than MAXLINES lines. */
 var LIMIT=600,MAXLINES=10,queued=false;
 function clampAll(){
  box.querySelectorAll(".body:not([data-cl])").forEach(function(b){
   b.dataset.cl="1";
   var tx=b.textContent||"";
   if(tx.length<=LIMIT&&tx.split("\n").length<=MAXLINES)return;
   b.classList.add("clamped");
   var btn=document.createElement("button");btn.type="button";btn.className="bmore";btn.textContent="View more";
   btn.onclick=function(e){
    e.stopPropagation();
    var c=b.classList.toggle("clamped");
    btn.textContent=c?"View more":"View less"};
   b.after(btn);
   /* if the text already fits inside the clamp, the button is pointless */
   requestAnimationFrame(function(){
    if(b.classList.contains("clamped")&&b.scrollHeight<=b.clientHeight+1){b.classList.remove("clamped");btn.remove()}})})}
 new MutationObserver(function(){
  if(queued)return;queued=true;
  requestAnimationFrame(function(){queued=false;clampAll()})}).observe(box,{childList:true,subtree:true});
 clampAll();
});

/* Chat upgrade: click -> dropdown, long-press -> select, Quote, rich-text formatting, schedule send.
   Runs after script.js; replaces bindMenu / openMenu / renderBody and re-renders the feed. */
document.addEventListener("DOMContentLoaded",function(){
 if(typeof el!=="function"||typeof renderFeed!=="function"||typeof ta==="undefined")return;
 var TK=String.fromCharCode(96),NLC=String.fromCharCode(10);
 var SCHEDRX=/^\[\[sched:(\d{9,11})\]\]\n?/;
 Object.assign(P,{
  wsback:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  wsmic:"M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z",
  wsok:"M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  wsact:"M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",
  wskey:"M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
  wschart:"M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z",
  quote:"M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z",
  link:"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  cal:"M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z",
  sched:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
  fmt:"M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z",
  gallery:"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  file:"M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z",
  loc:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"});

 function toast(t){var n=el("div","toast",t);document.body.append(n);setTimeout(function(){n.classList.add("out")},2600);setTimeout(function(){n.remove()},3000)}

 /* ================= rich text rendering =================
    Tokens: backtick code, **bold**, __underline__, ~~strike~~, [[date:YYYY-MM-DDTHH:mm]],
    [text](url), bare urls, _italic_, and [[sched:EPOCH]] (added by the server when a
    scheduled message is delivered; shows the date it was scheduled for). */
 var RX=/\x60([^\x60\n]+)\x60|\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|~~([\s\S]+?)~~|\[\[date:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})\]\]|\[([^\]\n]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>]*[^\s<>.,;:!?'")\]])|_([^_\n]+)_|\[\[sched:(\d{9,11})\]\]/g;
 function safeUrl(u){return /^(https?:\/\/|mailto:|tel:)/i.test(u)?u:""}

 /* ---- links: ask permission first, then open with ?utm_source=the-raghavan.com ---- */
 var UTM_SOURCE="the-raghavan.com";
 function withUtm(u){
  if(!/^https?:\/\//i.test(u))return u;
  try{
   var x=new URL(u);
   if(!x.searchParams.has("utm_source"))x.searchParams.set("utm_source",UTM_SOURCE);
   return x.toString()}
  catch(e){return u}}
 async function askOpen(url){
  var fin=withUtm(url);
  var r=await mform({title:"Open this link?",sub:fin,icon:"link",okText:"Open link",fields:[]});
  if(!r)return;
  if(/^https?:\/\//i.test(fin))window.open(fin,"_blank","noopener,noreferrer");
  else window.location.href=fin}
 function mkLink(url,label){
  var a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label;
  function go(e){e.preventDefault();e.stopPropagation();askOpen(url)}
  a.addEventListener("click",go);
  a.addEventListener("auxclick",function(e){if(e.button===1)go(e)});
  return a}

 function dateChip(iso){
  var d=new Date(iso),s=document.createElement("span");s.className="mdate";s.title=iso.replace("T"," ");
  s.textContent=isNaN(d)?iso:"📅 "+d.toLocaleString([],{weekday:"short",day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"});
  return s}
 /* chip shown on messages that were delivered from the scheduler */
 function schedChip(ts){
  var d=new Date(Number(ts)*1000),s=document.createElement("span");s.className="mdate";s.title="Scheduled message";
  s.textContent=isNaN(d)?"⏰ Scheduled":"⏰ Scheduled · "+d.toLocaleString([],{weekday:"short",day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"});
  return s}
 function inline(parent,s,depth){
  var rx=new RegExp(RX.source,"g"),last=0,m;
  function txt(t){if(t)parent.append(document.createTextNode(t))}
  while((m=rx.exec(s))){
   var i=m.index,full=m[0],n=null;
   if(m[9]!==undefined){var pc=s.charAt(i-1),nc=s.charAt(i+full.length);if((pc&&/\w/.test(pc))||(nc&&/\w/.test(nc)))continue}
   txt(s.slice(last,i));last=i+full.length;
   if(m[1]!==undefined){n=document.createElement("code");n.className="mc";n.textContent=m[1]}
   else if(m[2]!==undefined){n=document.createElement("strong");depth<3?inline(n,m[2],depth+1):n.textContent=m[2]}
   else if(m[3]!==undefined){n=document.createElement("u");depth<3?inline(n,m[3],depth+1):n.textContent=m[3]}
   else if(m[4]!==undefined){n=document.createElement("s");depth<3?inline(n,m[4],depth+1):n.textContent=m[4]}
   else if(m[5]!==undefined){n=dateChip(m[5])}
   else if(m[6]!==undefined){var u=safeUrl(m[7]);if(!u){txt(full);continue}n=mkLink(u,m[6])}
   else if(m[8]!==undefined){n=mkLink(m[8],m[8])}
   else if(m[9]!==undefined){n=document.createElement("em");depth<3?inline(n,m[9],depth+1):n.textContent=m[9]}
   else if(m[10]!==undefined){n=schedChip(m[10])}
   if(n)parent.append(n)}
  txt(s.slice(last))}
 function richInto(root,text){
  root.textContent="";
  var lines=text.split(NLC),i=0,run=[];
  function flushRun(){if(run.length){inline(root,run.join(NLC),0);run=[]}}
  while(i<lines.length){
   if(/^>( |$)/.test(lines[i])){
    flushRun();var q=[];
    while(i<lines.length&&/^>( |$)/.test(lines[i])){q.push(lines[i].replace(/^> ?/,""));i++}
    var bq=document.createElement("blockquote");bq.className="mq";inline(bq,q.join(NLC),0);root.append(bq);continue}
   run.push(lines[i]);i++}
  flushRun()}
 var _rb=window.renderBody;
 window.renderBody=function(content){
  var frag=_rb(content);
  frag.childNodes.forEach(function(n){if(n.classList&&n.classList.contains("body"))richInto(n,n.textContent)});
  return frag};

 /* ================= click -> dropdown, long-press -> select ================= */
 var LP_MS=550,LASTTOUCH=0,NOMENU="a,button,input,textarea,select,.cc,.quote,.mdate,.bmore";
 window.bindMenu=function(item,m){
  var tm=null,sx=0,sy=0,fired=false;
  function cancel(){if(tm){clearTimeout(tm);tm=null}}
  item.addEventListener("pointerdown",function(e){
   fired=false;cancel();
   if(e.pointerType==="touch")LASTTOUCH=Date.now();
   if(e.pointerType==="mouse"&&e.button!==0)return;
   if(SEL)return;
   if(e.target.closest&&e.target.closest(NOMENU))return;
   sx=e.clientX;sy=e.clientY;
   tm=setTimeout(function(){
    tm=null;fired=true;
    try{navigator.vibrate&&navigator.vibrate(12)}catch(x){}
    closeMenu();
    try{var s=window.getSelection();if(s&&s.removeAllRanges)s.removeAllRanges()}catch(x){}
    startSelect(m)},LP_MS)});
  item.addEventListener("pointermove",function(e){if(tm&&(Math.abs(e.clientX-sx)>8||Math.abs(e.clientY-sy)>8))cancel()});
  ["pointerup","pointercancel","pointerleave"].forEach(function(t){item.addEventListener(t,cancel)});
  item.addEventListener("contextmenu",function(e){
   if(e.target.closest&&e.target.closest("a"))return;
   e.preventDefault();
   if(SEL||fired||Date.now()-LASTTOUCH<1200)return;
   openMenu(m,e.clientX,e.clientY)});
  item.addEventListener("click",function(e){
   if(fired){fired=false;e.preventDefault();e.stopPropagation();return}
   if(SEL){e.preventDefault();e.stopPropagation();SEL.has(m.id)?SEL.delete(m.id):SEL.add(m.id);syncSel();return}
   if(e.target.closest&&e.target.closest(NOMENU))return;
   var s=window.getSelection&&window.getSelection();if(s&&String(s).length>0)return;
   e.stopPropagation();openMenu(m,e.clientX,e.clientY)},true)};

 /* ================= dropdown: no Select, with Quote ================= */
 function quoteMsg(m){
  if(EDIT){toast("Finish editing first");return}
  var t=(m.content||"").replace(SCHEDRX,"").trim();if(!t)return;
  var blk=t.slice(0,800).split(NLC).map(function(l){return "> "+l}).join(NLC)+NLC;
  var v=ta.value,s=ta.selectionStart==null?v.length:ta.selectionStart,e=ta.selectionEnd==null?s:ta.selectionEnd;
  var pre=(s>0&&v.charAt(s-1)!==NLC)?NLC:"",txt=pre+blk;
  put(s,e,txt,s+txt.length,s+txt.length);
  if(fmtBar.classList.contains("hidden"))setFmt(true)}
 window.openMenu=function(m,x,y){
  closeMenu();var mn=el("div","ctxmenu glass");mn.id="ctx";
  var add=function(icon,label,fn,o){
   o=o||{};var b=el("button","mi"+(o.danger?" danger":""));b.type="button";b.disabled=!!o.off;b.append(ic(icon),el("span","",label));
   b.onclick=function(e){e.stopPropagation();closeMenu();setTimeout(fn,0)};mn.append(b)};
  var sm=SCHEDRX.exec(m.content||"");
  if(sm)mn.append(el("div","msec","⏰ Scheduled for "+fmtDate(Number(sm[1]))));
  mn.append(el("div","msec"+(sm?" sub":""),"Sent "+fmtDate(m.created_at)));
  add("reply","Reply",function(){setReply(m)});
  add("quote","Quote",function(){quoteMsg(m)},{off:!m.content});
  add("edit","Edit",function(){setEdit(m)});
  add("copy","Copy text",async function(){try{await navigator.clipboard.writeText((m.content||"").replace(SCHEDRX,""))}catch(e){chatError.textContent="Copy failed"}},{off:!m.content});
  mn.append(el("div","mdiv"));
  add("info","Details",function(){var t=ART[m.id]&&ART[m.id].querySelector(".dtog");if(t)t.click()},{off:!m.details});
  add("pin",m.pinned?"Unpin":"Pin",function(){act(mpath(m,"pin"),"POST",{pinned:!m.pinned},"Pin failed")});
  if(m.file_id)add("download","Download file",function(){askDownload({name:m.filename,url:fileUrl(m,false),size:Number(m.size_bytes),kind:kindOf(m)})});
  mn.append(el("div","mdiv"),el("div","tagnote","Tag"));
  var tr=el("div","tagrow");
  TAGS.forEach(function(t){var b=el("button","tg"+(m.tag===t?" on":""),t);b.type="button";b.title=m.tag===t?"Remove tag":"Tag";
   b.onclick=function(e){e.stopPropagation();closeMenu();act(mpath(m,"tag"),"POST",{tag:m.tag===t?"":t},"Could not tag")};tr.append(b)});
  mn.append(tr);
  add("trash","Delete",function(){delMsgs([m.id])},{danger:true});
  document.body.append(mn);
  var w=mn.offsetWidth,h=mn.offsetHeight;
  mn.style.left=Math.max(8,Math.min(x,innerWidth-w-8))+"px";mn.style.top=Math.max(8,Math.min(y,innerHeight-h-8))+"px"};

 /* ================= small form dialog ================= */
 function mform(o){
  return new Promise(function(res){
   var ov=el("div","dm");ov.style.zIndex="98";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");
   var card=el("div","dm-card"),head=el("div","dm-head"),ico=el("span","dm-ico");ico.append(ic(o.icon||"edit"));
   var tt=el("div");tt.append(el("b","",o.title));if(o.sub)tt.append(el("small","",o.sub));head.append(ico,tt);
   var body=el("div","dm-body"),inputs={},err=el("div","err");err.style.padding="6px 0 0";
   (o.fields||[]).forEach(function(f){
    var w=el("label","mf");w.append(el("span","",f.label));
    var i=document.createElement("input");i.className="inp";i.type=f.type||"text";i.autocomplete="off";
    if(f.placeholder)i.placeholder=f.placeholder;i.value=f.value||"";inputs[f.id]=i;w.append(i);body.append(w)});
   if(o.chips){var cr=el("div","mchips");
    o.chips.forEach(function(c){var b=el("button","fchip");b.type="button";b.append(el("span","",c[0]));
     b.onclick=function(){inputs[o.chipField].value=c[1]();err.textContent=""};cr.append(b)});
    body.append(cr)}
   body.append(err);
   var foot=el("div","dm-foot");foot.style.gap="8px";
   var no=el("button","ghost","Cancel"),ok=el("button","btn",o.okText||"OK");no.type="button";ok.type="button";ok.style.height="42px";ok.style.padding="0 22px";ok.style.fontSize="14px";
   foot.append(no,ok);card.append(head,body,foot);ov.append(card);
   function done(v){document.removeEventListener("keydown",key,true);ov.remove();res(v)}
   function submit(){var v={};for(var k in inputs)v[k]=inputs[k].value;var msg=o.validate?o.validate(v):"";if(msg){err.textContent=msg;return}done(v)}
   function key(e){
    if(e.key==="Escape"){e.stopImmediatePropagation();done(null)}
    else if(e.key==="Enter"&&e.target&&e.target.tagName==="INPUT"){e.preventDefault();submit()}}
   no.onclick=function(){done(null)};ok.onclick=submit;
   ov.addEventListener("click",function(e){if(e.target===ov)done(null)});
   document.body.append(ov);document.addEventListener("keydown",key,true);
   var first=ov.querySelector("input");if(first)first.focus();else ok.focus()})}
 function p2(n){return (n<10?"0":"")+n}
 function toLocal(d){return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())+"T"+p2(d.getHours())+":"+p2(d.getMinutes())}

 /* ================= composer: formatting toolbar ================= */
 var form=$("#sendForm"),crow=form.querySelector(".crow"),fmtBar=el("div","fmtbar hidden");fmtBar.id="fmtbar";
 function put(start,end,text,a,b){
  ta.focus();ta.setSelectionRange(start,end);
  var ok=false;try{ok=document.execCommand&&document.execCommand("insertText",false,text)}catch(e){}
  if(!ok||ta.value.slice(start,start+text.length)!==text){ta.setRangeText(text,start,end,"end")}
  ta.setSelectionRange(a,b);ta.dispatchEvent(new Event("input",{bubbles:true}))}
 function wrap(o,c){
  var s=ta.selectionStart,e=ta.selectionEnd,v=ta.value,t=v.slice(s,e);
  var single=o.length===1,pc=v.charAt(s-o.length-1),nc=v.charAt(e+c.length);
  if(s>=o.length&&v.slice(s-o.length,s)===o&&v.slice(e,e+c.length)===c&&!(single&&(pc===o||nc===c))){
   put(s-o.length,e+c.length,t,s-o.length,s-o.length+t.length);return}
  if(t.length>=o.length+c.length&&t.slice(0,o.length)===o&&t.slice(t.length-c.length)===c){
   var inner=t.slice(o.length,t.length-c.length);put(s,e,inner,s,s+inner.length);return}
  put(s,e,o+t+c,s+o.length,s+o.length+t.length)}
 function toggleQuote(){
  var v=ta.value,s=ta.selectionStart,e=ta.selectionEnd;
  var ls=s===0?0:v.lastIndexOf(NLC,s-1)+1,le=(e>s&&v.charAt(e-1)===NLC)?e-1:v.indexOf(NLC,e);
  if(le<0)le=v.length;if(le<ls)le=ls;
  var lines=v.slice(ls,le).split(NLC),all=lines.every(function(l){return l.indexOf(">")===0});
  var out=lines.map(function(l){return all?l.replace(/^> ?/,""):"> "+l}).join(NLC);
  put(ls,le,out,ls,ls+out.length)}
 function normUrl(u){
  u=String(u||"").trim();if(!u)return "";
  if(/^(https?:\/\/|mailto:|tel:)/i.test(u))return u;
  if(/^[\w-]+(\.[\w-]+)+([\/?#]\S*)?$/.test(u))return "https://"+u;
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u))return "mailto:"+u;
  return ""}
 async function linkFlow(){
  var s=ta.selectionStart,e=ta.selectionEnd,t=ta.value.slice(s,e),isUrl=/^https?:\/\/\S+$/.test(t.trim());
  var r=await mform({title:"Create link",sub:"Adds a clickable link to your message",icon:"link",okText:"Insert",
   fields:[{id:"text",label:"Text",value:isUrl?"":t,placeholder:"What people will see"},{id:"url",label:"Link",type:"url",value:isUrl?t.trim():"",placeholder:"https://example.com"}],
   validate:function(v){return normUrl(v.url)?"":"Enter a valid link (https://, mailto: or tel:)"}});
  if(!r)return;
  var url=normUrl(r.url).replace(/\s/g,"%20").replace(/\)/g,"%29"),label=(r.text.trim()||url).replace(/[\[\]\n]/g," ");
  var tok="["+label+"]("+url+")";put(s,e,tok,s+tok.length,s+tok.length)}
 async function dateFlow(){
  var e=ta.selectionEnd;
  var r=await mform({title:"Insert date",sub:"Shows as a date chip in your message",icon:"cal",okText:"Insert",
   fields:[{id:"when",label:"Date and time",type:"datetime-local",value:toLocal(new Date())}],
   chipField:"when",chips:[["Now",function(){return toLocal(new Date())}],["Tomorrow",function(){var d=new Date();d.setDate(d.getDate()+1);return toLocal(d)}]],
   validate:function(v){return isNaN(new Date(v.when))?"Pick a date and time":""}});
  if(!r)return;
  var tok="[[date:"+r.when.slice(0,16)+"]]";put(e,e,tok,e+tok.length,e+tok.length)}

 var BTNS=[
  ["b","B","Bold (Ctrl+B)",function(){wrap("**","**")}],
  ["i","I","Italic (Ctrl+I)",function(){wrap("_","_")}],
  ["u","U","Underline (Ctrl+U)",function(){wrap("__","__")}],
  ["s","S","Strikethrough (Ctrl+Shift+X)",function(){wrap("~~","~~")}],
  ["m","</>","Mono (Ctrl+Shift+M)",function(){wrap(TK,TK)}],
  "|",
  ["q","quote","Quote",toggleQuote],
  ["l","link","Create link (Ctrl+K)",linkFlow],
  ["d","cal","Insert date",dateFlow],
  "|",
  ["c","sched","Schedule message",function(){scheduleFlow()}]];
 BTNS.forEach(function(d){
  if(d==="|"){fmtBar.append(el("span","fsep"));return}
  var b=el("button","fb "+d[0]);b.type="button";b.title=d[2];b.setAttribute("aria-label",d[2]);
  if(P[d[1]])b.append(ic(d[1]));else b.textContent=d[1];
  b.addEventListener("mousedown",function(e){e.preventDefault()});
  b.onclick=function(){d[3]()};fmtBar.append(b)});
 form.insertBefore(fmtBar,crow);
 var tg=el("button","icon");tg.type="button";tg.id="fmtToggle";tg.title="Formatting";tg.setAttribute("aria-label","Formatting");tg.append(ic("fmt"));
 $("#attach").after(tg);
 function setFmt(on){
  fmtBar.classList.toggle("hidden",!on);tg.classList.toggle("on",on);
  try{localStorage.setItem("ws.fmt",on?"1":"0")}catch(e){}}
 tg.onclick=function(){setFmt(fmtBar.classList.contains("hidden"))};
 try{if(localStorage.getItem("ws.fmt")==="1")setFmt(true)}catch(e){}
 ta.addEventListener("keydown",function(e){
  if(!(e.ctrlKey||e.metaKey))return;
  var k=e.key.toLowerCase();
  if(k==="b"&&!e.shiftKey){e.preventDefault();wrap("**","**")}
  else if(k==="i"&&!e.shiftKey){e.preventDefault();wrap("_","_")}
  else if(k==="u"&&!e.shiftKey){e.preventDefault();wrap("__","__")}
  else if(k==="x"&&e.shiftKey){e.preventDefault();wrap("~~","~~")}
  else if(k==="m"&&e.shiftKey){e.preventDefault();wrap(TK,TK)}
  else if(k==="k"&&!e.shiftKey){e.preventDefault();linkFlow()}});

 /* ================= schedule send ================= */
 var SCHED=[],stimer=null,sbar=el("button","schedbar hidden");sbar.id="schedbar";sbar.type="button";
 form.before(sbar);
 function renderSchedBar(){
  sbar.replaceChildren();
  if(!SCHED.length){sbar.classList.add("hidden");return}
  var n=SCHED[0];
  sbar.append(ic("sched"),el("span","t",SCHED.length+(SCHED.length===1?" scheduled message":" scheduled messages")+" · next "+dayLabel(n.send_at)+", "+fmtTime(n.send_at)));
  sbar.classList.remove("hidden")}
 function armTimer(){
  clearTimeout(stimer);stimer=null;
  if(!SCHED.length)return;
  var next=Math.min.apply(null,SCHED.map(function(x){return x.send_at})),ms=next*1000-Date.now()+1200;
  if(ms<=0)ms=8000;ms=Math.max(1500,Math.min(ms,2147000000));
  stimer=setTimeout(function(){loadMessages().catch(function(){stimer=setTimeout(armTimer,30000)})},ms)}
 async function loadScheduled(){
  try{var r=await api("/api/scheduled");if(!r.ok)return;var d=await r.json();SCHED=d.scheduled||[]}catch(e){return}
  renderSchedBar();armTimer()}
 async function sapi(path,method,body){
  try{
   var r=await api(path,{method:method,headers:JSONH,body:body?JSON.stringify(body):undefined});
   var d=await r.json().catch(function(){return {}});
   if(!r.ok)throw Error(d.error||"Request failed");return d}
  catch(e){toast(e.message||"Request failed");return null}}
 function whenDialog(o){
  var def=new Date(Date.now()+3600000);def.setMinutes(Math.ceil(def.getMinutes()/5)*5,0,0);
  return mform({title:o.title,sub:o.sub,icon:"sched",okText:o.okText,
   fields:[{id:"when",label:"Send on",type:"datetime-local",value:o.value||toLocal(def)}],
   chipField:"when",
   chips:[
    ["In 1 hour",function(){return toLocal(new Date(Date.now()+3600000))}],
    ["Tonight 9 pm",function(){var d=new Date();d.setHours(21,0,0,0);if(d<=new Date())d.setDate(d.getDate()+1);return toLocal(d)}],
    ["Tomorrow 9 am",function(){var d=new Date();d.setDate(d.getDate()+1);d.setHours(9,0,0,0);return toLocal(d)}],
    ["Next week",function(){var d=new Date();d.setDate(d.getDate()+7);d.setHours(9,0,0,0);return toLocal(d)}]],
   validate:function(v){
    var t=new Date(v.when).getTime();
    if(isNaN(t))return "Pick a date and time";
    if(t<Date.now()+30000)return "Pick a time in the future";
    if(t>Date.now()+365*86400000)return "You can schedule up to one year ahead";
    return ""}})}
 async function scheduleFlow(){
  if(EDIT){toast("Finish editing first");return}
  var text=ta.value;
  if(!text.trim()){toast("Write a message first, then schedule it");ta.focus();return}
  if(pendingFiles.length){toast("Scheduling works for text messages only");return}
  var r=await whenDialog({title:"Schedule message",sub:text.trim().replace(/\s+/g," ").slice(0,70),okText:"Schedule"});
  if(!r)return;
  var t=Math.floor(new Date(r.when).getTime()/1000);
  var det=JSON.stringify(await collectDetails());
  var d=await sapi("/api/scheduled","POST",{content:text,send_at:t,reply_to:REPLY?REPLY.id:"",details:det});
  if(!d)return;
  ta.value="";grow();REPLY=null;showCtx();
  toast("Scheduled for "+dayLabel(t)+", "+fmtTime(t));
  loadScheduled()}
 function showSched(){
  openSheet("Scheduled messages",function(body){
   if(!SCHED.length){body.append(el("div","h-empty","Nothing scheduled."));return}
   SCHED.forEach(function(x){
    var card=el("div","sc-item");
    card.append(el("div","sc-when",dayLabel(x.send_at)+", "+fmtTime(x.send_at)),el("div","sc-text",(x.content||"").slice(0,300)));
    var row=el("div","sc-act"),a=el("button","ghost","Send now"),b=el("button","ghost","Reschedule"),c=el("button","ghost danger","Delete");
    a.type=b.type=c.type="button";
    function after(){return loadMessages().catch(function(){}).then(function(){closeSheet();if(SCHED.length)showSched()})}
    a.onclick=async function(){if(await sapi("/api/scheduled/"+encodeURIComponent(x.id)+"/send","POST")){FORCE_BOTTOM=true;toast("Sent");after()}};
    b.onclick=async function(){
     var r=await whenDialog({title:"Reschedule",sub:(x.content||"").replace(/\s+/g," ").slice(0,70),okText:"Save",value:toLocal(new Date(x.send_at*1000))});
     if(!r)return;
     if(await sapi("/api/scheduled/"+encodeURIComponent(x.id),"PATCH",{send_at:Math.floor(new Date(r.when).getTime()/1000)})){toast("Rescheduled");after()}};
    c.onclick=async function(){
     if(!confirm("Delete this scheduled message?"))return;
     if(await sapi("/api/scheduled/"+encodeURIComponent(x.id),"DELETE")){toast("Deleted");after()}};
    row.append(a,b,c);card.append(row);body.append(card)})})}
 sbar.onclick=showSched;

 /* long-press / right-click the Send button -> schedule menu (like Telegram) */
 var send=$("#send"),sTm=null,sFired=false;
 function openSendMenu(){
  if(EDIT)return;
  closeMenu();var mn=el("div","ctxmenu glass");mn.id="ctx";
  var add=function(icon,label,fn){var b=el("button","mi");b.type="button";b.append(ic(icon),el("span","",label));b.onclick=function(e){e.stopPropagation();closeMenu();setTimeout(fn,0)};mn.append(b)};
  add("sched","Schedule message",scheduleFlow);
  if(SCHED.length)add("note","Scheduled messages ("+SCHED.length+")",showSched);
  document.body.append(mn);
  var r=send.getBoundingClientRect(),w=mn.offsetWidth,h=mn.offsetHeight;
  mn.style.left=Math.max(8,Math.min(r.right-w,innerWidth-w-8))+"px";mn.style.top=Math.max(8,r.top-h-8)+"px";
  mn.style.transformOrigin="bottom right"}
 send.addEventListener("pointerdown",function(e){
  if(e.pointerType==="mouse"&&e.button!==0)return;
  sFired=false;clearTimeout(sTm);
  sTm=setTimeout(function(){sFired=true;openSendMenu()},500)});
 ["pointerup","pointercancel","pointerleave"].forEach(function(t){send.addEventListener(t,function(){clearTimeout(sTm);if(t==="pointerup")setTimeout(function(){sFired=false},400)})});
 send.addEventListener("click",function(e){if(sFired){sFired=false;e.preventDefault();e.stopImmediatePropagation()}},true);
 send.addEventListener("contextmenu",function(e){e.preventDefault();if(!$("#ctx"))openSendMenu()});

 /* refresh the scheduled list whenever messages reload (this also delivers anything that came due) */
 var _lm2=window.loadMessages;
 window.loadMessages=async function(){var r=await _lm2.apply(this,arguments);loadScheduled();try{renderLinks()}catch(e){}return r};
 document.addEventListener("visibilitychange",function(){
  if(document.visibilityState==="visible"&&SCHED.some(function(x){return x.send_at*1000<=Date.now()}))loadMessages().catch(function(){})});

 /* ================= Links tab (Telegram-style shared links) ================= */
 var chatView=$("#chatView"),ctools=$("#ctools"),feedBox=$("#messages");
 var lkCnt=el("small","","0"),lkHead=el("div","vback"),lkBack=el("button","vback-btn");
 lkBack.type="button";lkBack.append(ic("wsback"),el("span","","Back to chat"));
 lkHead.append(lkBack,el("b","","Links"),lkCnt);
 var panel=el("div","lkpanel"),lkq=document.createElement("input"),lkList=el("div","lklist");
 lkq.type="search";lkq.className="inp";lkq.placeholder="Search links…";lkq.setAttribute("aria-label","Search links");lkq.autocomplete="off";
 panel.append(lkHead,lkq,lkList);feedBox.after(panel);
 var onLinks=false,savedTop=0,curView="chat",LINKRX=/\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:|tel:)[^)\s]+)\)|(https?:\/\/[^\s<>]*[^\s<>.,;:!?'")\]])/g;
 /* views inside the chat screen: "chat" (default), "links", "activity". The Chat/Links tab pill is gone:
    Links and Activity log open from the chat menu and each has a "Back to chat" button. */
 function setView(name){
  if(name===curView)return;
  if(curView==="chat")savedTop=feedBox.scrollTop;
  curView=name;onLinks=(name==="links");
  chatView.classList.toggle("show-links",name==="links");
  chatView.classList.toggle("show-activity",name==="activity");
  if(name==="links")renderLinks();
  else if(name==="activity"){if(window.wsActivityShow)window.wsActivityShow()}
  else requestAnimationFrame(function(){feedBox.scrollTop=savedTop})}
 /* the phone's Back button returns to the chat too: opening a view adds one history entry */
 function toView(name){
  if(name==="chat"){toChat();return}
  if(curView==="chat"){try{history.pushState({wsView:name},"")}catch(e){}}
  setView(name)}
 function toChat(){
  if(curView==="chat")return;
  if(history.state&&history.state.wsView){try{history.back()}catch(e){}}
  setView("chat")}
 function setTab(links){links?toView("links"):toChat()}
 lkBack.onclick=toChat;
 window.addEventListener("popstate",function(){if(curView!=="chat")setView("chat")});
 window.wsGo=toView;window.wsBack=toChat;window.wsCurView=function(){return curView};
 /* anything that needs the chat feed brings you back to the chat */
 document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#searchBtn"))setTab(false)},true);
 function hostOf(u){
  if(/^(mailto:|tel:)/i.test(u))return u.replace(/^(mailto:|tel:)/i,"");
  try{return new URL(u).hostname.replace(/^www\./,"")}catch(e){return u}}
 function pathOf(u){
  try{var x=new URL(u),p=(x.pathname+x.search).replace(/\/$/,"");return p.length>1?p:""}catch(e){return ""}}
 function hue(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%360;return h}
 function collectLinks(){
  var out=[],seen={},list=(typeof MSGS!=="undefined"&&MSGS)||[];
  for(var i=list.length-1;i>=0;i--){
   var m=list[i],txt=m.content||"";if(!txt)continue;
   var rx=new RegExp(LINKRX.source,"g"),k;
   while((k=rx.exec(txt))){
    var url=k[2]||k[3];if(!url)continue;
    var key=m.id+"|"+url;if(seen[key])continue;seen[key]=1;
    out.push({url:url,label:k[1]||"",m:m})}}
  return out}
 function renderLinks(){
  var all=collectLinks();
  lkCnt.textContent=String(all.length);
  if(!onLinks)return;
  var q=(lkq.value||"").trim().toLowerCase();
  var rows=q?all.filter(function(x){return (x.url+" "+x.label+" "+hostOf(x.url)).toLowerCase().indexOf(q)>=0}):all;
  lkList.replaceChildren();
  if(!rows.length){lkList.append(el("div","empty",all.length?"No links match your search.":"No links yet. Links you send in chat show up here."));return}
  var lastDay="",n=0;
  rows.forEach(function(x){
   var dl=dayLabel(x.m.created_at);
   if(dl!==lastDay){lastDay=dl;lkList.append(el("div","lk-day",dl))}
   var host=hostOf(x.url),row=el("div","lk"),av=el("span","lk-ic",(host.charAt(0)||"#").toUpperCase()),tx=el("div","lk-tx"),act=el("div","lk-a");
   row.style.setProperty("--i",Math.min(n++,12));
   av.style.background="linear-gradient(135deg,hsl("+hue(host)+" 70% 52%),hsl("+((hue(host)+40)%360)+" 70% 42%))";
   tx.append(el("b","",x.label||host),el("small","",host+pathOf(x.url)),el("small","lk-d",fmtTime(x.m.created_at)));
   var cp=el("button","icon sm"),go=el("button","lk-go","Show");
   cp.type=go.type="button";cp.title="Copy link";cp.setAttribute("aria-label","Copy link");cp.append(ic("copy"));go.title="Show in chat";
   cp.onclick=async function(e){e.stopPropagation();try{await navigator.clipboard.writeText(x.url);toast("Link copied")}catch(err){toast("Copy failed")}};
   go.onclick=function(e){
    e.stopPropagation();setTab(false);
    setTimeout(function(){
     var node=ART[x.m.id];
     if(node&&node.scrollIntoView){node.scrollIntoView({block:"center",behavior:"smooth"});node.classList.remove("flash");void node.offsetWidth;node.classList.add("flash");setTimeout(function(){node.classList.remove("flash")},1400)}},90)};
   act.append(cp,go);
   row.tabIndex=0;row.setAttribute("role","button");
   row.onclick=function(){askOpen(x.url)};
   row.onkeydown=function(e){if(e.key==="Enter"&&e.target===row)askOpen(x.url)};
   row.append(av,tx,act);lkList.append(row)})}
 lkq.addEventListener("input",renderLinks);
 var lkQueued=false;
 new MutationObserver(function(){
  if(lkQueued)return;lkQueued=true;
  requestAnimationFrame(function(){lkQueued=false;renderLinks()})}).observe(feedBox,{childList:true});

 /* ================= Attach sheet: Gallery / File / Location ================= */
 var fileIn=$("#file");
 function pickFiles(accept){fileIn.accept=accept||"";fileIn.click()}
 fileIn.addEventListener("change",function(){setTimeout(function(){fileIn.accept=""},0)});
 function coords(){
  return new Promise(function(res,rej){
   if(!navigator.geolocation){rej({code:0});return}
   navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:true,timeout:15000,maximumAge:30000})})}
 async function shareLocation(){
  var p;
  try{p=await coords()}
  catch(e){toast(e&&e.code===1?"Location is blocked. Allow it in your browser, then try again.":"Could not get your location");return}
  var la=p.coords.latitude.toFixed(5),lo=p.coords.longitude.toFixed(5),acc=Math.round(p.coords.accuracy||0);
  var r=await mform({title:"Send your location?",sub:la+", "+lo+(acc?" · ±"+acc+" m":""),icon:"loc",okText:"Send",fields:[]});
  if(!r)return;
  var url="https://www.google.com/maps?q="+la+","+lo;
  var d=await sapi("/api/messages","POST",{content:"📍 [My location ("+la+", "+lo+")]("+url+")",reply_to:REPLY?REPLY.id:"",details:JSON.stringify(await collectDetails())});
  if(!d)return;
  REPLY=null;showCtx();FORCE_BOTTOM=true;toast("Location sent");
  loadMessages().catch(function(){})}
 function openAttach(){
  if(EDIT){toast("Finish editing first");return}
  openSheet("Attach",function(body){
   var g=el("div","att-grid");
   [["gallery","Gallery","#a855f7","#ec4899",function(){pickFiles("image/*,video/*")}],
    ["file","File","#3b82f6","#22d3ee",function(){pickFiles("")}],
    ["loc","Location","#22c55e","#14b8a6",shareLocation]].forEach(function(o,i){
    var b=el("button","att-opt"),c=el("span","att-circle");
    b.type="button";b.style.setProperty("--i",i);
    c.style.background="linear-gradient(135deg,"+o[2]+","+o[3]+")";c.style.boxShadow="0 12px 26px -10px "+o[2];
    c.append(ic(o[0]));b.append(c,el("span","",o[1]));
    b.onclick=function(){closeSheet();o[4]()};
    g.append(b)});
   body.append(g)})}
 document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("#attach");
  if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();openAttach()},true);
 try{renderLinks()}catch(e){}

 /* re-render with the new bindings if messages were already on screen */
 try{if(MSGS.length){renderFeed(MSGS);loadScheduled()}}catch(e){}
});

/* Skeleton + lazy loading + PDF preview layer. Runs last; wraps renderGrid / renderFeed / loadMessages. */
document.addEventListener("DOMContentLoaded",function(){
 function $(s,r){return (r||document).querySelector(s)}
 function mkEl(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
 var box=$("#messages"),G=$("#grid"),home=$("#homeView"),stage=$("#stage"),vw=$("#viewer");
 if(!box||!G)return;
 function mk(cls,html){var e=document.createElement("div");e.className=cls;e.innerHTML=html;e.setAttribute("aria-hidden","true");return e}
 function ln(w,h,c){return '<i class="sk'+(c?" "+c:"")+'" style="width:'+w+";height:"+h+'px"></i>'}
 function msgsNow(){try{return typeof MSGS!=="undefined"?MSGS:null}catch(e){return null}}
 function filesNow(){try{return typeof files!=="undefined"?files:null}catch(e){return null}}

 /* ---------- skeleton markup ---------- */
 var BUB=[["l",62,[100,82,56]],["r",44,[100,70]],["l",74,[100,90,74,38]],["r",36,[100]],["l",52,[100,64]],["r",64,[100,72,46]]];
 function bubbles(list){
  return list.map(function(p,i){
   return '<div class="sk-msg '+p[0]+'" style="--i:'+i+";--w:"+p[1]+'%"><div class="sk-bub">'+
    p[2].map(function(w){return ln(w+"%",10,"sk-l")}).join("")+ln("34px",8,"sk-t")+"</div></div>"}).join("")}
 function chatSk(){return mk("sk-feed",'<i class="sk sk-pill"></i>'+bubbles(BUB))}
 function olderSk(){return mk("sk-older",bubbles(BUB.slice(0,2)))}
 function rows(n){
  var h="";
  for(var i=0;i<n;i++)h+='<div class="sk-row" style="--i:'+i+'"><i class="sk sk-ci"></i><div>'+ln((46+(i*13)%30)+"%",13)+ln((28+(i*7)%20)+"%",10)+"</div></div>";
  return h}
 function homeSk(){
  var acts="";
  for(var i=0;i<4;i++)acts+='<div class="sk-act" style="--i:'+i+'"><i class="sk sk-ico"></i>'+ln("62%",13)+ln("42%",10)+"</div>";
  return mk("sk-home",ln("58%",46)+ln("170px",28)+'<div class="sk-acts">'+acts+"</div>"+ln("120px",12)+'<div class="sk-list">'+rows(4)+"</div>")}
 function contactsSk(){return mk("sk-contacts",rows(8))}
 function viewerSk(){
  var h=ln("40%",22);
  [100,94,98,82,100,90,64].forEach(function(x){h+=ln(x+"%",12)});
  h+=ln("100%",180)+ln("76%",12)+ln("88%",12);
  return mk("sk-stage",h)}

 /* ---------- 1) chat: first-load skeleton (only while the app still says "Loading") ---------- */
 if(!box.querySelector(".msg")&&/^Loading/i.test((box.textContent||"").trim())){
  box.replaceChildren(chatSk());box.setAttribute("aria-busy","true");
  setTimeout(function(){
   var s=box.querySelector(".sk-feed");
   if(s){s.remove();box.removeAttribute("aria-busy");box.append(mkEl("div","empty","Could not load messages. Tap refresh to try again."))}},12000)}

 /* ---------- 2) files: skeleton only until data exists (this was the "files not showing" bug) ---------- */
 var fsum=$("#fsum"),LOADED=false,rg=(typeof window.renderGrid==="function")?window.renderGrid:null;
 function gridSk(){
  var h="";
  for(var i=0;i<10;i++)h+='<div class="sk-tile" aria-hidden="true" style="--i:'+i+'"><i class="sk sk-th"></i>'+ln("72%",13)+ln("44%",10)+"</div>";
  G.innerHTML=h;G.setAttribute("aria-busy","true");
  if(fsum)fsum.textContent="Loading…"}
 function dataReady(){var f=filesNow(),m=msgsNow();return !!((f&&f.length)||(m&&m.length))}
 function release(){
  if(LOADED)return;LOADED=true;G.removeAttribute("aria-busy");
  if(rg){try{rg()}catch(e){}}}
 if(rg){
  window.renderGrid=function(){
   if(!LOADED){
    if(dataReady()){LOADED=true;G.removeAttribute("aria-busy")}
    else return}
   return rg.apply(this,arguments)};
  if(dataReady())release();
  else{
   gridSk();
   var poll=setInterval(function(){
    if(LOADED){clearInterval(poll);return}
    if(dataReady()){clearInterval(poll);release()}},250);
   setTimeout(function(){clearInterval(poll);release()},7000)}}
 if(typeof window.loadMessages==="function"){
  var _lm=window.loadMessages;
  window.loadMessages=async function(){
   try{return await _lm.apply(this,arguments)}
   finally{release()}}}

 /* ---------- 3) chat: newest 60 first, older ones load while scrolling up ---------- */
 var PAGE_N=60,STEP=40,SHOWN=PAGE_N,busyOld=false,prepend=false,firstDone=false;
 function searching(){try{return typeof SEARCHQ!=="undefined"&&!!SEARCHQ}catch(e){return false}}
 function stagger(){
  var ms=box.querySelectorAll(".msg"),n=Math.min(ms.length,14),s=ms.length-n;
  for(var i=0;i<n;i++){ms[s+i].style.setProperty("--i",i);ms[s+i].classList.add("stg")}}
 function rerender(){
  var all=msgsNow();if(!all||typeof window.renderFeed!=="function")return;
  prepend=true;try{window.renderFeed(all)}finally{prepend=false}}
 function loadOlder(){
  if(busyOld)return;busyOld=true;
  setTimeout(function(){SHOWN+=STEP;rerender();busyOld=false},280)}
 function loadAll(){
  var all=msgsNow();
  if(all&&SHOWN<all.length){SHOWN=1e9;rerender()}}
 if(typeof window.renderFeed==="function"){
  var _rf=window.renderFeed;
  window.renderFeed=function(list){
   var args=[].slice.call(arguments),more=false;
   if(Array.isArray(list)&&!searching()&&list.length>SHOWN){args[0]=list.slice(list.length-SHOWN);more=true}
   var dist=box.scrollHeight-box.scrollTop;
   var r=_rf.apply(this,args);
   function after(){
    box.removeAttribute("aria-busy");
    if(more&&!box.querySelector(".sk-older"))box.insertBefore(olderSk(),box.firstChild);
    if(prepend)box.scrollTop=box.scrollHeight-dist;
    if(!firstDone&&box.querySelector(".msg")){firstDone=true;stagger()}}
   if(r&&typeof r.then==="function")return r.then(function(v){after();return v});
   after();return r}}
 box.addEventListener("scroll",function(){
  if(busyOld||searching())return;
  var all=msgsNow();
  if(all&&SHOWN<all.length&&box.scrollTop<160)loadOlder()},{passive:true});
 document.addEventListener("click",function(e){
  var t=e.target;
  if(t&&t.closest&&t.closest("#tmore,.lk-go,.quote,#pinbar,.dsep"))loadAll()},true);

 /* ---------- 4) lazy images: native lazy loading + shimmer + blur-up (no src swapping) ---------- */
 function lazify(img){
  if(img.dataset.lz)return;img.dataset.lz="1";
  img.decoding="async";img.loading="lazy";
  if(img.complete&&img.naturalWidth){img.classList.add("ld","inst");return}
  img.classList.add("lz");
  img.addEventListener("load",function(){img.classList.remove("lz");img.classList.add("ld")},{once:true});
  img.addEventListener("error",function(){img.classList.remove("lz")},{once:true})}
 function scan(n){
  if(n.nodeType!==1)return;
  if(n.tagName==="IMG")lazify(n);
  else if(n.querySelectorAll)n.querySelectorAll("img:not([data-lz])").forEach(lazify)}
 var imgMo=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(scan)})});
 [box,G,home].forEach(function(n){if(n){imgMo.observe(n,{childList:true,subtree:true});scan(n)}});

 /* ---------- 5) home + contacts skeletons, lazy contacts iframe ---------- */
 function find(el,sel){
  var out=[];
  if(el.matches&&el.matches(sel))out.push(el);
  if(el.querySelectorAll)out.push.apply(out,el.querySelectorAll(sel));
  return out}
 new MutationObserver(function(ms){
  ms.forEach(function(m){m.addedNodes.forEach(function(n){
   if(n.nodeType!==1)return;
   find(n,".h-load:not(.sk-on)").forEach(function(x){x.classList.add("sk-on");x.append(homeSk())});
   find(n,".cload:not(.sk-on)").forEach(function(x){x.classList.add("sk-on");x.append(contactsSk())});
   find(n,"iframe.cframe").forEach(function(f){f.setAttribute("loading","lazy")})})})
 }).observe(document.body,{childList:true,subtree:true});

 /* ---------- 6) viewer skeleton while content is loading ---------- */
 if(stage&&vw){
  new MutationObserver(function(){
   var sk=stage.querySelector(".sk-stage");
   if(vw.classList.contains("hidden")){if(sk)sk.remove();return}
   var real=[].filter.call(stage.children,function(k){
    return !k.classList.contains("sk-stage")&&!k.classList.contains("cpw")&&!(k.querySelector&&k.querySelector(".cpw"))});
   if(!real.length&&!sk)stage.append(viewerSk());
   else if(real.length&&sk)sk.remove()}).observe(stage,{childList:true});
  new MutationObserver(function(){
   var sk=stage.querySelector(".sk-stage");
   if(vw.classList.contains("hidden")&&sk)sk.remove()}).observe(vw,{attributes:true,attributeFilter:["class"]})}

 /* ================= 7) PDF preview (pdf.js, loaded on demand) ================= */
 var PDF_BASE="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/",pdfLoading=null;
 function loadPdfJs(){
  if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
  if(pdfLoading)return pdfLoading;
  pdfLoading=new Promise(function(res,rej){
   var s=document.createElement("script");s.src=PDF_BASE+"pdf.min.js";
   s.onload=function(){
    if(window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDF_BASE+"pdf.worker.min.js";res(window.pdfjsLib)}
    else{pdfLoading=null;rej(new Error("PDF engine missing"))}};
   s.onerror=function(){pdfLoading=null;rej(new Error("Could not load the PDF engine"))};
   document.head.append(s)});
  return pdfLoading}
 function pdfOpts(buf){return {data:buf,isEvalSupported:false,cMapUrl:PDF_BASE+"cmaps/",cMapPacked:true,standardFontDataUrl:PDF_BASE+"standard_fonts/"}}
 function pdfUrl(id){return "/api/files/"+encodeURIComponent(id)+"?preview=1"}

 var tokN=0;
 function curFile(){
  var nm=(($("#vname")||{}).textContent||"").trim(),meta=(($("#vmeta")||{}).textContent||"").trim(),id="";
  ["#vopen","#vdl"].forEach(function(s){
   if(id)return;
   var a=$(s),m=a&&(a.getAttribute("href")||"").match(/\/api\/files\/([^?#]+)/);
   if(m)id=m[1]});
  return {name:nm,id:id,pdf:/\.pdf$/i.test(nm)||/^pdf\b/i.test(meta)}}

 function pdfFallback(root,id,e){
  var n=mkEl("div","pdfv-note","Preview engine unavailable ("+((e&&e.message)||"error")+"). Showing the browser viewer instead.");
  var fr=mkEl("iframe","v-frame");fr.src=pdfUrl(id);fr.title="PDF preview";
  root.replaceChildren(n,fr)}

 function mountPdf(f){
  var tok=++tokN,root=mkEl("div","pdfv");root.dataset.id=f.id;
  var bar=mkEl("div","pdfv-bar"),pg=mkEl("span","pdfv-pg","…"),zl=mkEl("span","pdfv-z","100%");
  function btn(t,title,fn){var b=mkEl("button","pdfv-btn",t);b.type="button";b.title=title;b.setAttribute("aria-label",title);b.onclick=fn;return b}
  var bPrev=btn("‹","Previous page",function(){go((updPg()||1)-1)}),
      bNext=btn("›","Next page",function(){go((updPg()||1)+1)}),
      bOut=btn("−","Zoom out",function(){setZoom(zoom-.25)}),
      bIn=btn("+","Zoom in",function(){setZoom(zoom+.25)}),
      bFit=btn("Fit","Fit to width",function(){setZoom(1)});
  bar.append(bPrev,pg,bNext,mkEl("span","pdfv-sep"),bOut,zl,bIn,bFit);
  var sc=mkEl("div","pdfv-scroll"),pages=mkEl("div","pdfv-pages");
  sc.append(pages);root.append(bar,sc);
  stage.replaceChildren(root);

  var pdf=null,items=[],zoom=1,gen=0,io=null,p1=null,busy=false,queue=[],raf=0;
  function availW(){return Math.max(240,Math.min(sc.clientWidth-24,1100))}
  var W=availW();
  function alive(){return tok===tokN&&root.isConnected}
  function sizeFor(){var ratio=p1?p1.h/p1.w:1.414,w=Math.round(W*zoom);return {w:w,h:Math.round(w*ratio)}}
  var ph=mkEl("div","pdfv-page wait");ph.style.width=W+"px";ph.style.height=Math.round(W*1.414)+"px";pages.append(ph);

  function updPg(){
   if(!items.length)return 1;
   var top=sc.scrollTop+sc.clientHeight/3,cur=1;
   for(var i=0;i<items.length;i++){if(items[i].el.offsetTop<=top)cur=i+1;else break}
   pg.textContent=cur+" / "+items.length;bPrev.disabled=cur<=1;bNext.disabled=cur>=items.length;
   return cur}
  function go(n){
   var it=items[Math.max(0,Math.min(items.length-1,n-1))];
   if(it)sc.scrollTo({top:Math.max(0,it.el.offsetTop-8),behavior:"smooth"})}
  sc.addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;updPg()})},{passive:true});

  function observeAll(){
   if(io)io.disconnect();
   io=new IntersectionObserver(function(es){
    es.forEach(function(e){
     if(e.isIntersecting){
      var it=e.target._it;
      if(it&&!it.done&&!it.q){it.q=true;queue.push(it);pump()}}})},{root:sc,rootMargin:"700px 0px"});
   items.forEach(function(it){io.observe(it.el)})}
  function layout(){
   gen++;queue=[];
   var s=sizeFor();
   items.forEach(function(it){
    it.done=false;it.q=false;it.el.className="pdfv-page wait";
    it.el.style.width=s.w+"px";it.el.style.height=s.h+"px";it.el.replaceChildren()});
   zl.textContent=Math.round(zoom*100)+"%";
   observeAll()}
  function setZoom(z){
   var nz=Math.max(.5,Math.min(4,Math.round(z*100)/100));
   if(nz===zoom)return;
   var ratio=sc.scrollHeight?sc.scrollTop/sc.scrollHeight:0;
   zoom=nz;layout();
   sc.scrollTop=ratio*sc.scrollHeight;updPg()}
  async function draw(it,g){
   var page=await pdf.getPage(it.n);
   if(g!==gen||!alive())return;
   var v1=page.getViewport({scale:1}),css=(W*zoom)/v1.width,vp=page.getViewport({scale:css});
   var out=Math.min(window.devicePixelRatio||1,2);
   if(vp.width*vp.height*out*out>16e6)out=Math.sqrt(16e6/(vp.width*vp.height));
   var cv=document.createElement("canvas");
   cv.width=Math.max(1,Math.floor(vp.width*out));cv.height=Math.max(1,Math.floor(vp.height*out));
   cv.style.width=Math.floor(vp.width)+"px";cv.style.height=Math.floor(vp.height)+"px";
   await page.render({canvasContext:cv.getContext("2d"),viewport:vp,transform:out!==1?[out,0,0,out,0,0]:null}).promise;
   if(g!==gen||!alive())return;
   it.el.style.width=cv.style.width;it.el.style.height=cv.style.height;
   it.el.className="pdfv-page ok";it.el.replaceChildren(cv);it.done=true;
   if(page.cleanup)page.cleanup()}
  async function pump(){
   if(busy)return;busy=true;
   while(queue.length&&alive()){
    var it=queue.shift(),g=gen;
    try{await draw(it,g)}catch(e){}
    it.q=false}
   busy=false}
  if(window.ResizeObserver){
   var lastW=sc.clientWidth;
   new ResizeObserver(function(){
    if(!alive())return;
    var w=sc.clientWidth;
    if(Math.abs(w-lastW)>40){lastW=w;W=availW();if(items.length)layout()}}).observe(sc)}

  (async function(){
   try{
    var lib=await loadPdfJs();
    var r=await fetch(pdfUrl(f.id),{credentials:"same-origin"});
    if(!r.ok)throw new Error("Could not load the file ("+r.status+")");
    var buf=await r.arrayBuffer();
    if(!alive())return;
    pdf=await lib.getDocument(pdfOpts(buf)).promise;
    if(!alive())return;
    var first=await pdf.getPage(1),v=first.getViewport({scale:1});
    p1={w:v.width,h:v.height};
    pages.replaceChildren();
    for(var n=1;n<=pdf.numPages;n++){
     var el=mkEl("div","pdfv-page wait"),it={n:n,el:el,done:false,q:false};
     el._it=it;items.push(it);pages.append(el)}
    layout();updPg()}
   catch(e){if(alive())pdfFallback(root,f.id,e)}})()}

 var pdfT=0;
 function pdfCheck(){
  if(vw.classList.contains("hidden")){
   if(stage.querySelector(".pdfv")){tokN++;stage.replaceChildren()}
   return}
  var f=curFile();
  if(!f.pdf||!f.id)return;
  var ex=stage.querySelector(".pdfv");
  if(ex&&ex.dataset.id===f.id){
   [].slice.call(stage.children).forEach(function(k){if(k!==ex)k.remove()});
   return}
  mountPdf(f)}
 function schedPdf(){clearTimeout(pdfT);pdfT=setTimeout(pdfCheck,30)}
 if(stage&&vw){
  new MutationObserver(schedPdf).observe(stage,{childList:true});
  var vn=$("#vname"),vo=$("#vopen");
  if(vn)new MutationObserver(schedPdf).observe(vn,{childList:true,characterData:true,subtree:true});
  if(vo)new MutationObserver(schedPdf).observe(vo,{attributes:true,attributeFilter:["href"]});
  new MutationObserver(schedPdf).observe(vw,{attributes:true,attributeFilter:["class"]})}

 /* ---------- PDF first-page thumbnails in the Files grid (lazy, one at a time, cached) ---------- */
 var tcache=new Map(),tq=[],tbusy=false;
 var tio=("IntersectionObserver" in window)?new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){tio.unobserve(e.target);tq.push(e.target);tpump()}})},{rootMargin:"300px 0px"}):null;
 function pdfTiles(){
  if(!tio)return;
  G.querySelectorAll(".tile .badge[data-k=pdf]").forEach(function(b){
   var t=b.closest(".tile");
   if(!t||t.dataset.pt)return;
   t.dataset.pt="1";tio.observe(t)})}
 async function tpump(){
  if(tbusy)return;tbusy=true;
  while(tq.length){
   var t=tq.shift(),th=t.isConnected&&t.querySelector(".thumb"),id=t.dataset.id;
   if(!th||!id)continue;
   try{
    var url=tcache.get(id);
    if(!url){
     var lib=await loadPdfJs();
     var r=await fetch(pdfUrl(id),{credentials:"same-origin"});
     if(!r.ok)throw new Error("x");
     if(Number(r.headers.get("Content-Length")||0)>8*1048576)throw new Error("big");
     var doc=await lib.getDocument(pdfOpts(await r.arrayBuffer())).promise;
     var page=await doc.getPage(1),v=page.getViewport({scale:1}),vp=page.getViewport({scale:360/v.width});
     var cv=document.createElement("canvas");cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);
     var ctx=cv.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,cv.width,cv.height);
     await page.render({canvasContext:ctx,viewport:vp}).promise;
     url=cv.toDataURL("image/jpeg",.82);tcache.set(id,url);
     if(doc.destroy)doc.destroy()}
    if(!t.isConnected)continue;
    var im=document.createElement("img");im.className="att-img";im.alt="";im.src=url;
    th.replaceChildren(im)}
   catch(e){}}
  tbusy=false}
 new MutationObserver(pdfTiles).observe(G,{childList:true});
 pdfTiles();
});

document.addEventListener("DOMContentLoaded",function(){
 if(typeof el!=="function"||typeof ic!=="function"||typeof api!=="function")return;
 var Q=function(s,r){return (r||document).querySelector(s)};
 var FV=Q("#filesView"),G=Q("#grid");
 if(!FV||!G)return;

 Object.assign(P,{kbd:"M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"});

 function note(t){var n=el("div","toast",t);document.body.append(n);setTimeout(function(){n.classList.add("out")},2600);setTimeout(function(){n.remove()},3000)}
 async function tapi(path,method,body){
  try{
   var r=await api(path,{method:method||"GET",headers:JSONH,body:body?JSON.stringify(body):undefined});
   var d=await r.json().catch(function(){return {}});
   if(!r.ok)throw Error(d.error||"Request failed");
   return d}
  catch(e){note(e.message||"Request failed");return null}}
 function go(name){
  try{if(typeof tab==="function"){tab(name);return}}catch(e){}
  var b=Q(name==="files"?"#tabFiles":"#tabChat");if(b)b.click()}
 function msgs(){try{return (typeof MSGS!=="undefined"&&MSGS)||[]}catch(e){return []}}
 function fileList(){try{return (typeof files!=="undefined"&&files)||[]}catch(e){return []}}
 function filesVisible(){return !FV.classList.contains("hidden")}
 function blocking(){return !!document.querySelector(".dm,.msheet,.ctxmenu,#viewer:not(.hidden),#dl:not(.hidden),#geoAsk:not(.hidden),#themePanel:not(.hidden)")}

 /* =============================== TRASH =============================== */
 var TRASH_DAYS=30;
 async function reload(){try{await loadMessages()}catch(e){}}
 async function openTrash(){
  var d=await tapi("/api/trash");if(!d)return;
  var items=d.items||[],days=d.days||TRASH_DAYS;
  openSheet("Trash",function(body){
   body.append(el("div","note","Deleted messages and files stay here for "+days+" days, then they are removed for good."));
   if(!items.length){body.append(el("div","h-empty","Trash is empty."));return}
   function again(){closeSheet();openTrash()}
   items.forEach(function(x){
    var card=el("div","sc-item"),left=Math.max(0,Math.ceil((x.deleted_at+days*86400-Date.now()/1000)/86400));
    card.append(el("div","sc-when","Deleted "+fmtDate(x.deleted_at)+" \u00b7 "+left+(left===1?" day":" days")+" left"));
    if(x.filename)card.append(el("div","sc-text","\ud83d\udcce "+x.filename+(x.size_bytes?" \u00b7 "+fmtSize(Number(x.size_bytes)):"")));
    var txt=(x.content||"").replace(/\[\[sched:\d+\]\]\n?/,"").trim();
    if(txt)card.append(el("div","sc-text",txt.slice(0,300)));
    var row=el("div","sc-act"),a=el("button","ghost","Restore"),b=el("button","ghost danger","Delete forever");
    a.type=b.type="button";
    a.onclick=async function(){if(await tapi("/api/trash/"+encodeURIComponent(x.id)+"/restore","POST")){note("Restored");await reload();again()}};
    b.onclick=async function(){
     if(!confirm("Delete this permanently? This cannot be undone."))return;
     if(await tapi("/api/trash/"+encodeURIComponent(x.id),"DELETE")){note("Deleted for good");again()}};
    row.append(a,b);card.append(row);body.append(card)});
   var foot=el("div","sc-act");foot.style.margin="10px 14px 4px";
   var em=el("button","ghost danger","Empty trash ("+items.length+")");em.type="button";
   em.onclick=async function(){
    if(!confirm("Permanently delete everything in the trash? This cannot be undone."))return;
    if(await tapi("/api/trash/empty","POST")){note("Trash emptied");again()}};
   foot.append(em);body.append(foot)})}

 /* =============================== FILES MANAGER =============================== */
 var QUOTA=10*1024*1024*1024;   /* soft quota shown in the storage bar (R2 free tier = 10 GB); change if yours differs */
 var FILE_MAX=10*1024*1024;     /* matches the 10 MB per-file upload limit in the worker */
 var selMode=false,SELF=new Set(),lpFired=false,lpT=null,lx=0,ly=0;

 /* storage panel */
 var store=el("div","fstore"),r1=el("div","fstore-row"),t1=el("span"),s1=el("small"),bar1=el("div","fbar"),i1=el("i");
 var r2=el("div","fstore-row"),t2=el("span"),s2=el("small"),bar2=el("div","fbar"),i2=el("i");
 bar1.append(i1);bar2.append(i2);r1.append(t1,s1);r2.append(t2,s2);store.append(r1,bar1,r2,bar2);
 var chips=Q("#fchips");if(chips)chips.after(store);
 function pctText(p){return (p<1?p.toFixed(2):p.toFixed(1))+"%"}
 function updStorage(){
  var list=fileList(),total=0,big=null;
  list.forEach(function(f){var n=Number(f.size_bytes)||0;total+=n;if(!big||n>(Number(big.size_bytes)||0))big=f});
  var p=total/QUOTA*100;
  t1.textContent="Storage used \u00b7 "+fmtSize(total);
  s1.textContent=list.length+(list.length===1?" file":" files")+" \u00b7 "+pctText(p)+" of "+fmtSize(QUOTA);
  i1.style.width=(total?Math.max(1.5,Math.min(100,p)):0)+"%";
  bar1.className="fbar"+(p>90?" bad":p>70?" warn":"");
  var bn=big?(Number(big.size_bytes)||0):0,bp=bn/FILE_MAX*100;
  t2.textContent=big?"Largest file \u00b7 "+big.filename:"Largest file";
  s2.textContent=fmtSize(bn)+" of "+fmtSize(FILE_MAX)+" limit";
  i2.style.width=(bn?Math.max(1.5,Math.min(100,bp)):0)+"%";
  bar2.className="fbar"+(bp>90?" bad":bp>70?" warn":"")}

 /* select button + action bar */
 var selBtn=el("button","ghost","Select");selBtn.type="button";selBtn.title="Select files (s)";
 var fctl=Q(".fctl");if(fctl)fctl.append(selBtn);
 var sbar=el("div","fselbar glass"),cnt=el("b","","0 selected");
 var allB=el("button","ghost","Select all"),dlB=el("button","ghost","Download"),delB=el("button","ghost danger","Delete"),xB=el("button","icon sm");
 [allB,dlB,delB,xB].forEach(function(b){b.type="button"});
 xB.setAttribute("aria-label","Exit selection");xB.append(ic("close"));
 sbar.append(el("div","ring"),cnt,allB,dlB,delB,xB);
 FV.append(sbar);

 function decorate(){
  var ids=new Set(fileList().map(function(f){return f.file_id}));
  SELF.forEach(function(id){if(!ids.has(id))SELF.delete(id)});
  G.querySelectorAll(".tile").forEach(function(t){
   if(!t.querySelector(".fchk"))t.append(el("span","fchk"));
   t.classList.toggle("sel",SELF.has(t.dataset.id))});
  upd()}
 function upd(){
  cnt.textContent=SELF.size+" selected";
  dlB.disabled=delB.disabled=!SELF.size}
 function setSel(on){
  selMode=on;if(!on)SELF.clear();
  FV.classList.toggle("selmode",on);document.body.classList.toggle("fsel-on",on);
  selBtn.classList.toggle("on",on);selBtn.textContent=on?"Done":"Select";
  decorate()}
 function toggleId(id){SELF.has(id)?SELF.delete(id):SELF.add(id);decorate()}
 function selectAll(){G.querySelectorAll(".tile").forEach(function(t){SELF.add(t.dataset.id)});decorate()}
 selBtn.onclick=function(){setSel(!selMode)};
 xB.onclick=function(){setSel(false)};
 allB.onclick=selectAll;

 /* click selects while in select mode; long-press starts select mode (runs before each tile's own onclick) */
 G.addEventListener("pointerdown",function(e){
  lpFired=false;if(selMode)return;
  var t=e.target.closest&&e.target.closest(".tile");if(!t)return;
  if(e.pointerType==="mouse"&&e.button!==0)return;
  lx=e.clientX;ly=e.clientY;clearTimeout(lpT);
  lpT=setTimeout(function(){
   lpT=null;lpFired=true;
   try{navigator.vibrate&&navigator.vibrate(12)}catch(x){}
   setSel(true);SELF.add(t.dataset.id);decorate()},500)});
 G.addEventListener("pointermove",function(e){if(lpT&&(Math.abs(e.clientX-lx)>8||Math.abs(e.clientY-ly)>8)){clearTimeout(lpT);lpT=null}});
 ["pointerup","pointercancel","pointerleave"].forEach(function(n){G.addEventListener(n,function(){clearTimeout(lpT);lpT=null})});
 G.addEventListener("contextmenu",function(e){if(lpFired||selMode)e.preventDefault()});
 G.addEventListener("click",function(e){
  var t=e.target.closest&&e.target.closest(".tile");if(!t)return;
  if(lpFired){lpFired=false;e.preventDefault();e.stopImmediatePropagation();return}
  if(!selMode)return;
  e.preventDefault();e.stopImmediatePropagation();toggleId(t.dataset.id)},true);

 /* tiles are rebuilt on every render, so decorate + refresh the storage bar whenever the grid changes */
 var gq=false;
 new MutationObserver(function(){
  if(gq)return;gq=true;
  requestAnimationFrame(function(){gq=false;decorate();updStorage()})}).observe(G,{childList:true});
 decorate();updStorage();

 /* bulk delete -> Trash. Note: a file lives on its chat message, so that message (and its caption) goes to Trash too. */
 delB.onclick=bulkDelete;
 async function bulkDelete(){
  if(!SELF.size)return;
  var n=SELF.size,ids=[];
  msgs().forEach(function(m){if(m.file_id&&SELF.has(m.file_id))ids.push(m.id)});
  if(!ids.length){note("Could not match those files to their messages");return}
  if(!confirm("Move "+n+(n===1?" file":" files")+" to Trash? You can restore "+(n===1?"it":"them")+" for "+TRASH_DAYS+" days."))return;
  for(var i=0;i<ids.length;i+=100){
   if(!(await tapi("/api/messages/bulk-delete","POST",{ids:ids.slice(i,i+100)})))return}
  note("Moved to Trash");setSel(false);await reload()}

 /* bulk download: one file downloads directly, several are bundled into a .zip (built in the browser, no library) */
 var CRC=(function(){var t=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
 function crc32(u){var c=0xFFFFFFFF;for(var i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
 function zip(entries){
  var enc=new TextEncoder(),parts=[],cd=[],off=0,now=new Date();
  var dt=((now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1))&0xFFFF;
  var dd=(((now.getFullYear()-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate())&0xFFFF;
  entries.forEach(function(e){
   var nm=enc.encode(e.name),crc=crc32(e.data),sz=e.data.length;
   var lh=new DataView(new ArrayBuffer(30));
   lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(8,0,true);
   lh.setUint16(10,dt,true);lh.setUint16(12,dd,true);lh.setUint32(14,crc,true);lh.setUint32(18,sz,true);lh.setUint32(22,sz,true);
   lh.setUint16(26,nm.length,true);lh.setUint16(28,0,true);
   parts.push(lh.buffer,nm,e.data);
   var ch=new DataView(new ArrayBuffer(46));
   ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(10,0,true);
   ch.setUint16(12,dt,true);ch.setUint16(14,dd,true);ch.setUint32(16,crc,true);ch.setUint32(20,sz,true);ch.setUint32(24,sz,true);
   ch.setUint16(28,nm.length,true);ch.setUint32(42,off,true);
   cd.push(ch.buffer,nm);
   off+=30+nm.length+sz});
  var cdSize=0;cd.forEach(function(b){cdSize+=b.byteLength});
  var end=new DataView(new ArrayBuffer(22));
  end.setUint32(0,0x06054b50,true);end.setUint16(8,entries.length,true);end.setUint16(10,entries.length,true);
  end.setUint32(12,cdSize,true);end.setUint32(16,off,true);
  return new Blob(parts.concat(cd,[end.buffer]),{type:"application/zip"})}
 function save(blob,name){
  var u=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=u;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(u)},4000)}
 async function grab(f){
  var r=await fetch("/api/files/"+encodeURIComponent(f.file_id),{credentials:"same-origin"});
  if(!r.ok)throw Error("Could not download "+(f.filename||"a file"));
  return r.arrayBuffer()}
 dlB.onclick=async function(){
  var sel=fileList().filter(function(f){return SELF.has(f.file_id)});
  if(!sel.length)return;
  var orig="Download";dlB.disabled=true;
  try{
   if(sel.length===1){save(new Blob([await grab(sel[0])]),sel[0].filename||"file")}
   else{
    var used={},entries=[];
    for(var i=0;i<sel.length;i++){
     dlB.textContent=(i+1)+" / "+sel.length+"\u2026";
     var f=sel[i],name=String(f.filename||"file").replace(/[\\/:*?"<>|]/g,"_");
     if(used[name]){
      var dot=name.lastIndexOf("."),base=dot>0?name.slice(0,dot):name,ext=dot>0?name.slice(dot):"";
      name=base+" ("+(++used[name])+")"+ext}
     else used[name]=1;
     entries.push({name:name,data:new Uint8Array(await grab(f))})}
    save(zip(entries),"workspace-files-"+new Date().toISOString().slice(0,10)+".zip")}}
  catch(e){note(e.message||"Download failed")}
  dlB.textContent=orig;upd()};

 /* =============================== BACK TO TOP (progress ring) =============================== */
 var tt=document.createElement("button");
 tt.type="button";tt.className="totop";tt.title="Back to top";tt.setAttribute("aria-label","Back to top");
 tt.innerHTML='<svg class="ttring" viewBox="0 0 44 44" aria-hidden="true"><circle class="ttr-t" cx="22" cy="22" r="20"></circle><circle class="ttr-p" cx="22" cy="22" r="20"></circle></svg><svg class="ttarrow" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>';
 document.body.append(tt);
 var tp=tt.querySelector(".ttr-p"),TC=2*Math.PI*20,traf=0;
 tp.style.strokeDasharray=TC.toFixed(2);tp.style.strokeDashoffset=TC.toFixed(2);
 function scroller(){
  var app=Q("#app");if(!app||app.classList.contains("hidden"))return null;
  var f=Q("#filesView"),h=Q("#homeView"),c=Q("#chatView");
  if(f&&!f.classList.contains("hidden"))return f;
  if(h&&!h.classList.contains("hidden"))return h;
  if(c&&!c.classList.contains("hidden")&&c.classList.contains("show-links"))return Q(".lklist");
  if(c&&!c.classList.contains("hidden")&&c.classList.contains("show-activity"))return Q(".actlist");
  return null}
 function updTop(){
  traf=0;var s=scroller();
  if(!s){tt.classList.remove("show");return}
  var mx=s.scrollHeight-s.clientHeight,pr=mx>0?Math.max(0,Math.min(1,s.scrollTop/mx)):0;
  tp.style.strokeDashoffset=(TC*(1-pr)).toFixed(2);
  tt.title="Back to top \u00b7 "+Math.round(pr*100)+"%";
  tt.classList.toggle("show",s.scrollTop>260)}
 function schedTop(){if(!traf)traf=requestAnimationFrame(updTop)}
 document.addEventListener("scroll",schedTop,true);   /* scroll does not bubble, so listen in the capture phase */
 window.addEventListener("resize",schedTop);
 setInterval(updTop,400);                              /* also catches tab switches and re-renders */
 tt.onclick=function(){var s=scroller();if(s)s.scrollTo({top:0,behavior:"smooth"})};

 /* =============================== AUTO-CLOSING SEARCH =============================== */
 var qi=Q("#q"),sb=Q("#searchbar");
 function closeSearch(){
  if(!sb||sb.classList.contains("hidden"))return;
  var had=false;try{had=!!SEARCHQ}catch(e){}
  sb.classList.add("hidden");
  if(qi)qi.value="";
  try{SEARCHQ=""}catch(e){}
  if(had){try{renderFeed(MSGS)}catch(e){}}}
 if(qi){
  /* leaving the box with nothing typed closes it; with a query it stays so you can read the results */
  qi.addEventListener("blur",function(){setTimeout(function(){if(!qi.value.trim()&&document.activeElement!==qi)closeSearch()},180)});
  qi.addEventListener("keydown",function(e){if(e.key==="Escape"){e.stopPropagation();closeSearch();qi.blur()}})}
 /* switching to Files / Home / Links also closes it */
 var cv=Q("#chatView"),sq=false;
 function viewWatch(){
  if(sq)return;sq=true;
  requestAnimationFrame(function(){
   sq=false;
   if(cv&&(cv.classList.contains("hidden")||cv.classList.contains("show-links")||cv.classList.contains("show-activity")))closeSearch()})}
 if(cv)new MutationObserver(viewWatch).observe(cv,{attributes:true,attributeFilter:["class"]});

 /* =============================== tmore MENU: Links, Trash, Shortcuts =============================== */
 function openView(name){go("chat");if(window.wsGo)window.wsGo(name)}
 function openLinks(){openView("links")}
 function openActivity(){openView("activity")}
 function extendMenu(mn){
  if(mn.dataset.x)return;mn.dataset.x="1";
  function item(icon,label,fn,hint){
   var b=el("button","mi");b.type="button";b.setAttribute("role","menuitem");
   b.append(ic(icon),el("span","",label));
   if(hint)b.append(el("span","tr",hint));
   b.onclick=function(e){
    e.stopPropagation();mn.remove();
    var m=Q("#tmore");if(m)m.setAttribute("aria-expanded","false");
    setTimeout(fn,0)};
   mn.append(b)}
  mn.append(el("div","mdiv"));
  item("link","Links",openLinks,"g l");
  item("wsact","Activity log",openActivity,"g a");
  item("wschart","Usage",function(){if(window.openUsage)window.openUsage()});
  item("wskey","Passkeys",function(){if(window.openPasskeys)window.openPasskeys()});
  item("trash","Trash",openTrash,"g t");
  item("kbd","Keyboard shortcuts",showKeys,"?");
  var top=parseFloat(mn.style.top)||8;
  mn.style.top=Math.max(8,Math.min(top,innerHeight-mn.offsetHeight-8))+"px"}
 new MutationObserver(function(ms){
  ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.id==="tmenu")extendMenu(n)})})}).observe(document.body,{childList:true});

 /* =============================== KEYBOARD SHORTCUTS =============================== */
 var ROWS=[
  ["/","Search messages, or files on the Files page"],
  ["g then c","Go to Chat"],["g then f","Go to Files"],["g then l","Go to Links"],["g then a","Go to Activity log"],["g then t","Open Trash"],
  ["s","Select files (Files page)"],["Ctrl/Cmd + A","Select all files (while selecting)"],["Delete","Move selected files to Trash"],
  ["Esc","Close, clear search or leave selection"],["?","Show this list"]];
 function showKeys(){
  if(Q("#kbdHelp"))return;
  var ov=el("div","dm");ov.id="kbdHelp";ov.style.zIndex="98";
  ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label","Keyboard shortcuts");
  var card=el("div","dm-card"),head=el("div","dm-head"),ico=el("span","dm-ico");ico.append(ic("kbd"));
  var tx=el("div");tx.append(el("b","","Keyboard shortcuts"),el("small","","Active when you are not typing in a box"));
  head.append(ico,tx);
  var body=el("div","dm-body");
  ROWS.forEach(function(r){var row=el("div","krow");row.append(el("span","",r[1]),el("span","kbd",r[0]));body.append(row)});
  var foot=el("div","dm-foot"),ok=el("button","btn","Close");ok.type="button";ok.style.height="42px";ok.style.padding="0 22px";ok.style.fontSize="14px";
  foot.append(ok);card.append(head,body,foot);ov.append(card);
  function done(){document.removeEventListener("keydown",key,true);ov.remove()}
  function key(e){if(e.key==="Escape"||e.key==="?"){e.stopImmediatePropagation();e.preventDefault();done()}}
  ok.onclick=done;ov.addEventListener("click",function(e){if(e.target===ov)done()});
  document.body.append(ov);document.addEventListener("keydown",key,true);ok.focus()}
 function focusSearch(){
  if(filesVisible()){
   FV.scrollTo({top:0,behavior:"smooth"});
   var f=Q("#fq");f.focus();f.select();return}
  var s=Q("#searchbar");
  if(s.classList.contains("hidden"))Q("#searchBtn").click();
  else Q("#q").focus()}
 function typing(t){return !!t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))}
 var pend=false,pendT=0;
 document.addEventListener("keydown",function(e){
  var app=Q("#app");if(!app||app.classList.contains("hidden"))return;
  if(e.key==="Escape"&&selMode&&!blocking()&&!typing(e.target)){setSel(false);return}
  if(typing(e.target)||e.altKey)return;
  if(e.ctrlKey||e.metaKey){
   if(selMode&&e.key.toLowerCase()==="a"&&!blocking()){e.preventDefault();selectAll()}
   return}
  if(blocking())return;
  var k=e.key;
  if(pend){
   pend=false;clearTimeout(pendT);
   if(k==="c"){e.preventDefault();go("chat")}
   else if(k==="f"){e.preventDefault();go("files")}
   else if(k==="l"){e.preventDefault();openLinks()}
   else if(k==="a"){e.preventDefault();openActivity()}
   else if(k==="t"){e.preventDefault();openTrash()}
   return}
  if(k==="g"){pend=true;pendT=setTimeout(function(){pend=false},900);return}
  if(k==="/"){e.preventDefault();focusSearch();return}
  if(k==="?"){e.preventDefault();showKeys();return}
  if(k==="s"&&filesVisible()){e.preventDefault();setSel(!selMode);return}
  if(k==="Delete"&&selMode&&SELF.size){e.preventDefault();bulkDelete()}});
});

document.addEventListener("DOMContentLoaded",function(){
 var Q=function(s,r){return (r||document).querySelector(s)};
 var hasUI=(typeof el==="function"&&typeof ic==="function");

 /* ---------- small shared helpers ---------- */
 function toast(t){var n=document.createElement("div");n.className="toast";n.textContent=t;document.body.append(n);setTimeout(function(){n.classList.add("out")},2600);setTimeout(function(){n.remove()},3000)}
 async function call(path,method,body){
  try{
   var r=await fetch(path,{method:method||"GET",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:body===undefined?undefined:JSON.stringify(body)});
   var d={};try{d=await r.json()}catch(e){}
   return {ok:r.ok,status:r.status,data:d}}
  catch(e){return {ok:false,status:0,data:{error:"Request failed"}}}}
 function when(ts){
  var d=new Date(ts*1000);
  try{if(typeof fmtDate==="function")return fmtDate(ts)}catch(e){}
  return d.toLocaleString([],{day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"})}
 function clock(ts){try{if(typeof fmtTime==="function")return fmtTime(ts)}catch(e){}return new Date(ts*1000).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}
 function dayOf(ts){try{if(typeof dayLabel==="function")return dayLabel(ts)}catch(e){}return new Date(ts*1000).toLocaleDateString([],{weekday:"short",day:"numeric",month:"short"})}
 function fb(n){
  n=Number(n)||0;if(n<1024)return n+" B";
  var u=["KB","MB","GB","TB"],i=-1;do{n/=1024;i++}while(n>=1024&&i<3);
  var s=n>=100?n.toFixed(0):n>=10?n.toFixed(1):n.toFixed(2);
  if(s.indexOf(".")>=0)s=s.replace(/0+$/,"").replace(/\.$/,"");
  return s+" "+u[i]}
 var b64u={
  enc:function(buf){var b=new Uint8Array(buf),s="";for(var i=0;i<b.length;i++)s+=String.fromCharCode(b[i]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},
  dec:function(s){s=String(s).replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var r=atob(s),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}};
 var KEYSVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>';

 /* =====================================================================
    PASSKEYS: sign in with fingerprint / face / screen lock
    ===================================================================== */
 var pkOK=!!(window.PublicKeyCredential&&navigator.credentials);
 function pkMsg(e){
  var n=e&&e.name;
  if(n==="NotAllowedError")return "Passkey step was cancelled or timed out.";
  if(n==="InvalidStateError")return "This device already has a passkey for this site.";
  if(n==="SecurityError")return "Passkeys need the real site address (https). Open the workspace from its normal URL.";
  return (e&&e.message)||"Passkey failed"}

 /* login screen button */
 var lf=Q("#loginForm"),pkb=Q("#passkeyLogin");
 if(lf&&pkb&&pkOK){
  pkb.classList.remove("hidden");pkb.innerHTML=KEYSVG+"<span>Sign in with a passkey</span>";
  pkb.addEventListener("click",async function(){
   var err=Q("#loginError");if(err)err.textContent="";
   pkb.disabled=true;
   try{
    var o=await call("/api/passkey/login/options","POST",{});
    if(o.status===423){location.href=(o.data&&o.data.redirect)||"/";return}
    if(!o.ok)throw Error(o.data.error||"Passkey sign-in is unavailable");
    var pk=o.data.publicKey;
    var cred=await navigator.credentials.get({publicKey:{
     challenge:b64u.dec(pk.challenge),rpId:pk.rpId,timeout:pk.timeout,userVerification:pk.userVerification,
     allowCredentials:(pk.allowCredentials||[]).map(function(c){var x={type:"public-key",id:b64u.dec(c.id)};if(c.transports)x.transports=c.transports;return x})}});
    var r=cred.response;
    var v=await call("/api/passkey/login/verify","POST",{
     challengeId:o.data.challengeId,id:cred.id,
     clientDataJSON:b64u.enc(r.clientDataJSON),authenticatorData:b64u.enc(r.authenticatorData),signature:b64u.enc(r.signature)});
    if(v.status===423){location.href=(v.data&&v.data.redirect)||"/";return}
    if(!v.ok)throw Error(v.data.error||"Passkey sign-in failed");
    location.reload()}
   catch(e){if(err)err.textContent=pkMsg(e)}
   finally{pkb.disabled=false}})}

 /* register / list / remove (signed in) */
 async function addPasskey(){
  if(!pkOK){toast("This browser does not support passkeys");return false}
  var o=await call("/api/passkey/register/options","POST",{});
  if(!o.ok){toast(o.data.error||"Could not start");return false}
  var pk=o.data.publicKey,cred;
  try{
   cred=await navigator.credentials.create({publicKey:{
    rp:pk.rp,user:{id:b64u.dec(pk.user.id),name:pk.user.name,displayName:pk.user.displayName},
    challenge:b64u.dec(pk.challenge),pubKeyCredParams:pk.pubKeyCredParams,timeout:pk.timeout,attestation:"none",
    authenticatorSelection:pk.authenticatorSelection,
    excludeCredentials:(pk.excludeCredentials||[]).map(function(c){return {type:"public-key",id:b64u.dec(c.id)}})}})}
  catch(e){toast(pkMsg(e));return false}
  var r=cred.response;
  if(!r.getPublicKey||!r.getPublicKeyAlgorithm||!r.getAuthenticatorData||!r.getPublicKey()){toast("This browser cannot register passkeys for this site");return false}
  var v=await call("/api/passkey/register/verify","POST",{
   challengeId:o.data.challengeId,id:cred.id,
   clientDataJSON:b64u.enc(r.clientDataJSON),authenticatorData:b64u.enc(r.getAuthenticatorData()),
   publicKey:b64u.enc(r.getPublicKey()),alg:r.getPublicKeyAlgorithm(),transports:r.getTransports?r.getTransports():[]});
  if(!v.ok){toast(v.data.error||"Could not save the passkey");return false}
  toast("Passkey added");return true}

 window.openPasskeys=async function(){
  if(!hasUI||typeof openSheet!=="function")return;
  var r=await call("/api/passkeys");
  openSheet("Passkeys",function(body){
   body.append(el("p","pk-note",pkOK
    ?"Unlock the workspace with your fingerprint, face or screen lock instead of typing the password. Only the public half of each passkey is stored on the server."
    :"This browser does not support passkeys."));
   if(!r.ok)body.append(el("div","h-empty",r.data.error||"Could not load passkeys"));
   else if(!r.data.passkeys.length)body.append(el("div","h-empty","No passkeys yet."));
   else r.data.passkeys.forEach(function(p){
    var row=el("div","pk-item"),ico=el("span","pk-ic"),tx=el("div","pk-tx"),del=el("button","ghost danger","Remove");
    ico.innerHTML=KEYSVG;del.type="button";
    tx.append(el("b","",p.label||"Passkey"),el("small","","Added "+when(p.created_at)+" \u00b7 "+(p.last_used_at?"last used "+when(p.last_used_at):"never used")));
    del.onclick=async function(){
     if(!confirm("Remove this passkey? You can still sign in with your password."))return;
     var d=await call("/api/passkeys/"+encodeURIComponent(p.id),"DELETE");
     if(!d.ok){toast(d.data.error||"Could not remove");return}
     toast("Passkey removed");closeSheet();setTimeout(window.openPasskeys,0)};
    row.append(ico,tx,del);body.append(row)});
   if(pkOK){
    var add=el("button","btn pk-add","Add a passkey on this device");add.type="button";
    add.onclick=async function(){
     add.disabled=true;var ok=false;
     try{ok=await addPasskey()}finally{add.disabled=false}
     if(ok){closeSheet();setTimeout(window.openPasskeys,0)}};
    body.append(add)}})};

 if(!hasUI)return;   /* everything below needs the app helpers from script.js */

 /* =====================================================================
    ACTIVITY LOG view (opens from the menu, "Back to chat" returns)
    ===================================================================== */
 var cv=Q("#chatView"),feed=Q("#messages");
 var ap=el("div","actpanel"),ahd=el("div","vback"),aback=el("button","vback-btn"),alist=el("div","actlist"),amore=el("button","ghost actmore","Load more");
 aback.type=amore.type="button";aback.append(ic("wsback"),el("span","","Back to chat"));
 ahd.append(aback,el("b","","Activity log"));
 amore.classList.add("hidden");
 ap.append(ahd,alist);
 if(cv&&feed)(cv.querySelector(".lkpanel")||feed).after(ap);
 aback.onclick=function(){if(window.wsBack)window.wsBack()};
 var ACT={upload:["\u{1F4E4}","Uploaded"],delete:["\u{1F5D1}\uFE0F","Moved to trash"],restore:["\u267B\uFE0F","Restored"],edit:["\u270F\uFE0F","Edited message"],
  edit_file:["\u{1F4DD}","Edited file"],purge:["\u26D4","Deleted forever"],expire:["\u231B","Trash expired"],empty_trash:["\u{1F9F9}","Emptied trash"],
  passkey_add:["\u{1F511}","Passkey added"],passkey_remove:["\u{1F6AB}","Passkey removed"]};
 var actNext=null,actBusy=false,actLastDay="",actN=0;
 function addActRows(items){
  items.forEach(function(x){
   var dl=dayOf(x.created_at);
   if(dl!==actLastDay){actLastDay=dl;alist.append(el("div","act-day",dl))}
   var a=ACT[x.action]||["\u2022",x.action],row=el("div","act"),ico=el("span","act-ic",a[0]),tx=el("div","act-tx");
   row.style.setProperty("--i",Math.min(actN++,12));
   tx.append(el("b","",a[1]));if(x.detail)tx.append(el("span","",x.detail));
   var t=el("time","",clock(x.created_at));t.title=when(x.created_at);
   row.append(ico,tx,t);alist.append(row)})}
 async function loadActivity(reset){
  if(actBusy)return;actBusy=true;
  if(reset){alist.replaceChildren(el("div","empty","Loading activity\u2026"));actNext=null;actLastDay="";actN=0}
  amore.remove();
  var r=await call("/api/activity?limit=40"+(!reset&&actNext?"&before="+actNext:""));
  if(reset)alist.replaceChildren();
  if(!r.ok){alist.append(el("div","empty",r.status===503?"You are offline.":(r.data.error||"Could not load the activity log")));actBusy=false;return}
  var items=r.data.items||[];
  if(reset&&!items.length)alist.append(el("div","empty","Nothing yet. Uploads, deletes, restores and edits show up here."));
  addActRows(items);
  actNext=r.data.next||null;
  if(actNext){amore.classList.remove("hidden");alist.append(amore)}
  actBusy=false}
 amore.onclick=function(){loadActivity(false)};
 window.wsActivityShow=function(){loadActivity(true)};

 /* =====================================================================
    DASHBOARD on Home (+ "Usage" sheet from the menu)
    ===================================================================== */
 var DASH=null,DASH_AT=0,dashBusy=false;
 function shortDay(ts){return new Date(ts*1000).toLocaleDateString(undefined,{day:"numeric",month:"short"})}
 function renderDash(box,d){
  box.replaceChildren();
  var W=d.weeks||[],T=d.totals||{},last=W[W.length-1]||{messages:0},first=W[0]||{total:0,bytes:0};
  var head=el("div","dash-h"),ttl=el("div");
  ttl.append(el("b","","Usage"),el("small","","Last "+W.length+" weeks \u00b7 weeks start on Monday"));
  var rf=el("button","ghost","Refresh");rf.type="button";rf.onclick=function(){loadDash(box,true)};
  head.append(ttl,el("span","spacer"),rf);box.append(head);

  var st=el("div","dash-stats");
  [["Messages",String(T.messages||0)],["This week",String(last.messages||0)],["Files",String(T.files||0)],["Storage",fb(T.bytes)]].forEach(function(s){
   var c=el("div","dstat");c.append(el("b","",s[1]),el("span","",s[0]));st.append(c)});
  box.append(st);

  /* messages per week */
  var c1=el("div","dchart"),h1=el("h4","","Messages per week"),mx=1;
  W.forEach(function(w){if(w.messages>mx)mx=w.messages});
  h1.append(el("small","","peak "+mx));c1.append(h1);
  var bars=el("div","dbars"),lbl=el("div","dlbl");
  W.forEach(function(w,i){
   var col=el("div","dcol"+(i===W.length-1?" cur":"")),bar=el("div","dbar");
   bar.style.height=(w.messages?Math.max(4,Math.round(w.messages/mx*100)):0)+"%";
   if(w.messages)bar.append(el("em","",String(w.messages)));
   col.title="Week of "+shortDay(w.start)+": "+w.messages+" message"+(w.messages===1?"":"s");
   col.append(bar);bars.append(col);
   lbl.append(el("i","",(W.length-1-i)%3===0?shortDay(w.start):""))});
  c1.append(bars,lbl);box.append(c1);

  /* storage growth */
  var c2=el("div","dchart"),h2=el("h4","","Storage growth"),grow=Math.max(0,(last.total||0)-((first.total||0)-(first.bytes||0)));
  h2.append(el("small","",fb(last.total||0)+(grow?" \u00b7 +"+fb(grow):"")));c2.append(h2);
  var wd=300,ht=100,pad=6,tmax=1;
  W.forEach(function(w){if(w.total>tmax)tmax=w.total});
  var n=Math.max(1,W.length-1),pts=W.map(function(w,i){return [pad+(wd-2*pad)*i/n,ht-pad-(ht-2*pad)*(w.total/tmax)]});
  var line=pts.map(function(p,i){return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)}).join(" ");
  var area=line+" L"+pts[pts.length-1][0].toFixed(1)+" "+(ht-pad)+" L"+pts[0][0].toFixed(1)+" "+(ht-pad)+" Z";
  var lp=pts[pts.length-1],svg='<svg class="dsvg" viewBox="0 0 '+wd+" "+ht+'" preserveAspectRatio="none" role="img" aria-label="Storage used over the last '+W.length+' weeks">'+
   '<line class="dgrid" x1="0" x2="'+wd+'" y1="'+(ht-pad)+'" y2="'+(ht-pad)+'"/><line class="dgrid" x1="0" x2="'+wd+'" y1="'+pad+'" y2="'+pad+'"/>'+
   '<path class="darea" d="'+area+'"/><path class="dline" d="'+line+'"/><circle class="ddot" cx="'+lp[0].toFixed(1)+'" cy="'+lp[1].toFixed(1)+'" r="4.5"/></svg>';
  var sv=el("div");sv.innerHTML=svg;c2.append(sv.firstChild);box.append(c2);

  /* biggest file types */
  var c3=el("div","dchart");c3.append(el("h4","","Biggest file types"));
  var ty=d.types||[],tm=1;ty.forEach(function(t){if(t.bytes>tm)tm=t.bytes});
  if(!ty.length)c3.append(el("div","dempty","No files yet."));
  else{var tw=el("div","dtypes");
   ty.forEach(function(t){
    var r=el("div","dtype"),tr=el("div","dtrack"),fill=document.createElement("i");
    fill.style.width=Math.max(2,Math.round(t.bytes/tm*100))+"%";tr.append(fill);
    r.append(el("b","",t.merged?"others":("."+t.ext)),tr,el("small","",fb(t.bytes)+" \u00b7 "+t.count));tw.append(r)});
   c3.append(tw)}
  box.append(c3)}
 async function loadDash(box,force){
  if(dashBusy)return;
  if(!force&&DASH&&Date.now()-DASH_AT<45000){renderDash(box,DASH);return}
  dashBusy=true;
  if(!DASH)box.replaceChildren(el("div","dash-load","Loading usage\u2026"));
  var r=await call("/api/stats");
  dashBusy=false;
  if(r.ok){DASH=r.data;DASH_AT=Date.now();renderDash(box,DASH)}
  else if(DASH)renderDash(box,DASH);
  else box.replaceChildren(el("div","dash-load",r.status===503?"Usage is not available offline.":(r.data.error||"Could not load usage")))}
 function mountHome(){
  var home=Q("#homeView");if(!home)return;
  var card=home.querySelector(".dash");
  if(!card){
   if(!home.children.length)return;                  /* wait until script.js has drawn Home */
   card=el("section","dash glass");home.append(card);
   if(DASH)renderDash(card,DASH);else card.append(el("div","dash-load","Loading usage\u2026"))}
  if(home.classList.contains("hidden"))return;       /* only fetch while Home is on screen */
  if(!DASH||Date.now()-DASH_AT>=45000)loadDash(card,false)}
 setInterval(mountHome,1200);
 window.openUsage=function(){
  if(typeof openSheet!=="function")return;
  openSheet("Usage",function(body){
   var w=el("div","dsheet"),box=el("section","dash");w.append(box);body.append(w);loadDash(box,true)})};

 /* =====================================================================
    VOICE NOTES: record in the composer, attach, then Send
    ===================================================================== */
 (function(){
  var form=Q("#sendForm"),crow=form&&form.querySelector(".crow"),fin=Q("#file");
  if(!form||!crow||!fin||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder)return;
  var mic=el("button","icon");mic.type="button";mic.id="micBtn";mic.title="Record a voice note";mic.setAttribute("aria-label","Record a voice note");mic.append(ic("wsmic"));
  (Q("#fmtToggle")||Q("#attach")||crow.firstChild).after(mic);
  var bar=el("div","recbar"),dot=el("span","recdot"),tm=el("span","rectime","0:00"),tx=el("span","rectxt","Recording\u2026"),
      cx=el("button","icon"),ok=el("button","icon stopb");
  cx.type=ok.type="button";cx.title="Discard";cx.setAttribute("aria-label","Discard recording");cx.append(ic("trash"));
  ok.title="Stop and attach";ok.setAttribute("aria-label","Stop and attach");ok.append(ic("wsok"));
  bar.append(cx,dot,tm,tx,ok);form.insertBefore(bar,crow);
  var rec=null,chunks=[],stream=null,t0=0,tick=null,drop=false,MAXS=300;
  function pick(){var c=["audio/mp4","audio/ogg;codecs=opus","audio/webm;codecs=opus","audio/webm"];for(var i=0;i<c.length;i++){try{if(MediaRecorder.isTypeSupported(c[i]))return c[i]}catch(e){}}return ""}
  function micErr(e){
   var n=e&&e.name;
   if(n==="NotAllowedError"||n==="SecurityError")return "Microphone is blocked. Allow it for this site in your browser settings.";
   if(n==="NotFoundError"||n==="OverconstrainedError")return "No microphone found on this device.";
   if(n==="NotReadableError")return "The microphone is in use by another app.";
   return "Could not start the microphone"}
  function two(n){return (n<10?"0":"")+n}
  function stamp(){var d=new Date();return d.getFullYear()+two(d.getMonth()+1)+two(d.getDate())+"-"+two(d.getHours())+two(d.getMinutes())+two(d.getSeconds())}
  function ui(on){form.classList.toggle("recording",on);mic.classList.toggle("on",on)}
  function release(){
   clearInterval(tick);tick=null;
   if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}
   rec=null;ui(false);tm.textContent="0:00"}
  function upd(){
   var s=Math.floor((Date.now()-t0)/1000);tm.textContent=Math.floor(s/60)+":"+two(s%60);
   if(s>=MAXS)finish(false)}
  function finish(discard){drop=!!discard;if(rec&&rec.state!=="inactive"){try{rec.stop()}catch(e){onStop()}}else onStop()}
  function onStop(){
   var type=(rec&&rec.mimeType)||(chunks[0]&&chunks[0].type)||"audio/webm",blob=new Blob(chunks,{type:type}),skip=drop;
   chunks=[];release();
   if(skip||!blob.size)return;
   if(blob.size>10*1024*1024){toast("Voice note is too large (10 MB maximum)");return}
   var ext=type.indexOf("mp4")>=0?"m4a":type.indexOf("ogg")>=0?"ogg":"webm";
   var f=new File([blob],"voice-note-"+stamp()+"."+ext,{type:type.split(";")[0]});
   try{var dt=new DataTransfer();dt.items.add(f);fin.files=dt.files;fin.dispatchEvent(new Event("change",{bubbles:true}))}
   catch(e){toast("Could not attach the recording");return}
   toast("Voice note attached. Press Send.")}
  async function start(){
   if(rec)return;
   try{if(typeof EDIT!=="undefined"&&EDIT){toast("Finish editing first");return}}catch(e){}
   if(window.WS_OUTBOX&&!navigator.onLine){toast("You are offline. Files cannot be sent until you reconnect.")}
   try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}
   catch(e){toast(micErr(e));return}
   var mime=pick(),opts={audioBitsPerSecond:64000};if(mime)opts.mimeType=mime;
   try{rec=new MediaRecorder(stream,opts)}
   catch(e){try{rec=new MediaRecorder(stream)}catch(e2){release();toast("Recording is not supported in this browser");return}}
   chunks=[];drop=false;
   rec.ondataavailable=function(ev){if(ev.data&&ev.data.size)chunks.push(ev.data)};
   rec.onerror=function(){toast("Recording failed");finish(true)};
   rec.onstop=onStop;
   rec.start(1000);t0=Date.now();ui(true);tick=setInterval(upd,250)}
  mic.onclick=function(){if(rec)finish(false);else start()};
  ok.onclick=function(){finish(false)};
  cx.onclick=function(){finish(true)};
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&rec){e.stopImmediatePropagation();finish(true)}},true);
  window.addEventListener("pagehide",function(){if(rec)finish(true)})
 })();

 /* =====================================================================
    EMOJI REACTIONS + "waiting to send" marks (both painted after every render)
    ===================================================================== */
 var EM=["\u{1F44D}","\u2764\uFE0F","\u{1F602}","\u{1F62E}","\u{1F622}","\u{1F64F}","\u{1F525}","\u{1F389}"];
 function node(id){try{return (typeof ART!=="undefined"&&ART[id])||null}catch(e){return null}}
 function isPending(m){return !!(m.pending||(window.WS_OUTBOX&&WS_OUTBOX.ids().indexOf(m.id)>=0))}
 function paintOne(m){
  var n=node(m.id);if(!n)return;
  var main=n.querySelector(".li-main");if(!main)return;
  var old=main.querySelector(".rx-row");if(old)old.remove();
  var rs=m.reactions||[];
  if(rs.length){
   var row=el("div","rx-row");
   rs.forEach(function(e){
    var b=el("button","rx-chip",e);b.type="button";b.title="Remove reaction";b.setAttribute("aria-label","Remove reaction "+e);
    b.onclick=function(ev){ev.stopPropagation();react(m,e)};row.append(b)});
   var foot=main.querySelector(".li-foot");foot?main.insertBefore(row,foot):main.append(row)}
  if(isPending(m)){
   n.classList.add("pending");
   var f=main.querySelector(".li-foot");
   if(f&&!f.querySelector(".qchip"))f.prepend(el("span","li-chip qchip","\u23F3 Waiting to send"))}}
 function paintAll(){var l=[];try{l=MSGS||[]}catch(e){}l.forEach(paintOne)}
 async function react(m,e){
  if(isPending(m)){toast("Wait until this message has been sent");return}
  var r=await call("/api/messages/"+encodeURIComponent(m.id)+"/react","POST",{emoji:e});
  if(!r.ok){toast(r.status===503?"You are offline":(r.data.error||"Could not react"));return}
  m.reactions=r.data.reactions||[];paintOne(m)}
 if(typeof window.renderFeed==="function"){
  var _rf=window.renderFeed;
  window.renderFeed=function(){
   var r=_rf.apply(this,arguments);
   if(r&&typeof r.then==="function")return r.then(function(v){paintAll();return v});
   paintAll();return r}}
 window.addEventListener("ws:outbox",function(){setTimeout(paintAll,0)});
 if(typeof window.openMenu==="function"){
  var _om=window.openMenu;
  window.openMenu=function(m,x,y){
   _om.apply(this,arguments);
   var mn=document.getElementById("ctx");if(!mn||isPending(m))return;
   var row=el("div","rxpick"),have=m.reactions||[];
   EM.forEach(function(e){
    var b=el("button",have.indexOf(e)>=0?"on":"",e);b.type="button";b.setAttribute("aria-label","React "+e);
    b.onclick=function(ev){ev.stopPropagation();try{closeMenu()}catch(err){mn.remove()}react(m,e)};row.append(b)});
   var firstItem=mn.querySelector(".mi");
   if(firstItem)mn.insertBefore(row,firstItem);else mn.append(row);
   var w=mn.offsetWidth,h=mn.offsetHeight;
   mn.style.left=Math.max(8,Math.min(x,innerWidth-w-8))+"px";mn.style.top=Math.max(8,Math.min(y,innerHeight-h-8))+"px"}}
 paintAll();

 /* Esc inside Links / Activity goes back to the chat */
 document.addEventListener("keydown",function(e){
  if(e.key!=="Escape"||!window.wsCurView||window.wsCurView()==="chat")return;
  var t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
  if(document.querySelector(".dm,.msheet,.ctxmenu,#viewer:not(.hidden),#dl:not(.hidden),#geoAsk:not(.hidden)"))return;
  if(window.wsBack)window.wsBack()});
});
