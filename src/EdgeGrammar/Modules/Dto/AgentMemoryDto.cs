
namespace EdgeGrammar.Modules.Dto;

/// <summary>
/// An expressed memory created by an entity for a given work domain.
/// </summary>

public record AgentMemoryDto
{
    public required string Id { get; init; }
    public required long TickStamp { get; init; }
    public required EntityEnum Entity { get; init; }
    public required WorkEnum Work { get; init; }

    public required string Notes { get; init; }
    public EdgeDto Edge { get; init; } = new();
}

