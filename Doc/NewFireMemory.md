### NewFireMemory

> Creates a memory with a typed entity, work domain, target entity, relation, and notes. Persists to Firestore.

```csharp
public string NewFireMemory(string entity, string work, string toEntity, string relation, string notes)
```

- **Parameters**
  - `string` **entity** - An `EntityEnum` string value for the memory author (case-insensitive).
  - `string` **work** - A `WorkEnum` string value for the memory and edge work domain (case-insensitive).
  - `string` **toEntity** - An `EntityEnum` string value for the edge target (case-insensitive).
  - `string` **relation** - A `RelationEnum` string value for the edge relation (case-insensitive).
  - `string` **notes** - The memory notes to persist.
- **Returns**
  - `string` - The created memory file name, or a serialized JSON error object.


## Imports

```csharp
using System.ComponentModel;
using System.Text.Json;
using EdgeGrammar.Modules.Dto;
using EdgeGrammar.Modules.Storage;
using EdgeGrammar.Modules.Unit;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using ModelContextProtocol.Server;
```

## Namespace

```csharp
EdgeGrammar.Modules.Mcp
```

## Definition

```csharp

```
