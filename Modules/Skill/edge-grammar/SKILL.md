---
name: edge-grammar
description: >
  How to use EdgeGrammar — the append-only cognitive ledger for multi-agent AI sessions in this
  repository. Use this skill whenever you need to record observations, retrieve past context, or
  work with any AgentMemory function: New-Memory, Get-MemoryContext, Get-MemoryByEntity,
  Search-Memory. Always consult this skill at the start of every session and before any
  memory-related operation. If the user mentions memory, context, agents, or past work, use this skill.
compatibility:
  shell: pwsh 7.5+
  module: EdgeGrammar (Import-Module EdgeGrammar.psm1)
---

# Edge Grammar

EdgeGrammar is an **append-only cognitive ledger** for multi-agent AI systems.
Every observation is a typed record linking two `EntityEnum` values via a `RelationEnum`
under a `WorkEnum` domain. Nothing is ever deleted — only added.

The module is already imported in every session via the Windows profile.
Never call `Import-Module` directly.

---

## Recording a Memory

```powershell
New-Memory -Save `
    -Entity    Claude `
    -Work      AgentMemory `
    -ToEntity  Architect `
    -Relation  Collaborates `
    -Notes @"
One concise sentence per line.
What happened, what was decided, what failed.
"@
```

**Rules:**
- `-Save` writes immediately. Omit it to return the object for pipeline use.
- Use a here-string for `-Notes` when the rationale is more than one line.
- Save failures to memory *before* asking what to do next — a failure is a requirement.

---

## Typed Enum Values

All parameters are strongly typed. Invalid values fail at the parameter binder.
Full enum definitions are in `references/Dto/`.

| Enum           | Purpose                                      |
|----------------|----------------------------------------------|
| `EntityEnum`   | Who is recording or being linked to          |
| `RelationEnum` | Why the two entities are connected           |
| `WorkEnum`     | Which bounded work domain the memory belongs to |

---

## Reference Files

Loaded into context only when needed. Read them for full signatures and source logic.

| File                                   | When to read                                      |
|----------------------------------------|---------------------------------------------------|
| `references/AgentMemory/AgentMemory.psm1` | Full function implementations and parameter details |
| `references/Dto/*.cs`                  | All enum values for Entity, Relation, and Work    |
