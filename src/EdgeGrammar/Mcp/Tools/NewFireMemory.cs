using System.ComponentModel;
using System.Text.Json;
using EdgeGrammar.Modules.Dto;
using EdgeGrammar.Modules.Storage;
using EdgeGrammar.Modules.Unit;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using ModelContextProtocol.Server;

namespace EdgeGrammar.Modules.Mcp;

public partial class EdgeGrammarMcp
{
    /// ### NewFireMemory
    ///
    /// > Creates a memory with a typed entity, work domain, target entity, relation, and notes. Persists to Firestore.
    ///
    /// ```csharp
    /// public string NewFireMemory(string entity, string work, string toEntity, string relation, string notes)
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
        ### new_fire_memory

        > Creates a memory with a typed entity, work domain, target entity, relation, and notes. Persists to Firestore.

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
