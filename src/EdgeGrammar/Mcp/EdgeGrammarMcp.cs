using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

using EdgeGrammar.Modules.Dto;
using EdgeGrammar.Modules.Unit;

using Google.Cloud.Firestore;

namespace EdgeGrammar.Modules.Mcp;

/// # EdgeGrammarMcp
///
/// > MCP tool host for the EdgeGrammar agent memory store. Enforces EntityEnum, WorkEnum, RelationEnum at the MCP boundary.
///
/// - Tool methods live in `Tools/` as partial classes — one file per tool.
/// - This file owns only the shared internals: helpers, overloads, SaveMemory, Firestore field.
public partial class EdgeGrammarMcp
{
    // ── GetMemoriesInternal ───────────────────────────────────────────────────

    public string GetMemoriesInternal(EntityEnum entity, int count)
    {
        string entityPath = EntityDir(entity.ToString());
        if (!Directory.Exists(entityPath)) { return SerializerError($"No memory directory found for entity: {entity}"); }

        return JsonSerializer.Serialize(
            LoadFiles(entityPath, count), JsonOpts);
    }

    public string GetMemoriesInternal(EntityEnum entity, int count, WorkEnum work)
    {
        string entityPath = EntityDir(entity.ToString());
        if (!Directory.Exists(entityPath)) { return SerializerError($"No memory directory found for entity: {entity}"); }

        return JsonSerializer.Serialize(
            LoadFiles(entityPath, count).Where(m => m.Work == work).ToList(), JsonOpts);
    }

    public string GetMemoriesInternal(EntityEnum entity, int count, RelationEnum r)
    {
        string entityPath = EntityDir(entity.ToString());
        if (!Directory.Exists(entityPath)) { return SerializerError($"No memory directory found for entity: {entity}"); }

        return JsonSerializer.Serialize(
            LoadFiles(entityPath, count).Where(m => m.Edge.Relation == r).ToList(), JsonOpts);
    }

    public string GetMemoriesInternal(EntityEnum entity, int count, WorkEnum work, RelationEnum r)
    {
        string entityPath = EntityDir(entity.ToString());
        if (!Directory.Exists(entityPath)) { return SerializerError($"No memory directory found for entity: {entity}"); }

        return JsonSerializer.Serialize(
            LoadFiles(entityPath, count).Where(m => m.Work == work && m.Edge.Relation == r).ToList(), JsonOpts);
    }

    // ── LoadFiles ─────────────────────────────────────────────────────────────

    private static List<AgentMemoryDto> LoadFiles(string entityPath, int count) =>
        new DirectoryInfo(entityPath)
            .GetFiles("*.jsonl")
            .OrderByDescending(f => f.LastWriteTime)
            .Take(count)
            .Select(f => JsonSerializer.Deserialize<AgentMemoryDto>(File.ReadAllText(f.FullName, Encoding.UTF8), JsonOpts))
            .Where(m => m != null)
            .ToList();

    // ── SaveMemory ────────────────────────────────────────────────────────────

    private string SaveMemory(EntityEnum entity, WorkEnum entityWork, EntityEnum toEntity, WorkEnum edgeWork, RelationEnum relation, string notes)
    {
        if (string.IsNullOrWhiteSpace(notes)) { return SerializerError("Notes must not be empty"); }

        long ts = new TickStampUnit().Ticks;
        AgentMemoryDto memory = new AgentMemoryDto
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

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private static string MemoryRoot() =>
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "EdgeGrammar", "agentmemory");

    private static string EntityDir(string entity) =>
        Path.Combine(MemoryRoot(), entity);

    private static string SerializerError(string message) =>
        JsonSerializer.Serialize(new { error = message });

    private static string GetEntityValues() => String.Join(", ", Enum.GetNames<EntityEnum>());
    private static string GetWorkValues() => String.Join(", ", Enum.GetNames<WorkEnum>());
    private static string GetRelationValues() => String.Join(", ", Enum.GetNames<RelationEnum>());

    // ── Firestore ─────────────────────────────────────────────────────────────

    public static string firestoreProjectId = "edgegrammar";
    public FirestoreDb firestoreMemoryDb { get; private set; }
}
