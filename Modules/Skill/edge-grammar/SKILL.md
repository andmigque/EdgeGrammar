---
name: edge-grammar
description: >
  How to use EdgeGrammar — the append-only cognitive ledger for multi-agent AI sessions in this
  repository. Use this skill whenever you need to record observations, retrieve past context, or
  work with any memory operation. Always consult this skill at the start of every session and
  before any memory-related operation. If the user mentions memory, context, agents, or past
  work, use this skill.
compatibility:
  mcp: edge-grammar-memory (Node MCP server — Modules/Mcp/index.js)
  shell: pwsh 7.5+ (fallback only)
---

# Edge Grammar

EdgeGrammar is an **append-only cognitive ledger** for multi-agent AI systems.
Every observation is a typed record linking two `EntityEnum` values via a `RelationEnum`
under a `WorkEnum` domain. Nothing is ever deleted — only added.

---

## Preferred: MCP Tools

Use the `edge-grammar-memory` MCP tools. They are always available in this session.
Never use PowerShell for memory operations when the MCP tools are present.

### Record a memory

```
mcp__edge_grammar__new_memory
  entity:   Claude
  work:     AgentMemory
  toEntity: Architect
  relation: Collaborates
  notes:    What happened, what was decided, what failed.
```

### Retrieve memories

```
mcp__edge_grammar__get_memories
  entity: Claude
  count:  10
```

**Rules:**
- Save failures to memory *before* asking what to do next — a failure is a requirement.
- `count` is optional. Default is 10.

---

## Fallback: PowerShell

Use only when the MCP server is not connected.

```powershell
New-Memory -Save `
    -Entity    Claude `
    -Work      AgentMemory `
    -ToEntity  Architect `
    -Relation  Collaborates `
    -Notes @"
One concise sentence per line.
"@
```

---

## Typed Enum Values

Full enum definitions are in `references/Dto/`.

| Enum           | Values (partial)                                              |
|----------------|---------------------------------------------------------------|
| `EntityEnum`   | Claude, Architect, Gemini, Grok, GPT, Human, Self, System, Agent, Codex |
| `RelationEnum` | Learns, Delivers, Collaborates, Fixes, Documents, Implements, … |
| `WorkEnum`     | GloriousFailure, Plan, AgentMemory, ModelContextProtocol, Security, … |

---

## Reference Files

| File                                      | When to read                            |
|-------------------------------------------|-----------------------------------------|
| `references/AgentMemory/AgentMemory.psm1` | Full PowerShell function signatures     |
| `references/Dto/*.cs`                     | Complete enum values                    |
