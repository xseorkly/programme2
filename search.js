(()=>{
const $=id=>document.getElementById(id);
const q=$('q'),level=$('level'),type=$('type'),source=$('source'),results=$('results'),count=$('count');
let DATA=[];
const norm=s=>(s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function extractData(html){
  const token='const DATA=';const start=html.indexOf(token);if(start<0)throw new Error('Corpus DATA introuvable');
  let i=start+token.length;while(/\s/.test(html[i]))i++;if(html[i]!=='[')throw new Error('Format du corpus inattendu');
  const begin=i;let depth=0,inString=false,escape=false;
  for(;i<html.length;i++){
    const c=html[i];
    if(inString){if(escape){escape=false;continue}if(c==='\\'){escape=true;continue}if(c==='"'){inString=false}continue}
    if(c==='"'){inString=true;continue}
    if(c==='[')depth++;else if(c===']'){depth--;if(depth===0)return JSON.parse(html.slice(begin,i+1))}
  }
  throw new Error('Fin du corpus introuvable');
}
function addOptions(el,values){values.filter(Boolean).sort((a,b)=>a.localeCompare(b,'fr')).forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)})}
function statusClass(s){return ['official','national','academic'].includes(s)?s:''}
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function card(r){const url=r.url||r.source_url||'';return `<article class="result-card"><div class="badges"><span class="badge ${statusClass(r.status)}">${esc(r.level||'Cycle 4')}</span><span class="badge">${esc(r.type||'Ressource')}</span><span class="badge ${statusClass(r.status)}">${esc(r.source||'')}</span></div><h3>${esc(r.title||r.label||'Ressource')}</h3><p>${esc(r.summary||'')}</p><div class="result-actions">${url?`<a href="${esc(url)}" target="_blank" rel="noopener">Source originale</a>`:''}<button type="button" data-details="${esc(r.id||'')}">Voir la synthèse</button></div></article>`}
function render(){
 const nq=norm(q.value),nl=level.value,nt=type.value,ns=source.value;
 const found=DATA.filter(r=>{if(nl&&r.level!==nl)return false;if(nt&&r.type!==nt)return false;if(ns&&r.source!==ns)return false;if(!nq)return true;return norm([r.title,r.label,r.summary,r.details,r.type,r.level,r.source,...(r.tags||[])].join(' ')).includes(nq)});
 count.textContent=`${found.length} ressource${found.length>1?'s':''} sur ${DATA.length}`;
 results.innerHTML=found.length?found.slice(0,200).map(card).join(''):'<div class="empty">Aucune ressource trouvée. Essaie un terme plus large ou réinitialise les filtres.</div>';
 results.querySelectorAll('[data-details]').forEach(b=>b.onclick=()=>{const r=DATA.find(x=>(x.id||'')===b.dataset.details);if(!r)return;alert(`${r.title||r.label}\n\n${r.details||r.summary||'Aucune synthèse disponible.'}`)});
}
function readParams(){const p=new URLSearchParams(location.search);if(p.get('q'))q.value=p.get('q');if(p.get('level'))level.value=p.get('level');if(p.get('type'))type.value=p.get('type');if(p.get('source'))source.value=p.get('source')}
async function init(){
 try{
  const res=await fetch('/programme/',{cache:'no-store'});if(!res.ok)throw new Error(`HTTP ${res.status}`);DATA=extractData(await res.text());
  addOptions(level,[...new Set(DATA.map(x=>x.level))]);addOptions(type,[...new Set(DATA.map(x=>x.type))]);addOptions(source,[...new Set(DATA.map(x=>x.source))]);
  readParams();[q,level,type,source].forEach(el=>el.addEventListener(el===q?'input':'change',render));$('reset').onclick=()=>{q.value='';level.value='';type.value='';source.value='';history.replaceState({},'',location.pathname);render();q.focus()};
  document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{q.value=b.dataset.q;render()});render();
 }catch(err){count.textContent='Corpus indisponible';results.innerHTML=`<div class="empty"><b>Le corpus du portail principal n'a pas pu être chargé.</b><br>${esc(err.message)}<br><br><a href="https://xseorkly.github.io/programme/">Ouvrir le moteur de recherche du portail principal</a></div>`}
}
init();
})();
