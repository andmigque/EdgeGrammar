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
$Global:EdgeGrammarDll = Join-Path -Path "$PSScriptRoot" -ChildPath 'bin\Debug\net10.0\win-x64\EdgeGrammar.dll'

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

# Export what the manifest says to export
Export-ModuleMember -Function $manifest.FunctionsToExport
