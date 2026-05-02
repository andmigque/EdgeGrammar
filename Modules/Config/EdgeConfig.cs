using EdgeGrammar.Modules.Dto;

namespace EdgeGrammar.Modules.Config;

/// # EdgeGrammarConfig
///
/// > Derives all runtime paths from an `EdgeGrammarConfigDto`. The single resolution point for every hardcoded path in the system.
///
/// - Instance class — not static. Preserves DI scalability.
/// - `AccountJsonPath` is intentionally absent — resolved via `EDGE_GRAMMAR_ACCOUNT_JSON` environment variable.
///
/// ## Methods
public class EdgeConfig(EdgeConfigDto dto)
{
    private readonly EdgeConfigDto _dto = dto;

    // ── Repo ──────────────────────────────────────────────────────────────────

    /// ### EdgeGrammarDllPath
    ///
    /// > Returns the absolute path to the compiled EdgeGrammar DLL.
    ///
    /// ```csharp
    /// public string EdgeGrammarDllPath()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `EdgeGrammarHome/bin/BuildEnvironment/BuildArchitecture/EdgeGrammar.dll`
    public string EdgeGrammarDllPath() =>
        Path.Combine(_dto.EdgeGrammarHome, "bin", _dto.BuildEnvironment, _dto.BuildArchitecture, "EdgeGrammar.dll");

    /// ### EdgeGrammarModulesPath
    ///
    /// > Returns the absolute path to the Modules directory.
    ///
    /// ```csharp
    /// public string EdgeGrammarModulesPath()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `EdgeGrammarHome/Modules`
    public string EdgeGrammarModulesPath() =>
        Path.Combine(_dto.EdgeGrammarHome, "Modules");

    /// ### AgentConfigPath
    ///
    /// > Returns the absolute path to an entity's agent-config.json.
    ///
    /// ```csharp
    /// public string AgentConfigPath(string entity)
    /// ```
    ///
    /// - **Parameters**
    ///   - `string` **entity** - The entity name (e.g. `"Claude"`, `"Gemini"`).
    /// - **Returns**
    ///   - `string` - `EdgeGrammarModulesPath()/Config/entity/agent-config.json`
    public string AgentConfigPath(string entity) =>
        Path.Combine(EdgeGrammarModulesPath(), "Config", entity, "agent-config.json");

    // ── Storage ───────────────────────────────────────────────────────────────

    /// ### AgentMemoryStoragePath
    ///
    /// > Returns the absolute path to the agent memory store root.
    ///
    /// ```csharp
    /// public string AgentMemoryStoragePath()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `UserHome/EdgeGrammar/agentmemory`
    public string AgentMemoryStoragePath() =>
        Path.Combine(_dto.UserHome, "EdgeGrammar", "agentmemory");

    /// ### AgentMemoryEntityPath
    ///
    /// > Returns the absolute path to a specific entity's memory directory.
    ///
    /// ```csharp
    /// public string AgentMemoryEntityPath(string entity)
    /// ```
    ///
    /// - **Parameters**
    ///   - `string` **entity** - The entity name (e.g. `"Claude"`, `"Architect"`).
    /// - **Returns**
    ///   - `string` - `AgentMemoryStoragePath()/entity`
    public string AgentMemoryEntityPath(string entity) =>
        Path.Combine(AgentMemoryStoragePath(), entity);

    /// ### ToolStoragePath
    ///
    /// > Returns the absolute path to the tool use audit log directory.
    ///
    /// ```csharp
    /// public string ToolStoragePath()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `UserHome/EdgeGrammar/tool`
    public string ToolStoragePath() =>
        Path.Combine(_dto.UserHome, "EdgeGrammar", "tool");

    // ── Claude ────────────────────────────────────────────────────────────────

    /// ### ClaudeHome
    ///
    /// > Returns the absolute path to the Claude CLI home directory.
    ///
    /// ```csharp
    /// public string ClaudeHome()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `UserHome/.claude`
    public string ClaudeHome() =>
        Path.Combine(_dto.UserHome, ".claude");

    /// ### ClaudeJsonPath
    ///
    /// > Returns the absolute path to the Claude global config file.
    ///
    /// ```csharp
    /// public string ClaudeJsonPath()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `UserHome/.claude.json`
    public string ClaudeJsonPath() =>
        Path.Combine(_dto.UserHome, ".claude.json");

    // ── Gemini ────────────────────────────────────────────────────────────────

    /// ### GeminiHome
    ///
    /// > Returns the absolute path to the Gemini CLI home directory.
    ///
    /// ```csharp
    /// public string GeminiHome()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `UserHome/.gemini`
    public string GeminiHome() =>
        Path.Combine(_dto.UserHome, ".gemini");

    /// ### GeminiSettingsPath
    ///
    /// > Returns the absolute path to the Gemini CLI settings file.
    ///
    /// ```csharp
    /// public string GeminiSettingsPath()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `GeminiHome()/settings.json`
    public string GeminiSettingsPath() =>
        Path.Combine(GeminiHome(), "settings.json");

    // ── Codex ─────────────────────────────────────────────────────────────────

    /// ### CodexHome
    ///
    /// > Returns the absolute path to the Codex CLI home directory.
    ///
    /// ```csharp
    /// public string CodexHome()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `UserHome/.codex`
    public string CodexHome() =>
        Path.Combine(_dto.UserHome, ".codex");

    /// ### CodexConfigPath
    ///
    /// > Returns the absolute path to the Codex CLI config file.
    ///
    /// ```csharp
    /// public string CodexConfigPath()
    /// ```
    ///
    /// - **Returns**
    ///   - `string` - `CodexHome()/config.toml`
    public string CodexConfigPath() =>
        Path.Combine(CodexHome(), "config.toml");
}
