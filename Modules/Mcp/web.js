#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { createRequire } from "module";

const require  = createRequire(import.meta.url);
const EASYMDE  = path.dirname(require.resolve("easymde/dist/easymde.min.js"));
const VENDOR   = { 
  "/vendor/easymde.min.js":  { file: path.join(EASYMDE, "easymde.min.js"),  mime: "text/javascript" },
  "/vendor/easymde.min.css": { file: path.join(EASYMDE, "easymde.min.css"), mime: "text/css" },
};

const PORT        = 7070;
const MEMORY_ROOT = path.join(os.homedir(), "EdgeGrammar", "agentmemory");
const ENTITIES  = ["Architect","Gemini","Claude","Grok","GPT","Human","Self","System","Agent","Codex"];
const WORKS     = ["PowerNixxServer","SystemPrompt","Npm","Pester","Devops","Infrastructure","DataPlane","ModelContextProtocol","Security","Reactor","MarkdownChat","AgentMemory","Research","Plan","Fragment","Frontend","Troubleshoot","GloriousFailure","CMMC"];
const RELATIONS = ["Depends","Creates","Tests","Refactors","Throws","Runs","Guides","Learns","Configures","Interrupts","Thinks","Delivers","Reviews","Documents","Implements","Fixes","Observes","Analyzes","Designs","Encourages","Requests","Reports","Credits","Evolves","Understands","Thanks","Accepts","Imagines","Decodes","Collaborates","Questions","Plans","Grows","Transcends","Reflects","Realizes","Integrates","Delegates","Proposes","Researches"];

const DOTNET_EPOCH_OFFSET = 621355968000000000n;
const CENTURY_BEGIN_TICKS = 631139040000000000n;

function tickStamp() {
  return Number(BigInt(Date.now()) * 10000n + DOTNET_EPOCH_OFFSET - CENTURY_BEGIN_TICKS);
}

function filenameTicks() {
  return (BigInt(Date.now()) * 10000n + DOTNET_EPOCH_OFFSET).toString();
}

function getMemories(entity, count = 20) {
  const entityDir = path.join(MEMORY_ROOT, entity);
  if (!fs.existsSync(entityDir)) return [];
  return fs.readdirSync(entityDir)
    .filter(f => f.endsWith(".jsonl"))
    .sort().reverse().slice(0, count)
    .map(f => JSON.parse(fs.readFileSync(path.join(entityDir, f), "utf8").trim()));
}

function saveMemory({ entity, work, toEntity, relation, notes }) {
  const entityDir = path.join(MEMORY_ROOT, entity);
  if (!fs.existsSync(entityDir)) fs.mkdirSync(entityDir, { recursive: true });
  const ts = tickStamp();
  const memory = {
    Id: randomUUID(), TickStamp: ts, Entity: entity, Work: work, Notes: notes,
    Edge: { Id: randomUUID(), TickStamp: ts, FromEntity: entity, ToEntity: toEntity, Relation: relation, Work: work },
  };
  const filepath = path.join(entityDir, `${filenameTicks()}.jsonl`);
  fs.writeFileSync(filepath, JSON.stringify(memory), "utf8");
  return memory;
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EdgeGrammar Memory</title>
<link rel="stylesheet" href="/vendor/easymde.min.css">
<script src="/vendor/easymde.min.js"></script>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:monospace;background:#0d0d0d;color:#ccc;padding:1.5rem}
  h1{color:#7fba00;font-size:1.1rem;margin-bottom:1.2rem;letter-spacing:.05em}
  .layout{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start}
  .left{order:2;min-width:0}.right{order:1;min-width:0}
  @media(min-width:992px){
    .left{order:1}.right{order:2}
  }
  @media(max-width:991px){
    .layout{grid-template-columns:1fr}
  }
  .tabs{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.2rem}
  .tab{background:#1a1a1a;border:1px solid #333;color:#888;padding:.35rem .9rem;cursor:pointer;font:inherit;font-size:.85rem}
  .tab.active{border-color:#7fba00;color:#7fba00}
  .panel{display:none}.panel.active{display:block}
  .card{background:#141414;border:1px solid #222;padding:.9rem 1rem;margin-bottom:.7rem;border-radius:2px}
  .card-meta{font-size:.72rem;color:#555;margin-bottom:.4rem}
  .card-meta span{color:#888;margin-right:1rem}
  .card-notes{font-size:.82rem;color:#bbb;white-space:pre-wrap;line-height:1.5}
  .card-edge{font-size:.72rem;color:#555;margin-top:.5rem}
  .card-edge span{color:#7fba00}
  form{background:#141414;border:1px solid #333;padding:1.2rem;display:grid;gap:.7rem}
  @media(min-width:992px){form{position:sticky;top:1.5rem}}
  form h2{font-size:.85rem;color:#7fba00;margin-bottom:.4rem}
  .selects{display:flex;flex-wrap:wrap;gap:.5rem}
  .selects select{flex:1 1 120px;min-width:0;width:0}
  input,select,textarea{background:#0d0d0d;border:1px solid #333;color:#ccc;padding:.4rem .6rem;font:inherit;font-size:.82rem;width:100%;min-width:0;max-width:100%}
  textarea{resize:vertical;min-height:120px}
  input:focus,select:focus,textarea:focus{outline:none;border-color:#7fba00}
  button[type=submit]{background:#7fba00;color:#000;border:none;padding:.45rem 1.2rem;font:inherit;font-size:.85rem;cursor:pointer;width:100%}
  button[type=submit]:hover{background:#a0d020}
  #status{font-size:.78rem;color:#7fba00;min-height:1em}
  .count{font-size:.72rem;color:#555;margin-bottom:.6rem}
  .EasyMDEContainer{width:100%;max-width:100%;min-width:0}
  .EasyMDEContainer .CodeMirror{background:#0d0d0d;color:#ccc;border:1px solid #333;font-family:monospace;font-size:.82rem;min-height:140px;width:100% !important;max-width:100%;min-width:0 !important}
  .EasyMDEContainer .CodeMirror-focused{border-color:#7fba00}
  .editor-toolbar{background:#1a1a1a;border:1px solid #333;border-bottom:none}
  .editor-toolbar a,.editor-toolbar button{color:#888 !important;background:transparent}
  .editor-toolbar a:hover,.editor-toolbar a.active,.editor-toolbar button:hover,.editor-toolbar button.active{color:#7fba00 !important;background:#222}
  .editor-toolbar i.separator{border-color:#333}
  .CodeMirror-cursor{border-left:2px solid #ccc !important}
  .editor-preview{background:#111;color:#ccc;font-family:monospace;font-size:.82rem}
  .editor-statusbar{display:none}
</style>
</head>
<body>
<h1>EdgeGrammar / agentmemory</h1>
<div class="layout">
  <div class="left">
    <div class="tabs" id="tabs">
      ${ENTITIES.map((e, i) => `<button class="tab${i === 0 ? " active" : ""}" data-entity="${e}">${e}</button>`).join("\n      ")}
    </div>
    ${ENTITIES.map((e, i) => `<div class="panel${i === 0 ? " active" : ""}" id="panel-${e}"><div class="count" id="count-${e}"></div><div id="feed-${e}"></div></div>`).join("\n    ")}
  </div>
  <div class="right">
    <form id="form">
      <h2>new_memory</h2>
      <div class="selects">
        <select name="entity">${ENTITIES.map(e => `<option${e==="Claude"?" selected":""}>${e}</option>`).join("")}</select>
        <select name="work">${WORKS.map(w => `<option${w==="GloriousFailure"?" selected":""}>${w}</option>`).join("")}</select>
        <select name="toEntity">${ENTITIES.map(e => `<option${e==="Architect"?" selected":""}>${e}</option>`).join("")}</select>
        <select name="relation">${RELATIONS.map(r => `<option${r==="Learns"?" selected":""}>${r}</option>`).join("")}</select>
      </div>
      <textarea name="notes" placeholder="Notes…"></textarea>
      <button type="submit">Save</button>
      <div id="status"></div>
    </form>
  </div>
</div>

<script>
const ENTITIES = ${JSON.stringify(ENTITIES)};

function renderCard(m) {
  const date = new Date(
    Math.round(Number(BigInt(m.TickStamp) + ${CENTURY_BEGIN_TICKS.toString()}n) / 10000)
    - ${Number(DOTNET_EPOCH_OFFSET / 10000n)}
  ).toLocaleString();
  return \`<div class="card">
    <div class="card-meta"><span>\${m.Work}</span><span>\${date}</span></div>
    <div class="card-notes">\${escHtml(String(m.Notes))}</div>
    <div class="card-edge">\${m.Entity} <span>\${m.Edge?.Relation ?? ''}</span> \${m.Edge?.ToEntity ?? ''}</div>
  </div>\`;
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

async function load(entity) {
  const r = await fetch(\`/api/memories?entity=\${entity}&count=30\`);
  const data = await r.json();
  document.getElementById(\`feed-\${entity}\`).innerHTML = data.map(renderCard).join('');
  document.getElementById(\`count-\${entity}\`).textContent = \`\${data.length} records\`;
}

document.getElementById('tabs').addEventListener('click', e => {
  if (!e.target.dataset.entity) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById('panel-' + e.target.dataset.entity).classList.add('active');
});

const mde = new EasyMDE({
  element: document.querySelector('textarea[name="notes"]'),
  placeholder: 'Notes…',
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
  const r = await fetch('/api/memories', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (r.ok) {
    document.getElementById('status').textContent = 'Saved.';
    mde.value('');
    await load(body.entity);
  } else {
    document.getElementById('status').textContent = 'Error: ' + r.status;
  }
});

ENTITIES.forEach(load);
</script>
</body>
</html>`;

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  const vendor = VENDOR[url.pathname];
  if (req.method === "GET" && vendor) {
    res.writeHead(200, { "Content-Type": vendor.mime });
    return res.end(fs.readFileSync(vendor.file));
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(HTML);
  }

  if (req.method === "GET" && url.pathname === "/api/memories") {
    const entity = url.searchParams.get("entity") ?? "Claude";
    const count  = parseInt(url.searchParams.get("count") ?? "20", 10);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(getMemories(entity, count)));
  }

  if (req.method === "POST" && url.pathname === "/api/memories") {
    let body = "";
    req.on("data", d => body += d);
    req.on("end", () => {
      try {
        const memory = saveMemory(JSON.parse(body));
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(memory));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(err.message);
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(PORT, () => {
  process.stderr.write(`edge-grammar-memory  http://localhost:${PORT}\n`);
});
