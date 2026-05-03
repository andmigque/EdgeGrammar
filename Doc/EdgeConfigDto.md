# EdgeGrammarConfigDto

> The EdgeGrammar configuration record. Stores the six root anchors from which all runtime paths are derived.

- Single source of truth for machine-specific configuration.
- All derived paths are computed by `EdgeGrammarConfig` — never stored here.
- `AccountJsonPath` is intentionally absent — it is a secret, resolved via `EDGE_GRAMMAR_ACCOUNT_JSON`.

## Properties

- `string` **EdgeGrammarHome** - The absolute path to the EdgeGrammar repository root.
- `string` **UserHome** - The absolute path to the current user's home directory.
- `string` **BuildEnvironment** - The current build environment (e.g., `"Debug"`, `"Release"`).
- `string` **BuildArchitecture** - The target build architecture (e.g., `"win-x64"`).
- `string` **FirestoreProjectId** - The Google Cloud Project ID for Firestore storage.
- `string` **GoogleApiUrl** - The base URL for Google API interactions.

## Namespace

```csharp
EdgeGrammar.Modules.Dto
```

## Definition

```csharp
public record EdgeConfigDto
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
public record EdgeConfigDto
```
