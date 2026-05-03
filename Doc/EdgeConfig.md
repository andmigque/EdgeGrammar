# EdgeGrammarConfig

> Derives runtime paths from an `EdgeConfigDto` loaded from `EdgeConfig.json`.

- Instance class — not static. Preserves DI scalability.
- `EdgeConfig.json` is the source of truth for portable path literals.
- `~` roots are expanded before path composition.
- `AccountJsonPath` is intentionally absent — resolved via `EDGE_GRAMMAR_ACCOUNT_JSON` environment variable.

## Methods
### FromJsonFile

> Loads `EdgeConfig.json` and returns an `EdgeConfig` resolver.

```csharp
public static EdgeConfig FromJsonFile(string configPath)
```

- **Parameters**
  - `string` **configPath** - The path to `EdgeConfig.json`.
- **Returns**
  - `EdgeConfig` - A resolver backed by the parsed config file.
- **Exceptions**
  - `InvalidOperationException` - Thrown if the config file cannot be parsed.
### EdgeGrammarDllPath

> Returns the absolute path to the compiled EdgeGrammar DLL.

```csharp
public string EdgeGrammarDllPath()
```

- **Returns**
  - `string` - `EdgeGrammarHome/bin/BuildEnvironment/BuildArchitecture/EdgeGrammar.dll`
### EdgeGrammarModulesPath

> Returns the absolute path to the Modules directory.

```csharp
public string EdgeGrammarModulesPath()
```

- **Returns**
  - `string` - `EdgeGrammarHome/Modules`
### AgentConfigPath

> Returns the absolute path to an entity's agent-config.json.

```csharp
public string AgentConfigPath(string entity)
```

- **Parameters**
  - `string` **entity** - The entity name (e.g. `"Claude"`, `"Gemini"`).
- **Returns**
  - `string` - `EdgeGrammarModulesPath()/Config/entity/agent-config.json`
### AgentMemoryStoragePath

> Returns the absolute path to the agent memory store root.

```csharp
public string AgentMemoryStoragePath()
```

- **Returns**
  - `string` - `UserHome/EdgeGrammar/agentmemory`
### AgentMemoryEntityPath

> Returns the absolute path to a specific entity's memory directory.

```csharp
public string AgentMemoryEntityPath(string entity)
```

- **Parameters**
  - `string` **entity** - The entity name (e.g. `"Claude"`, `"Architect"`).
- **Returns**
  - `string` - `AgentMemoryStoragePath()/entity`
### ToolStoragePath

> Returns the absolute path to the tool use audit log directory.

```csharp
public string ToolStoragePath()
```

- **Returns**
  - `string` - `UserHome/EdgeGrammar/tool`
### ClaudeHome

> Returns the absolute path to the Claude CLI home directory.

```csharp
public string ClaudeHome()
```

- **Returns**
  - `string` - `UserHome/.claude`
### ClaudeJsonPath

> Returns the absolute path to the Claude global config file.

```csharp
public string ClaudeJsonPath()
```

- **Returns**
  - `string` - `UserHome/.claude.json`
### GeminiHome

> Returns the absolute path to the Gemini CLI home directory.

```csharp
public string GeminiHome()
```

- **Returns**
  - `string` - `UserHome/.gemini`
### GeminiSettingsPath

> Returns the absolute path to the Gemini CLI settings file.

```csharp
public string GeminiSettingsPath()
```

- **Returns**
  - `string` - `GeminiHome()/settings.json`
### CodexHome

> Returns the absolute path to the Codex CLI home directory.

```csharp
public string CodexHome()
```

- **Returns**
  - `string` - `UserHome/.codex`
### CodexConfigPath

> Returns the absolute path to the Codex CLI config file.

```csharp
public string CodexConfigPath()
```

- **Returns**
  - `string` - `CodexHome()/config.toml`

## Imports

```csharp
using EdgeGrammar.Modules.Dto;
using System.Text.Json;
```

## Namespace

```csharp
EdgeGrammar.Modules.Config
```

## Definition

```csharp
public class EdgeConfig(EdgeConfigDto dto)
```
