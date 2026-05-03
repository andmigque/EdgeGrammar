using System.ComponentModel;
using EdgeGrammar.Modules.Dto;
using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
    /// ### GetMemoriesByRelation
    ///
    /// > Gets memories for a given entity and relation, bounded by a maximum record count.
    ///
    /// ```csharp
    /// public string GetMemoriesByRelation(string entity, int count, string relation)
    /// ```
    ///
    /// - **Parameters**
    ///   - `string` **entity** - An `EntityEnum` string value (case-insensitive).
    ///   - `int` **count** - The maximum number of memory records to inspect.
    ///   - `string` **relation** - A `RelationEnum` string value (case-insensitive).
    /// - **Returns**
    ///   - `string` - A serialized JSON memories array filtered by relation.
    ///
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
        if (!Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out EntityEnum e)) { return SerializerError($"Valid Entity values: {GetEntityValues()}"); }
        if (count <= 0) { return SerializerError("Count must be greater than 0"); }
        if (!Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out RelationEnum r)) { return SerializerError($"Valid Relation values: {GetRelationValues()}"); }
        return this.GetMemoriesInternal(e, count, r);
    }
}
