using EdgeGrammar.Modules.Dto;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
    // ── NewCollab ─────────────────────────────────────────────────────────────
    // Not yet active. Relation is hardcoded to Collaborates — no relation param.

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
    //        ? SerializerError($"Valid Entity values: {GetEntityEnumValues()}")
    //        : !Enum.TryParse<WorkEnum>(work, ignoreCase: true, out var w)
    //        ? SerializerError($"Valid Work values: {GetWorkEnumValues()}")
    //        : !Enum.TryParse<EntityEnum>(toEntity, ignoreCase: true, out var te)
    //        ? SerializerError($"Valid ToEntity values: {GetEntityEnumValues()}")
    //        : !Enum.TryParse<WorkEnum>(toEntityWork, ignoreCase: true, out var tew)
    //        ? SerializerError($"Valid ToEntityWork values: {GetWorkEnumValues()}")
    //        : this.SaveMemory(e, w, te, tew, RelationEnum.Collaborates, notes);
}
