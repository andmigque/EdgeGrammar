### GetMemoriesByRelation

> Gets memories for a given entity and relation, bounded by a maximum record count.

```csharp
public string GetMemoriesByRelation(string entity, int count, string relation)
```

- **Parameters**
  - `string` **entity** - An `EntityEnum` string value (case-insensitive).
  - `int` **count** - The maximum number of memory records to inspect.
  - `string` **relation** - A `RelationEnum` string value (case-insensitive).
- **Returns**
  - `string` - A serialized JSON memories array filtered by relation.


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
