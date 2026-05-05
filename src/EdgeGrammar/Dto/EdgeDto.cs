/// # EdgeDto
///
/// > Represents a relational link between two entities within a specific work domain.
///
/// - Captures the "Edge" in the EdgeGrammar graph model.
/// - Used to define how entities interact or depend on each other.
///
/// ## Properties
///
/// - `string` **Id** - The unique identifier for the edge record.
/// - `long` **TickStamp** - The high-resolution timestamp when the edge was created or modified.
/// - `EntityEnum` **FromEntity** - The source entity of the relationship.
/// - `EntityEnum` **ToEntity** - The target entity of the relationship.
/// - `RelationEnum` **Relation** - The typed relationship (e.g., `Depends`, `Creates`).
/// - `WorkEnum` **Work** - The work domain context for this edge.
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
/// public record EdgeDto
/// ```
namespace EdgeGrammar.Modules.Dto;

public record EdgeDto
{
    public string Id { get; init; }
    public long TickStamp { get; init; }
    public EntityEnum FromEntity { get; init; }
    public EntityEnum ToEntity { get; init; }
    public RelationEnum Relation { get; init; }
    public WorkEnum Work { get; init; }
}

