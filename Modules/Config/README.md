# Config Module

The `Config` module is EdgeGrammar's deployment engine. It syncs agent configurations, hook scripts, skills, and shell profiles into their live runtime locations — keeping every AI agent and developer environment reproducible from a single source of truth in the repository.

---

## Directory Structure

```
Modules/Config/
├── Config.psm1              # Module — four exported functions
├── SYSTEM.md                # Canonical system prompt injected at session start
├── Windows-Profile.ps1      # PowerShell profile deployed by Sync-Profile
├── Hooks/
│   └── Write-ToolUseLog.ps1 # PostToolUse hook — logs every tool call to EdgeGrammar:/tool/
├── Claude/
│   ├── agent-config.json    # Desired state for Claude (permissions, hooks, plugins, style)
│   ├── claude.json          # Desired state for ~/.claude.json (MCP servers, preferences)
│   ├── Launch-Claude.ps1    # Builds dynamic system prompt and launches claude CLI
│   └── settings.json        # (generated) — not committed, written by Sync-AgentConfig
└── Gemini/
    ├── Launch-Gemini.ps1    # Builds dynamic system prompt and launches Gemini CLI
    └── settings.json        # Gemini CLI settings (model, session retention, auth)
```

---

## Exported Functions

### `Sync-AgentConfig`

Applies a desired-state `agent-config.json` to the live `~/.claude/settings.json`.

```powershell
Sync-AgentConfig -Entity Claude
```

**What it does, in order:**

| Step | Action |
|------|--------|
| 1 | Reads `Claude/agent-config.json` (the desired state) |
| 2 | Loads or scaffolds `~/.claude/settings.json` |
| 3 | **Permissions** — union-merges `permissions.allow`; never removes existing entries |
| 4 | **Hooks** — copies `*.ps1` scripts from `Hooks/` into `~/.claude/`, resolves the `{ClaudeHome}` token in hook commands, and overwrites `PostToolUse` |
| 5 | **Plugins** — enables each listed plugin in `enabledPlugins` |
| 6 | **Style** — writes `outputStyle` and `effortLevel` from desired config |
| 7 | Writes the merged result back to `~/.claude/settings.json` |
| 8 | Ensures the agent's memory store directory exists at `EdgeGrammar:/agentmemory/<Entity>/` |
| 9 | Warns if the EdgeGrammar DLL has not been compiled yet |

**`agent-config.json` schema:**

```json
{
  "entity": "Claude",
  "hooks": {
    "PostToolUse": [
      { "matcher": "", "command": "pwsh -NoProfile -File \"{ClaudeHome}\\Write-ToolUseLog.ps1\"" }
    ]
  },
  "permissions": {
    "allow": [ "mcp__desktopcommander__read_file", "..." ]
  },
  "plugins": [],
  "outputStyle": "Playful",
  "effortLevel": "medium"
}
```

> **Token:** `{ClaudeHome}` is resolved at sync time to the absolute path of `~/.claude/`. Never hardcode machine paths in `agent-config.json`.

---

### `Sync-ClaudeJson`

Merges the canonical `Claude/claude.json` into the live `~/.claude.json` (Claude's global config file).

```powershell
Sync-ClaudeJson
```

**What it does, in order:**

| Step | Action |
|------|--------|
| 1 | Reads `Claude/claude.json`, resolves `{UserHome}` token to the current user's home directory |
| 2 | Loads or scaffolds the live `~/.claude.json` |
| 3 | **Preferences** — overwrites `autoUpdates`, `verbose`, `copyFullResponse` from canonical source |
| 4 | **MCP servers** — merges per-project `mcpServers` entries; never removes existing entries |
| 5 | Writes the merged result back to `~/.claude.json` |

**`claude.json` schema:**

```json
{
  "autoUpdates": false,
  "verbose": true,
  "copyFullResponse": true,
  "projects": {
    "{UserHome}/Develop/EdgeGrammar": {
      "mcpServers": {
        "desktopcommander": {
          "type": "stdio",
          "command": "pwsh",
          "args": [ "-Command", "npx @wonderwhy-er/desktop-commander@latest" ],
          "env": {}
        }
      }
    }
  }
}
```

> **Token:** `{UserHome}` is resolved at sync time. Never commit absolute paths with usernames or home directories.

---

### `Sync-Skill`

Deploys a named skill from `Modules/Skill/<SkillName>/` into `~/.claude/skills/<SkillName>/`, along with its reference materials.

```powershell
Sync-Skill -SkillName edge-grammar
```

**What it deploys:**

| Source | Destination |
|--------|-------------|
| `Modules/Skill/<SkillName>/SKILL.md` | `~/.claude/skills/<SkillName>/SKILL.md` |
| `Modules/AgentMemory/` | `~/.claude/skills/<SkillName>/references/AgentMemory/` |
| `Modules/Dto/` | `~/.claude/skills/<SkillName>/references/Dto/` |
| `Modules/Doc/` | `~/.claude/skills/<SkillName>/references/Doc/` |

The `references/` subtree is what `SKILL.md` files reference via `references/<dir>/` paths — resolved by Claude Code at runtime.

---

### `Sync-Profile`

Deploys `Windows-Profile.ps1` to the current user's PowerShell `$PROFILE` path.

```powershell
Sync-Profile
```

The profile bootstraps the EdgeGrammar module, configures PSReadLine history and Vi keybindings, sets the custom prompt, and exposes the `Invoke-Claude` launcher function.

---

## Hook: `Write-ToolUseLog.ps1`

Deployed to `~/.claude/` by `Sync-AgentConfig`. Fires on every `PostToolUse` event.

**Behavior:** reads the tool-use payload from stdin, writes a timestamped JSON file to `EdgeGrammar:/tool/<ticks>_<tool_name>.json`. This gives a durable audit trail of every tool Claude invokes during a session.

---

## Agent Launchers

### `Claude/Launch-Claude.ps1`

Builds a dynamic system prompt by combining:

1. `SYSTEM.md` (the static rules and context)
2. `Get-MemoryContext -Entities Claude, Architect, Gemini, Agent -Count 3` (live Agent Memory)

Writes the combined prompt to `~/.claude/DYNAMIC_SYSTEM_PROMPT.md`, then launches:

```powershell
claude --system-prompt-file "$HOME\.claude\DYNAMIC_SYSTEM_PROMPT.md"
```

This is invoked by the shell profile's `Invoke-Claude` function.

### `Gemini/Launch-Gemini.ps1`

Same pattern as `Launch-Claude.ps1` — builds a dynamic system prompt from `SYSTEM.md` + memory context, writes it to `~/.gemini/DYNAMIC_SYSTEM_PROMPT.md`, then launches the Gemini CLI.

---

## Common Workflows

**First-time setup (new machine):**

```powershell
# 1. Deploy the PowerShell profile
Sync-Profile

# 2. Sync Claude's settings.json
Sync-AgentConfig -Entity Claude

# 3. Sync ~/.claude.json with MCP server registrations
Sync-ClaudeJson

# 4. Deploy a skill
Sync-Skill -SkillName edge-grammar
```

**After editing `agent-config.json`:**

```powershell
Sync-AgentConfig -Entity Claude
```

**After adding a new MCP server to `claude.json`:**

```powershell
Sync-ClaudeJson
```

**After modifying `Windows-Profile.ps1`:**

```powershell
Sync-Profile
# Then restart your terminal session
```

---

## Security Notes

- `agent-config.json` and `claude.json` use `{UserHome}` and `{ClaudeHome}` tokens. These are resolved at runtime — never hardcode paths, usernames, or hostnames in these files.
- `settings.json` inside `Claude/` is a generated file. It should not be committed to the repository if it contains resolved machine-specific paths.
- The hook script (`Write-ToolUseLog.ps1`) logs tool inputs. Avoid passing secrets as tool arguments — they will appear in the log.
