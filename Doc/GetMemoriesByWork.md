### GetMemoriesByWork

> Gets memories for a given entity and work domain, bounded by a maximum record count.

```csharp
public string GetMemoriesByWork(string entity, int count, string work)
```

- **Parameters**
  - `string` **entity** - An `EntityEnum` string value (case-insensitive).
  - `int` **count** - The maximum number of memory records to inspect.
  - `string` **work** - A `WorkEnum` string value (case-insensitive).
- **Returns**
  - `string` - A serialized JSON memories array filtered by work.


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
