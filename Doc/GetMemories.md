### GetMemories

> Gets memories for a given entity, bounded by a maximum record count.

```csharp
public string GetMemories(string entity, int count)
```

- **Parameters**
  - `string` **entity** - An `EntityEnum` string value (case-insensitive).
  - `int` **count** - The maximum number of memory records to return.
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
