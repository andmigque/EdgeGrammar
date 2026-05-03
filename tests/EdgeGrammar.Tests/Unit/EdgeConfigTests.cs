using EdgeGrammar.Modules.Config;
using EdgeGrammar.Modules.Dto;
using System.Text.Json;
using Xunit;

namespace EdgeGrammar.Tests.Unit;

public class EdgeConfigTests
{
    [Fact]
    public void FromJsonFile_LoadsConfig_AndBuildsDllPath()
    {
        string tempRoot = CreateTempRoot();
        string configPath = Path.Combine(tempRoot, "EdgeConfig.json");
        string repoHome = Path.Combine(tempRoot, "repo");
        string userHome = Path.Combine(tempRoot, "user");

        EdgeConfigDto dto = CreateDto(repoHome, userHome);
        File.WriteAllText(configPath, JsonSerializer.Serialize(dto));

        EdgeConfig config = EdgeConfig.FromJsonFile(configPath);

        string expected = Path.Combine(
            repoHome,
            "source",
            "Project",
            "out",
            "Release",
            "net10.0/win-x64",
            "Project.dll");

        Assert.Equal(expected, config.EdgeGrammarDllPath());
    }

    [Fact]
    public void PathMethods_ComposePaths_FromConfiguredSegments()
    {
        string tempRoot = CreateTempRoot();
        string repoHome = Path.Combine(tempRoot, "repo");
        string userHome = Path.Combine(tempRoot, "user");
        EdgeConfig config = new(CreateDto(repoHome, userHome));

        Assert.Equal(
            Path.Combine(repoHome, "source", "Project", "mods"),
            config.EdgeGrammarModulesPath());

        Assert.Equal(
            Path.Combine(repoHome, "source", "Project", "mods", "cfg", "Claude", "agent.json"),
            config.AgentConfigPath("Claude"));

        Assert.Equal(
            Path.Combine(userHome, "Project", "memory"),
            config.AgentMemoryStoragePath());

        Assert.Equal(
            Path.Combine(userHome, "Project", "memory", "Architect"),
            config.AgentMemoryEntityPath("Architect"));

        Assert.Equal(
            Path.Combine(userHome, "Project", "audit"),
            config.ToolStoragePath());
    }

    [Fact]
    public void AgentHomes_ComposePaths_FromConfiguredSegments()
    {
        string tempRoot = CreateTempRoot();
        string repoHome = Path.Combine(tempRoot, "repo");
        string userHome = Path.Combine(tempRoot, "user");
        EdgeConfig config = new(CreateDto(repoHome, userHome));

        Assert.Equal(Path.Combine(userHome, ".claude-test"), config.ClaudeHome());
        Assert.Equal(Path.Combine(userHome, ".claude-test.json"), config.ClaudeJsonPath());
        Assert.Equal(Path.Combine(userHome, ".gemini-test"), config.GeminiHome());
        Assert.Equal(Path.Combine(userHome, ".gemini-test", "settings-test.json"), config.GeminiSettingsPath());
        Assert.Equal(Path.Combine(userHome, ".codex-test"), config.CodexHome());
        Assert.Equal(Path.Combine(userHome, ".codex-test", "config-test.toml"), config.CodexConfigPath());
    }

    [Fact]
    public void PathMethods_ExpandTildeRoots()
    {
        string userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        EdgeConfig config = new(CreateDto("~", "~/edge-user"));

        Assert.Equal(
            Path.Combine(userProfile, "source", "Project", "mods"),
            config.EdgeGrammarModulesPath());

        Assert.Equal(
            Path.Combine(userProfile, "edge-user", "Project", "memory"),
            config.AgentMemoryStoragePath());
    }

    private static string CreateTempRoot()
    {
        string tempRoot = Path.Combine(Path.GetTempPath(), "EdgeGrammar.Tests", Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(tempRoot);
        return tempRoot;
    }

    private static EdgeConfigDto CreateDto(string edgeGrammarHome, string userHome) =>
        new()
        {
            EdgeGrammarHome = edgeGrammarHome,
            UserHome = userHome,
            BuildEnvironment = "Release",
            BuildArchitecture = "net10.0/win-x64",
            FirestoreProjectId = "project-id",
            GoogleApiUrl = "https://example.test",
            Paths = new EdgeConfigPathsDto
            {
                SourceRoot = "source",
                ProjectName = "Project",
                BuildOutputRoot = "out",
                AssemblyFileName = "Project.dll",
                ModulesRoot = "mods",
                ConfigModule = "cfg",
                AgentConfigFileName = "agent.json",
                AgentMemoryRoot = "memory",
                ToolRoot = "audit",
                ClaudeHome = ".claude-test",
                ClaudeJsonFile = ".claude-test.json",
                GeminiHome = ".gemini-test",
                GeminiSettingsFile = "settings-test.json",
                CodexHome = ".codex-test",
                CodexConfigFile = "config-test.toml"
            }
        };
}
