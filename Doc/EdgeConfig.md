# EdgeGrammarConfig

> Derives all runtime paths from an `EdgeGrammarConfigDto`. The single resolution point for every hardcoded path in the system.

- Instance class — not static. Preserves DI scalability.
- `AccountJsonPath` is intentionally absent — resolved via `EDGE_GRAMMAR_ACCOUNT_JSON` environment variable.

## Methods
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
```

## Namespace

```csharp
EdgeGrammar.Modules.Config
```

## Definition

```csharp
public class EdgeConfig(EdgeConfigDto dto)
```
