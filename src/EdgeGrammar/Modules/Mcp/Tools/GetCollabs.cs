using System.Text.Json;

using EdgeGrammar.Modules.Dto;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
    // ── GetCollabs ────────────────────────────────────────────────────────────
    // Not yet active. GetCollabsInternal scans all entity directories.

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
    //public string GetCollabs(int count) => count <= 0
    //        ? SerializerError("Count must be greater than 0")
    //        : this.GetCollabsInternal(count);

    //[McpServerTool]
    //[Description("""
    //    ### get_collabs_by_work

    //    > Gets collaboration memories filtered by work domain, bounded by a maximum record count.

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
    //        ? SerializerError("Count must be greater than 0")
    //        : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w)
    //        ? SerializerError($"Valid Work values: {GetWorkValues()}")
    //        : this.GetCollabsInternal(count, w);

    /// ### GetCollabsInternal
    ///
    /// > Internal scanner that aggregates collaboration memories across all entity directories.
    ///
    /// ```csharp
    /// private string GetCollabsInternal(int count)
    /// ```
    ///
    /// - **Parameters**
    ///   - `int` **count** - The maximum number of collaboration memory records to return.
    /// - **Returns**
    ///   - `string` - A serialized JSON memories array where the edge relation is `Collaborates`.
    ///
    private string GetCollabsInternal(int count)
    {
        if (!Directory.Exists(MemoryRoot())) { return SerializerError("Memory root not found"); }

        IEnumerable<AgentMemoryDto> all = Directory.GetDirectories(MemoryRoot())
            .SelectMany(dir => Directory.GetFiles(dir, "*.jsonl"))
            .Select(f => JsonSerializer.Deserialize<AgentMemoryDto>(File.ReadAllText(f), JsonOpts))
            .Where(m => m.Edge.Relation == RelationEnum.Collaborates);

        return JsonSerializer.Serialize(
            all.OrderByDescending(m => m.TickStamp).Take(count).ToList(), JsonOpts);
    }
}
