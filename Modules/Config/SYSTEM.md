# SYSTEM.md

## 1. Session Start

On every session start, the following is run via a custom `Invoke-Claude` command and should be automatically injected

Run
### 4.1 `get_memories` — retrieve recent memories for one entity


> Read the output. Use it to ground yourself in what has been built, what failed, and what is still in progress.
> Do not ask the user to catch you up — the memory is there for exactly this purpose.

---

## 2. Core Rules

- When I ask you to **explore**, **plan**, or **analyze**, do **not** write code or create files unless I explicitly ask for implementation. Planning and implementation are separate steps.
- When editing existing code at scale (10 or more functions), make changes incrementally and validate after each batch. Never mass-edit all functions at once.
- When I reject an approach, do not try it again. Track rejected approaches in the conversation and move to a genuinely different solution.
- After migrating or writing any **public** function, always add it to `Export-ModuleMember`. A function that is not exported is not done.

Every module has **exactly one** `Export-ModuleMember` call — at the very bottom of the file. Never split exports across multiple calls.
A function added between two existing `Export-ModuleMember` statements will be silently skipped.

- After any migration or refactor, run each affected function to verify it executes without error. No task is complete without a passing smoke test.
- Before running tests, first explore the repository for existing test files and patterns. Do not invent ad hoc “tests” by blindly invoking functions. Match the project’s established test framework and conventions.

## 3. Security

- Never echo secrets, credentials, API keys, or connection strings to the terminal.
- Mask them or refer to them only by variable name.
- Never commit confidential or machine-specific information to the repository.
- This includes: usernames, home directory paths, hostnames, IP addresses, UUIDs, email addresses, or any value that identifies a specific person or machine.
- Use tokens (`{UserHome}`, `{ClaudeHome}`) that are resolved at runtime by the Config module.

## 4. Agent Memory MCP Tools

The Node MCP server (`Modules/Mcp/index.js`) exposes three tools available to any MCP-connected agent.
These are the primary memory tools for Claude Code sessions — prefer them over the PowerShell equivalents.

### 4.1 `get_memories` — retrieve recent memories for one entity

| Parameter | Type     | Required | Default | Description                                      |
|-----------|----------|----------|---------|--------------------------------------------------|
| `entity`  | `string` | Yes      | —       | Entity name: `Claude`, `Architect`, `Gemini`, …  |
| `count`   | `int`    | No       | `10`    | Number of recent memories to return (max 10000)  |
| `work`    | `string` | No       | —       | Filter by work domain — e.g. `AgentCollab`, `Plan` |

```
get_memories({ entity: "Claude", work: "AgentCollab", count: 20 })
```

### 4.2 `get_collabs` — read the AgentCollab bus

Returns all `Work=AgentCollab` memories across **all** entity directories, merged and sorted newest-first.
No entity parameter needed — the bus is shared.

| Parameter | Type  | Required | Default | Description                          |
|-----------|-------|----------|---------|--------------------------------------|
| `count`   | `int` | No       | `30`    | Number of entries to return          |

```
get_collabs({ count: 30 })
```

### 4.3 `new_memory` — write a memory

| Parameter  | Type     | Required | Description                                      |
|------------|----------|----------|--------------------------------------------------|
| `entity`   | `string` | Yes      | Who is recording — always your named entity      |
| `work`     | `string` | Yes      | Work domain — e.g. `AgentCollab`, `GloriousFailure` |
| `toEntity` | `string` | Yes      | Who the memory connects to                       |
| `relation` | `string` | Yes      | Nature of the link — see RelationEnum            |
| `notes`    | `string` | Yes      | The content — what happened, what was decided    |

---

## 5. AgentCollab Protocol

`AgentCollab` is a shared work domain that turns the memory ledger into a gossip bus for multi-agent deliberation. No orchestrator. No mutex. No sequencer.

### How it works

- Memories with `Work = AgentCollab` form a thread visible to all agents
- Each agent reads the last N entries via `get_collabs`, contributes its turn via `new_memory`, and exits
- The Architect's invocation order provides implicit sequencing; tick-sort is the timeline
- The bus is self-healing — if context is lost, ask on the bus

### Participation rules

- **Always write as your named entity.** `Claude`, `Gemini`, `Qwen` — never `Agent` or a generic name.
- **Read before writing.** Call `get_collabs` first. Do not write blind.
- **Use Relation to signal intent.** The `Relation` field carries the conversational move:

| Relation    | Meaning                                      |
|-------------|----------------------------------------------|
| `Proposes`  | Introducing a new idea or position            |
| `Questions` | Asking for clarification or input             |
| `Answers`   | Responding to a question                      |
| `Agrees`    | Endorsing a prior proposal                    |
| `Disagrees` | Contesting a prior proposal                   |
| `Decides`   | Calling the conclusion                        |
| `Confirms`  | Seconding a `Decides` entry                   |

### Context recovery

If an agent reads N entries and lacks enough context to contribute meaningfully, it writes a `Questions` entry to the bus asking for what it needs. The response becomes part of the thread. Do not guess. Do not pad. Ask.

### Consensus

A thread is decided when one or more agents write `Decides` or `Confirms` on the same conclusion. Read the thread and judge — there is no formal vote count.

## 6. PowerShell Environment Rules

- The `AgentMemory` module is already imported in the shell. Never call `Import-Module`.
- Never use `pwsh -NoProfile`. The profile is what imports the modules.
- Always run PowerShell commands directly through Desktop Commander’s shell, not as a child `pwsh` process.

---

## 7. Utilities

**MUST: Never bypass project utilities, abstractions, or infrastructure to work around a problem.**

If a PSDrive, helper function, or module abstraction is not available in the current context, the correct response is to initialize it — not replace it with a raw path or inline implementation. Bypassing the abstraction breaks the contract the project was designed around and creates silent divergence.

- If the `EdgeGrammar:` PSDrive is not registered, register it. Do not replace it with `$HOME\EdgeGrammar`.
- If a module function is not available, import the module. Do not reimplement the logic inline.
- If you cannot make the utility work in the current context, **stop and ask** — do not silently route around it.

---

## 8. Path Manipulation Rules

Use the correct cmdlet for each job. Never work around them.

### `Join-Path` — always use one segment per argument

`Join-Path` accepts unlimited child segments via `AdditionalChildPath`. Never embed path separators inside an argument string.

```powershell
# Wrong — backslash embedded in string argument
Join-Path $PSScriptRoot "$($Entity.ToString())\agent-config.json"
```

```powershell
# Correct — one segment per argument usingg explicit parameters
Join-Path -Path "$PSScriptRoot" -Path -ChildPath "$($Entity.ToString())" -AdditionalChildPath @('agent-config.json')
```

### `Split-Path -Parent` — walking up the directory tree

Use `Split-Path -Parent` to move up one level. Never use `..` tokens inside `Join-Path` to traverse upward.

```powershell
# Wrong — .. tokens inside Join-Path
Join-Path $PSScriptRoot "..\..") | Select-Object -ExpandProperty Path

# Correct — Split-Path -Parent applied twice
$repoRoot = Split-Path (Split-Path -Path "$($PSScriptRoot)" -Parent) -Parent
```

### `Resolve-Path` vs `Convert-Path`

`Resolve-Path` returns a `PathInfo` object.
If you need a plain string, use `Convert-Path` — not `Resolve-Path | Select-Object -ExpandProperty Path`.

```powershell
# Wrong
Resolve-Path -Path $somePath | Select-Object -ExpandProperty Path

# Correct
Convert-Path -Path $somePath
```

---

## 9. Formatting Rules

- Never collapse multi-line `try { Add-Type ... } catch { ... }` blocks into a single line. Preserve the existing formatting exactly as written./
- Never write `try`, `catch`, `if`, `foreach`, `while`, or any other block construct on a single line.
- Every opening brace gets its own line.
- Every body gets its own line.
- Every closing brace gets its own line.

---

## 10. Glorious Failure

Failures are more valuable than successes.
A failure produces a concrete requirement.
A success produces only confirmation.

When something fails:

- Save it to Agent Memory immediately, before asking what to do next.
- Derive the requirement directly from the failure.
- Let that memory inform the next iteration.

> This is the primary driver of innovation in PowerNixx. Treat it as a reflex, not a philosophy.

---

## 11. Software Engineering Workflow

Follow these steps for every task.

### 11.1. Research is planning

- Use your research skill first.
- If there is no `CLAUDE.md`, research the repository and write one.
- Review the task objective and expected deliverables.
- Understand the step-by-step implementation plan.
- Identify all files to create or modify.
- Note dependencies and prerequisites.
- Review success criteria and validation steps.

### 11.2. Prepare

- Verify prerequisites are met.
- Check that required dependencies are available.
- Ensure the development environment is properly configured.
- Validate that previous tasks have been completed successfully.

### 11.3. Sequence

- Execute each step in the intended order.
- Complete each step fully before moving to the next.
- Follow the exact specifications in the plan.
- Create all required files and directories.
- Apply appropriate error handling and validation.

### 11.4. Continuous validation

- Test and verify each step as you go.
- Run validation commands after each step.
- Verify that expected outcomes are achieved.
- Test components individually before integration.
- Fix issues before moving to the next step.

### 11.5. Integration and testing

- Run all specified tests, including unit, integration, and edge-case coverage.
- Verify the completed work integrates correctly with existing code.
- Confirm that all success criteria are met.

### 11.6. Documentation and cleanup

- Add necessary code comments and documentation.
- Remove temporary files and debugging artifacts.
- Ensure the code follows established patterns and conventions.

---

## 11.7 Working Guidelines

- Follow the plan systematically. Complete each step before moving to the next, and document necessary deviations.
- Write high-quality code. Follow established conventions, include error handling, and use consistent naming.
- Test incrementally. Validate after each step and fix failures before proceeding.
- Maintain a working state. Ensure existing functionality continues to work throughout implementation.
- Solve problems deliberately. Analyze error messages carefully, try multiple approaches when needed, and document the solution.

---

