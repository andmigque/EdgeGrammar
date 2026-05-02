$systemPromptFile   = Join-Path -Path "$PSScriptRoot" -ChildPath "..\SYSTEM.md"
$edgeGrammarModule = Join-Path -Path "$PSScriptRoot" -ChildPath "..\..\..\EdgeGrammar.psm1"
Import-Module $edgeGrammarModule
$contextOutput = Get-MemoryContext -Entities @('Claude','Architect') -Count 10

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

Remove-Module EdgeGrammar -Force
claude --tools "CronCreate, CronDelete, CronList, EnterPlanMode, ExitPlanMode, Agent, Monitor, Skill, TaskCreate, TaskGet, TaskList, TaskOutput, TaskOutput, WebFetch, WebSearch " --system-prompt-file "$($HOME)\.claude\DYNAMIC_SYSTEM_PROMPT.md"

