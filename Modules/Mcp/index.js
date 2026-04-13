#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";

const MEMORY_ROOT = path.join(os.homedir(), "EdgeGrammar", "agentmemory");

// TickStamp = DateTime.UtcNow.Ticks - new DateTime(2001, 1, 1).Ticks
const DOTNET_EPOCH_OFFSET  = 621355968000000000n; // ticks: year 1 -> Unix epoch
const CENTURY_BEGIN_TICKS  = 631139040000000000n; // ticks: year 1 -> 2001-01-01

function tickStamp() {
  return Number(BigInt(Date.now()) * 10000n + DOTNET_EPOCH_OFFSET - CENTURY_BEGIN_TICKS);
}

// Filename uses raw .NET ticks from year 1 (matches (Get-Date).Ticks in Save-AgentMemory)
function filenameTicks() {
  return (BigInt(Date.now()) * 10000n + DOTNET_EPOCH_OFFSET).toString();
}

const server = new McpServer({
  name: "edge-grammar-memory",
  version: "1.0.0",
});

server.tool(
  "get_memories",
  "Get recent memories for an entity from the EdgeGrammar agent memory store",
  {
    entity: z.string().describe("Entity name — Claude, Architect, or Gemini"),
    count:  z.number().int().min(1).max(10000).default(10).describe("Number of recent memories to return (default 10)"),
    work:   z.string().optional().describe("Filter by work domain — e.g. AgentCollab, Plan, GloriousFailure"),
  },
  async ({ entity, count, work }) => {
    const entityDir = path.join(MEMORY_ROOT, entity);

    if (!fs.existsSync(entityDir)) {
      return {
        content: [{ type: "text", text: `No memory directory found for entity: ${entity}` }],
        isError: true,
      };
    }

    const files = fs.readdirSync(entityDir)
      .filter(f => f.endsWith(".jsonl"))
      .sort()
      .reverse();

    if (files.length === 0) {
      return {
        content: [{ type: "text", text: `No memories found for entity: ${entity}` }],
      };
    }

    let memories = files.map(file => {
      const raw = fs.readFileSync(path.join(entityDir, file), "utf8").trim();
      return JSON.parse(raw);
    });

    if (work) {
      memories = memories.filter(m => m.Work === work);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(memories.slice(0, count), null, 2) }],
    };
  }
);

server.tool(
  "new_memory",
  "Save a new memory to the EdgeGrammar agent memory store",
  {
    entity:   z.string().describe("Who is recording this memory — Claude, Architect, or Gemini"),
    work:     z.string().describe("Which effort this memory belongs to — e.g. GloriousFailure, Plan, AgentMemory"),
    toEntity: z.string().describe("Who the memory author is connecting to"),
    relation: z.string().describe("Why the two entities are linked — e.g. Learns, Delivers, Collaborates"),
    notes:    z.string().describe("The memory content — what happened, what was learned"),
  },
  async ({ entity, work, toEntity, relation, notes }) => {
    const entityDir = path.join(MEMORY_ROOT, entity);

    if (!fs.existsSync(entityDir)) {
      fs.mkdirSync(entityDir, { recursive: true });
    }

    const ts = tickStamp();

    const memory = {
      Id:        randomUUID(),
      TickStamp: ts,
      Entity:    entity,
      Work:      work,
      Notes:     notes,
      Edge: {
        Id:         randomUUID(),
        TickStamp:  ts,
        FromEntity: entity,
        ToEntity:   toEntity,
        Relation:   relation,
        Work:       work,
      },
    };

    const filename = `${filenameTicks()}.jsonl`;
    const filepath = path.join(entityDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(memory), "utf8");

    return {
      content: [{ type: "text", text: filename }],
    };
  }
);

server.tool(
  "get_collabs",
  "Get recent AgentCollab memories across all entities, merged and sorted by tick",
  {
    count: z.number().int().min(1).max(10000).default(30).describe("Number of recent collab entries to return (default 30)"),
  },
  async ({ count }) => {
    if (!fs.existsSync(MEMORY_ROOT)) {
      return {
        content: [{ type: "text", text: "No memory root found." }],
        isError: true,
      };
    }

    const entities = fs.readdirSync(MEMORY_ROOT, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    let all = [];
    for (const entity of entities) {
      const entityDir = path.join(MEMORY_ROOT, entity);
      const files = fs.readdirSync(entityDir)
        .filter(f => f.endsWith(".jsonl"))
        .sort()
        .reverse();
      for (const file of files) {
        const raw = fs.readFileSync(path.join(entityDir, file), "utf8").trim();
        const m = JSON.parse(raw);
        if (m.Work === "AgentCollab") all.push(m);
      }
    }

    all.sort((a, b) => b.TickStamp - a.TickStamp);

    return {
      content: [{ type: "text", text: JSON.stringify(all.slice(0, count), null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
