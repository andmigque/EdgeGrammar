using EdgeGrammar.Modules.Unit;

namespace EdgeGrammar.Modules.Dto;

/// <summary>
/// A typed connection from one entity to another, scoped to a work domain.
/// </summary>

public record EdgeDto
{
    public string Id { get; init; }
    public long TickStamp { get; init; }
    public EntityEnum FromEntity { get; init; }
    public EntityEnum ToEntity { get; init; }
    public RelationEnum Relation { get; init; }
    public WorkEnum Work { get; init; }
}

