using EdgeGrammar.Modules.Dto;
using System.Text.Json;

namespace EdgeGrammar.Modules.Config;

/// # EdgeGrammarConfig
///
/// > Derives runtime paths from an `EdgeConfigDto` loaded from `EdgeConfig.json`.
///
/// - Instance class — not static. Preserves DI scalability.
/// - `EdgeConfig.json` is the source of truth for portable path literals.
/// - `~` roots are expanded before path composition.
/// - `AccountJsonPath` is intentionally absent — resolved via `EDGE_GRAMMAR_ACCOUNT_JSON` environment variable.
///
/// ## Methods
public class EdgeConfig(EdgeConfigDto dto)
{
    private readonly EdgeConfigDto _dto = dto;

    private string EdgeGrammarHome => ExpandHome(_dto.EdgeGrammarHome);
    private string UserHome => ExpandHome(_dto.UserHome);

    /// ### FromJsonFile
    ///
    /// > Loads `EdgeConfig.json` and returns an `EdgeConfig` resolver.
    ///
    /// ```csharp
    /// public static EdgeConfig FromJsonFile(string configPath)
    /// ```
    ///
    /// - **Parameters**
    ///   - `string` **configPath** - The path to `EdgeConfig.json`.
    /// - **Returns**
    ///   - `EdgeConfig` - A resolver backed by the parsed config file.
    /// - **Exceptions**
    ///   - `InvalidOperationException` - Thrown if the config file cannot be parsed.
    public static EdgeConfig FromJsonFile(string configPath)
    {
        string json = File.ReadAllText(ExpandHome(configPath));
        EdgeConfigDto dto = JsonSerializer.Deserialize<EdgeConfigDto>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (dto is null)
        {
            throw new InvalidOperationException($"{nameof(EdgeConfig)} -> Could not parse EdgeConfig.json.");
        }

        return new EdgeConfig(dto);
    }

    private static string ExpandHome(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            return path;
        }

        if (path == "~")
        {
            return Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        }

        if (path.StartsWith("~/") || path.StartsWith("~\\"))
        {
            string home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            return Path.Combine(home, path[2..]);
        }

        return path;
    }

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
        Path.Combine(
            EdgeGrammarHome,
            _dto.Paths.SourceRoot,
            _dto.Paths.ProjectName,
            _dto.Paths.BuildOutputRoot,
            _dto.BuildEnvironment,
            _dto.BuildArchitecture,
            _dto.Paths.AssemblyFileName);

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
        Path.Combine(EdgeGrammarHome, _dto.Paths.SourceRoot, _dto.Paths.ProjectName, _dto.Paths.ModulesRoot);

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
        Path.Combine(EdgeGrammarModulesPath(), _dto.Paths.ConfigModule, entity, _dto.Paths.AgentConfigFileName);

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
        Path.Combine(UserHome, _dto.Paths.ProjectName, _dto.Paths.AgentMemoryRoot);

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
        Path.Combine(UserHome, _dto.Paths.ProjectName, _dto.Paths.ToolRoot);

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
        Path.Combine(UserHome, _dto.Paths.ClaudeHome);

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
        Path.Combine(UserHome, _dto.Paths.ClaudeJsonFile);

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
        Path.Combine(UserHome, _dto.Paths.GeminiHome);

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
        Path.Combine(GeminiHome(), _dto.Paths.GeminiSettingsFile);

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
        Path.Combine(UserHome, _dto.Paths.CodexHome);

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
        Path.Combine(CodexHome(), _dto.Paths.CodexConfigFile);
}
