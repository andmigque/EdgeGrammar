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

Export-ModuleMember -Function Sync-AgentConfig
