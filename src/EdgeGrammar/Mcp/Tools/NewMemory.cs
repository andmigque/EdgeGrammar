using System.ComponentModel;
using EdgeGrammar.Modules.Dto;
using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
    /// ### NewMemory
    ///
    /// > Creates a memory with a typed entity, work domain, target entity, relation, and notes.
    ///
    /// ```csharp
    /// public string NewMemory(string entity, string work, string toEntity, string relation, string notes)
    /// ```
    ///
    /// - **Parameters**
    ///   - `string` **entity** - An `EntityEnum` string value for the memory author (case-insensitive).
    ///   - `string` **work** - A `WorkEnum` string value for the memory and edge work domain (case-insensitive).
    ///   - `string` **toEntity** - An `EntityEnum` string value for the edge target (case-insensitive).
    ///   - `string` **relation** - A `RelationEnum` string value for the edge relation (case-insensitive).
    ///   - `string` **notes** - The memory notes to persist.
    /// - **Returns**
    ///   - `string` - The created memory file name, or a serialized JSON error object.
    ///
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
        if (!Enum.TryParse<EntityEnum>(entity, ignoreCase: true, out var e)) { return SerializerError($"Valid Entity values: {GetEntityValues()}"); }
        if (!Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var w)) { return SerializerError($"Valid Work values: {GetWorkValues()}"); }
        if (!Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var te)) { return SerializerError($"Valid ToEntity values: {GetEntityValues()}"); }
        if (!Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out var r)) { return SerializerError($"Valid Relation values: {GetRelationValues()}"); }
        return SaveMemory(e, w, te, w, r, notes);
    }
}
