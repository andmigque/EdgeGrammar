#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { createRequire } from "module";
import { buildHTML } from "./web.html.js";

const require  = createRequire(import.meta.url);
const EASYMDE  = path.dirname(require.resolve("easymde/dist/easymde.min.js"));
const VENDOR   = {
  "/vendor/easymde.min.js":  { file: path.join(EASYMDE, "easymde.min.js"),  mime: "text/javascript" },
  "/vendor/easymde.min.css": { file: path.join(EASYMDE, "easymde.min.css"), mime: "text/css" },
};

const PORT        = 7070;
const MEMORY_ROOT = path.join(os.homedir(), "EdgeGrammar", "agentmemory");
const ENTITIES  = ["Architect","Gemini","Claude","Grok","GPT","Agent","Codex","Qwen"];
const WORKS     = ["PowerNixxServer","SystemPrompt","Npm","Pester","Devops","Infrastructure","DataPlane","ModelContextProtocol","Security","Reactor","MarkdownChat","AgentMemory","Research","Plan","Fragment","Frontend","Troubleshoot","GloriousFailure","CMMC","Collab"];
const RELATIONS = ["Depends","Creates","Tests","Refactors","Throws","Runs","Guides","Learns","Configures","Interrupts","Thinks","Delivers","Reviews","Documents","Implements","Fixes","Observes","Analyzes","Designs","Encourages","Requests","Reports","Evolves","Understands","Accepts","Imagines","Decodes","Questions","Plans","Grows","Transcends","Reflects","Realizes","Integrates","Delegates","Proposes","Researches","Agrees","Disagrees","Answers","Confirms","Decides"];

const DOTNET_EPOCH_OFFSET = 621355968000000000n;
const CENTURY_BEGIN_TICKS = 631139040000000000n;

function tickStamp() {
  return Number(BigInt(Date.now()) * 10000n + DOTNET_EPOCH_OFFSET - CENTURY_BEGIN_TICKS);
}

function filenameTicks() {
  return (BigInt(Date.now()) * 10000n + DOTNET_EPOCH_OFFSET).toString();
}

function getMemories(entity, count = 20, work = null) {
  const entityDir = path.join(MEMORY_ROOT, entity);
  if (!fs.existsSync(entityDir)) return [];
  let memories = fs.readdirSync(entityDir)
    .filter(f => f.endsWith(".jsonl"))
    .sort().reverse()
    .map(f => JSON.parse(fs.readFileSync(path.join(entityDir, f), "utf8").trim()));
  if (work) memories = memories.filter(m => m.Work === work);
  return memories.slice(0, count);
}

function saveMemory({ entity, work, toEntity, relation, notes, edgeWork }) {
  const entityDir = path.join(MEMORY_ROOT, entity);
  if (!fs.existsSync(entityDir)) fs.mkdirSync(entityDir, { recursive: true });
  const ts = tickStamp();
  const memory = {
    Id: randomUUID(), TickStamp: ts, Entity: entity, Work: work, Notes: notes,
    Edge: { Id: randomUUID(), TickStamp: ts, FromEntity: entity, ToEntity: toEntity, Relation: relation, Work: edgeWork || work },
  };
  const filepath = path.join(entityDir, `${filenameTicks()}.jsonl`);
  fs.writeFileSync(filepath, JSON.stringify(memory), "utf8");
  return memory;
}

const HTML = buildHTML({ ENTITIES, WORKS, RELATIONS, CENTURY_BEGIN_TICKS, DOTNET_EPOCH_OFFSET });

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

  if (req.method === "GET" && url.pathname === "/api/stats/relations") {
    const stats = {};
    for (const entity of ENTITIES) {
      const memories = getMemories(entity, 1000);
      for (const m of memories) {
        if (m.Edge?.Relation) stats[m.Edge.Relation] = (stats[m.Edge.Relation] || 0) + 1;
      }
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(Object.entries(stats).sort((a,b) => b[1] - a[1])));
  }

  if (req.method === "GET" && url.pathname === "/api/memories") {
    const entityParam = url.searchParams.get("entity") ?? "Claude";
    const entities = entityParam.split(",");
    const count = parseInt(url.searchParams.get("count") ?? "20", 10);
    const work     = url.searchParams.get("work") ?? null;
    const relation = url.searchParams.get("relation") ?? null;
    const edgeWork = work === "Collab" ? "Collab" : null;

    let allMemories = [];
    for (const entity of entities) {
      allMemories.push(...getMemories(entity, count, edgeWork ? null : work));
    }
    if (edgeWork) allMemories = allMemories.filter(m => m.Edge?.Work === edgeWork);
    if (relation) allMemories = allMemories.filter(m => m.Edge?.Relation === relation);

    allMemories.sort((a, b) => b.TickStamp - a.TickStamp);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(allMemories.slice(0, count)));
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
