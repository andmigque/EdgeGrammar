using System.ComponentModel;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

using EdgeGrammar.Modules.Dto;
using EdgeGrammar.Modules.Unit;

using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

/// <summary>
/// MCP tools for the EdgeGrammar agent memory store.
/// Typed migration of index.js — enforces EntityEnum, WorkEnum, RelationEnum at the MCP boundary.
/// </summary>
public class EdgeGrammarMcp
{

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    Get-Memories -Entity 'Claude' -Count 10
                Types:
                    -Entity [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Count  [int]
            Discoverables:
                EntityEnum: discover_edge_grammar Entity
            Error:
                Valid Entity values are Discoverables.EntityEnum
                Count must be greater than 0
        """)]
    public string GetMemories(string entity, int count) => !Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out EntityEnum e)
            ? SE($"Valid Entity values: {GEEV()}")
            : count <= 0 ? SE("Count must be greater than 0") : this.GetMemoriesInternal(e, count);



    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    Get-MemoriesByWork -Entity 'Claude' -Count 10 -Work 'SharpeX'
                Types:
                    -Entity [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Count  [int]
                    -Work   [EdgeGrammar.Modules.Dto.WorkEnum]
            Discoverables:
                EntityEnum: discover_edge_grammar Entity
                WorkEnum:   discover_edge_grammar Work
            Error:
                Valid Entity values are Discoverables.EntityEnum
                Valid Work values are Discoverables.WorkEnum
        """)]
    public string GetMemoriesByWork(string entity, int count, string work) => !Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out EntityEnum e)
            ? SE($"Valid Entity values: {GEEV()}")
            : count <= 0
            ? SE("Count must be greater than 0")
            : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w)
            ? SE($"Valid Work values: {GWEV()}")
            : this.GetMemoriesInternal(e, count, w);

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    Get-MemoriesByRelation -Entity 'Claude' -Count 10 -Relation 'Delivers'
                Types:
                    -Entity   [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Count    [int]
                    -Relation [EdgeGrammar.Modules.Dto.RelationEnum]
            Discoverables:
                EntityEnum:   discover_edge_grammar Entity
                RelationEnum: discover_edge_grammar Relation
            Error:
                Valid Entity values are Discoverables.EntityEnum
                Valid Relation values are Discoverables.RelationEnum
        """)]
    public string GetMemoriesByRelation(string entity, int count, string relation)
    {
        if (!Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out EntityEnum e)) { return SE($"Valid Entity values: {GEEV()}"); }
        if (count <= 0) { return SE("Count must be greater than 0"); }
        if (!Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out RelationEnum r)) { return SE($"Valid Relation values: {GREV()}"); }
        return this.GetMemoriesInternal(e, count, r);
    }

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    Get-MemoriesByWorkAndRelation -Entity 'Claude' -Count 10 -Work 'SharpeX' -Relation 'Delivers'
                Types:
                    -Entity   [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Count    [int]
                    -Work     [EdgeGrammar.Modules.Dto.WorkEnum]
                    -Relation [EdgeGrammar.Modules.Dto.RelationEnum]
            Discoverables:
                EntityEnum:   discover_edge_grammar Entity
                WorkEnum:     discover_edge_grammar Work
                RelationEnum: discover_edge_grammar Relation
            Error:
                Valid Entity values are Discoverables.EntityEnum
                Valid Work values are Discoverables.WorkEnum
                Valid Relation values are Discoverables.RelationEnum
        """)]
    public string GetMemoriesByWorkAndRelation(string entity, int count, string work, string relation) => !Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out EntityEnum e)
            ? SE($"Valid Entity values: {GEEV()}")
            : count <= 0
            ? SE("Count must be greater than 0")
            : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w)
            ? SE($"Valid Work values: {GWEV()}")
            : !Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out RelationEnum r)
            ? SE($"Valid Relation values: {GREV()}")
            : this.GetMemoriesInternal(e, count, w, r);

    // ── NewMemory ─────────────────────────────────────────────────────────────

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    New-Memory -Entity 'Claude' -Work 'SharpeX' -ToEntity 'Architect' -Relation 'Delivers' -Notes 'Implemented ISxController'
                Types:
                    -Entity   [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Work     [EdgeGrammar.Modules.Dto.WorkEnum]
                    -ToEntity [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Relation [EdgeGrammar.Modules.Dto.RelationEnum]
                    -Notes    [string]
            Edge.Work = entity Work. Both entities share the same work domain.
            Discoverables:
                EntityEnum:   discover_edge_grammar Entity
                WorkEnum:     discover_edge_grammar Work
                RelationEnum: discover_edge_grammar Relation
            Error:
                Valid Entity/ToEntity values are Discoverables.EntityEnum
                Valid Work values are Discoverables.WorkEnum
                Valid Relation values are Discoverables.RelationEnum
                Notes must not be empty
        """)]
    public string NewMemory(string entity, string work, string toEntity, string relation, string notes)
    {
        if (!Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out var e)) { return SE($"Valid Entity values: {GEEV()}"); }
        if (!Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var w)) { return SE($"Valid Work values: {GWEV()}"); }
        if (!Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var te)) { return SE($"Valid ToEntity values: {GEEV()}"); }
        if (!Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out var r)) { return SE($"Valid Relation values: {GREV()}"); }
        return SaveMemory(e, w, te, w, r, notes);
    }

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    New-MemoryWithToEntityWork -Entity 'Claude' -Work 'SharpeX' -ToEntity 'Architect' -ToEntityWork 'Security' -Relation 'Delivers' -Notes 'Implemented ISxController'
                Types:
                    -Entity       [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Work         [EdgeGrammar.Modules.Dto.WorkEnum]
                    -ToEntity     [EdgeGrammar.Modules.Dto.EntityEnum]
                    -ToEntityWork [EdgeGrammar.Modules.Dto.WorkEnum]
                    -Relation     [EdgeGrammar.Modules.Dto.RelationEnum]
                    -Notes        [string]
            Edge.Work = ToEntityWork. Entities operate in different work domains.
            Discoverables:
                EntityEnum:   discover_edge_grammar Entity
                WorkEnum:     discover_edge_grammar Work
                RelationEnum: discover_edge_grammar Relation
            Error:
                Valid Entity/ToEntity values are Discoverables.EntityEnum
                Valid Work/ToEntityWork values are Discoverables.WorkEnum
                Valid Relation values are Discoverables.RelationEnum
                Notes must not be empty
        """)]
    public string NewMemoryWithToEntityWork(string entity, string work, string toEntity, string toEntityWork, string relation, string notes)
    {
        return !Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out var e)
            ? SE($"Valid Entity values: {GEEV()}")
            : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var w)
            ? SE($"Valid Work values: {GWEV()}")
            : !Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var te)
            ? SE($"Valid ToEntity values: {GEEV()}")
            : !Enum.TryParse<WorkEnum>(toEntityWork, ignoreCase: true, out var tew)
            ? SE($"Valid ToEntityWork values: {GWEV()}")
            : !Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out var r)
            ? SE($"Valid Relation values: {GREV()}")
            : this.SaveMemory(e, w, te, tew, r, notes);
    }

    // ── NewCollab ─────────────────────────────────────────────────────────────

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    New-Collab -Entity 'Claude' -Work 'SharpeX' -ToEntity 'Architect' -ToEntityWork 'Security' -Notes 'Proposing ISxController pattern'
                Types:
                    -Entity       [EdgeGrammar.Modules.Dto.EntityEnum]
                    -Work         [EdgeGrammar.Modules.Dto.WorkEnum]
                    -ToEntity     [EdgeGrammar.Modules.Dto.EntityEnum]
                    -ToEntityWork [EdgeGrammar.Modules.Dto.WorkEnum]
                    -Notes        [string]
            Edge.Relation is fixed to Collaborates — not a parameter.
            AgentMemoryDto.Work = entity work domain. Edge.Work = toEntity work domain.
            Discoverables:
                EntityEnum: discover_edge_grammar Entity
                WorkEnum:   discover_edge_grammar Work
            Error:
                Valid Entity/ToEntity values are Discoverables.EntityEnum
                Valid Work/ToEntityWork values are Discoverables.WorkEnum
                Notes must not be empty
        """)]
    public string NewCollab(string entity, string work, string toEntity, string toEntityWork, string notes)
    {
        if (!Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out var e)) { return SE($"Valid Entity values: {GEEV()}"); }
        if (!Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var w)) { return SE($"Valid Work values: {GWEV()}"); }
        if (!Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var te)) { return SE($"Valid ToEntity values: {GEEV()}"); }
        if (!Enum.TryParse<WorkEnum>(toEntityWork, ignoreCase: true, out var tew)) { return SE($"Valid ToEntityWork values: {GWEV()}"); }
        return this.SaveMemory(e, w, te, tew, RelationEnum.Collaborates, notes);
    }

    // ── GetCollabs ────────────────────────────────────────────────────────────

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    Get-Collabs -Count 5
                Types:
                    -Count [int]
            Returns all Collaborates edges across all entities, sorted newest-first.
            Error:
                Count must be greater than 0
        """)]
    public string GetCollabs(int count) => count <= 0 ? SE("Count must be greater than 0") : this.GetCollabsInternal(count);

    [McpServerTool]
    [Description("""
            Powershell:
                Example:
                    Get-CollabsByWork -Count 5 -Work 'SharpeX'
                Types:
                    -Count [int]
                    -Work  [EdgeGrammar.Modules.Dto.WorkEnum]
            Returns Collaborates edges where AgentMemoryDto.Work OR Edge.Work matches.
            Discoverables:
                WorkEnum: discover_edge_grammar Work
            Error:
                Count must be greater than 0
                Valid Work values are Discoverables.WorkEnum
        """)]
    public string GetCollabsByWork(int count, string work) => count <= 0
            ? SE("Count must be greater than 0")
            : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w) ? SE($"Valid Work values: {GWEV()}") : this.GetCollabsInternal(count);

    public string GetMemoriesInternal(EntityEnum entity, int count)
    {
        var memories = new List<AgentMemoryDto>();

        string entityPath = this.EntityDir(entity.ToString());
        var directoryInfo = new DirectoryInfo(entityPath);

        if (!Directory.Exists(entityPath)) { return SE($"No memory directory found for entity: {entity}"); }

        var files = directoryInfo.GetFiles("*.jsonl")
            .OrderByDescending(f => f.LastWriteTime)
            .Take(count)
            .ToList();

        foreach (var file in files)
        {
            var jsonContent = File.ReadAllText(file.FullName, Encoding.UTF8);
            var memory = JsonSerializer.Deserialize<AgentMemoryDto>(jsonContent, JsonOpts);

            if (memory != null)
            {
                memories.Add(memory);
            }
        }

        return JsonSerializer.Serialize(memories, JsonOpts);
    }

    public string GetMemoriesInternal(EntityEnum entity, int count, WorkEnum work)
    {
        var memories = new List<AgentMemoryDto>();

        string entityPath = this.EntityDir(entity.ToString());
        var directoryInfo = new DirectoryInfo(entityPath);

        if (!Directory.Exists(entityPath)) { return SE($"No memory directory found for entity: {entity}"); }

        var files = directoryInfo.GetFiles("*.jsonl")
            .OrderByDescending(f => f.LastWriteTime)
            .Take(count)
            .ToList();

        foreach (var file in files)
        {
            var jsonContent = File.ReadAllText(file.FullName, Encoding.UTF8);
            var memory = JsonSerializer.Deserialize<AgentMemoryDto>(jsonContent, JsonOpts);

            if (memory != null && memory.Work.ToString() == work.ToString())
            {
                memories.Add(memory);
            }
        }

        return JsonSerializer.Serialize(memories, JsonOpts);
    }

    public string GetMemoriesInternal(EntityEnum entity, int count, WorkEnum work, RelationEnum r)
    {
        var memories = new List<AgentMemoryDto>();

        string entityPath = this.EntityDir(entity.ToString());
        var directoryInfo = new DirectoryInfo(entityPath);

        if (!Directory.Exists(entityPath)) { return SE($"No memory directory found for entity: {entity}"); }

        var files = directoryInfo.GetFiles("*.jsonl")
            .OrderByDescending(f => f.LastWriteTime)
            .Take(count)
            .ToList();

        foreach (var file in files)
        {
            var jsonContent = File.ReadAllText(file.FullName, Encoding.UTF8);
            var memory = JsonSerializer.Deserialize<AgentMemoryDto>(jsonContent, JsonOpts);

            if (memory != null && memory.Edge.Relation.ToString() == r.ToString())
            {
                memories.Add(memory);
            }
        }

        return JsonSerializer.Serialize(memories, JsonOpts);
    }


    public string GetMemoriesInternal(EntityEnum entity, int count, RelationEnum r)
    {
        var memories = new List<AgentMemoryDto>();

        string entityPath = this.EntityDir(entity.ToString());
        var directoryInfo = new DirectoryInfo(entityPath);

        if (!Directory.Exists(entityPath)) { return SE($"No memory directory found for entity: {entity}"); }

        var files = directoryInfo.GetFiles("*.jsonl")
            .OrderByDescending(f => f.LastWriteTime)
            .Take(count)
            .ToList();

        foreach (var file in files)
        {
            var jsonContent = File.ReadAllText(file.FullName, Encoding.UTF8);
            var memory = JsonSerializer.Deserialize<AgentMemoryDto>(jsonContent, JsonOpts);

            if (memory != null && memory.Edge.Relation.ToString() == r.ToString())
            {
                memories.Add(memory);
            }
        }

        return JsonSerializer.Serialize(memories, JsonOpts);
    }

    private string SaveMemory(EntityEnum entity, WorkEnum entityWork, EntityEnum toEntity, WorkEnum edgeWork, RelationEnum relation, string notes)
    {
        if (string.IsNullOrWhiteSpace(notes)) { return SE("Notes must not be empty"); }

        var ts = new TickStampUnit().Ticks;
        var memory = new AgentMemoryDto
        {
            Id = Guid.NewGuid().ToString(),
            TickStamp = ts,
            Entity = entity,
            Work = entityWork,
            Notes = notes,
            Edge = new EdgeDto
            {
                Id = Guid.NewGuid().ToString(),
                TickStamp = ts,
                FromEntity = entity,
                ToEntity = toEntity,
                Relation = relation,
                Work = edgeWork
            }
        };

        var dir = EntityDir(entity.ToString());
        Directory.CreateDirectory(dir);
        var file = Path.Combine(dir, $"{new TickStampUnit().Ticks}.jsonl");
        File.WriteAllText(file, JsonSerializer.Serialize(memory, JsonOpts));
        return Path.GetFileName(file);
    }

    private string GetCollabsInternal(int count)
    {
        if (!Directory.Exists(MemoryRoot())) { return SE("Memory root not found"); }

        IEnumerable<AgentMemoryDto> all = Directory.GetDirectories(MemoryRoot())
            .SelectMany(dir => Directory.GetFiles(dir, "*.jsonl"))
            .Select(f => JsonSerializer.Deserialize<AgentMemoryDto>(File.ReadAllText(f), JsonOpts))
            .Where(m => m.Edge.Relation == RelationEnum.Collaborates);

        return JsonSerializer.Serialize(
            all.OrderByDescending(m => m.TickStamp).Take(count).ToList(), JsonOpts);
    }

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private static string MemoryRoot() =>
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "EdgeGrammar", "agentmemory");

    private string EntityDir(string entity) =>
        Path.Combine(MemoryRoot(), entity);

    private static string SE(string message) =>
        JsonSerializer.Serialize(new { error = message });

    private static string GEEV() => String.Join(", ", Enum.GetNames<EntityEnum>());
    private static string GWEV() => String.Join(", ", Enum.GetNames<WorkEnum>());
    private static string GREV() => String.Join(", ", Enum.GetNames<RelationEnum>());

}
