// using System.ComponentModel;
// using System.Management.Automation;
// using System.Management.Automation.Runspaces;
// using System.Text;
// using System.Text.Json;
// using Json.More;
// using Microsoft.VisualBasic;
// using ModelContextProtocol.Server;
// using PowerNixx.Dto;
// using PowerNixx.Repository;

// /// <summary>
// /// PowerShell discovery tools for introspecting PowerShell modules and commands.
// /// Uses the PowerShell SDK to execute Get-Command and expose results via MCP.
// /// </summary>
// internal class AgentMemoryTools
// {
//     private string SerializeError(string message) =>
//       JsonSerializer.Serialize(new { error = message });
//     private string SE(string message) => SerializeError(message);

//     private string GetEntityEnumValues() => string.Join(", ", Enum.GetNames<EntityEnum>());
//     private string GEEV() => GetEntityEnumValues();

//     private string GetWorkEnumValues() => string.Join(", ", Enum.GetNames<WorkEnum>());
//     private string GWEV() => GetWorkEnumValues();

//     private string GetRelationEnumValues() => string.Join(", ", Enum.GetNames<RelationEnum>());
//     private string GREV() => GetRelationEnumValues();

//     [McpServerTool]
//     [Description($"""
//             Powershell:
//                 Example:
//                     Get-AgentMemoryByEntity -Entity 'Claude' -Count 5
//                 Types:
//                     -Entity [PowerNixx.Dto.EntityEnum] -Count [int]
//             Discoverables
//                 EntityEnum:
//                     discover_power_nixx Entity
//                     discover_power_nixx Get-AgentMemoryByEntity
//             Error:
//                 Valid enum values are Discoverables.EntityEnum
//                 Count must be greater than Powershell.Types(Count).Value

//         """)]
//     public string GetAgentMemoryByEntity(string entityEnum, int count)
//     {
//         if(!Enum.TryParse<EntityEnum>(entityEnum, ignoreCase: true, out var entity)) { return SE($"Valid enum values are {GEEV()}"); }
//         if (count <= 0) {return SE($"Count must be greater than 0"); }
//         var basePath = GetAgentMemoryBasePath();
//         var repository = new AgentMemoryRepository(basePath);
//         var memories = repository.GetByEntity(entity, count);
//         return AgentMemoryRepository.Serialize(memories);
//     }

//     [McpServerTool]
//     [Description($"""
//             Powershell:
//                 Example:
//                     New-AgentMemoryLink -Entity 'Claude' -Work 'Security' -ToEntity 'System' -Relation 'Tests' -Notes @'
//                     Test results showing validation passed
//                     '@
//                 Types:
//                     -Entity [PowerNixx.Dto.EntityEnum]
//                     -Work [PowerNixx.Dto.WorkEnum]
//                     -ToEntity [PowerNixx.Dto.EntityEnum]
//                     -Relation [PowerNixx.Dto.RelationEnum]
//                     -Notes [string[]]
//             Discoverables:
//                 EntityEnum:
//                     discover_power_nixx Entity
//                 WorkEnum:
//                     discover_power_nixx Work
//                 RelationEnum:
//                     discover_power_nixx Relation
//             Error:
//                 Valid enum values are Discoverables.EntityEnum/WorkEnum/RelationEnum
//                 Notes must not be empty
//         """)]
//     public string NewAgentMemoryLink(string entity, string work, string toEntity, string relation, string[] notes)
//     {
//         if (!Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out var entityEnum)) { return SE($"Valid Entity values: {GEEV()}"); }
//         if (!Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var workEnum)) { return SE($"Valid Work values: {GWEV()}"); }
//         if (!Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var toEntityEnum)) { return SE($"Valid ToEntity values: {GEEV()}"); }
//         if (!Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out var relationEnum)) { return SE($"Valid Relation values: {GREV()}"); }
//         if (notes == null || notes.Length == 0) { return SE($"Notes must not be empty"); };

//         /// !!!! TODO => THIS WAS NEVER SUPPOSED TO BE A LIST. MULTILINE STRING !== LIST !!!!
//         var notesList = notes.ToList();
//         /// !!!! TODO => We should not be constructing willy nilly AgentMemory. Should create a polymorphic on AgentMemoryRepository.SaveAgentMemory !!!!
//         var memory = new AgentMemory
//         {
//             id = Guid.NewGuid().ToString(),
//             tickStamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
//             entity = entityEnum,
//             work = workEnum,
//             notes = notesList,
//             links = new List<Link>
//             {
//                 new Link
//                 {
//                     id = Guid.NewGuid().ToString(),
//                     tickStamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
//                     fromEntity = entityEnum,
//                     toEntity = toEntityEnum,
//                     relation = relationEnum,
//                     work = workEnum
//                 }
//             }
//         };

//         var options = new JsonSerializerOptions
//         {
//             Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
//         };

//         return SaveAgentMemory(JsonSerializer.Serialize(memory, options));
//     }
//     /// !!!! TODO => There should be a private polymorphic that takes a typed AgentMemory object !!!!
//     // [McpServerTool]
//     // [Description($"""
//     //         Powershell:
//     //             Example:
//     //                 Save-AgentMemory -Memory ([AgentMemory as JSON string])
//     //             Types:
//     //                 -Memory [string] (JSON serialized AgentMemory)
//     //         Discoverables:
//     //             AgentMemory schema:
//     //                 discover_power_nixx AgentMemory
//     //         Error:
//     //             Memory JSON parameter is required
//     //             AgentMemory base path not configured
//     //             Failed to deserialize AgentMemory from JSON
//     //     """)]
//     private string SaveAgentMemory(string memoryJson)
//     {
//         var basePath = GetAgentMemoryBasePath();
//         if (string.IsNullOrWhiteSpace(memoryJson)) { return SE("Memory JSON parameter is required."); }
//         if (string.IsNullOrEmpty(basePath)) { return SE("AgentMemory base path not configured."); }
//         /// !!!! TODO => Repetitive Verbosity. Refactor into shorter name style functions !!!!
//         var options = new JsonSerializerOptions { Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() } };
//         /// !!!! TODO => Repetitive Verbosity. Refactor into shorter name style functions !!!!
//         var memory = JsonSerializer.Deserialize<AgentMemory>(memoryJson, options);
//         if (memory == null) { return SE("Failed to deserialize AgentMemory from JSON."); }
//         var repository = new AgentMemoryRepository(basePath);
//         var fileName = repository.SaveMemory(memory);
//         /// !!!! TODO => Repetitive Verbosity. Refactor into shorter name style functions !!!!
//         return JsonSerializer.Serialize(new { success = true, fileName });
//     }

//     /// !!!! TODO => This whole section belongs in the Config Module !!!!
//     /// !!!! SECTION => Config !!!!

//     /// <summary>
//     /// Expands the leading tilde (~) in a path to the user's home directory
//     /// in a cross-platform manner.
//     /// </summary>
//     public string ResolveTildePath(string path)
//     {
//         if (string.IsNullOrEmpty(path))
//         {
//             return path;
//         }

//         if (!path.StartsWith("~"))
//         {
//             // If the path doesn't start with a tilde, return it as is.
//             // You can optionally call Path.GetFullPath(path) here to resolve
//             // other relative path components (like . and ..).
//             return Path.GetFullPath(path);
//         }

//         string userFolder = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

//         if (path == "~")
//         {
//             return userFolder;
//         }

//         // Handle cases like "~/folder" or "~\\folder"
//         // Use Path.Combine to ensure the correct directory separator is used for the platform
//         // path.Substring(1) removes the leading tilde
//         return Path.Combine(userFolder, path.Substring(1).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar));
//     }

//     public string GetPowerNixxHome()
//     {
//         // !!!! TODO : ARCHITECTURAL DRIFT, THIS IS WRONG !!!!
//         // Need to be getting from config
//         var powerNixxHome = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
//         var combined = Path.Combine(powerNixxHome, "Develop", "PowerNixx");
//         var full = Path.GetFullPath(combined);

//         var resolved = new DirectoryInfo(full).FullName;


//         if(!Directory.Exists(resolved))
//         {
//             return "";
//         }

//         return resolved;
//     }

//     public String GetPowerNixxModuleFile()
//     {
//         var powerNixxHome = GetPowerNixxHome();

//         if(!Directory.Exists(powerNixxHome))
//         {
//             return "";
//         }
//         var powerNixxFile = Path.Combine(powerNixxHome, "PowerNixx.psd1");
//         var powerNixxFileFullName = new FileInfo(powerNixxFile).FullName;
//         return powerNixxFileFullName;
//     }

//     public string GetPowerNixxConfigFile()
//     {
//         var powerNixxHome = GetPowerNixxHome();

//         if(!Directory.Exists(powerNixxHome))
//         {
//             return "";
//         }
//         var configFile = Path.Combine(powerNixxHome, "PowerNixx.psd1.json");

//         if(!File.Exists(configFile))
//         {
//             return "";
//         }

//         return new FileInfo(configFile).FullName;
//     }

//     public string GetAgentMemoryBasePath()
//     {
//         var configFile = GetPowerNixxConfigFile();

//         if(string.IsNullOrEmpty(configFile))
//         {
//             return "";
//         }

//         var json = File.ReadAllText(configFile);
//         var config = JsonSerializer.Deserialize<JsonElement>(json);

//         var agentMemoryPath = config
//             .GetProperty("PrivateData")
//             .GetProperty("PowerNixx")
//             .GetProperty("AgentMemory")
//             .GetString();

//         if(string.IsNullOrEmpty(agentMemoryPath))
//         {
//             return "";
//         }

//         // Expand ~ to user home directory
//         // !!!! TODO : ARCHITECTURAL DRIFT, THIS IS WRONG !!!!
//         // CONCAT THE KEYS THEN RESOLVE
//         if(agentMemoryPath.StartsWith("~/") || agentMemoryPath.StartsWith("~\\"))
//         {
//             // !!!! TODO : ARCHITECTURAL DRIFT, THIS IS WRONG !!!!
//             var userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
//             agentMemoryPath = Path.Combine(userProfile, agentMemoryPath.Substring(2));
//         }

//         return agentMemoryPath;
//     }

//     /// !!!! END => SECTION => Config !!!!


// }
