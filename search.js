(()=>{
const $=id=>document.getElementById(id);
const q=$('q'),level=$('level'),type=$('type'),source=$('source'),results=$('results'),count=$('count');
const modal=$('detailsModal'),modalTitle=$('modalTitle'),modalText=$('modalText'),modalLinks=$('modalLinks'),modalClose=$('modalClose');
let DATA=[];
const EXTRA_RESOURCES=[
  {
    id:'eduvox-ia-projet-3e-2026',
    title:'Assistant vocal EDUVOX — réaliser le support avec l’IA comme aide dans la démarche de projet',
    type:'Séquences',
    level:'3e',
    source:'RNR Éduscol STI',
    status:'national',
    summary:'Nouvelle ressource publiée le 23 septembre 2026 : deux séquences de 3e autour de la conception du support d’un assistant vocal EDUVOX, avec l’IA utilisée comme aide au cours des différentes tâches du projet.',
    details:'Sébastien Ponsot, enseignant de technologie dans l’académie de Dijon, propose un projet composé de deux séquences pour la classe de 3e. La ressource développe les compétences liées à la conception d’un objet technique, en suivant les grandes étapes de la démarche de projet et en mobilisant l’intelligence artificielle comme aide pour réaliser certaines tâches. À exploiter notamment dans les entrées CCRI, IA, conception, réalisation et démarche de projet.',
    tags:['EDUVOX','assistant vocal','IA','intelligence artificielle','3e','CCRI','démarche de projet','conception','réalisation','RNR','23 septembre 2026'],
    url:'https://sti.eduscol.education.fr/ressources_pedagogiques/assistant-vocal-comment-realiser-le-support-de-leduvox-en-utilisant-lia'
  },
  {
    id:'worldskills-challenge-inter-colleges-2026-2027',
    title:'WorldSkills France — Challenge inter-collèges 2026-2027 : découvrir les métiers autrement',
    type:'Projet / orientation',
    level:'Cycle 4',
    source:'Académie de Bordeaux / WorldSkills France',
    status:'academic',
    summary:'Challenge ouvert aux élèves de 5e, 4e, 3e et 3e prépa-métiers, organisé autour de cinq séances et des thématiques France 2030 : mieux produire, mieux vivre, mieux comprendre le monde.',
    details:'Le Challenge Inter-collèges WorldSkills 2026-2027 est présenté par l’académie de Bordeaux comme cohérent avec les programmes du cycle 4. Il permet d’articuler technologie, découverte des métiers et orientation. Les élèves suivent cinq séances de 50 minutes, accessibles de manière asynchrone, d’octobre 2026 à mars 2027. La ressource peut servir pour des projets interdisciplinaires, l’ouverture sur les métiers et les parcours d’orientation.',
    tags:['WorldSkills','orientation','métiers','cycle 4','5e','4e','3e','France 2030','projet','challenge inter-collèges','2026-2027'],
    url:'https://ent2d.ac-bordeaux.fr/disciplines/sti-college/2026/09/10/worldskills-france-challenge-inter-colleges-decouvrir-les-metiers-autrement/'
  }
];
const BASE='https://xseorkly.github.io/programme/';
const norm=s=>(s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const esc=s=>(s||'').toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function extractData(html){const token='const DATA=';const start=html.indexOf(token);if(start<0)throw new Error('Corpus DATA introuvable');let i=start+token.length;while(/\s/.test(html[i]))i++;if(html[i]!=='[')throw new Error('Format du corpus inattendu');const begin=i;let depth=0,inString=false,escape=false;for(;i<html.length;i++){const c=html[i];if(inString){if(escape){escape=false;continue}if(c==='\\'){escape=true;continue}if(c==='"')inString=false;continue}if(c==='"'){inString=true;continue}if(c==='[')depth++;else if(c===']'){depth--;if(depth===0)return JSON.parse(html.slice(begin,i+1))}}throw new Error('Fin du corpus introuvable')}
function addOptions(el,values){values.filter(Boolean).sort((a,b)=>a.localeCompare(b,'fr')).forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)})}
function statusClass(s){return ['official','national','academic','personal','draft'].includes(s)?s:''}
function localUrl(path){return BASE+String(path||'').replace(/^\//,'')}
function actionLinks(r){let out='';if(r.url)out+=`<a class="primary" href="${esc(r.url)}" target="_blank" rel="noopener">Ouvrir la ressource</a>`;(r.localDocs||[]).forEach(d=>{if(d&&d.path)out+=`<a href="${esc(localUrl(d.path))}" target="_blank" rel="noopener">${esc(d.label||'Document local')}</a>`});if(r.local)out+=`<a href="${esc(localUrl(r.local))}" target="_blank" rel="noopener">Lire la fiche synthèse</a>`;return out}
function card(r){return `<article class="result-card"><div class="badges"><span class="badge ${statusClass(r.status)}">${esc(r.level||'Cycle 4')}</span><span class="badge">${esc(r.type||'Ressource')}</span><span class="badge ${statusClass(r.status)}">${esc(r.source||'')}</span></div><h3>${esc(r.title||r.label||'Ressource')}</h3><p>${esc(r.summary||'')}</p><div class="result-actions">${actionLinks(r)}<button type="button" data-details="${esc(r.id||'')}">Voir la synthèse</button></div></article>`}
function matches(r,nq){if(!nq)return true;return norm([r.title,r.label,r.summary,r.details,r.type,r.level,r.source,...(r.tags||[])].join(' ')).includes(nq)}
function render(){const nq=norm(q.value),nl=level.value,nt=type.value,ns=source.value;const found=DATA.filter(r=>{if(nl&&r.level!==nl)return false;if(nt&&r.type!==nt)return false;if(ns&&r.source!==ns)return false;return matches(r,nq)});count.textContent=`${found.length} ressource${found.length>1?'s':''} sur ${DATA.length}`;results.innerHTML=found.length?found.slice(0,250).map(card).join(''):'<div class="empty">Aucune ressource trouvée. Essayez un terme plus large ou réinitialisez les filtres.</div>';results.querySelectorAll('[data-details]').forEach(b=>b.onclick=()=>openDetails(DATA.find(x=>(x.id||'')===b.dataset.details)))}
function openDetails(r){if(!r)return;modalTitle.textContent=r.title||r.label||'Ressource';modalText.textContent=r.details||r.summary||'Aucune synthèse disponible.';modalLinks.innerHTML=actionLinks(r);modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
if(modalClose)modalClose.onclick=closeModal;if(modal)modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function readParams(){const p=new URLSearchParams(location.search);if(p.get('q'))q.value=p.get('q');if(p.get('level'))level.value=p.get('level');if(p.get('type'))type.value=p.get('type');if(p.get('source'))source.value=p.get('source')}
function syncUrl(){const p=new URLSearchParams();if(q.value)p.set('q',q.value);if(level.value)p.set('level',level.value);if(type.value)p.set('type',type.value);if(source.value)p.set('source',source.value);history.replaceState({},'',location.pathname+(p.toString()?'?'+p.toString():''))}
async function init(){try{const res=await fetch('/programme/',{cache:'no-store'});if(!res.ok)throw new Error(`HTTP ${res.status}`);DATA=[...extractData(await res.text()),...EXTRA_RESOURCES];addOptions(level,[...new Set(DATA.map(x=>x.level))]);addOptions(type,[...new Set(DATA.map(x=>x.type))]);addOptions(source,[...new Set(DATA.map(x=>x.source))]);readParams();[q,level,type,source].forEach(el=>el.addEventListener(el===q?'input':'change',()=>{syncUrl();render()}));$('reset').onclick=()=>{q.value='';level.value='';type.value='';source.value='';syncUrl();render();q.focus()};document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{q.value=b.dataset.q;syncUrl();render()});render()}catch(err){DATA=[...EXTRA_RESOURCES];addOptions(level,[...new Set(DATA.map(x=>x.level))]);addOptions(type,[...new Set(DATA.map(x=>x.type))]);addOptions(source,[...new Set(DATA.map(x=>x.source))]);readParams();render();count.textContent=`${DATA.length} nouveautés locales disponibles — corpus principal temporairement indisponible`}}
init();
})();
