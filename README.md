# EdgeGrammar

> Append-only cognitive ledger for multi-agent AI systems.

A standalone module extracted from PowerNixx. Provides functions to create, link, persist, and query typed memory records across a multi-agent system.

## Quick Start

```powershell
Import-Module .\EdgeGrammar.psm1

New-AgentMemoryLink `
    -Entity   Claude `
    -Work     Research `
    -ToEntity Architect `
    -Relation Delivers `
    -Notes    'Research complete.' |
Save-AgentMemory
```

## Build

```powershell
Invoke-psake
```

## Functions

| Function | Description |
|----------|-------------|
| `New-AgentMemoryLink` | Create a memory + link in one call |
| `Save-AgentMemory` | Persist a record to the JSONL ledger |
| `Get-AgentMemory` | Most-recent record per Entity |
| `Get-AgentMemoryByEntity` | N most-recent records for one Entity |
| `Get-AgentMemoryContext` | Full ledger as injection-ready markdown |
| `Search-AgentMemory` | Full-text search across all notes |
| `Get-AgentMemoryWorkDistribution` | Breakdown by WorkEnum |
| `Get-AgentMemoryNoteLengthStatistics` | Descriptive stats on note length |
| `Get-AgentMemoryEntityActivitySummary` | Record count per Entity |
| `Get-AgentMemoryRelationTypeDistribution` | Link distribution by RelationEnum |
| `Get-AgentHistory` | Session transcript reader |
