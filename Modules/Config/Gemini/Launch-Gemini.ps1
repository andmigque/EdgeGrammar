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

Set-Content -Path "$($HOME)\.gemini\DYNAMIC_SYSTEM_PROMPT.md" -Value $dynamicSystemPrompt -Force


claude --system-prompt-file "$($HOME)\.gemini\DYNAMIC_SYSTEM_PROMPT.md"