### GetCollabsInternal

> Internal scanner that aggregates collaboration memories across all entity directories.

```csharp
private string GetCollabsInternal(int count)
```

- **Parameters**
  - `int` **count** - The maximum number of collaboration memory records to return.
- **Returns**
  - `string` - A serialized JSON memories array where the edge relation is `Collaborates`.


## Imports

```csharp
using System.Text.Json;
using EdgeGrammar.Modules.Dto;
```

## Namespace

```csharp
EdgeGrammar.Modules.Mcp
```

## Definition

```csharp

```
