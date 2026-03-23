# Edge Grammar

A memory system grammar for collaboration with agentic AI that captures relationship dynamics and preferences over time.

## Build and Test

```powershell
# Full pipeline: install dependencies, compile, test, generate docs
Invoke-psake

# Individual tasks
Invoke-psake -taskList Install   # installs Pester, platyPS, PSScriptAnalyzer, Psake
Invoke-psake -taskList Compile   # dotnet restore + dotnet build -> bin/Debug/net9.0/EdgeGrammar.dll
Invoke-psake -taskList Test      # Invoke-Pester -Output Minimal
Invoke-psake -taskList Document  # platyPS -> Doc/
```

Run a single test file directly:

```powershell
Invoke-Pester .\Modules\AgentMemory\AgentMemory.Tests.ps1 -Output Detailed
```

---

## Architecture

EdgeGrammar is a two-layer system: a .NET class library that defines the type model, and a PowerShell module that exposes the API.

### Layer 1 — .NET class library (`net9.0`)

All types live under `Modules/Dto/` and `Modules/Unit/`:

| Type | Role |
|------|------|
| `AgentMemoryDto` | A single memory record: entity, work domain, notes, optional edge |
| `EdgeDto` | A typed relationship between two entities, scoped to a work domain |
| `EntityEnum` | Who authored or is referenced: `Claude`, `Architect`, `Gemini`, … |
| `WorkEnum` | What effort the memory belongs to: `AgentMemory`, `Security`, `GloriousFailure`, … |
| `RelationEnum` | Why two entities are linked: `Delivers`, `Fixes`, `Collaborates`, … |
| `TickStampUnit` | Tick-based timestamp utility; used for file naming and UTC conversion |

Compiled output: `bin/Debug/net9.0/EdgeGrammar.dll`

### Layer 2 — PowerShell module (`EdgeGrammar.psm1`)

The root module (`EdgeGrammar.psm1`) does three things on import:

1. Registers the `EdgeGrammar:` PSDrive → `~/EdgeGrammar/` (all storage goes here)
2. Sets `$Global:EdgeGrammarDll` to the DLL path
3. Loads the DLL once via `Add-Type`, then imports nested modules

**Nested modules** (declared in `EdgeGrammar.psd1 > NestedModules`):

| Module | File | Purpose |
|--------|------|---------|
| AgentMemory | `Modules/AgentMemory/AgentMemory.psm1` | Read/write JSONL memory records |
| Config | `Modules/Config/Config.psm1` | Restore agent config on a new machine |

### Storage layout under `EdgeGrammar:`

```
~/EdgeGrammar/
  agentmemory/
    Claude/         # one JSONL file per memory record
    Architect/
    ...
  tool/             # one JSON file per PostToolUse hook invocation
```

Files are named `<ticks>.jsonl` or `<ticks>_<toolname>.json`; tick-based names sort by write time for free.

---

## Module Conventions

Every exported function must follow these patterns exactly — no exceptions.

### `Out-Error` helper (private, one per module)

```powershell
function Out-Error {
    [CmdletBinding()]
    param([string]$CallerName)
    throw "$CallerName -> Could not Add-Type. Please Import-Module EdgeGrammar.psm1 and try again"
}
```

### `Add-Type` guard (first statement in every exported function)

```powershell
try {
    Add-Type -Path $Global:EdgeGrammarDll
}
catch {
    Out-Error -CallerName $MyInvocation.MyCommand.Name
}
```

Never write the catch body inline. Never skip the guard. Never call `Add-Type` without it.

### Block formatting

Every `try`, `catch`, `if`, `foreach`, `while` — all block constructs — must use multi-line braces. No single-line blocks.

### Path rules

```powershell
# One segment per Join-Path argument
Join-Path $PSScriptRoot $Entity.ToString() 'agent-config.json'

# Walk up with Split-Path -Parent, not ..
$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

# Plain string from path: Convert-Path, not Resolve-Path | Select-Object
Convert-Path $somePath
```

---

## Config and New Machine Restore

`Modules/Config/Claude/agent-config.json` is the canonical desired state for the Claude agent.

To restore a new machine:

```powershell
Import-Module .\EdgeGrammar.psm1
Sync-AgentConfig -Entity Claude
```

This copies `Modules/Config/Hooks/*.ps1` to `~/.claude/`, merges permissions into `~/.claude/settings.json`, resolves the `{ClaudeHome}` token in hook commands, enables plugins, and creates the `EdgeGrammar:\agentmemory\Claude` directory.

**Still pending:** `Sync-AgentConfig` does not yet restore the `desktopcommander` MCP server entry into `~/.claude.json`.

---

## Invariants

- **Append-only** — never modify or delete persisted JSONL records
- **C# DTOs at boundaries** — never use hashtables where a typed DTO is expected
- **PSDrive required** — all storage paths go through `EdgeGrammar:`, not raw filesystem paths
- **`Import-Module` is forbidden inside this project** — the root module handles all loading
- **The DLL must be compiled before the module can be imported** — run `Invoke-psake Compile` first
