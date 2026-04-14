$systemPromptFile   = Join-Path $PSScriptRoot "..\SYSTEM.md"
$contextOutput = Get-MemoryContext -Entities @('Claude','Architect','Gemini','Agent') -Count 3

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


claude --tools "CronCreate, CronDelete, CronList, EnterPlanMode, ExitPlanMode, Agent, Monitor, Skill, TaskCreate, TaskGet, TaskList, TaskOutput, TaskOutput, WebFetch, WebSearch " --system-prompt-file "$($HOME)\.claude\DYNAMIC_SYSTEM_PROMPT.md"