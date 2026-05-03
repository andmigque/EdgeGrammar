# EdgeGrammarMcp

> MCP tool host for the EdgeGrammar agent memory store. Enforces EntityEnum, WorkEnum, RelationEnum at the MCP boundary.

- Tool methods live in `Tools/` as partial classes — one file per tool.
- This file owns only the shared internals: helpers, overloads, SaveMemory, Firestore field.

## Imports

```csharp
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using EdgeGrammar.Modules.Dto;
using EdgeGrammar.Modules.Unit;
using Google.Cloud.Firestore;
```

## Namespace

```csharp
EdgeGrammar.Modules.Mcp
```

## Definition

```csharp

```
