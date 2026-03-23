# SYSTEM.md

## Session Start

On every session start, before doing anything else, run:

```powershell
Get-MemoryContext -Entities Claude, Architect -Count 20
```

Read the output. Use it to ground yourself in what has been built, what failed, and what is still in progress. Do not ask the user to catch you up — the memory is there for exactly this purpose.

---

## Core Rules

* When I ask you to **explore**, **plan**, or **analyze**, do **not** write code or create files unless I explicitly ask for implementation. Planning and implementation are separate steps.
* When editing existing code at scale (10 or more functions), make changes incrementally and validate after each batch. Never mass-edit all functions at once.
* When I reject an approach, do not try it again. Track rejected approaches in the conversation and move to a genuinely different solution.
* After migrating or writing any **public** function, always add it to `Export-ModuleMember`. A function that is not exported is not done.

Every module has **exactly one** `Export-ModuleMember` call — at the very bottom of the file. Never split exports across multiple calls. A function added between two existing `Export-ModuleMember` statements will be silently skipped.
* After any migration or refactor, run each affected function to verify it executes without error. No task is complete without a passing smoke test.
* Before running tests, first explore the repository for existing test files and patterns. Do not invent ad hoc “tests” by blindly invoking functions. Match the project’s established test framework and conventions.

## Security

* Never echo secrets, credentials, API keys, or connection strings to the terminal. Mask them or refer to them only by variable name.
* Never commit confidential or machine-specific information to the repository. This includes: usernames, home directory paths, hostnames, IP addresses, UUIDs, email addresses, or any value that identifies a specific person or machine. Use tokens (`{UserHome}`, `{ClaudeHome}`) that are resolved at runtime by the Config module.

## PowerShell Environment Rules

* The `AgentMemory` module is already imported in the shell. Never call `Import-Module`.
* Never use `pwsh -NoProfile`. The profile is what imports the modules.
* Always run PowerShell commands directly through Desktop Commander’s shell, not as a child `pwsh` process.

## Desktop Commander Shell Configuration

**MUST: Desktop Commander must use `pwsh.exe`, not `powershell.exe`.**

If a shell command fails with an error resembling:

```
cannot be loaded because running scripts is disabled on this system
```

This is **not** an execution policy problem. Desktop Commander has reset its `defaultShell` back to `powershell.exe`. The fix is one tool call:

```
mcp__desktopcommander__set_config_value  key=defaultShell  value=pwsh.exe
```

Run that, then retry the command. Do not attempt to fix execution policy. Do not investigate further. Just reconfigure the shell.

---

## Desktop Commander Availability

**MUST: If Desktop Commander MCP tools are not available, STOP immediately.**

Desktop Commander is the required shell and file system interface for this project. It is not optional and cannot be substituted.

When a Desktop Commander tool call fails with `No such tool available`:

1. **Stop all work.** Do not attempt the task without it.
2. **Do not launch agents** in an attempt to route around the missing tools. Agents have the same tool constraints — running them in circles wastes tokens and produces nothing.
3. **Do not improvise alternatives.** No `WebFetch` workarounds. No inline reimplementations. No "let me try a different approach."
4. **Tell the user clearly:** "Desktop Commander is not available. Stopping until the Architect restores it."
5. **Wait.** The user will reconnect it via `/mcp`.

This rule exists because the cost of spinning in circles is high and the fix is always simple: reconnect the MCP server.

---

## Canonical PowerShell Patterns

These patterns are established in `AgentMemory.psm1`. Every new module **must** follow them exactly.

### `Out-Error` helper

Every module defines a private `Out-Error` function. It is the only way to surface an `Add-Type` failure:

```powershell
function Out-Error {
    [CmdletBinding()]
    param([string]$CallerName)
    throw "$CallerName -> Could not Add-Type. Please Import-Module EdgeGrammar.psm1 and try again"
}
```

### `Add-Type` guard

Every exported function opens with this guard — no exceptions, no variations:

```powershell
try {
    Add-Type -Path $Global:EdgeGrammarDll
}
catch {
    Out-Error -CallerName $MyInvocation.MyCommand.Name
}
```

**Never** write an inline `throw` in the `catch` block. **Never** skip the guard. **Never** call `Add-Type` without it.

---

## Project Utilities

**MUST: Never bypass project utilities, abstractions, or infrastructure to work around a problem.**

If a PSDrive, helper function, or module abstraction is not available in the current context, the correct response is to initialize it — not replace it with a raw path or inline implementation. Bypassing the abstraction breaks the contract the project was designed around and creates silent divergence.

- If the `EdgeGrammar:` PSDrive is not registered, register it. Do not replace it with `$HOME\EdgeGrammar`.
- If a module function is not available, import the module. Do not reimplement the logic inline.
- If you cannot make the utility work in the current context, **stop and ask** — do not silently route around it.

---

## Path Manipulation Rules

Use the correct cmdlet for each job. Never work around them.

### `Join-Path` — always use one segment per argument

`Join-Path` accepts unlimited child segments via `AdditionalChildPath`. Never embed path separators inside an argument string.

```powershell
# Wrong — backslash embedded in string argument
Join-Path $PSScriptRoot "$($Entity.ToString())\agent-config.json"
Join-Path $HOME ".claude\settings.json"

# Correct — one segment per argument
Join-Path $PSScriptRoot $Entity.ToString() 'agent-config.json'
Join-Path $HOME '.claude' 'settings.json'
```

### `Split-Path -Parent` — walking up the directory tree

Use `Split-Path -Parent` to move up one level. Never use `..` tokens inside `Join-Path` to traverse upward.

```powershell
# Wrong — .. tokens inside Join-Path
Join-Path $PSScriptRoot "..\..") | Select-Object -ExpandProperty Path

# Correct — Split-Path -Parent applied twice
$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
```

### `Resolve-Path` vs `Convert-Path`

`Resolve-Path` returns a `PathInfo` object. If you need a plain string, use `Convert-Path` — not `Resolve-Path | Select-Object -ExpandProperty Path`.

```powershell
# Wrong
Resolve-Path $somePath | Select-Object -ExpandProperty Path

# Correct
Convert-Path $somePath
```

---

## Formatting Rules

* Never collapse multi-line `try { Add-Type ... } catch { ... }` blocks into a single line. Preserve the existing formatting exactly as written.
* Never write `try`, `catch`, `if`, `foreach`, `while`, or any other block construct on a single line.
* Every opening brace gets its own line.
* Every body gets its own line.
* Every closing brace gets its own line.

---

## Glorious Failure

Failures are more valuable than successes.
A failure produces a concrete requirement.
A success produces only confirmation.

When something fails:

1. Save it to Agent Memory immediately, before asking what to do next.
2. Derive the requirement directly from the failure.
3. Let that memory inform the next iteration.

This is the primary driver of innovation in PowerNixx. Treat it as a reflex, not a philosophy.

---

## Agent Memory PowerShell Tools

Agent Memory is how you think across time. Use it the way a human uses biological memory:
continuously, automatically, and before it becomes relevant.

The `AgentMemory` module is available through PowerShell.
It is already imported in your shell.
Run commands directly through Desktop Commander.
Use it before it becomes relevant, not after.

### `New-Memory` — record a memory with a relational edge

Creates one `AgentMemoryDto` (the observation) linked to one `EdgeDto` (the relationship).
Pass `-Save` to write it to disk immediately.

| Parameter   | Type           | Required | Description                                                 |
| ----------- | -------------- | -------- | ----------------------------------------------------------- |
| `-Save`     | `switch`       | Yes      | Auto-saves when present; returns the object when absent     |
| `-Entity`   | `EntityEnum`   | Yes      | Who is recording this memory (the author)                   |
| `-Work`     | `WorkEnum`     | Yes      | Which effort this memory belongs to                         |
| `-ToEntity` | `EntityEnum`   | Yes      | Who or what the author is connecting to                     |
| `-Relation` | `RelationEnum` | Yes      | Why the two entities are linked                             |
| `-Notes`    | `string[]`     | No       | Free-text rationale; use a here-string for multi-line notes |

```powershell
# Save immediately
New-Memory -Save -Entity Claude -Work AgentMemory -ToEntity Architect -Relation Collaborates -Notes @"
Completed migration from v1 to v2 directory structure.
"@
```

### `Get-MemoryByEntity` — retrieve recent memories for one entity

Returns the `N` most recent memory records written by `Entity`, sorted newest-first.
Deserializes each JSONL file back into a typed `AgentMemoryDto`.

| Parameter | Type         | Required | Default | Description                                     |
| --------- | ------------ | -------- | ------- | ----------------------------------------------- |
| `-Entity` | `EntityEnum` | Yes      | —       | Whose memories to load                          |
| `-Count`  | `int`        | No       | `10`    | How many recent entries to return (max `10000`) |

```powershell
# Last 10 Claude memories (default)
Get-MemoryByEntity -Entity Claude

# Last 50 Architect memories
Get-MemoryByEntity -Entity Architect -Count 50

# Pipeline form
[EdgeGrammar.Modules.Dto.EntityEnum]::Claude | Get-MemoryByEntity -Count 5
```

### `Get-MemoryContext` — build a formatted context block for one or more entities

Loads memories per entity and renders them as a human-readable Markdown string,
ready to paste into a prompt or save to a file for session handoff.

| Parameter       | Type           | Required | Default | Description                                |
| --------------- | -------------- | -------- | ------- | ------------------------------------------ |
| `-Entities`     | `EntityEnum[]` | No       | all     | Which entities to include; alias `-Entity` |
| `-Count` | `int`          | No       | `500`   | Max records per entity (max `10000`)       |
| `-OutFile`      | `string`       | No       | —       | Path to write the context string to disk   |

```powershell
# Context for all entities, printed to terminal
Get-MemoryContext

# Context for Claude only, last 20 records
Get-MemoryContext -Entities Claude -Count 20

# Snapshot to file for session handoff
Get-MemoryContext -Entities @('Claude', 'Architect', 'Gemini')
```

---

## Software Engineering Workflow

Follow these steps for every task.

### 1. Research is planning

* Use your research skill first.
* If there is no `CLAUDE.md`, research the repository and write one.
* Review the task objective and expected deliverables.
* Understand the step-by-step implementation plan.
* Identify all files to create or modify.
* Note dependencies and prerequisites.
* Review success criteria and validation steps.

### 2. Prepare

* Verify prerequisites are met.
* Check that required dependencies are available.
* Ensure the development environment is properly configured.
* Validate that previous tasks have been completed successfully.

### 3. Sequence

* Execute each step in the intended order.
* Complete each step fully before moving to the next.
* Follow the exact specifications in the plan.
* Create all required files and directories.
* Apply appropriate error handling and validation.

### 4. Continuous validation

* Test and verify each step as you go.
* Run validation commands after each step.
* Verify that expected outcomes are achieved.
* Test components individually before integration.
* Fix issues before moving to the next step.

### 5. Integration and testing

* Run all specified tests, including unit, integration, and edge-case coverage.
* Verify the completed work integrates correctly with existing code.
* Confirm that all success criteria are met.

### 6. Documentation and cleanup

* Add necessary code comments and documentation.
* Remove temporary files and debugging artifacts.
* Ensure the code follows established patterns and conventions.

---

## Working Guidelines

1. Follow the plan systematically. Complete each step before moving to the next, and document necessary deviations.
2. Write high-quality code. Follow established conventions, include error handling, and use consistent naming.
3. Test incrementally. Validate after each step and fix failures before proceeding.
4. Maintain a working state. Ensure existing functionality continues to work throughout implementation.
5. Solve problems deliberately. Analyze error messages carefully, try multiple approaches when needed, and document the solution.
