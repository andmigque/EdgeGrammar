// using System.ComponentModel;
// using System.Diagnostics;
// using System.Text.Json;
// using ModelContextProtocol.Server;
// using PowerNixx.ETL;

// /// <summary>
// /// Discovery tools for querying PowerNixx project index.
// /// Builds index in memory at startup for instant querying.
// /// </summary>
// internal class DiscoveryTools
// {
//     private readonly List<IndexEntry> indexCache;

//     private string SE(string message) => JsonSerializer.Serialize(new { error = message });

//     public DiscoveryTools()
//     {
//         var powerNixxHome = GetPowerNixxHome();

//         if (string.IsNullOrEmpty(powerNixxHome))
//         {
//             indexCache = new List<IndexEntry>();
//             return;
//         }

//         var configPath = Path.Combine(powerNixxHome, "Config", "IndexIncludeExclude.json");

//         if (!File.Exists(configPath))
//         {
//             indexCache = new List<IndexEntry>();
//             return;
//         }

//         var config = JsonSerializer.Deserialize<IndexConfig>(File.ReadAllText(configPath));

//         var index = new PowerNixx.ETL.Index();
//         indexCache = index.CreateInMemory(
//             root: powerNixxHome,
//             include: config.Include,
//             exclude: config.Exclude
//         );
//     }

//     [McpServerTool]
//     [Description($"""
//             Powershell:
//                 Example:
//                     Search-KeywordAsGit -Keyword 'AgentMemory'
//                 Types:
//                     -Keyword [string]
//             Discoverables:
//                 discover_power_nixx SearchGitAsKeyword
//             Error:
//                 Keyword parameter is required
//                 PowerNixx home not found
//                 Git repository not found
//         """)]
//     public string SearchKeywordAsGit(string keyword)
//     {
//         if (string.IsNullOrWhiteSpace(keyword)) { return SE("Keyword parameter is required"); }
//         var home = GetPowerNixxHome();
//         if (string.IsNullOrEmpty(home)) { return SE("PowerNixx home not found"); }
//         if (!Directory.Exists(Path.Combine(home, ".git"))) { return SE("Git repository not found"); }

//         var commitsGrep = GitExec(home, $"--no-pager log --all --grep=\"{keyword}\" --oneline --max-count=15") ?? string.Empty;
//         var commitsPickaxe = GitExec(home, $"--no-pager log --all -S\"{keyword}\" --oneline --max-count=15") ?? string.Empty;

//         var commits = (commitsGrep + "\n" + commitsPickaxe)
//             .Split('\n', StringSplitOptions.RemoveEmptyEntries)
//             .Distinct()
//             .Select(line => line.Split(' ', 2))
//             .Where(parts => parts.Length == 2)
//             .Select(parts => new { hash = parts[0], message = parts[1] })
//             .Take(25);

//         return JsonSerializer.Serialize(new { keyword, commits });
//     }

//     /// !!!! TODO: Refactor to use comments like AgentMemoryTools.cs does !!!!
//     /// <summary>
//     ///
//     /// </summary>
//     /// <param name="keyword"></param>
//     /// <returns></returns>
//     [McpServerTool]
//     [Description($"""
//             Powershell:
//                 Example:
//                     Search-KeywordAsFile -Keyword 'AgentMemory'
//                 Types:
//                     -Keyword [string]
//             Discoverables:
//                 discover_power_nixx SearchKeywordAsFile
//             Error:
//                 Index not loaded
//         """)]
//     public string SearchKeywordAsFile(string keyword)
//     {
//         if (indexCache.Count == 0) { return SE("Index not loaded. Ensure PowerNixx home exists and Config/IndexIncludeExclude.json is present."); }

//         var results = indexCache
//             .Where(entry =>
//                 entry.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
//                 entry.Path.Contains(keyword, StringComparison.OrdinalIgnoreCase))
//             .Take(50)
//             .ToList();

//         return JsonSerializer.Serialize(new { count = results.Count, results });
//     }

//     private string? GitExec(string repoPath, string args)
//     {
//         var psi = new ProcessStartInfo
//         {
//             FileName = "git",
//             Arguments = args,
//             WorkingDirectory = repoPath,
//             RedirectStandardOutput = true,
//             RedirectStandardError = true,
//             UseShellExecute = false,
//             CreateNoWindow = true
//         };

//         using var proc = Process.Start(psi);
//         if (proc == null) { return string.Empty; }

//         var outputTask = proc.StandardOutput.ReadToEndAsync();
//         var errorTask = proc.StandardError.ReadToEndAsync();

//         if (!proc.WaitForExit(5000))
//         {
//             proc.Kill();
//             return string.Empty;
//         }

//         Task.WaitAll(outputTask, errorTask);
//         return outputTask.Result;
//     }

//     /// !!!! TODO : ARCHITECTURAL DRIFT, THIS IS WRONG !!!!
//     /// Need to be getting from config
//     /// AGAIN ANOTHER pathing implementation. THIS NEEDS TO STOP
//     private string GetPowerNixxHome()
//     {
//         var home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
//         var path = Path.Combine(home, "Develop", "PowerNixx");
//         return Directory.Exists(path) ? path : string.Empty;
//     }

//     private record IndexConfig(string[] Include, string[] Exclude);
// }
