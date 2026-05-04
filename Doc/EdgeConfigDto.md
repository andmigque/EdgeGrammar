# EdgeGrammarConfigDto

> The EdgeGrammar configuration record. Stores portable anchors and path segments loaded from `EdgeConfig.json`.

- Single source of truth for deployment-specific configuration.
- Portable roots may use `~`; `EdgeConfig` expands them at runtime.
- Path literals live under `Paths` so PowerShell can read them before `EdgeGrammar.dll` loads.
- `AccountJsonPath` is intentionally absent — it is a secret, resolved via `EDGE_GRAMMAR_ACCOUNT_JSON`.

## Properties

- `string` **EdgeGrammarHome** - The portable path to the EdgeGrammar repository root.
- `string` **UserHome** - The portable path to the current user's home directory.
- `string` **BuildEnvironment** - The current build environment (e.g., `"Debug"`, `"Release"`).
- `string` **BuildArchitecture** - The target build architecture path (e.g., `"net10.0/win-x64"`).
- `string` **FirestoreProjectId** - The Google Cloud Project ID for Firestore storage.
- `string` **GoogleApiUrl** - The base URL for Google API interactions.
- `EdgeConfigPathsDto` **Paths** - Portable path literals used by C# and PowerShell.

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
