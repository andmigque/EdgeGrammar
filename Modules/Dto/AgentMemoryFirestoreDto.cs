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

