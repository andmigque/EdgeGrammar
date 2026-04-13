export function buildHTML({ ENTITIES, WORKS, RELATIONS, CENTURY_BEGIN_TICKS, DOTNET_EPOCH_OFFSET }) {
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
  h1{color:#7fba00;font-size:1.1rem;margin-bottom:1.2rem;letter-spacing:.05em}
  .layout{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;flex:1;min-height:0}
  .left{order:2;min-width:0;overflow-y:auto;height:100%}.right{order:1;min-width:0;overflow-y:auto;height:100%}
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
  form{background:#141414;border:1px solid #333;padding:0.7rem;display:grid;gap:.7rem}
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
  ::-webkit-scrollbar{width:8px;height:8px}
  ::-webkit-scrollbar-track{background:#0d0d0d}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
  ::-webkit-scrollbar-thumb:hover{background:#7fba00}
  * {scrollbar-width:thin;scrollbar-color:#333 #0d0d0d}
</style>
</head>
<body>
<div class="layout">
  <div class="left">
    <div class="tabs" id="tabs">
      ${ENTITIES.map((e, i) => `<button class="tab${i === 0 ? " active" : ""}" data-entity="${e}">${e}</button>`).join("\n      ")}
    </div>
    <div class="panel active" id="panel-combined">
      <div class="count">
        Show: <input type="number" id="combined-limit" value="30" style="width:50px;padding:2px 4px;margin-bottom:0.5rem"> records
      </div>
      <div id="combined-feed"></div>
    </div>
  </div>
  <div class="right">
    <!-- <div id="stats" style="background:#141414;border:1px solid #333;padding:1rem;margin-bottom:1rem;font-size:.75rem">
      <h2 style="color:#7fba00;margin-bottom:.5rem;font-size:.85rem">Relation Pulse</h2>
      <div id="stats-feed" style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"></div>
    </div> -->
    <form id="form">
      <h2>new_memory</h2>
      <div class="selects">
        <select name="entity">${ENTITIES.map(e => `<option${e === "Claude" ? " selected" : ""}>${e}</option>`).join("")}</select>
        <select name="work">${WORKS.map(w => `<option${w === "GloriousFailure" ? " selected" : ""}>${w}</option>`).join("")}</select>
        <select name="toEntity">${ENTITIES.map(e => `<option${e === "Architect" ? " selected" : ""}>${e}</option>`).join("")}</select>
        <select name="relation">${RELATIONS.map(r => `<option${r === "Learns" ? " selected" : ""}>${r}</option>`).join("")}</select>
      </div>
      <label style="display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:#888;cursor:pointer">
        <input type="checkbox" name="collab" value="1" style="width:auto;accent-color:#7fba00"> Collab bus
      </label>
      <textarea name="notes" placeholder="Notes\u2026"></textarea>
      <button type="submit">Save</button>
      <div id="status"></div>
    </form>
    <div id="collab" style="background:#141414;border:1px solid #333;padding:1rem;margin-top:1rem">
      <h2 style="color:#7fba00;margin-bottom:.5rem;font-size:.85rem">Collab</h2>
      <div class="count" id="collab-count"></div>
      <div id="collab-feed"></div>
    </div>
  </div>
</div>

<script>
const ENTITIES = ${JSON.stringify(ENTITIES)};

function renderCard(m) {
  const date = new Date(
    Math.round(Number(BigInt(m.TickStamp) + ${CENTURY_BEGIN_TICKS.toString()}n) / 10000)
    - ${Number(DOTNET_EPOCH_OFFSET / 10000n)}
  ).toLocaleString();
  return \`<div class="card collapsed">
    <div class="card-header">
      <div class="card-meta"><span>\${date}</span></div>
      <button class="card-toggle" onclick="this.closest('.card').classList.toggle('collapsed')">&#9662;</button>
    </div>
    <div class="card-relation"><span class="entity">\${m.Entity}</span> <span class="relation">\${m.Edge?.Relation ?? ''}</span> <span class="entity">\${m.Edge?.ToEntity ?? ''}</span> by working on <span class="work">\${m.Work}</span></div>
    <div class="card-body">
      <div class="card-notes">\${escHtml(String(m.Notes))}</div>
    </div>
  </div>\`;
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

const selectedEntities = new Set(["Architect"]);

async function loadCombined() {
  const entityList = Array.from(selectedEntities).join(',');
  if (!entityList) return;
  const limit = document.getElementById('combined-limit').value || 30;
  const r = await fetch('/api/memories?entity=' + entityList + '&count=' + limit);
  const data = await r.json();
  const feed = document.getElementById('combined-feed');
  feed.innerHTML = data.map(renderCard).join('');
}

document.getElementById('combined-limit').addEventListener('change', loadCombined);

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
    await loadCollab();
  } else {
    document.getElementById('status').textContent = 'Error: ' + r.status;
  }
});

async function loadStats() {
  const r = await fetch('/api/stats/relations');
  const data = await r.json();
  document.getElementById('stats-feed').innerHTML = data
    .slice(0, 10)
    .map(s => '<div><span style="color:#7fba00">' + s[1] + '</span> ' + s[0] + '</div>')
    .join('');
}

async function loadCollab() {
  const r = await fetch('/api/memories?entity=${ENTITIES.join(",")}&work=Collab&count=30');
  const data = await r.json();
  document.getElementById('collab-feed').innerHTML = data.map(renderCard).join('');
  document.getElementById('collab-count').textContent = data.length + ' records';
}

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadCombined();
  loadCollab();
});
</script>
</body>
</html>`;
}
