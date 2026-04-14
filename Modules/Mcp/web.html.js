export function buildHTML({ ENTITIES, WORKS, RELATIONS, CENTURY_BEGIN_TICKS, DOTNET_EPOCH_OFFSET, SYSTEM_PROMPT }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EdgeGrammar Memory</title>
<link rel="stylesheet" href="/vendor/easymde.min.css">
<script src="/vendor/easymde.min.js"></script>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{font-family:monospace;background:#0d0d0d;color:#ccc;padding:1.5rem;display:flex;flex-direction:column}
  h1{color:#7fba00;font-size:1.1rem;letter-spacing:.05em}
  .h1-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem}
  .ham{background:none;border:none;color:#7fba00;font-size:1.3rem;cursor:pointer;padding:0;line-height:1;flex-shrink:0}
  .ham:hover{color:#a0d020}
  .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10}
  .sidebar-overlay.open{display:block}
  .sidebar{position:fixed;top:0;left:0;height:100%;width:280px;background:#111;border-right:1px solid #2a2a2a;z-index:11;transform:translateX(-100%);transition:transform .2s ease;display:flex;flex-direction:column}
  .sidebar.open{transform:translateX(0)}
  .sidebar-head{display:flex;align-items:center;justify-content:space-between;padding:.65rem 1rem;border-bottom:1px solid #222;flex-shrink:0}
  .sidebar-head span{color:#7fba00;font-size:.78rem;letter-spacing:.06em}
  .sidebar-close{background:none;border:none;color:#555;font-size:1.2rem;cursor:pointer;line-height:1}
  .sidebar-close:hover{color:#7fba00}
  .sidebar-body{flex:1;overflow-y:auto;padding:.75rem}
  .state-item{background:#141414;border:1px solid #222;padding:.45rem .7rem;margin-bottom:.45rem;display:flex;justify-content:space-between;align-items:center;cursor:pointer;gap:.5rem}
  .state-item:hover{border-color:#7fba00}
  .state-name{font-size:.8rem;color:#ccc}
  .state-ts{font-size:.65rem;color:#555;margin-top:.1rem}
  .state-del{background:none;border:none;color:#555;cursor:pointer;font-size:1rem;padding:0;line-height:1;flex-shrink:0}
  .state-del:hover{color:#e06c75}
  .json-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:20;align-items:center;justify-content:center}
  .json-overlay.open{display:flex}
  .json-modal{background:#111;border:1px solid #333;width:min(720px,92vw);max-height:80vh;display:flex;flex-direction:column}
  .json-modal-head{display:flex;align-items:center;justify-content:space-between;padding:.5rem 1rem;border-bottom:1px solid #222;flex-shrink:0}
  .json-modal-head span{color:#7fba00;font-size:.75rem;letter-spacing:.06em}
  .json-close{background:none;border:none;color:#555;font-size:1.2rem;cursor:pointer;line-height:1}
  .json-close:hover{color:#7fba00}
  .json-modal pre{flex:1;overflow:auto;padding:1rem;font-size:.74rem;color:#bbb;margin:0;white-space:pre-wrap;word-break:break-all;line-height:1.5}
  .btn-save{background:none;border:1px solid #333;color:#888;padding:.2rem .65rem;font:inherit;font-size:.78rem;cursor:pointer;flex-shrink:0}
  .btn-save:hover{border-color:#7fba00;color:#7fba00}
  .card-json{background:none;border:none;color:#444;cursor:pointer;font:inherit;font-size:.72rem;padding:0 .3rem;line-height:1;flex-shrink:0}
  .card-json:hover{color:#7fba00}
  .layout{display:grid;grid-template-columns:1fr 2fr;gap:1.5rem;flex:1;min-height:0}
  .left{order:2;min-width:0;overflow-y:auto;height:100%;padding-left:1rem;padding-right:1rem}.right{order:1;min-width:0;overflow-y:auto;height:100%;padding-left:1rem;padding-right:1rem}
  @media(min-width:992px){
    .left{order:1}.right{order:2}
  }
  @media(max-width:991px){
    .layout{grid-template-columns:1fr;height:auto}
    .left,.right{height:auto;overflow-y:visible}
  }
  .tabs{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.2rem}
  .tab{background:#1a1a1a;border:1px solid #333;color:#888;padding:.35rem .9rem;cursor:pointer;font:inherit;font-size:.85rem}
  .tab.active{border-color:#7fba00;color:#7fba00}
  .tab.collab-tab{border-color:#2a3a4a;color:#5a8aa0}
  .tab.collab-tab.active{border-color:#61afef;color:#61afef}
  .panel{display:none}.panel.active{display:block}
  .card{background:#141414;border:1px solid #222;padding:.9rem 1rem;margin-bottom:.7rem;border-radius:2px}
  .card-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.4rem}
  .card-meta{font-family:sans-serif;font-size:.7rem;color:#666;text-transform:uppercase;letter-spacing:0.02em}
  .card-meta span{color:#888;margin-right:1rem}
  .card-toggle{background:none;border:none;color:#555;cursor:pointer;font:inherit;font-size:1.4rem;padding:0 .25rem;line-height:1;flex-shrink:0}
  .card-toggle:hover{color:#7fba00}
  .card.collapsed .card-body{display:none}
  .card.collapsed .card-toggle{color:#7fba00}
  .card-notes{font-size:.82rem;color:#bbb;white-space:pre-wrap;line-height:1.5}
  .card-relation{font-size:.75rem;color:#666;margin-bottom:.5rem}
  .card-relation span.relation{color:#7fba00}
  .card-relation span.entity{color:#90c520}
  .card-relation span.work{color:#a0d020}
  form{background:#141414;border:1px solid #333;padding:1rem;display:grid;gap:.7rem;margin-bottom:1rem}
  form h2{font-size:.85rem;color:#7fba00;margin-bottom:.4rem}
  .selects{display:flex;flex-wrap:wrap;gap:.5rem}
  .selects select{flex:1 1 120px;min-width:0;width:0}
  input,select,textarea{background:#0d0d0d;border:1px solid #333;color:#ccc;padding:.4rem .6rem;font:inherit;font-size:.82rem;width:100%;min-width:0;max-width:100%}
  textarea{resize:vertical;min-height:120px}
  input:focus,select:focus,textarea:focus{outline:none;border:1px solid #7fba00}
  button[type=submit]{background:#7fba00;color:#000;border:none;padding:.45rem 1.2rem;font:inherit;font-size:.85rem;cursor:pointer;width:100%}
  button[type=submit]:hover{background:#a0d020}
  #status{font-size:.78rem;color:#7fba00;min-height:1em}
  .count{font-size:.72rem;color:#555;margin-bottom:.6rem}
  .EasyMDEContainer{width:100%;max-width:100%;min-width:0}
  .EasyMDEContainer .CodeMirror{background:#0d0d0d;color:#ccc;border:1px solid #333;font-family:monospace;font-size:.82rem;width:100% !important;max-width:100%;min-width:0 !important}
  .EasyMDEContainer .CodeMirror-scroll{min-height:150px !important}
  .EasyMDEContainer .CodeMirror-focused{border-color:#7fba00}
  .editor-toolbar{background:#1a1a1a;border:1px solid #333;border-bottom:none}
  .editor-toolbar a,.editor-toolbar button{color:#fff !important;background:transparent}
  .editor-toolbar a:hover,.editor-toolbar a.active,.editor-toolbar button:hover,.editor-toolbar button.active{color:#7fba00 !important;background:#222}
  .editor-toolbar i.separator{border-color:#333}
  .CodeMirror-cursor{border-left:2px solid #ccc !important}
  .editor-preview{background:#111;color:#ccc;font-family:monospace;font-size:.82rem}
  .editor-statusbar{display:none}
  ::-webkit-scrollbar{display:none}
  * {scrollbar-width:none}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
</style>
</head>
<body>
<div class="h1-row">
  <h1>EdgeGrammar</h1>
  <div style="font-size:.68rem;color:#444;font-family:monospace;display:flex;flex-wrap:wrap;gap:.6rem 1.1rem;align-items:center;flex:1;padding:0 1.2rem">
    <span>^&#8679;J <span style="color:#333">notes</span></span>
    <span>^&#8679;K <span style="color:#333">chat</span></span>
    <span>^&#8679;C <span style="color:#333">collab</span></span>
    <span>^&#8679;G <span style="color:#333">graph</span></span>
    <span>^&#8679;H <span style="color:#333">hide</span></span>
    <span>^&#8679;&#8629; <span style="color:#333">save</span></span>
  </div>
  <button class="ham" id="ham-btn">&#9776;</button>
</div>

<div class="sidebar-overlay" id="sidebar-overlay"></div>
<div class="sidebar" id="sidebar">
  <div class="sidebar-head">
    <span>SAVED STATES</span>
    <button class="sidebar-close" id="sidebar-close">&#215;</button>
  </div>
  <div class="sidebar-body" id="sidebar-body"></div>
</div>

<div class="json-overlay" id="sysprompt-overlay">
  <div class="json-modal">
    <div class="json-modal-head">
      <span>SYSTEM PROMPT</span>
      <button class="json-close" id="sysprompt-close">&#215;</button>
    </div>
    <pre id="sysprompt-pre">${SYSTEM_PROMPT.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
  </div>
</div>

<div class="json-overlay" id="json-overlay">
  <div class="json-modal">
    <div class="json-modal-head">
      <span>JSON</span>
      <button class="json-close" id="json-close">&#215;</button>
    </div>
    <pre id="json-pre"></pre>
  </div>
</div>

<div class="layout">
  <div class="left">
    <form id="form">
      <h2>Memory</h2>
      <div class="selects">
        <select name="entity">${ENTITIES.map(e => `<option${e === "Architect" ? " selected" : ""}>${e}</option>`).join("")}</select>
        <select name="work">${WORKS.map(w => `<option${w === "Plan" ? " selected" : ""}>${w}</option>`).join("")}</select>
        <select name="toEntity">${ENTITIES.map(e => `<option${e === "Agent" ? " selected" : ""}>${e}</option>`).join("")}</select>
        <select name="relation">${RELATIONS.map(r => `<option${r === "Thinks" ? " selected" : ""}>${r}</option>`).join("")}</select>
      </div>
      <label style="display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:#888;cursor:pointer">
        <input type="checkbox" name="collab" value="1" style="width:auto;accent-color:#7fba00"> Collab
      </label>
      <textarea name="notes" placeholder="Notes\u2026"></textarea>
      <button type="submit">Save</button>
    </form>
    <div class="tabs" id="tabs">
      ${ENTITIES.map((e, i) => `<button class="tab${i === 0 ? " active" : ""}" data-entity="${e}">${e}</button>`).join("\n      ")}
      <button class="tab collab-tab" data-entity="Collab">Collab</button>
    </div>
    <div class="panel active" id="panel-combined">
      <div class="count" style="display:flex;align-items:center;gap:1rem">
        <div>
          Show: <input type="number" id="combined-limit" value="30" style="width:50px;padding:2px 4px"> records
        </div>
        <label style="color:#888;cursor:pointer;display:flex;align-items:center">
          <input type="checkbox" id="hide-records" checked style="margin-right:0.3rem"> Hide
        </label>
        <label style="color:#888;cursor:pointer;display:flex;align-items:center">
          <input type="checkbox" id="show-graph" style="margin-right:0.3rem"> Graph
        </label>
        <select id="filter-relation" style="background:#0d0d0d;border:1px solid #333;color:#888;padding:.25rem .5rem;font:inherit;font-size:.78rem;cursor:pointer">
          <option value="">— relation —</option>
          ${RELATIONS.map(r => `<option value="${r}">${r}</option>`).join("")}
        </select>
        <button class="btn-save" id="btn-save">Save</button>
        <button class="btn-save" id="btn-clear-all">Clear</button>
      </div>
      <div id="graph-panel" style="display:none;position:relative;width:100%;height:480px;background:#141414;border:1px solid #222;margin-bottom:.7rem;cursor:crosshair">
        <svg id="graph-svg" style="width:100%;height:100%;display:block"></svg>
      </div>
      <div id="combined-feed" style="display:none"></div>
    </div>
  </div>
  <div class="right">
    <div id="chat-panel" style="display:flex;flex-direction:column;background:#141414;border:1px solid #222;margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:.4rem .75rem;border-bottom:1px solid #222;flex-shrink:0">
        <span style="color:#7fba00;font-size:.75rem;letter-spacing:.05em">GEMINI CHAT</span>
        <div style="display:flex;gap:.4rem;align-items:center">
          <button id="btn-sysprompt" style="background:none;border:1px solid #333;color:#555;padding:.15rem .6rem;font:inherit;font-size:.72rem;cursor:pointer">system prompt</button>
          <button id="chat-clear" style="background:none;border:1px solid #333;color:#555;padding:.15rem .6rem;font:inherit;font-size:.72rem;cursor:pointer">clear</button>
        </div>
      </div>
      <div id="chat-messages" style="height:75vh;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:1rem"></div>
      <div style="display:flex;gap:.5rem;padding:.5rem .75rem;border-top:1px solid #222;flex-shrink:0">
        <textarea id="chat-input" rows="1" placeholder="Message\u2026" style="flex:1;background:#0d0d0d;border:1px solid #333;color:#ccc;padding:.35rem .6rem;font:inherit;font-size:.82rem;resize:none;min-height:34px;max-height:120px;field-sizing:content"></textarea>
        <button id="chat-send" style="background:#7fba00;color:#000;border:none;padding:.35rem .9rem;font:inherit;font-size:.82rem;cursor:pointer;align-self:flex-end">Send</button>
      </div>
    </div>
  </div>
</div>

<script>
const ENTITIES = ${JSON.stringify(ENTITIES)};

const memoryStore = {};

function renderCard(m) {
  memoryStore[m.Id] = m;
  const date = new Date(
    Math.round(Number(BigInt(m.TickStamp) + ${CENTURY_BEGIN_TICKS.toString()}n) / 10000)
    - ${Number(DOTNET_EPOCH_OFFSET / 10000n)}
  ).toLocaleString();
  return \`<div class="card collapsed">
    <div class="card-header">
      <div class="card-meta"><span>\${date}</span></div>
      <div style="display:flex;align-items:center;gap:.25rem">
        <button class="card-json" onclick="showJSON('\${m.Id}')" title="View raw JSON">{ }</button>
        <button class="card-toggle" onclick="this.closest('.card').classList.toggle('collapsed')">&#9662;</button>
      </div>
    </div>
    <div class="card-relation"><span class="entity">\${m.Entity}</span> <span class="relation">\${m.Edge?.Relation ?? ''}</span> <span class="entity">\${m.Edge?.ToEntity ?? ''}</span> by working on <span class="work">\${m.Work}</span></div>
    <div class="card-body">
      <div class="card-notes">\${escHtml(String(m.Notes))}</div>
    </div>
  </div>\`;
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

const selectedEntities = new Set(["Architect"]);

function saveCurrentState() {
  const state = {
    entities: Array.from(selectedEntities),
    limit:    document.getElementById('combined-limit').value,
    relation: document.getElementById('filter-relation').value,
    graph:    document.getElementById('show-graph').checked,
    hide:     document.getElementById('hide-records').checked,
  };
  localStorage.setItem('eg-current', JSON.stringify(state));
}

async function loadCombined() {
  const limit = parseInt(document.getElementById('combined-limit').value || 30, 10);
  const relation = document.getElementById('filter-relation').value;
  const collabSelected = selectedEntities.has('Collab');
  const regularEntities = Array.from(selectedEntities).filter(function(e) { return e !== 'Collab'; });

  if (!regularEntities.length && !collabSelected) return;

  let allData = [];

  if (regularEntities.length) {
    let url = '/api/memories?entity=' + regularEntities.join(',') + '&count=' + limit;
    if (relation) url += '&relation=' + encodeURIComponent(relation);
    const r = await fetch(url);
    allData.push(...(await r.json()));
  }

  if (collabSelected) {
    let url = '/api/memories?entity=' + ENTITIES.join(',') + '&work=Collab&count=' + limit;
    if (relation) url += '&relation=' + encodeURIComponent(relation);
    const r = await fetch(url);
    allData.push(...(await r.json()));
  }

  // deduplicate, sort newest first, cap at limit
  const seen = new Set();
  allData = allData.filter(function(m) {
    if (seen.has(m.Id)) return false;
    seen.add(m.Id);
    return true;
  });
  allData.sort(function(a, b) { return b.TickStamp - a.TickStamp; });
  allData = allData.slice(0, limit);

  document.getElementById('combined-feed').innerHTML = allData.map(renderCard).join('');
}

document.getElementById('hide-records').addEventListener('change', e => {
  document.getElementById('combined-feed').style.display = e.target.checked ? 'none' : 'block';
  saveCurrentState();
});

document.getElementById('combined-limit').addEventListener('change', function() { loadCombined(); saveCurrentState(); });
document.getElementById('filter-relation').addEventListener('change', function() { loadCombined(); saveCurrentState(); });

document.getElementById('tabs').addEventListener('click', e => {
  if (!e.target.dataset.entity) return;
  const entity = e.target.dataset.entity;
  if (e.ctrlKey || e.metaKey) {
    if (selectedEntities.has(entity)) {
      selectedEntities.delete(entity);
      e.target.classList.remove('active');
    } else {
      selectedEntities.add(entity);
      e.target.classList.add('active');
    }
  } else {
    selectedEntities.clear();
    selectedEntities.add(entity);
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
  }
  loadCombined();
  saveCurrentState();
});

const mde = new EasyMDE({
  element: document.querySelector('textarea[name="notes"]'),
  placeholder: 'Notes\u2026',
  spellChecker: false,
  autofocus: false,
  toolbar: ['bold','italic','heading','|','quote','unordered-list','ordered-list','|','preview'],
  status: false,
});

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd);
  body.notes = mde.value();
  if (body.collab) body.edgeWork = "Collab";
  delete body.collab;
  const r = await fetch('/api/memories', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (r.ok) {
    document.getElementById('status').textContent = 'Saved.';
    mde.value('');
    await loadCombined();
  } else {
    document.getElementById('status').textContent = 'Error: ' + r.status;
  }
});

async function loadStats() {
  const el = document.getElementById('stats-feed');
  if (!el) return;
  const r = await fetch('/api/stats/relations');
  const data = await r.json();
  el.innerHTML = data
    .slice(0, 10)
    .map(s => '<div><span style="color:#7fba00">' + s[1] + '</span> ' + s[0] + '</div>')
    .join('');
}

// ── Graph ──────────────────────────────────────────────────────────────────
let graphHovered = null;
let graphSelected = null;
let graphCache = { entities: [], relations: [] };

async function loadGraph() {
  const r = await fetch('/api/memories?entity=' + ENTITIES.join(',') + '&count=500');
  const memories = await r.json();
  const entitySet = new Set();
  const relMap = new Map();
  for (const m of memories) {
    const f = m.Edge && m.Edge.FromEntity;
    const t = m.Edge && m.Edge.ToEntity;
    const rel = m.Edge && m.Edge.Relation;
    if (f) entitySet.add(f);
    if (t) entitySet.add(t);
    if (f && t && rel) {
      const key = f + '|' + t + '|' + rel;
      if (!relMap.has(key)) relMap.set(key, { from: f, to: t, type: rel });
    }
  }
  graphCache.entities = Array.from(entitySet);
  graphCache.relations = Array.from(relMap.values());
  renderGraph();
}

function renderGraph() {
  const panel = document.getElementById('graph-panel');
  const svg = document.getElementById('graph-svg');
  if (!panel || !svg || panel.style.display === 'none') return;
  const W = panel.clientWidth || 700;
  const H = panel.clientHeight || 480;
  const cx = W / 2, cy = H / 2;
  const radius = Math.min(W, H) * 0.38;
  const ents = graphCache.entities;
  const rels = graphCache.relations;
  const active = graphHovered || graphSelected;
  const pos = {};
  ents.forEach(function(e, i) {
    const angle = (i / ents.length) * 2 * Math.PI - Math.PI / 2;
    pos[e] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
  let h = '';
  h += '<defs>';
  h += '<marker id="arr" markerWidth="8" markerHeight="6" refX="20" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#333"/></marker>';
  h += '<marker id="arr-a" markerWidth="8" markerHeight="6" refX="20" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#7fba00"/></marker>';
  h += '</defs>';
  for (let i = 0; i < rels.length; i++) {
    const rel = rels[i];
    const f = pos[rel.from], t = pos[rel.to];
    if (!f || !t) continue;
    const isAct = active && (rel.from === active || rel.to === active);
    if (isAct) continue;
    h += '<line x1="' + f.x.toFixed(1) + '" y1="' + f.y.toFixed(1) + '" x2="' + t.x.toFixed(1) + '" y2="' + t.y.toFixed(1) + '" stroke="#252525" stroke-width="1" marker-end="url(#arr)"/>';
  }
  for (let i = 0; i < rels.length; i++) {
    const rel = rels[i];
    const f = pos[rel.from], t = pos[rel.to];
    if (!f || !t) continue;
    if (!active || (rel.from !== active && rel.to !== active)) continue;
    h += '<line x1="' + f.x.toFixed(1) + '" y1="' + f.y.toFixed(1) + '" x2="' + t.x.toFixed(1) + '" y2="' + t.y.toFixed(1) + '" stroke="#7fba00" stroke-width="2" stroke-opacity="0.75" marker-end="url(#arr-a)"/>';
  }
  for (let i = 0; i < ents.length; i++) {
    const e = ents[i];
    const p = pos[e];
    if (!p) continue;
    const isAct = e === active;
    const fill = isAct ? '#7fba00' : '#2a2a2a';
    const stroke = isAct ? '#a0d020' : '#444';
    const cr = isAct ? 12 : 7;
    const textY = (p.y + cr + 14).toFixed(1);
    const fontSize = isAct ? '13' : '11';
    const textFill = isAct ? '#fff' : '#999';
    h += '<g class="gn" data-e="' + escHtml(e) + '" style="cursor:pointer">';
    h += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + cr + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/>';
    h += '<text x="' + p.x.toFixed(1) + '" y="' + textY + '" text-anchor="middle" fill="' + textFill + '" font-size="' + fontSize + '" font-family="monospace" font-weight="bold" pointer-events="none">' + escHtml(e) + '</text>';
    h += '</g>';
  }
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.innerHTML = h;
  svg.querySelectorAll('.gn').forEach(function(node) {
    const entity = node.dataset.e;
    node.addEventListener('mouseenter', function() { graphHovered = entity; renderGraph(); });
    node.addEventListener('mouseleave', function() { graphHovered = null; renderGraph(); });
    node.addEventListener('click', function(ev) { ev.stopPropagation(); graphSelected = graphSelected === entity ? null : entity; renderGraph(); });
  });
}

document.getElementById('show-graph').addEventListener('change', async function(e) {
  const panel = document.getElementById('graph-panel');
  panel.style.display = e.target.checked ? 'block' : 'none';
  if (e.target.checked) {
    if (graphCache.entities.length === 0) {
      await loadGraph();
    } else {
      renderGraph();
    }
  }
  saveCurrentState();
});

document.getElementById('graph-panel').addEventListener('click', function() {
  graphSelected = null;
  renderGraph();
});

// ── Sidebar ────────────────────────────────────────────────────────────────
function openSidebar() {
  renderSavedStates();
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}
document.getElementById('ham-btn').addEventListener('click', openSidebar);
document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

// ── JSON Modal ─────────────────────────────────────────────────────────────
function showJSON(id) {
  const m = memoryStore[id];
  if (!m) return;
  document.getElementById('json-pre').textContent = JSON.stringify(m, null, 2);
  document.getElementById('json-overlay').classList.add('open');
}

function showStateJSON(ts) {
  const s = getSavedStates().find(function(x) { return x.ts === ts; });
  if (!s) return;
  document.getElementById('json-pre').textContent = JSON.stringify(s, null, 2);
  document.getElementById('json-overlay').classList.add('open');
}
function closeJSON() {
  document.getElementById('json-overlay').classList.remove('open');
}
document.getElementById('json-close').addEventListener('click', closeJSON);
document.getElementById('json-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeJSON();
});

document.getElementById('btn-sysprompt').addEventListener('click', function() {
  document.getElementById('sysprompt-overlay').classList.add('open');
});
document.getElementById('sysprompt-close').addEventListener('click', function() {
  document.getElementById('sysprompt-overlay').classList.remove('open');
});
document.getElementById('sysprompt-overlay').addEventListener('click', function(e) {
  if (e.target === this) document.getElementById('sysprompt-overlay').classList.remove('open');
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeJSON();
    closeSidebar();
    document.getElementById('sysprompt-overlay').classList.remove('open');
    return;
  }

  const ctrl = e.ctrlKey || e.metaKey;
  if (!ctrl || !e.shiftKey) return;

  switch (e.key.toLowerCase()) {
    case 'j': // Focus notes
      e.preventDefault();
      mde.codemirror.focus();
      break;

    case 'k': // Focus chat input
      e.preventDefault();
      document.getElementById('chat-input').focus();
      break;

    case 'c': { // Toggle collab + save memory form
      e.preventDefault();
      const cb = document.querySelector('input[name="collab"]');
      cb.checked = !cb.checked;
      document.getElementById('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      break;
    }

    case 'g': { // Toggle graph
      e.preventDefault();
      const gCb = document.getElementById('show-graph');
      gCb.checked = !gCb.checked;
      gCb.dispatchEvent(new Event('change'));
      break;
    }

    case 'h': // Toggle hide records
      e.preventDefault();
      const hCb = document.getElementById('hide-records');
      hCb.checked = !hCb.checked;
      hCb.dispatchEvent(new Event('change'));
      break;

    case 'enter': // Submit memory form
      e.preventDefault();
      document.getElementById('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      break;
  }
});

// ── State Save / Restore ───────────────────────────────────────────────────
function getState() {
  return {
    entities: Array.from(selectedEntities),
    limit:    document.getElementById('combined-limit').value,
    relation: document.getElementById('filter-relation').value,
    graph:    document.getElementById('show-graph').checked,
    chat:     chatHistory,
  };
}

function clearAll() {
  // config
  selectedEntities.clear();
  selectedEntities.add('Architect');
  document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  const firstTab = document.querySelector('.tab[data-entity="Architect"]');
  if (firstTab) firstTab.classList.add('active');
  document.getElementById('combined-limit').value = 30;
  document.getElementById('filter-relation').value = '';
  document.getElementById('show-graph').checked = false;
  document.getElementById('graph-panel').style.display = 'none';
  // chat
  chatHistory = [];
  localStorage.removeItem('eg-chat');
  localStorage.removeItem('eg-current');
  document.getElementById('chat-messages').innerHTML = '';
  loadCombined();
}

document.getElementById('btn-clear-all').addEventListener('click', clearAll);

function getSavedStates() {
  try { return JSON.parse(localStorage.getItem('eg-states') || '[]'); }
  catch(_) { return []; }
}

function renderSavedStates() {
  const body = document.getElementById('sidebar-body');
  const states = getSavedStates();
  if (!states.length) {
    body.innerHTML = '<div style="color:#444;font-size:.78rem;padding:.5rem 0">No saved states.</div>';
    return;
  }
  body.innerHTML = states.map(function(s) {
    return '<div class="state-item" onclick="showStateJSON(' + s.ts + ')">' +
      '<div><div class="state-name">' + escHtml(s.name) + '</div>' +
      '<div class="state-ts">' + new Date(s.ts).toLocaleString() + '</div></div>' +
      '<button class="state-del" onclick="event.stopPropagation();deleteSavedState(' + s.ts + ')" title="Delete">&#215;</button>' +
      '</div>';
  }).join('');
}

function deleteSavedState(ts) {
  const states = getSavedStates().filter(function(s) { return s.ts !== ts; });
  localStorage.setItem('eg-states', JSON.stringify(states));
  renderSavedStates();
}

document.getElementById('btn-save').addEventListener('click', function() {
  const name = prompt('Name this state:');
  if (!name) return;
  const states = getSavedStates();
  states.unshift({ name: name, ts: Date.now(), state: getState() });
  localStorage.setItem('eg-states', JSON.stringify(states.slice(0, 20)));
});

// ── Chat ───────────────────────────────────────────────────────────────────
let chatHistory = [];
let chatStreaming = false;

function chatScrollBottom() {
  const el = document.getElementById('chat-messages');
  el.scrollTop = el.scrollHeight;
}

function chatAppend(role, text) {
  const msgs = document.getElementById('chat-messages');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isUser = role === 'user';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex;flex-direction:column;gap:.25rem;' +
    (isUser ? 'align-self:flex-end;max-width:85%;' : 'align-self:flex-start;width:95%;max-width:95%;');

  const label = document.createElement('div');
  label.style.cssText = 'font-size:.7rem;color:#555;' + (isUser ? 'text-align:right;' : 'text-align:left;');
  label.textContent = (isUser ? 'User' : 'Model') + ' \u2022 ' + time;

  const div = document.createElement('div');
  div.style.cssText = 'padding:.65rem .9rem;font-size:.82rem;white-space:pre-wrap;word-break:break-word;line-height:1.6;' +
    (isUser
      ? 'background:#1e2a14;border:1px solid #4a6a20;color:#d4e8a0;'
      : 'background:#141414;border:1px solid #383838;color:#bbb;');

  const content = document.createElement('span');
  content.textContent = text;
  div.appendChild(content);
  wrapper.appendChild(label);
  wrapper.appendChild(div);
  msgs.appendChild(wrapper);
  chatScrollBottom();
  return { div, content };
}

async function chatSend() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const text = input.value.trim();
  if (!text || chatStreaming) return;
  input.value = '';
  chatAppend('user', text);
  chatHistory.push({ role: 'user', content: text });
  chatStreaming = true;
  sendBtn.disabled = true;
  const { div: msgDiv, content: contentSpan } = chatAppend('assistant', '');
  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:7px;height:.85em;background:#7fba00;animation:blink .8s steps(1) infinite;vertical-align:text-bottom;margin-left:2px';
  msgDiv.appendChild(cursor);
  let accumulated = '';
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) })
    });
    if (!res.ok) {
      contentSpan.textContent = 'Error ' + res.status + ': ' + (await res.text());
      msgDiv.style.borderColor = '#4a1a1a';
    } else {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const chunk = JSON.parse(raw).candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            if (chunk) { accumulated += chunk; contentSpan.textContent = accumulated; chatScrollBottom(); }
          } catch (_) {}
        }
      }
    }
  } catch (err) {
    contentSpan.textContent = 'Network error: ' + err.message;
    msgDiv.style.borderColor = '#4a1a1a';
  }
  cursor.remove();
  if (accumulated) chatHistory.push({ role: 'model', content: accumulated });
  localStorage.setItem('eg-chat', JSON.stringify(chatHistory));
  if (accumulated) {
    fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity:   'Architect',
        work:     'Collab',
        toEntity: 'Agent',
        relation: 'Documents',
        notes:    'Q: ' + text + '\\n\\nA: ' + accumulated,
        edgeWork: 'Collab',
      })
    });
  }
  chatStreaming = false;
  sendBtn.disabled = false;
}

document.getElementById('chat-send').addEventListener('click', chatSend);

document.getElementById('chat-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatSend(); }
});

document.getElementById('chat-clear').addEventListener('click', function() {
  chatHistory = [];
  document.getElementById('chat-messages').innerHTML = '';
});

document.addEventListener('DOMContentLoaded', () => {
  loadStats();

  // Restore config state
  try {
    const cur = JSON.parse(localStorage.getItem('eg-current') || 'null');
    if (cur) {
      if (cur.entities && cur.entities.length) {
        selectedEntities.clear();
        cur.entities.forEach(function(e) { selectedEntities.add(e); });
        document.querySelectorAll('.tab').forEach(function(t) {
          t.classList.toggle('active', selectedEntities.has(t.dataset.entity));
        });
      }
      if (cur.limit) document.getElementById('combined-limit').value = cur.limit;
      if (cur.relation !== undefined) document.getElementById('filter-relation').value = cur.relation;
      if (cur.hide) {
        document.getElementById('hide-records').checked = true;
        document.getElementById('combined-feed').style.display = 'none';
      }
      if (cur.graph) {
        document.getElementById('show-graph').checked = true;
        document.getElementById('graph-panel').style.display = 'block';
        loadGraph();
      }
    }
  } catch(_) {}

  loadCombined();

  // Restore chat history
  try {
    const saved = JSON.parse(localStorage.getItem('eg-chat') || '[]');
    if (saved.length) {
      chatHistory = saved;
      saved.forEach(function(m) {
        if (m.role === 'user') chatAppend('user', m.content);
        else if (m.role === 'model') chatAppend('assistant', m.content);
      });
    }
  } catch(_) {}
});
</script>
</body>
</html>`;
}
