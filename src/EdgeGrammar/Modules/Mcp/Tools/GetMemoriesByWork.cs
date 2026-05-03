using System.ComponentModel;
using EdgeGrammar.Modules.Dto;
using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
    /// ### GetMemoriesByWork
    ///
    /// > Gets memories for a given entity and work domain, bounded by a maximum record count.
    ///
    /// ```csharp
    /// public string GetMemoriesByWork(string entity, int count, string work)
    /// ```
    ///
    /// - **Parameters**
    ///   - `string` **entity** - An `EntityEnum` string value (case-insensitive).
    ///   - `int` **count** - The maximum number of memory records to inspect.
    ///   - `string` **work** - A `WorkEnum` string value (case-insensitive).
    /// - **Returns**
    ///   - `string` - A serialized JSON memories array filtered by work.
    ///
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
            ? SerializerError($"Valid Entity values: {GetEntityValues()}")
            : count <= 0
            ? SerializerError("Count must be greater than 0")
            : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w)
            ? SerializerError($"Valid Work values: {GetWorkValues()}")
            : this.GetMemoriesInternal(e, count, w);
}
