Set-StrictMode -Version Latest

$EdgeGrammarRoot = Join-Path (Convert-Path '~') 'EdgeGrammar'

if (-not (Test-Path $EdgeGrammarRoot)) {
    New-Item -Path $EdgeGrammarRoot -ItemType Directory -Force | Out-Null
}

if (-not (Get-PSDrive -Name 'EdgeGrammar' -ErrorAction SilentlyContinue)) {
    [void](New-PSDrive -Name 'EdgeGrammar' -PSProvider FileSystem -Root $EdgeGrammarRoot `
        -Description 'A drive for storing edge grammar configurations, memories, and tools' `
        -Scope Global)
}
$Global:EdgeGrammarDll = Join-Path -Path "$PSScriptRoot" -ChildPath 'src\EdgeGrammar\bin\Debug\net10.0\win-x64\EdgeGrammar.dll'

# Load the EdgeGrammar assembly before importing nested modules so that
# typed DTO parameters are available when AgentMemory.psm1 functions are called.
try   { Add-Type -Path $Global:EdgeGrammarDll -ErrorAction Stop }
catch [System.Reflection.ReflectionTypeLoadException] { <# already loaded #> }

# Read the manifest data
$manifestPath = Join-Path $PSScriptRoot 'EdgeGrammar.psd1'
$manifest = Import-PowerShellDataFile -Path $manifestPath

# Import the NestedModules from the manifest
foreach ($nestedModule in $manifest.NestedModules) {
    $nestedModulePath = Join-Path $PSScriptRoot $nestedModule
    Import-Module $nestedModulePath -Force
}

function Write-Documentation {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $false)]
        [string]$OutPath
    )

    $docsDir = Join-Path "$PSScriptRoot" "Doc"
    $markdownPath = [System.IO.Path]::ChangeExtension($Path, ".md")
    $filename = [System.IO.Path]::GetFileName($markdownPath)

    if([string]::IsNullOrWhiteSpace($OutPath)){
        $OutPath = Join-Path -Path $docsDir -ChildPath $filename
    } else {
        $OutPath = Resolve-Path -Path $OutPath
    }

    $lines = Get-Content $Path

    $imports = $lines |
        Where-Object { $_ -match '^using ' } |
        ForEach-Object { $_.Trim() }

    $namespace = ($lines | Where-Object { $_ -match '^namespace ' } | Select-Object -First 1) -replace '^namespace ', '' -replace ';', ''

    $definition = ($lines | Where-Object { $_ -match '^\s*public (class|interface|record|enum)' } | Select-Object -First 1).Trim()

    $docLines = ($lines |
        Where-Object { $_ -match '^\s*///' } |
        ForEach-Object { $_ -replace '^\s*/// ?', '' }) -join "`n"

    $importsBlock = $imports -join "`n"

    $content = @"
$docLines

## Imports

``````csharp
$importsBlock
``````

## Namespace

``````csharp
$namespace
``````

## Definition

``````csharp
$definition
``````
"@

    Set-Content -Path $outPath -Value $content

    Write-Output ([PSCustomObject]@{
        InPath = $Path
        OutPath = $outPath
    })
}

function Write-AllDocumentation {
    [CmdletBinding()]
    param()
    $Path = Join-Path -Path "$PSScriptRoot" -ChildPath "src" -AdditionalChildPath @('EdgeGrammar', 'Modules')
    Get-ChildItem -Recurse -File -Include '*.cs' -Path "$Path"| ForEach-Object {
        Write-Documentation $_.FullName
    }
}

Export-ModuleMember -Function $manifest.FunctionsToExport, Write-Documentation, Write-AllDocumentation
