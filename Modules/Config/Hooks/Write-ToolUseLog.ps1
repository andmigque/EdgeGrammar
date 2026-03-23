$raw = [Console]::In.ReadToEnd()
$entry = $raw | ConvertFrom-Json
$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$edgeGrammarRoot = Join-Path $HOME 'EdgeGrammar'
if (-not (Get-PSDrive -Name EdgeGrammar -ErrorAction SilentlyContinue)) {
    New-PSDrive -Name EdgeGrammar -PSProvider FileSystem -Root $edgeGrammarRoot -Scope Global | Out-Null
}
$edgeGrammarPath = Join-Path 'EdgeGrammar:' 'tool'

if(-not (Test-Path $edgeGrammarPath)) {
    [void](New-Item -Path $edgeGrammarPath -ItemType Directory -Force)
}

$jsonFileName = "$((Get-Date).Ticks)_$($entry.tool_name).json"
$logFile = Join-Path $edgeGrammarPath $jsonFileName

[PSCustomObject]@{
    timestamp = $stamp
    tool      = $entry.tool_name
    input     = $entry.tool_input
} | ConvertTo-Json | Set-Content -Path $logFile
