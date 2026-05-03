# EdgeConfigPathsDto

> The portable path segment record for EdgeGrammar configuration.

- Stores reusable path literals as configuration data.
- Keeps `EdgeConfig` responsible for expansion and path composition.
- Values may use forward slashes because PowerShell and .NET normalize them at runtime.

## Properties

- `string` **SourceRoot** - The repository source directory.
- `string` **ProjectName** - The EdgeGrammar project and storage root name.
- `string` **BuildOutputRoot** - The build output directory name.
- `string` **AssemblyFileName** - The EdgeGrammar assembly file name.
- `string` **ModulesRoot** - The modules directory name.
- `string` **ConfigModule** - The config module directory name.
- `string` **AgentConfigFileName** - The agent config file name.
- `string` **AgentMemoryRoot** - The agent memory storage directory name.
- `string` **ToolRoot** - The tool audit storage directory name.
- `string` **ClaudeHome** - The Claude CLI home directory name.
- `string` **ClaudeJsonFile** - The Claude global config file name.
- `string` **GeminiHome** - The Gemini CLI home directory name.
- `string` **GeminiSettingsFile** - The Gemini settings file name.
- `string` **CodexHome** - The Codex CLI home directory name.
- `string` **CodexConfigFile** - The Codex config file name.

## Namespace

```csharp
EdgeGrammar.Modules.Dto
```

## Definition

```csharp
public record EdgeConfigPathsDto
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
public record EdgeConfigPathsDto
```
