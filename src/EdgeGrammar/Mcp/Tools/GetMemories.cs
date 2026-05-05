using System.ComponentModel;

using EdgeGrammar.Modules.Dto;

using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
    /// ### GetMemories
    ///
    /// > Gets memories for a given entity, bounded by a maximum record count.
    ///
    /// ```csharp
    /// public string GetMemories(string entity, int count)
    /// ```
    ///
    /// - **Parameters**
    ///   - `string` **entity** - An `EntityEnum` string value (case-insensitive).
    ///   - `int` **count** - The maximum number of memory records to return.
    /// - **Returns**
    ///   - `string` - A serialized JSON memories array.
    ///
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
            ? SerializerError($"Valid Entity values: {GetEntityValues()}")
            : count <= 0 ? SerializerError("Count must be greater than 0") : this.GetMemoriesInternal(e, count);
}
