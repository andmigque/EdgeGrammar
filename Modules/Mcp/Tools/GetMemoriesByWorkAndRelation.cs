using System.ComponentModel;
using EdgeGrammar.Modules.Dto;
using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
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
            ? SerializerError($"Valid Entity values: {GetEntityValues()}")
            : count <= 0
            ? SerializerError("Count must be greater than 0")
            : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out WorkEnum w)
            ? SerializerError($"Valid Work values: {GetWorkValues()}")
            : !Enum.TryParse<RelationEnum>(relation, ignoreCase: true, out RelationEnum r)
            ? SerializerError($"Valid Relation values: {GetRelationValues()}")
            : this.GetMemoriesInternal(e, count, w, r);
}
