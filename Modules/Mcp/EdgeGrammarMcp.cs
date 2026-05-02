using System.ComponentModel;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

using EdgeGrammar.Modules.Dto;
using EdgeGrammar.Modules.Storage;
using EdgeGrammar.Modules.Unit;

using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;

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
        ### get_memories

        > Gets memories for a given entity, bounded by a maximum record count.

        - **Parameters**
            - `string` **entity** - An `EntityEnum` string value (case-insensitive).
            - `int` **count** - The maximum number of memory records to return.
        - **Returns**
            - `json` - A serialized JSON memories array.
        - **Throws**
            - Valid entity values:
                - Architect
                - Gemini
                - Claude
                - Grok
                - GPT
                - Human
                - Self
                - System
                - Agent
                - Codex
                - Qwen
            - count must be greater than 0.
    """)]
    public string GetMemories(string entity, int count) => !Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out EntityEnum e)
            ? SE($"Valid Entity values: {GEEV()}")
            : count <= 0 ? SE("Count must be greater than 0") : this.GetMemoriesInternal(e, count);



    [McpServerTool]
    [Description("""
        ### get_memories_by_work

        > Gets memories for a given entity and work domain, bounded by a maximum record count.

        - **Parameters**
            - `string` **entity** - An `EntityEnum` string value (case-insensitive).
            - `int` **count** - The maximum number of memory records to inspect.
            - `string` **work** - A `WorkEnum` string value (case-insensitive).
        - **Returns**
            - `json` - A serialized JSON memories array filtered by work.
        - **Throws**
            - Valid entity values:
                - Architect
                - Gemini
                - Claude
                - Grok
                - GPT
                - Human
                - Self
                - System
                - Agent
                - Codex
                - Qwen
            - count must be greater than 0.
            - Valid work values:
                - PowerNixxServer
                - SystemPrompt
                - Npm
                - Pester
                - Devops
                - Infrastructure
                - DataPlane
                - ModelContextProtocol
                - Security
                - Reactor
                - MarkdownChat
                - AgentMemory
                - Research
                - Plan
                - Fragment
                - Frontend
                - Troubleshoot
                - GloriousFailure
                - CMMC
                - SharpeX
                - CMMCPower
                - CMMCPowerLearn
                - EdgeGrammar
                - Approval
                - Collab
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
        ### get_memories_by_relation

        > Gets memories for a given entity and relation, bounded by a maximum record count.

        - **Parameters**
            - `string` **entity** - An `EntityEnum` string value (case-insensitive).
            - `int` **count** - The maximum number of memory records to inspect.
            - `string` **relation** - A `RelationEnum` string value (case-insensitive).
        - **Returns**
            - `json` - A serialized JSON memories array filtered by relation.
        - **Throws**
            - Valid entity values:
                - Architect
                - Gemini
                - Claude
                - Grok
                - GPT
                - Human
                - Self
                - System
                - Agent
                - Codex
                - Qwen
            - count must be greater than 0.
            - Valid relation values:
                - Depends
                - Creates
                - Tests
                - Refactors
                - Throws
                - Runs
                - Guides
                - Learns
                - Configures
                - Interrupts
                - Thinks
                - Delivers
                - Reviews
                - Documents
                - Implements
                - Fixes
                - Observes
                - Analyzes
                - Designs
                - Encourages
                - Requests
                - Reports
                - Credits
                - Evolves
                - Understands
                - Thanks
                - Accepts
                - Imagines
                - Decodes
                - Collaborates
                - Questions
                - Plans
                - Grows
                - Transcends
                - Reflects
                - Realizes
                - Integrates
                - Delegates
                - Proposes
                - Researches
                - Retrospects
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
        ### get_memories_by_work_and_relation

        > Gets memories for a given entity, work domain, and relation, bounded by a maximum record count.

        - **Parameters**
            - `string` **entity** - An `EntityEnum` string value (case-insensitive).
            - `int` **count** - The maximum number of memory records to inspect.
            - `string` **work** - A `WorkEnum` string value (case-insensitive).
            - `string` **relation** - A `RelationEnum` string value (case-insensitive).
        - **Returns**
            - `json` - A serialized JSON memories array.
        - **Throws**
            - Valid entity values:
                - Architect
                - Gemini
                - Claude
                - Grok
                - GPT
                - Human
                - Self
                - System
                - Agent
                - Codex
                - Qwen
            - count must be greater than 0.
            - Valid work values:
                - PowerNixxServer
                - SystemPrompt
                - Npm
                - Pester
                - Devops
                - Infrastructure
                - DataPlane
                - ModelContextProtocol
                - Security
                - Reactor
                - MarkdownChat
                - AgentMemory
                - Research
                - Plan
                - Fragment
                - Frontend
                - Troubleshoot
                - GloriousFailure
                - CMMC
                - SharpeX
                - CMMCPower
                - CMMCPowerLearn
                - EdgeGrammar
                - Approval
                - Collab
            - Valid relation values:
                - Depends
                - Creates
                - Tests
                - Refactors
                - Throws
                - Runs
                - Guides
                - Learns
                - Configures
                - Interrupts
                - Thinks
                - Delivers
                - Reviews
                - Documents
                - Implements
                - Fixes
                - Observes
                - Analyzes
                - Designs
                - Encourages
                - Requests
                - Reports
                - Credits
                - Evolves
                - Understands
                - Thanks
                - Accepts
                - Imagines
                - Decodes
                - Collaborates
                - Questions
                - Plans
                - Grows
                - Transcends
                - Reflects
                - Realizes
                - Integrates
                - Delegates
                - Proposes
                - Researches
                - Retrospects
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
        ### new_memory

        > Creates a memory with a typed entity, work domain, target entity, relation, and notes.

        - **Parameters**
            - `string` **entity** - An `EntityEnum` string value for the memory author (case-insensitive).
            - `string` **work** - A `WorkEnum` string value for the memory and edge work domain (case-insensitive).
            - `string` **toEntity** - An `EntityEnum` string value for the edge target (case-insensitive).
            - `string` **relation** - A `RelationEnum` string value for the edge relation (case-insensitive).
            - `string` **notes** - The memory notes to persist.
        - **Returns**
            - `json|string` - The created memory file name, or a serialized JSON error object.
        - **Throws**
            - Valid entity and toEntity values:
                - Architect
                - Gemini
                - Claude
                - Grok
                - GPT
                - Human
                - Self
                - System
                - Agent
                - Codex
                - Qwen
            - Valid work values:
                - PowerNixxServer
                - SystemPrompt
                - Npm
                - Pester
                - Devops
                - Infrastructure
                - DataPlane
                - ModelContextProtocol
                - Security
                - Reactor
                - MarkdownChat
                - AgentMemory
                - Research
                - Plan
                - Fragment
                - Frontend
                - Troubleshoot
                - GloriousFailure
                - CMMC
                - SharpeX
                - CMMCPower
                - CMMCPowerLearn
                - EdgeGrammar
                - Approval
                - Collab
            - Valid relation values:
                - Depends
                - Creates
                - Tests
                - Refactors
                - Throws
                - Runs
                - Guides
                - Learns
                - Configures
                - Interrupts
                - Thinks
                - Delivers
                - Reviews
                - Documents
                - Implements
                - Fixes
                - Observes
                - Analyzes
                - Designs
                - Encourages
                - Requests
                - Reports
                - Credits
                - Evolves
                - Understands
                - Thanks
                - Accepts
                - Imagines
                - Decodes
                - Collaborates
                - Questions
                - Plans
                - Grows
                - Transcends
                - Reflects
                - Realizes
                - Integrates
                - Delegates
                - Proposes
                - Researches
                - Retrospects
            - notes must not be empty.
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
        ### new_memory_with_to_entity_work

        > Creates a memory with separate work domains for the author entity and target entity edge.

        - **Parameters**
            - `string` **entity** - An `EntityEnum` string value for the memory author (case-insensitive).
            - `string` **work** - A `WorkEnum` string value for the author's memory work domain (case-insensitive).
            - `string` **toEntity** - An `EntityEnum` string value for the edge target (case-insensitive).
            - `string` **toEntityWork** - A `WorkEnum` string value for the target edge work domain (case-insensitive).
            - `string` **relation** - A `RelationEnum` string value for the edge relation (case-insensitive).
            - `string` **notes** - The memory notes to persist.
        - **Returns**
            - `json|string` - The created memory file name, or a serialized JSON error object.
        - **Throws**
            - Valid entity and toEntity values:
                - Architect
                - Gemini
                - Claude
                - Grok
                - GPT
                - Human
                - Self
                - System
                - Agent
                - Codex
                - Qwen
            - Valid work and toEntityWork values:
                - PowerNixxServer
                - SystemPrompt
                - Npm
                - Pester
                - Devops
                - Infrastructure
                - DataPlane
                - ModelContextProtocol
                - Security
                - Reactor
                - MarkdownChat
                - AgentMemory
                - Research
                - Plan
                - Fragment
                - Frontend
                - Troubleshoot
                - GloriousFailure
                - CMMC
                - SharpeX
                - CMMCPower
                - CMMCPowerLearn
                - EdgeGrammar
                - Approval
                - Collab
            - Valid relation values:
                - Depends
                - Creates
                - Tests
                - Refactors
                - Throws
                - Runs
                - Guides
                - Learns
                - Configures
                - Interrupts
                - Thinks
                - Delivers
                - Reviews
                - Documents
                - Implements
                - Fixes
                - Observes
                - Analyzes
                - Designs
                - Encourages
                - Requests
                - Reports
                - Credits
                - Evolves
                - Understands
                - Thanks
                - Accepts
                - Imagines
                - Decodes
                - Collaborates
                - Questions
                - Plans
                - Grows
                - Transcends
                - Reflects
                - Realizes
                - Integrates
                - Delegates
                - Proposes
                - Researches
                - Retrospects
            - notes must not be empty.
    """)]
    public string NewMemoryWithToEntityWork(string entity, string work, string toEntity, string toEntityWork, string relation, string notes) => !Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out var e)
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

    // ── NewCollab ─────────────────────────────────────────────────────────────

    //[McpServerTool]
    //[Description("""
    //    ### new_collab

    //    > Creates a collaboration memory between two typed entities and work domains.

    //    - **Parameters**
    //        - `string` **entity** - An `EntityEnum` string value for the memory author (case-insensitive).
    //        - `string` **work** - A `WorkEnum` string value for the author's memory work domain (case-insensitive).
    //        - `string` **toEntity** - An `EntityEnum` string value for the collaboration target (case-insensitive).
    //        - `string` **toEntityWork** - A `WorkEnum` string value for the target edge work domain (case-insensitive).
    //        - `string` **notes** - The collaboration notes to persist.
    //    - **Returns**
    //        - `json|string` - The created memory file name, or a serialized JSON error object.
    //    - **Throws**
    //        - Valid entity and toEntity values:
    //            - Architect
    //            - Gemini
    //            - Claude
    //            - Grok
    //            - GPT
    //            - Human
    //            - Self
    //            - System
    //            - Agent
    //            - Codex
    //            - Qwen
    //        - Valid work and toEntityWork values:
    //            - PowerNixxServer
    //            - SystemPrompt
    //            - Npm
    //            - Pester
    //            - Devops
    //            - Infrastructure
    //            - DataPlane
    //            - ModelContextProtocol
    //            - Security
    //            - Reactor
    //            - MarkdownChat
    //            - AgentMemory
    //            - Research
    //            - Plan
    //            - Fragment
    //            - Frontend
    //            - Troubleshoot
    //            - GloriousFailure
    //            - CMMC
    //            - SharpeX
    //            - CMMCPower
    //            - CMMCPowerLearn
    //            - EdgeGrammar
    //            - Approval
    //            - Collab
    //        - notes must not be empty.
    //""")]
    //public string NewCollab(string entity, string work, string toEntity, string toEntityWork, string notes) => !Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out var e)
    //        ? SE($"Valid Entity values: {GEEV()}")
    //        : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var w)
    //        ? SE($"Valid Work values: {GWEV()}")
    //        : !Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var te)
    //        ? SE($"Valid ToEntity values: {GEEV()}")
    //        : !Enum.TryParse<WorkEnum>(toEntityWork, ignoreCase: true, out var tew)
    //        ? SE($"Valid ToEntityWork values: {GWEV()}")
    //        : this.SaveMemory(e, w, te, tew, RelationEnum.Collaborates, notes);

    // ── GetCollabs ────────────────────────────────────────────────────────────

    //[McpServerTool]
    //[Description("""
    //    ### get_collabs

    //    > Gets collaboration memories across the memory store, bounded by a maximum record count.

    //    - **Parameters**
    //        - `int` **count** - The maximum number of collaboration memory records to return.
    //    - **Returns**
    //        - `json` - A serialized JSON memories array where the edge relation is `Collaborates`.
    //    - **Throws**
    //        - count must be greater than 0.
    //        - memory root must exist.
    //""")]
    //public string GetCollabs(int count) => count <= 0 ? SE("Count must be greater than 0") : this.GetCollabsInternal(count);

    //[McpServerTool]
    //[Description("""
    //    ### get_collabs_by_work

    //    > Gets collaboration memories after validating a work domain, bounded by a maximum record count.

    //    - **Parameters**
    //        - `int` **count** - The maximum number of collaboration memory records to return.
    //        - `string` **work** - A `WorkEnum` string value (case-insensitive).
    //    - **Returns**
    //        - `json` - A serialized JSON memories array where the edge relation is `Collaborates`.
    //    - **Throws**
    //        - count must be greater than 0.
    //        - Valid work values:
    //            - PowerNixxServer
    //            - SystemPrompt
    //            - Npm
    //            - Pester
    //            - Devops
    //            - Infrastructure
    //            - DataPlane
    //            - ModelContextProtocol
    //            - Security
    //            - Reactor
    //            - MarkdownChat
    //            - AgentMemory
    //            - Research
    //            - Plan
    //            - Fragment
    //            - Frontend
    //            - Troubleshoot
    //            - GloriousFailure
    //            - CMMC
    //            - SharpeX
    //            - CMMCPower
    //            - CMMCPowerLearn
    //            - EdgeGrammar
    //            - Approval
    //            - Collab
    //        - memory root must exist.
    //""")]
    //public string GetCollabsByWork(int count, string work) => count <= 0
    //        ? SE("Count must be greater than 0")
    //        : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w) ? SE($"Valid Work values: {GWEV()}") : this.GetCollabsInternal(count);

    public string GetMemoriesInternal(EntityEnum entity, int count)
    {
        List<AgentMemoryDto> memories = new List<AgentMemoryDto>();

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
            string jsonContent = File.ReadAllText(file.FullName, Encoding.UTF8);
            AgentMemoryDto memory = JsonSerializer.Deserialize<AgentMemoryDto>(jsonContent, JsonOpts);

            if (memory != null && memory.Work.ToString() == work.ToString() && memory.Edge.Relation.ToString() == r.ToString())
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

        var dir = this.EntityDir(entity.ToString());
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

    public static string firestoreProjectId = "edgegrammar";

    public FirestoreDb firestoreMemoryDb { get; private set; }

    [McpServerTool]
    [Description("""
        ### new_memory

        > Creates a memory with a typed entity, work domain, target entity, relation, and notes.

        - **Parameters**
            - `string` **entity** - An `EntityEnum` string value for the memory author (case-insensitive).
            - `string` **work** - A `WorkEnum` string value for the memory and edge work domain (case-insensitive).
            - `string` **toEntity** - An `EntityEnum` string value for the edge target (case-insensitive).
            - `string` **relation** - A `RelationEnum` string value for the edge relation (case-insensitive).
            - `string` **notes** - The memory notes to persist.
        - **Returns**
            - `json|string` - The created memory file name, or a serialized JSON error object.
        - **Throws**
            - Valid entity and toEntity values:
                - Architect
                - Gemini
                - Claude
                - Grok
                - GPT
                - Human
                - Self
                - System
                - Agent
                - Codex
                - Qwen
            - Valid work values:
                - PowerNixxServer
                - SystemPrompt
                - Npm
                - Pester
                - Devops
                - Infrastructure
                - DataPlane
                - ModelContextProtocol
                - Security
                - Reactor
                - MarkdownChat
                - AgentMemory
                - Research
                - Plan
                - Fragment
                - Frontend
                - Troubleshoot
                - GloriousFailure
                - CMMC
                - SharpeX
                - CMMCPower
                - CMMCPowerLearn
                - EdgeGrammar
                - Approval
                - Collab
            - Valid relation values:
                - Depends
                - Creates
                - Tests
                - Refactors
                - Throws
                - Runs
                - Guides
                - Learns
                - Configures
                - Interrupts
                - Thinks
                - Delivers
                - Reviews
                - Documents
                - Implements
                - Fixes
                - Observes
                - Analyzes
                - Designs
                - Encourages
                - Requests
                - Reports
                - Credits
                - Evolves
                - Understands
                - Thanks
                - Accepts
                - Imagines
                - Decodes
                - Collaborates
                - Questions
                - Plans
                - Grows
                - Transcends
                - Reflects
                - Realizes
                - Integrates
                - Delegates
                - Proposes
                - Researches
                - Retrospects
            - notes must not be empty.
    """)]
    public string NewFireMemory(string entity, string work, string toEntity, string relation, string notes)
    {
        GoogleCredential credential = FirestoreClient.GetCredential();
        Task<FirestoreDb> firestoreDb = FirestoreClient.GetFirestoreDb(firestoreProjectId, credential);

        this.firestoreMemoryDb = firestoreDb.Result;

        Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out EntityEnum e);
        Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out RelationEnum r);
        Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w);
        Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out EntityEnum to);

        if (String.IsNullOrEmpty(notes))
        {
            throw new ArgumentException("Notes can not be null or empty");
        }

        AgentMemoryFirestoreDto firestoreMemoryDto = new AgentMemoryFirestoreDto
        {
            TickStamp = new TickStampUnit().Ticks,
            Entity = e.ToString(),
            ToEntity = to.ToString(),
            Relation = r.ToString(),
            Work = w.ToString(),
            Notes = notes
        };

        CollectionReference collection = this.firestoreMemoryDb.Collection(entity);
        DocumentReference document = collection.AddAsync(firestoreMemoryDto).Result;

        var successResponse = new { Record = document.ToString() };

        return JsonSerializer.Serialize(successResponse);
    }
}
