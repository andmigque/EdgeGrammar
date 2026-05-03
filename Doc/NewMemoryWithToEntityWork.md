### NewMemoryWithToEntityWork

> Creates a memory with separate work domains for the author entity and target entity edge.

```csharp
public string NewMemoryWithToEntityWork(string entity, string work, string toEntity, string toEntityWork, string relation, string notes)
```

- **Parameters**
  - `string` **entity** - An `EntityEnum` string value for the memory author (case-insensitive).
  - `string` **work** - A `WorkEnum` string value for the author's memory work domain (case-insensitive).
  - `string` **toEntity** - An `EntityEnum` string value for the edge target (case-insensitive).
  - `string` **toEntityWork** - A `WorkEnum` string value for the target edge work domain (case-insensitive).
  - `string` **relation** - A `RelationEnum` string value for the edge relation (case-insensitive).
  - `string` **notes** - The memory notes to persist.
- **Returns**
  - `string` - The created memory file name, or a serialized JSON error object.


## Imports

```csharp
using System.ComponentModel;
using EdgeGrammar.Modules.Dto;
using ModelContextProtocol.Server;
```

## Namespace

```csharp
EdgeGrammar.Modules.Mcp
```

## Definition

```csharp

```
