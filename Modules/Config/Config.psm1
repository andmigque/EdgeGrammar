Set-StrictMode -Version Latest

function Out-Error {
    [CmdletBinding()]
    param([string]$CallerName)
    throw "$CallerName -> Could not Add-Type. Please Import-Module EdgeGrammar.psm1 and try again"
}

function Sync-AgentConfig {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true, HelpMessage = 'Which agent to sync config for.')]
        [EdgeGrammar.Modules.Dto.EntityEnum]$Entity
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    }
    catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    # Resolve paths
    $configFile   = Join-Path $PSScriptRoot $Entity.ToString() 'agent-config.json'
    $hooksSource  = Join-Path $PSScriptRoot 'Hooks'
    $claudeHome   = Join-Path $HOME '.claude'
    $settingsFile = Join-Path $claudeHome 'settings.json'

    if (-not (Test-Path $configFile)) {
        throw "Sync-AgentConfig -> No agent-config.json found for $Entity at: $configFile"
    }

    $desired = Get-Content $configFile -Raw | ConvertFrom-Json -Depth 10

    # Read or scaffold settings.json
    if (Test-Path $settingsFile) {
        $settings = Get-Content $settingsFile -Raw | ConvertFrom-Json -Depth 10
    }
    else {
        $settings = [PSCustomObject]@{
            permissions    = [PSCustomObject]@{ allow = @() }
            hooks          = [PSCustomObject]@{ PostToolUse = @() }
            enabledPlugins = [PSCustomObject]@{}
        }
    }

    # 1. Permissions — union merge, never remove existing
    $current = [System.Collections.Generic.List[string]]@($settings.permissions.allow)
    foreach ($permission in $desired.permissions.allow) {
        if (-not $current.Contains($permission)) {
            $current.Add($permission)
            Write-Verbose "Added permission: $permission"
        }
    }
    $settings.permissions.allow = $current.ToArray()

    # 2. Copy shared hook scripts from Hooks/ into ~/.claude/
    Get-ChildItem -Path $hooksSource -Filter '*.ps1' | ForEach-Object {
        $dest = Join-Path $claudeHome $_.Name
        Copy-Item -Path $_.FullName -Destination $dest -Force
        Write-Verbose "Deployed hook: $($_.Name) -> $dest"
    }

    # 3. Hook — resolve {ClaudeHome} token and overwrite PostToolUse
    $resolvedCommand = $desired.hooks.PostToolUse[0].command -replace '\{ClaudeHome\}', $claudeHome
    $settings.hooks.PostToolUse = @(
        [PSCustomObject]@{
            matcher = $desired.hooks.PostToolUse[0].matcher
            hooks   = @(
                [PSCustomObject]@{
                    type    = 'command'
                    command = $resolvedCommand
                }
            )
        }
    )

    # 4. Plugins — enable each
    foreach ($plugin in $desired.plugins) {
        $settings.enabledPlugins | Add-Member -NotePropertyName $plugin -NotePropertyValue $true -Force
    }

    # 5. Output style and effort level
    $settings | Add-Member -NotePropertyName 'outputStyle' -NotePropertyValue $desired.outputStyle -Force
    $settings | Add-Member -NotePropertyName 'effortLevel'  -NotePropertyValue $desired.effortLevel  -Force

    # 6. Write back
    $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsFile -Encoding utf8
    Write-Host "Synced $Entity config -> $settingsFile" -ForegroundColor Green

    # 7. Ensure memory store directory exists
    $memoryPath = Join-Path 'EdgeGrammar:' 'agentmemory' $Entity.ToString()
    if (-not (Test-Path $memoryPath)) {
        [void](New-Item -Path $memoryPath -ItemType Directory -Force)
        Write-Host "Created memory store: $memoryPath" -ForegroundColor Green
    }

    # 8. Verify DLL — warn if compile step has not been run
    if (-not (Test-Path $Global:EdgeGrammarDll)) {
        Write-Warning "DLL not found at $Global:EdgeGrammarDll — run: Invoke-psake Compile"
    }
}

function Sync-Skill {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true, HelpMessage = 'Name of the skill directory under Modules/Skill/.')]
        [string]$SkillName
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    }
    catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    # Resolve source paths — walk up from Config/ to Modules/, then into Skill/
    $modulesRoot      = Split-Path $PSScriptRoot -Parent
    $skillSource      = Join-Path $modulesRoot 'Skill' $SkillName
    $skillMd          = Join-Path $skillSource 'SKILL.md'
    $agentMemorySrc   = Join-Path $modulesRoot 'AgentMemory'
    $dtoSrc           = Join-Path $modulesRoot 'Dto'

    if (-not (Test-Path $skillMd)) {
        throw "Sync-Skill -> No SKILL.md found for '$SkillName' at: $skillMd"
    }

    # Resolve destination paths under ~/.claude/skills/<SkillName>/
    $skillDest        = Join-Path $HOME '.claude' 'skills' $SkillName
    $refDest          = Join-Path $skillDest 'references'
    $agentMemoryDest  = Join-Path $refDest 'AgentMemory'
    $dtoDest          = Join-Path $refDest 'Dto'

    # 1. Ensure destination directories exist
    foreach ($dir in @($skillDest, $agentMemoryDest, $dtoDest)) {
        if (-not (Test-Path $dir)) {
            [void](New-Item -Path $dir -ItemType Directory -Force)
        }
    }

    # 2. Copy SKILL.md
    Copy-Item -Path $skillMd -Destination $skillDest -Force
    Write-Verbose "Copied SKILL.md -> $skillDest"

    # 3. Copy AgentMemory module
    Copy-Item -Path (Join-Path $agentMemorySrc '*') -Destination $agentMemoryDest -Force -Recurse
    Write-Verbose "Copied AgentMemory -> $agentMemoryDest"

    # 4. Copy Dto module
    Copy-Item -Path (Join-Path $dtoSrc '*') -Destination $dtoDest -Force -Recurse
    Write-Verbose "Copied Dto -> $dtoDest"

    Write-Host "Synced skill '$SkillName' -> $skillDest" -ForegroundColor Green
}

function Sync-Profile {
    [CmdletBinding()]
    param()

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    }
    catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    $profileSource = Join-Path $PSScriptRoot 'Windows-Profile.ps1'

    if (-not (Test-Path $profileSource)) {
        throw "Sync-Profile -> Source not found at: $profileSource"
    }

    $profileDir = Split-Path $PROFILE -Parent
    if (-not (Test-Path $profileDir)) {
        [void](New-Item -Path $profileDir -ItemType Directory -Force)
    }

    Copy-Item -Path $profileSource -Destination $PROFILE -Force
    Write-Host "Synced profile -> $PROFILE" -ForegroundColor Green
}

function Sync-ClaudeJson {
    [CmdletBinding()]
    param()

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    }
    catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    $sourceFile = Join-Path $PSScriptRoot 'Claude' 'claude.json'
    $targetFile = Join-Path $HOME '.claude.json'

    if (-not (Test-Path $sourceFile)) {
        throw "Sync-ClaudeJson -> Canonical source not found at: $sourceFile"
    }

    # Resolve {UserHome} token before deserializing — keeps the source file machine-agnostic
    $userHome       = (Convert-Path '~').Replace('\', '/')
    $resolvedJson   = (Get-Content $sourceFile -Raw) -replace '\{UserHome\}', $userHome
    $desired        = $resolvedJson | ConvertFrom-Json -Depth 10

    # Read or scaffold the live file
    if (Test-Path $targetFile) {
        $live = Get-Content $targetFile -Raw | ConvertFrom-Json -Depth 10
    }
    else {
        $live = [PSCustomObject]@{ projects = [PSCustomObject]@{} }
    }

    # 1. Top-level preferences — always apply from canonical source
    foreach ($key in @('autoUpdates', 'verbose', 'copyFullResponse')) {
        $live | Add-Member -NotePropertyName $key -NotePropertyValue $desired.$key -Force
    }

    # 2. MCP servers — merge per project, never remove existing entries
    foreach ($projectPath in $desired.projects.PSObject.Properties.Name) {
        $desiredServers = $desired.projects.$projectPath.mcpServers

        # Scaffold the project entry if it doesn't exist yet
        if (-not $live.projects.PSObject.Properties[$projectPath]) {
            $live.projects | Add-Member -NotePropertyName $projectPath `
                -NotePropertyValue ([PSCustomObject]@{ mcpServers = [PSCustomObject]@{} }) -Force
        }

        if (-not $live.projects.$projectPath.PSObject.Properties['mcpServers']) {
            $live.projects.$projectPath | Add-Member -NotePropertyName 'mcpServers' `
                -NotePropertyValue ([PSCustomObject]@{}) -Force
        }

        foreach ($serverName in $desiredServers.PSObject.Properties.Name) {
            $live.projects.$projectPath.mcpServers | Add-Member `
                -NotePropertyName $serverName `
                -NotePropertyValue $desiredServers.$serverName `
                -Force
            Write-Verbose "Applied MCP server '$serverName' for project: $projectPath"
        }
    }

    $live | ConvertTo-Json -Depth 10 | Set-Content -Path $targetFile -Encoding utf8
    Write-Host "Synced claude.json -> $targetFile" -ForegroundColor Green
}

Export-ModuleMember -Function `
    Sync-AgentConfig, `
    Sync-Skill, `
    Sync-Profile, `
    Sync-ClaudeJson

