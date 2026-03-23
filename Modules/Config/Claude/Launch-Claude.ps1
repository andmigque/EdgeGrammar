$systemPromptFile   = Join-Path $PSScriptRoot "..\SYSTEM.md"
$claudeHome         = Join-Path $HOME '.claude'
$dynamicPromptFile  = Join-Path $claudeHome 'DYNAMIC_CLAUDE.md'

Get-MemoryContext -Entities @('Claude') -Count 5 *> $dynamicPromptFile

claude --tools "WebFetch,WebSearch,TaskGet,TaskCreate,TaskUpdate,Task,TaskOutput,TaskList,ListMcpResourcesTool,ReadMcpResourcesTool" --system-prompt-file $systemPromptFile --append-system-prompt $dynamicPromptFile