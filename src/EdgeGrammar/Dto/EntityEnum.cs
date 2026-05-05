
/// # EntityEnum
///
/// > Defines the valid actors and systems within the EdgeGrammar ecosystem.
///
/// - Used to identify the author and target of memories and edges.
/// - Case-insensitive parsing is standard across the system.
///
/// ## Values
///
/// - **Architect**: The high-level system designer.
/// - **Gemini**: Google's LLM agent.
/// - **Claude**: Anthropic's LLM agent.
/// - **Grok**: xAI's LLM agent.
/// - **GPT**: OpenAI's LLM agent.
/// - **Human**: The end-user or human operator.
/// - **Self**: The current agent referring to itself.
/// - **System**: The underlying operating system or environment.
/// - **Agent**: A generic autonomous agent.
/// - **Codex**: The knowledge base or library system.
/// - **Qwen**: Alibaba's LLM agent.
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
/// public enum EntityEnum
/// ```
namespace EdgeGrammar.Modules.Dto;
public enum EntityEnum
{
    Architect,
    Gemini,
    Claude,
    Grok,
    GPT,
    Human,
    Self,
    System,
    Agent,
    Codex,
    Qwen
}

