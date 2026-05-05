
/// # WorkEnum
///
/// > Defines bounded work domains used across memories, links, and observations.
///
/// - Acts as the "context" or "topic" for any edge or memory.
/// - Used to filter and aggregate information within specific technical or functional areas.
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
/// public enum WorkEnum
/// ```
namespace EdgeGrammar.Modules.Dto;

public enum WorkEnum
{
    PowerNixxServer,
    SystemPrompt,
    Npm,
    Pester,
    Devops,
    Infrastructure,
    DataPlane,
    ModelContextProtocol,
    Security,
    Reactor,
    MarkdownChat,
    AgentMemory,
    Research,
    Plan,
    Fragment,
    Frontend,
    Troubleshoot,
    GloriousFailure,
    CMMC,
    SharpeX,
    CMMCPower,
    CMMCPowerLearn,
    EdgeGrammar,
    Approval,
    Collab
}

