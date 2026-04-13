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
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
</style>
</head>
<body>
<div class="layout">
  <div class="left">
    <div class="tabs" id="tabs">
      ${ENTITIES.map((e, i) => `<button class="tab${i === 0 ? " active" : ""}" data-entity="${e}">${e}</button>`).join("\n      ")}
    </div>
    <div class="panel active" id="panel-combined">
      <div class="count" style="display:flex;align-items:center;gap:1rem">
        <div>
          Show: <input type="number" id="combined-limit" value="30" style="width:50px;padding:2px 4px"> records
        </div>
        <label style="color:#888;cursor:pointer;display:flex;align-items:center">
          <input type="checkbox" id="hide-records" style="margin-right:0.3rem"> Hide
        </label>
        <label style="color:#888;cursor:pointer;display:flex;align-items:center">
          <input type="checkbox" id="show-graph" style="margin-right:0.3rem"> Graph
        </label>
        <label style="color:#888;cursor:pointer;display:flex;align-items:center">
          <input type="checkbox" id="show-chat" style="margin-right:0.3rem"> Chat
        </label>
        <select id="filter-relation" style="background:#0d0d0d;border:1px solid #333;color:#888;padding:.25rem .5rem;font:inherit;font-size:.78rem;cursor:pointer">
          <option value="">— relation —</option>
          ${RELATIONS.map(r => `<option value="${r}">${r}</option>`).join("")}
        </select>
      </div>
      <div id="graph-panel" style="display:none;position:relative;width:100%;height:480px;background:#141414;border:1px solid #222;margin-bottom:.7rem;cursor:crosshair">
        <svg id="graph-svg" style="width:100%;height:100%;display:block"></svg>
      </div>
      <div id="chat-panel" style="display:none;background:#141414;border:1px solid #222;margin-bottom:.7rem">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.4rem .75rem;border-bottom:1px solid #222">
          <span style="color:#7fba00;font-size:.75rem;letter-spacing:.05em">GEMINI CHAT</span>
          <button id="chat-clear" style="background:none;border:1px solid #333;color:#555;padding:.15rem .6rem;font:inherit;font-size:.72rem;cursor:pointer">clear</button>
        </div>
        <div id="chat-messages" style="height:340px;overflow-y:auto;padding:.75rem;display:flex;flex-direction:column;gap:.6rem"></div>
        <div style="display:flex;gap:.5rem;padding:.5rem .75rem;border-top:1px solid #222">
          <textarea id="chat-input" rows="1" placeholder="Message\u2026" style="flex:1;background:#0d0d0d;border:1px solid #333;color:#ccc;padding:.35rem .6rem;font:inherit;font-size:.82rem;resize:none;min-height:34px;max-height:120px;field-sizing:content"></textarea>
          <button id="chat-send" style="background:#7fba00;color:#000;border:none;padding:.35rem .9rem;font:inherit;font-size:.82rem;cursor:pointer;align-self:flex-end">Send</button>
        </div>
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
      <h2>Memory</h2>
      <div class="selects">
        <select name="entity">${ENTITIES.map(e => `<option${e === "Architect" ? " selected" : ""}>${e}</option>`).join("")}</select>
        <select name="work">${WORKS.map(w => `<option${w === "Collab" ? " selected" : ""}>${w}</option>`).join("")}</select>
        <select name="toEntity">${ENTITIES.map(e => `<option${e === "Agent" ? " selected" : ""}>${e}</option>`).join("")}</select>
        <select name="relation">${RELATIONS.map(r => `<option${r === "Decides" ? " selected" : ""}>${r}</option>`).join("")}</select>
      </div>
      <label style="display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:#888;cursor:pointer">
        <input type="checkbox" name="collab" value="1" style="width:auto;accent-color:#7fba00"> Collab
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
  const relation = document.getElementById('filter-relation').value;
  let url = '/api/memories?entity=' + entityList + '&count=' + limit;
  if (relation) url += '&relation=' + encodeURIComponent(relation);
  const r = await fetch(url);
  const data = await r.json();
  const feed = document.getElementById('combined-feed');
  feed.innerHTML = data.map(renderCard).join('');
}

document.getElementById('hide-records').addEventListener('change', e => {
  document.getElementById('combined-feed').style.display = e.target.checked ? 'none' : 'block';
});

document.getElementById('combined-limit').addEventListener('change', loadCombined);
document.getElementById('filter-relation').addEventListener('change', loadCombined);

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
});

document.getElementById('graph-panel').addEventListener('click', function() {
  graphSelected = null;
  renderGraph();
});

// ── Chat ───────────────────────────────────────────────────────────────────
let chatHistory = [];
let chatStreaming = false;

function chatEsc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function chatScrollBottom() {
  const el = document.getElementById('chat-messages');
  el.scrollTop = el.scrollHeight;
}

function chatAppend(role, text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.style.cssText = 'max-width:85%;padding:.45rem .7rem;font-size:.82rem;white-space:pre-wrap;word-break:break-word;line-height:1.5;' +
    (role === 'user'
      ? 'align-self:flex-end;background:#1a1a1a;border:1px solid #333;color:#ccc;'
      : 'align-self:flex-start;background:#111;border:1px solid #2a2a2a;color:#bbb;');
  const content = document.createElement('span');
  content.textContent = text;
  div.appendChild(content);
  msgs.appendChild(div);
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
  chatStreaming = false;
  sendBtn.disabled = false;
}

document.getElementById('show-chat').addEventListener('change', function(e) {
  document.getElementById('chat-panel').style.display = e.target.checked ? 'flex' : 'none';
  if (e.target.checked) document.getElementById('chat-input').focus();
});

document.getElementById('chat-panel').style.flexDirection = 'column';

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
  loadCombined();
  loadCollab();
});
</script>
</body>
</html>`;
}
