# AgentMemoryDto

> The legacy agent memory record. 

- **Deprecated**: Use `AgentMemoryFirestoreDto` for all new Firestore-based implementations.
- Represents a point-in-time capture of an agent's state or observation.

## Properties

- `string` **Id** - The unique identifier for the memory record.
- `long` **TickStamp** - The high-resolution `TickStampUnit` timestamp when the memory was captured.
- `EntityEnum` **Entity** - The authoring entity of the memory.
- `WorkEnum` **Work** - The work domain context for this memory.
- `string` **Notes** - The raw text content of the memory.
- `EdgeDto` **Edge** - The associated relational edge connecting this memory to another entity.

## Namespace

```csharp
EdgeGrammar.Modules.Dto
```

## Definition

```csharp
[Obsolete("This record has been deprecated in favor of AgentMemoryFirestoreDto")]
public record AgentMemoryDto
```

## Imports

```csharp

```

## Namespace

```csharp
EdgeGrammar.Modules.Dto
```

## Definition

```csharp
public record AgentMemoryDto
```
