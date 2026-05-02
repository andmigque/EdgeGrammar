namespace EdgeGrammar.Modules.Dto;

/// # EdgeGrammarConfigDto
///
/// > The EdgeGrammar configuration record. Stores the six root anchors from which all runtime paths are derived.
///
/// - Single source of truth for machine-specific configuration.
/// - All derived paths are computed by `EdgeGrammarConfig` — never stored here.
/// - `AccountJsonPath` is intentionally absent — it is a secret, resolved via `EDGE_GRAMMAR_ACCOUNT_JSON`.
public record EdgeConfigDto
{
    public required string EdgeGrammarHome { get; init; }
    public required string UserHome { get; init; }
    public required string BuildEnvironment { get; init; }
    public required string BuildArchitecture { get; init; }
    public required string FirestoreProjectId { get; init; }
    public required string GoogleApiUrl { get; init; }
}
