---
name: edge-grammar
description: Edge Grammar is a graph memory system for use with Agentic AI workloads. You use this skill when important events occur such as completing a sprint or failing several times in a loop.
compatibility:
  mcp: edge-grammar-memory (Node MCP server — Modules/Mcp/index.js)
---

# Edge Grammar

> Edge Grammar is a graph memory system for use with Agentic AI workloads.

> It is **Append Only JsonL**. The primary use case is compliance systems requiring attribution of agency. 

> Still , the system works equally well as a Collaborative Message bus for agents. 


---

## 1. Interfaces

Edge Grammar provides multiple interface surfaces and are listed here in order of suggested utility.

### 1.1 MCP

All custom mcp in Claude Code are prefixed with mcp__`<serverName>`__ . 
The prefix will be omitted here for brevity.

---

#### 1.2 `get_memories` — retrieve memories for one entity

```
get_memories
  entity:  Claude              # required — Claude, Architect, Gemini, …
  count:   10                  # optional — default 10, max 10000
  work:    Collab              # optional — filter by work domain
```

---

#### 1.3 `new_memory` — write a memory

```
new_memory
  entity:   Claude             # who is recording
  work:     AgentMemory        # work domain
  toEntity: Architect          # who the memory connects to
  relation: Collaborates       # nature of the link
  notes:    What happened.     # what actually matters. This should be comprehensive and verbose.
```

---

#### 1.4 `get_collabs` — read the Collab bus

Returns all `Work=Collab` edges across **all** entity directories, merged newest-first.

```
get_collabs
  count: 10 # optional — default 5, max 10000
```

---

#### 1.5 `new_collab` — write to the Collab bus

Proxies `new_memory` but fixes `Edge.Work` to `Collab`.

```
new_collab
  entity:   Claude             # who is writing — always your named entity
  work:     AgentMemory        # domain of the work being discussed
  toEntity: Gemini             # who you are collaborating with
  relation: Proposes           # conversational move
  notes:    Your position.     # the actual message or response
```

---

#### 1.6 Rules

- Save failures to memory **before** asking what to do next — a failure is a requirement.
- Always call `get_collabs` before writing to the Collab bus — never write blind.
- Write as your named entity (`Claude`, `Gemini`, `Qwen`) — never `Agent` or a generic name.

## 2. Powershell

> The Powershell and Csharp interface is the foundational rock solid implementation.

> See `references/Doc/*` for all of the available Powershell functions.

> The Entire AgentMemory module code is also available in references. 

### 2.1 Instrospection

```powershell
Get-Command -Module EdgeGrammar -Syntax
```

> Yields

- Get-Command -Module EdgeGrammar -Syntax
- Get-MemoryByEntity [[-Entity] <EntityEnum>] [[-Count] <int>] [<CommonParameters>]
- Get-MemoryContext [[-Entities] <EntityEnum[]>] [[-Count] <int>] [[-OutFile] <string>] [<CommonParameters>]
- Get-MemorySummary [<CommonParameters>]
- Get-MemoryWorkDistribution [<CommonParameters>]
- Measure-MemoryRelation [<CommonParameters>]
- Measure-MemoryStatistic [<CommonParameters>]
- New-Memory [[-Entity] <EntityEnum>] [[-Work] <WorkEnum>] [[-ToEntity] <EntityEnum>] [[-Relation] <RelationEnum>] [[-Notes] <string[]>] -Save [<CommonParameters>]
- Search-Memory [-Pattern] <string> [-Entity <EntityEnum[]>] [-Work <WorkEnum>] [-Relation <RelationEnum>] [-MaxPerEntity <int>] [-CaseSensitive] [-SimpleMatch] [<CommonParameters>]
- Sync-AgentConfig [-Entity] <EntityEnum> [<CommonParameters>]
- Sync-ClaudeJson [<CommonParameters>]
- Sync-Profile [<CommonParameters>]
- Sync-Skill [-SkillName] <string> [<CommonParameters>]
