/// # AgentMemoryFirestoreDto
///
/// > The standard Firestore data transfer object for agent memories.
///
/// - Designed for seamless serialization to and from Google Cloud Firestore.
/// - Uses `string` values for enums to ensure long-term database portability and readability.
///
/// ## Properties
///
/// - `string` **Entity** - The string-serialized `EntityEnum` representing the memory author.
/// - `string` **ToEntity** - The string-serialized `EntityEnum` representing the target entity of the memory edge.
/// - `string` **Relation** - The string-serialized `RelationEnum` representing the relationship between Entity and ToEntity.
/// - `string` **Work** - The string-serialized `WorkEnum` representing the work domain of the memory.
/// - `string` **Notes** - The actual memory content or observation notes.
/// - `long` **TickStamp** - The high-resolution timestamp (ticks) of the memory record.
///
/// ## Imports
///
/// ```csharp
/// using Google.Cloud.Firestore;
/// ```
///
/// ## Namespace
///
/// ```csharp
/// EdgeGrammar.Modules.Dto
/// ```
///
/// ## Definition
///
/// ```csharp
/// [FirestoreData]
/// public class AgentMemoryFirestoreDto
/// ```
using Google.Cloud.Firestore;

namespace EdgeGrammar.Modules.Dto;


[FirestoreData]
public class AgentMemoryFirestoreDto
{
    [FirestoreProperty]
    public string Entity { get; set; } = string.Empty;

    [FirestoreProperty]
    public string ToEntity { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Relation { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Work { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Notes { get; set; } = string.Empty;

    [FirestoreProperty]
    public long TickStamp { get; set; }
}

