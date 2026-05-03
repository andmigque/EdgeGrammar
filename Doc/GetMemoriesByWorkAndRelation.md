### GetMemoriesByWorkAndRelation

> Gets memories for a given entity, work domain, and relation, bounded by a maximum record count.

```csharp
public string GetMemoriesByWorkAndRelation(string entity, int count, string work, string relation)
```

- **Parameters**
  - `string` **entity** - An `EntityEnum` string value (case-insensitive).
  - `int` **count** - The maximum number of memory records to inspect.
  - `string` **work** - A `WorkEnum` string value (case-insensitive).
  - `string` **relation** - A `RelationEnum` string value (case-insensitive).
- **Returns**
  - `string` - A serialized JSON memories array.


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
