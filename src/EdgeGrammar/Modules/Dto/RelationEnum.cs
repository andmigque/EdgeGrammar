
/// # RelationEnum
///
/// > Defines the typed relationships between two entities for a specific work domain.
///
/// - Provides the semantic verbs that connect the actors (entities).
/// - Essential for graph-based memory analysis and reasoning.
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
/// public enum RelationEnum
/// ```
namespace EdgeGrammar.Modules.Dto;

public enum RelationEnum
{
    Depends,
    Creates,
    Tests,
    Refactors,
    Throws,
    Runs,
    Guides,
    Learns,
    Configures,
    Interrupts,
    Thinks,
    Delivers,
    Reviews,
    Documents,
    Implements,
    Fixes,
    Observes,
    Analyzes,
    Designs,
    Encourages,
    Requests,
    Reports,
    Credits,
    Evolves,
    Understands,
    Thanks,
    Accepts,
    Imagines,
    Decodes,
    Collaborates,
    Questions,
    Plans,
    Grows,
    Transcends,
    Reflects,
    Realizes,
    Integrates,
    Delegates,
    Proposes,
    Researches,
    Retrospects
}
