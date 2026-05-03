using System.ComponentModel;
using EdgeGrammar.Modules.Dto;
using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
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
            ? SerializerError($"Valid Entity values: {GetEntityValues()}")
            : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var w)
            ? SerializerError($"Valid Work values: {GetWorkValues()}")
            : !Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var te)
            ? SerializerError($"Valid ToEntity values: {GetEntityValues()}")
            : !Enum.TryParse<WorkEnum>(toEntityWork, ignoreCase: true, out var tew)
            ? SerializerError($"Valid ToEntityWork values: {GetWorkValues()}")
            : !Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out var r)
            ? SerializerError($"Valid Relation values: {GetRelationValues()}")
            : this.SaveMemory(e, w, te, tew, r, notes);
}
