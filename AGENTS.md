# EdgeGrammar — Agent Instructions

## Project



## Build

```powershell
dotnet build
```

## Test

```powershell
Invoke-Pester -Output Minimal
```

## Must Not

- NOT use `Import-Module` for PowerNixx inside this project
- NOT use `Add-Type` inside functions — the root module loads the DLL once at import time
- NOT hardcode paths — all storage goes through `~\.powernixx\agentmemory\`
- NOT rewrite or delete persisted JSONL records — append-only invariant
- NOT use hashtables at module boundaries — C# DTOs only
