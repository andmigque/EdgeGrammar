$systemPromptFile   = Join-Path $PSScriptRoot "..\SYSTEM.md"
$contextOutput = Get-MemoryContext -Entities @('Claude') -Count 15

$dynamicSystemPrompt = @"
---
System Prompt
---

$(Get-Content -Path $systemPromptFile -Raw | Out-String)

---
Dynamic Context
---

$contextOutput

---
"@

Set-Content -Path "$($HOME)\.claude\DYNAMIC_SYSTEM_PROMPT.md" -Value $dynamicSystemPrompt -Force


claude --tools "WebFetch,WebSearch,TaskGet,TaskCreate,TaskUpdate,Task,TaskOutput,TaskList,ListMcpResourcesTool,ReadMcpResourcesTool" --system-prompt-file "$($HOME)\.claude\DYNAMIC_SYSTEM_PROMPT.md"