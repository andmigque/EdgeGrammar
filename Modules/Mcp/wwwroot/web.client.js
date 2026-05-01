/**
 * EdgeGrammar Memory UI — client-side script
 * Extracted from web.html.js <script> block for structural exploration.
 *
 * NOTE: In web.html.js, ENTITIES / CENTURY_BEGIN_TICKS / DOTNET_EPOCH_OFFSET
 *       are injected as JSON literals by the buildHTML() template.
 *       Here they are represented as runtime constants that would need to be
 *       supplied via a /api/config endpoint or a <script> data-island.
 *
 * The authoritative source remains web.html.js.
 */

// ── Constants (mirrored from web.js — keep in sync) ──────────────────────
const ENTITIES  = ["Architect","Gemini","Claude","Grok","GPT","Agent","Codex","Qwen"];
const WORKS     = ["PowerNixxServer","SystemPrompt","Npm","Pester","Devops","Infrastructure","DataPlane","ModelContextProtocol","Security","Reactor","MarkdownChat","AgentMemory","Research","Plan","Fragment","Frontend","Troubleshoot","GloriousFailure","CMMC","Collab"];
const RELATIONS = ["Depends","Creates","Tests","Refactors","Throws","Runs","Guides","Learns","Configures","Interrupts","Thinks","Delivers","Reviews","Documents","Implements","Fixes","Observes","Analyzes","Designs","Encourages","Requests","Reports","Evolves","Understands","Accepts","Imagines","Decodes","Questions","Plans","Grows","Transcends","Reflects","Realizes","Integrates","Delegates","Proposes","Researches","Agrees","Disagrees","Answers","Confirms","Decides"];

// .NET tick epoch constants — mathematical, never change
const DOTNET_EPOCH_OFFSET = 621355968000000000n; // ticks: year 1 → Unix epoch
const CENTURY_BEGIN_TICKS = 631139040000000000n; // ticks: year 1 → 2001-01-01

// ── State ─────────────────────────────────────────────────────────────────
const memoryStore = {};
const selectedEntities = new Set(["Architect"]);
let graphHovered = null;
let graphSelected = null;
let graphCache = { entities: [], relations: [] };
let chatHistory = [];
let chatStreaming = false;

// ── Helpers ───────────────────────────────────────────────────────────────
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderCard(m) {
  memoryStore[m.Id] = m;
  const date = new Date(
    Math.round(Number(BigInt(m.TickStamp) + CENTURY_BEGIN_TICKS) / 10000) - Number(DOTNET_EPOCH_OFFSET / 10000n)
  ).toLocaleString();
  return `<div class="card collapsed">
    <div class="card-header">
      <div class="card-meta"><span>${date}</span></div>
      <div style="display:flex;align-items:center;gap:.25rem">
        <button class="card-json" onclick="showJSON('${m.Id}')" title="View raw JSON">{ }</button>
        <button class="card-toggle" onclick="this.closest('.card').classList.toggle('collapsed')">&#9662;</button>
      </div>
    </div>
    <div class="card-relation">
      <span class="entity">${m.Entity}</span>
      <span class="relation">${m.Edge?.Relation ?? ''}</span>
      <span class="entity">${m.Edge?.ToEntity ?? ''}</span>
      by working on <span class="work">${m.Work}</span>
    </div>
    <div class="card-body">
      <div class="card-notes">${escHtml(String(m.Notes))}</div>
    </div>
  </div>`;
}

// ── State persistence ─────────────────────────────────────────────────────
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

function getState() {
  return {
    entities: Array.from(selectedEntities),
    limit:    document.getElementById('combined-limit').value,
    relation: document.getElementById('filter-relation').value,
    graph:    document.getElementById('show-graph').checked,
    chat:     chatHistory,
  };
}

function getSavedStates() {
  try { return JSON.parse(localStorage.getItem('eg-states') || '[]'); }
  catch (_) { return []; }
}

// ── Memory feed ───────────────────────────────────────────────────────────
async function loadCombined() {
  const limit = parseInt(document.getElementById('combined-limit').value || 30, 10);
  const relation = document.getElementById('filter-relation').value;
  const collabSelected = selectedEntities.has('Collab');
  const regularEntities = Array.from(selectedEntities).filter(e => e !== 'Collab');

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

  const seen = new Set();
  allData = allData.filter(m => { if (seen.has(m.Id)) return false; seen.add(m.Id); return true; });
  allData.sort((a, b) => b.TickStamp - a.TickStamp);
  allData = allData.slice(0, limit);

  document.getElementById('combined-feed').innerHTML = allData.map(renderCard).join('');
}

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

// ── Graph ─────────────────────────────────────────────────────────────────
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
  const W = panel.clientWidth || 700, H = panel.clientHeight || 480;
  const cx = W / 2, cy = H / 2;
  const radius = Math.min(W, H) * 0.38;
  const ents = graphCache.entities, rels = graphCache.relations;
  const active = graphHovered || graphSelected;
  const pos = {};
  ents.forEach((e, i) => {
    const angle = (i / ents.length) * 2 * Math.PI - Math.PI / 2;
    pos[e] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  let h = '<defs>';
  h += '<marker id="arr" markerWidth="8" markerHeight="6" refX="20" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#333"/></marker>';
  h += '<marker id="arr-a" markerWidth="8" markerHeight="6" refX="20" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#7fba00"/></marker>';
  h += '</defs>';

  // inactive edges
  for (const rel of rels) {
    const f = pos[rel.from], t = pos[rel.to];
    if (!f || !t) continue;
    if (active && (rel.from === active || rel.to === active)) continue;
    h += `<line x1="${f.x.toFixed(1)}" y1="${f.y.toFixed(1)}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" stroke="#252525" stroke-width="1" marker-end="url(#arr)"/>`;
  }
  // active edges
  for (const rel of rels) {
    const f = pos[rel.from], t = pos[rel.to];
    if (!f || !t || !active || (rel.from !== active && rel.to !== active)) continue;
    h += `<line x1="${f.x.toFixed(1)}" y1="${f.y.toFixed(1)}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" stroke="#7fba00" stroke-width="2" stroke-opacity="0.75" marker-end="url(#arr-a)"/>`;
  }
  // nodes
  for (const e of ents) {
    const p = pos[e];
    if (!p) continue;
    const isAct = e === active;
    const fill = isAct ? '#7fba00' : '#2a2a2a', stroke = isAct ? '#a0d020' : '#444';
    const cr = isAct ? 12 : 7, textY = (p.y + cr + 14).toFixed(1);
    h += `<g class="gn" data-e="${escHtml(e)}" style="cursor:pointer">`;
    h += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${cr}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    h += `<text x="${p.x.toFixed(1)}" y="${textY}" text-anchor="middle" fill="${isAct ? '#fff' : '#999'}" font-size="${isAct ? 13 : 11}" font-family="monospace" font-weight="bold" pointer-events="none">${escHtml(e)}</text>`;
    h += '</g>';
  }

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = h;
  svg.querySelectorAll('.gn').forEach(node => {
    const entity = node.dataset.e;
    node.addEventListener('mouseenter', () => { graphHovered = entity; renderGraph(); });
    node.addEventListener('mouseleave', () => { graphHovered = null; renderGraph(); });
    node.addEventListener('click', ev => { ev.stopPropagation(); graphSelected = graphSelected === entity ? null : entity; renderGraph(); });
  });
}

// ── Sidebar ───────────────────────────────────────────────────────────────
function openSidebar() {
  renderSavedStates();
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

function renderSavedStates() {
  const body = document.getElementById('sidebar-body');
  const states = getSavedStates();
  if (!states.length) {
    body.innerHTML = '<div style="color:#444;font-size:.78rem;padding:.5rem 0">No saved states.</div>';
    return;
  }
  body.innerHTML = states.map(s =>
    `<div class="state-item" onclick="showStateJSON(${s.ts})">` +
    `<div><div class="state-name">${escHtml(s.name)}</div>` +
    `<div class="state-ts">${new Date(s.ts).toLocaleString()}</div></div>` +
    `<button class="state-del" onclick="event.stopPropagation();deleteSavedState(${s.ts})" title="Delete">&#215;</button>` +
    `</div>`
  ).join('');
}

function deleteSavedState(ts) {
  const states = getSavedStates().filter(s => s.ts !== ts);
  localStorage.setItem('eg-states', JSON.stringify(states));
  renderSavedStates();
}

function clearAll() {
  selectedEntities.clear();
  selectedEntities.add('Architect');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const firstTab = document.querySelector('.tab[data-entity="Architect"]');
  if (firstTab) firstTab.classList.add('active');
  document.getElementById('combined-limit').value = 30;
  document.getElementById('filter-relation').value = '';
  document.getElementById('show-graph').checked = false;
  document.getElementById('graph-panel').style.display = 'none';
  chatHistory = [];
  localStorage.removeItem('eg-chat');
  localStorage.removeItem('eg-current');
  document.getElementById('chat-messages').innerHTML = '';
  loadCombined();
}

// ── JSON Modal ────────────────────────────────────────────────────────────
function showJSON(id) {
  const m = memoryStore[id];
  if (!m) return;
  document.getElementById('json-pre').textContent = JSON.stringify(m, null, 2);
  document.getElementById('json-overlay').classList.add('open');
}

function showStateJSON(ts) {
  const s = getSavedStates().find(x => x.ts === ts);
  if (!s) return;
  document.getElementById('json-pre').textContent = JSON.stringify(s, null, 2);
  document.getElementById('json-overlay').classList.add('open');
}

function closeJSON() {
  document.getElementById('json-overlay').classList.remove('open');
}

// ── Chat ──────────────────────────────────────────────────────────────────
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
        const lines = buf.split('\n');
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
        entity: 'Architect', work: 'Collab', toEntity: 'Agent',
        relation: 'Documents', notes: 'Q: ' + text + '\n\nA: ' + accumulated,
        edgeWork: 'Collab',
      })
    });
  }
  chatStreaming = false;
  sendBtn.disabled = false;
}

// ── Event wiring ──────────────────────────────────────────────────────────
document.getElementById('ham-btn').addEventListener('click', openSidebar);
document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

document.getElementById('json-close').addEventListener('click', closeJSON);
document.getElementById('json-overlay').addEventListener('click', function (e) { if (e.target === this) closeJSON(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeJSON(); closeSidebar(); } });

document.getElementById('hide-records').addEventListener('change', e => {
  document.getElementById('combined-feed').style.display = e.target.checked ? 'none' : 'block';
  saveCurrentState();
});

document.getElementById('combined-limit').addEventListener('change', () => { loadCombined(); saveCurrentState(); });
document.getElementById('filter-relation').addEventListener('change', () => { loadCombined(); saveCurrentState(); });

document.getElementById('tabs').addEventListener('click', e => {
  if (!e.target.dataset.entity) return;
  const entity = e.target.dataset.entity;
  if (e.ctrlKey || e.metaKey) {
    if (selectedEntities.has(entity)) { selectedEntities.delete(entity); e.target.classList.remove('active'); }
    else { selectedEntities.add(entity); e.target.classList.add('active'); }
  } else {
    selectedEntities.clear(); selectedEntities.add(entity);
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
  }
  loadCombined(); saveCurrentState();
});

document.getElementById('show-graph').addEventListener('change', async e => {
  const panel = document.getElementById('graph-panel');
  panel.style.display = e.target.checked ? 'block' : 'none';
  if (e.target.checked) {
    if (graphCache.entities.length === 0) await loadGraph(); else renderGraph();
  }
  saveCurrentState();
});

document.getElementById('graph-panel').addEventListener('click', () => { graphSelected = null; renderGraph(); });

document.getElementById('btn-clear-all').addEventListener('click', clearAll);

document.getElementById('btn-save').addEventListener('click', () => {
  const name = prompt('Name this state:');
  if (!name) return;
  const states = getSavedStates();
  states.unshift({ name, ts: Date.now(), state: getState() });
  localStorage.setItem('eg-states', JSON.stringify(states.slice(0, 20)));
});

document.getElementById('chat-send').addEventListener('click', chatSend);
document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatSend(); }
});
document.getElementById('chat-clear').addEventListener('click', () => {
  chatHistory = [];
  document.getElementById('chat-messages').innerHTML = '';
});

// ── Form (EasyMDE + submit) ────────────────────────────────────────────────
const mde = new EasyMDE({
  element: document.querySelector('textarea[name="notes"]'),
  placeholder: 'Notes…',
  spellChecker: false,
  autofocus: false,
  toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'preview'],
  status: false,
});

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd);
  body.notes = mde.value();
  if (body.collab) body.edgeWork = 'Collab';
  delete body.collab;
  const r = await fetch('/api/memories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (r.ok) { document.getElementById('status').textContent = 'Saved.'; mde.value(''); await loadCombined(); }
  else { document.getElementById('status').textContent = 'Error: ' + r.status; }
});

// ── DOMContentLoaded ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadStats();

  // Restore config state
  try {
    const cur = JSON.parse(localStorage.getItem('eg-current') || 'null');
    if (cur) {
      if (cur.entities && cur.entities.length) {
        selectedEntities.clear();
        cur.entities.forEach(e => selectedEntities.add(e));
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', selectedEntities.has(t.dataset.entity)));
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
  } catch (_) {}

  loadCombined();

  // Restore chat history
  try {
    const saved = JSON.parse(localStorage.getItem('eg-chat') || '[]');
    if (saved.length) {
      chatHistory = saved;
      saved.forEach(m => {
        if (m.role === 'user') chatAppend('user', m.content);
        else if (m.role === 'model') chatAppend('assistant', m.content);
      });
    }
  } catch (_) {}
});
