Set-StrictMode -Version Latest

function Out-Error {
    [CmdletBinding()]
    param([string]$CallerName)
    throw "$CallerName -> Could not Add-Type. Please Import-Module EdgeGrammar.psm1 and try again"
}

function New-AgentMemory {

    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false, HelpMessage = 'Who are you?')]
        [EdgeGrammar.Modules.Dto.EntityEnum]$Entity,

        [Parameter(Mandatory = $false, HelpMessage = 'What are you working on?')]
        [EdgeGrammar.Modules.Dto.WorkEnum]$Work,

        [Parameter(Mandatory = $false, HelpMessage = 'Use here string like: @" "@. This is ONLY string[] because a here string is considered an array. If not using cli here string, just use string.')]
        [string[]]$Notes
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    } catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    if (
        [string]::IsNullOrWhiteSpace($Entity.ToString()) -or
        [string]::IsNullOrWhiteSpace($Work.ToString()) -or
        [string]::IsNullOrWhiteSpace($Notes)
    ) {
        throw "$($MyInvocation.MyCommand.Name) -> Entity, Work, and Notes are Required."
    }

    [EdgeGrammar.Modules.Dto.AgentMemoryDto]@{
        Id        = (New-Guid).Guid
        TickStamp = [EdgeGrammar.Modules.Unit.TickStampUnit]::new().Ticks
        Entity    = $Entity
        Work      = $Work
        Notes     = $Notes
    }
}

function New-Edge {
    [CmdletBinding()]
    param(
        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Who is asserting the relationship (the originator or "speaker" in the link).'
        )]
        [EdgeGrammar.Modules.Dto.EntityEnum]$FromEntity,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Who the relationship is about (the target being linked to).'
        )]
        [EdgeGrammar.Modules.Dto.EntityEnum]$ToEntity,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Why these two entities are connected (the meaning of the link).'
        )]
        [EdgeGrammar.Modules.Dto.RelationEnum]$Relation,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Which active effort this relationship supports or explains.'
        )]
        [EdgeGrammar.Modules.Dto.WorkEnum]$Work
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    } catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    # Guard: all four fields are required for a well-formed Link.
    if (
        [string]::IsNullOrWhiteSpace($FromEntity.ToString()) -or
        [string]::IsNullOrWhiteSpace($ToEntity.ToString())   -or
        [string]::IsNullOrWhiteSpace($Relation.ToString())   -or
        [string]::IsNullOrWhiteSpace($Work.ToString())
    ) {
      throw "$($MyInvocation.MyCommand.Name) -> All parameters are required"
    }

    [EdgeGrammar.Modules.Dto.EdgeDto]@{
        Id         = (New-Guid).Guid
        TickStamp  = [EdgeGrammar.Modules.Unit.TickStampUnit]::new().Ticks
        FromEntity = $FromEntity
        ToEntity   = $ToEntity
        Relation   = $Relation
        Work       = $Work
    }
}
function Save-AgentMemory {
    [CmdletBinding()]
    param(
        [Parameter(
            Mandatory         = $true,
            ValueFromPipeline = $true,
            HelpMessage       = 'The completed memory record to write to disk.'
        )]
        [EdgeGrammar.Modules.Dto.AgentMemoryDto]$Memory
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    } catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    try
    {
        $ErrorActionPreference = 'Stop'

        $Agent        = $Memory.Entity.ToString()
        $AgentPath    = Join-Path "EdgeGrammar:\agentmemory" "$Agent"

        # Auto-create the Entity directory on first write.
        if (-not (Test-Path $AgentPath))
        {
            [void](New-Item -Path $AgentPath -ItemType Directory -Force)
        }

        # Tick-based file name preserves write-order sort for free.
        $FileName = "$((Get-Date).Ticks).jsonl"
        $FilePath = Join-Path $AgentPath $FileName

        # One compact JSON line per file — human-readable enums, max fidelity.
        $Line = $Memory | ConvertTo-Json -Depth 10 -EnumsAsStrings -Compress
        Add-Content -Path $FilePath -Value $Line -Encoding utf8 -NoNewline -Force
        Write-Verbose "Created file at $($FilePath)"
        $FileName
    }
    catch
    {
        Write-Error "$($MyInvocation.MyCommand.Name) -> An Unknown Error Occurred: $_"
        Write-Host -BackgroundColor Red -ForegroundColor Gray "Get-Error for Advanced troubleshooting"

    }
}
function New-Memory {
    [CmdletBinding()]
    param(
        [Parameter(
            Mandatory   = $true,
            HelpMessage = "Automatically save this Memory, or return the object for downstream pipelining"
        )]
        [switch]$Save,
        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Who is creating this memory and link (the owner of the entry).'
        )]
        [EdgeGrammar.Modules.Dto.EntityEnum]$Entity,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Which effort this memory+link is documenting.'
        )]
        [EdgeGrammar.Modules.Dto.WorkEnum]$Work,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Who/what the memory owner is connecting to.'
        )]
        [EdgeGrammar.Modules.Dto.EntityEnum]$ToEntity,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Why the connection matters between the two entities.'
        )]
        [EdgeGrammar.Modules.Dto.RelationEnum]$Relation,

        [Parameter(HelpMessage = 'Human-readable rationale or context for the link.')]
        [string[]]$Notes
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    } catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    # Guard: all relational fields are required for a coherent memory+link.
    if (
        [string]::IsNullOrWhiteSpace($Entity.ToString())   -or
        [string]::IsNullOrWhiteSpace($Work.ToString())     -or
        [string]::IsNullOrWhiteSpace($ToEntity.ToString()) -or
        [string]::IsNullOrWhiteSpace($Relation.ToString())
    ) {
        throw "$($MyInvocation.MyCommand.Name) -> All parameters are required"
    }

    $Memory       = New-AgentMemory -Entity $Entity -Work $Work -Notes $Notes
    $Memory.Edge  = New-Edge -FromEntity $Entity -ToEntity $ToEntity -Relation $Relation -Work $Work


    if($Save) {
        $Memory | Save-AgentMemory
    } else {
        $Memory
    }

}

function Get-AgentMemory {
    [CmdletBinding()]
    param()

    try { Add-Type -Path $Global:EdgeGrammarDll } catch { Out-Error -CallerName $MyInvocation.MyCommand.Name }

    $ledgerPath = 'EdgeGrammar:\agentmemory'

    if (-not (Test-Path $ledgerPath)) {
        throw "$($MyInvocation.MyCommand.Name) -> The agent memory directory does not exist."
    }

    $threadJobs = @()

    # Fan-out: one thread job per Entity directory for parallel I/O.
    Get-ChildItem -Path $ledgerPath -Directory | ForEach-Object {
        $threadJobs += Start-ThreadJob -ArgumentList "$($_.FullName)" -ThrottleLimit 4 -ScriptBlock {
            param([string]$directoryPath)
            Get-ChildItem -Path $directoryPath -File |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 1 |
                Select-Object -Property FullName
        }
    }

    # Fan-in: deserialise each JSONL line back into a typed DTO.
    $threadJobs | Wait-Job | Receive-Job | ForEach-Object {
        [EdgeGrammar.Modules.Dto.AgentMemoryDto](Get-Content $_.FullName | ConvertFrom-Json)
    }
}

function Get-MemoryByEntity {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false, ValueFromPipeline = $true, HelpMessage = 'Which entity''s memories to retrieve.')]
        [EdgeGrammar.Modules.Dto.EntityEnum]$Entity,

        [Parameter(Mandatory = $false, HelpMessage = 'How many recent entries you want back.')]
        [int]$Count = 10
    )

    begin {
        try {
            Add-Type -Path $Global:EdgeGrammarDll
        } catch {
            Out-Error -CallerName $MyInvocation.MyCommand.Name
        }
    }

    process {
        if ([string]::IsNullOrWhiteSpace($Entity.ToString()) -or -not $Count -or $Count -lt 1) {
            throw "$($MyInvocation.MyCommand.Name) -> Entity and Count are required."
        }

        $limit      = [Math]::Min($Count, 10000)
        $entityPath = Join-Path "EdgeGrammar:" "agentmemory" "$($Entity.ToString())"

        if (-not (Test-Path $entityPath)) {
            throw "$($MyInvocation.MyCommand.Name) -> $entityPath does not exist."
        }

        Get-ChildItem -Path $entityPath |
            Sort-Object -Property LastWriteTime -Descending |
            Select-Object -First $limit |
            ForEach-Object {
                Get-Content -Path $_.FullName -Encoding utf8 | ConvertFrom-Json -Depth 10
            }
    }
}

function Get-AgentMemoryWorkDistribution {
    [CmdletBinding()]
    param()

    try { Add-Type -Path $Global:EdgeGrammarDll } catch { Out-Error -CallerName $MyInvocation.MyCommand.Name }

    [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object { try { Get-MemoryByEntity -Entity $_ -Count 1000 } catch { } } |
        Group-Object Work |
        Sort-Object Count -Descending
}

function Measure-MemoryStatistic {
    [CmdletBinding()]
    param()

    try { Add-Type -Path $Global:EdgeGrammarDll } catch { Out-Error -CallerName $MyInvocation.MyCommand.Name }

    $lengths = [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object { try { Get-MemoryByEntity -Entity $_ -Count 1000 } catch { } } |
        ForEach-Object { ($_.Notes -join "`n").Length } |
        Sort-Object

    [PSCustomObject]@{
        Count  = $lengths.Count
        Mean   = [math]::Round(($lengths | Measure-Object -Average).Average, 2)
        StdDev = [math]::Round(($lengths | Measure-Object -StandardDeviation).StandardDeviation, 2)
        Min    = $lengths[0]
        Median = $lengths[[math]::Floor($lengths.Count * 0.5)]
        P90    = $lengths[[math]::Floor($lengths.Count * 0.9)]
        P99    = $lengths[[math]::Floor($lengths.Count * 0.99)]
        Max    = $lengths[-1]
    }
}

function Get-MemorySummary {
    [CmdletBinding()]
    param()

    try { Add-Type -Path $Global:EdgeGrammarDll } catch { Out-Error -CallerName $MyInvocation.MyCommand.Name }

    [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() | ForEach-Object {
        $memories = @(try { Get-MemoryByEntity -Entity $_ -Count 1000 } catch { })
        [PSCustomObject]@{
            Entity = $_
            Count  = $memories.Count
        }
    }
}

function Measure-MemoryRelation {
    [CmdletBinding()]
    param()

    try { Add-Type -Path $Global:EdgeGrammarDll } catch { Out-Error -CallerName $MyInvocation.MyCommand.Name }

    [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object { try { Get-MemoryByEntity -Entity $_ -Count 1000 } catch { } } |
        ForEach-Object { $_.Edge } |
        Where-Object { ${_}?.Relation } |
        Group-Object Relation |
        Sort-Object Count -Descending
}

function Search-Memory {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0, HelpMessage = 'Regex pattern (or literal string with -SimpleMatch) to search note content.')]
        [string]$Pattern,

        [Parameter(Mandatory = $false, HelpMessage = 'Restrict search to one or more Entities. Searches all when omitted.')]
        [EdgeGrammar.Modules.Dto.EntityEnum[]]$Entity,

        [Parameter(Mandatory = $false, HelpMessage = 'Return only records whose Work field matches this value.')]
        [EdgeGrammar.Modules.Dto.WorkEnum]$Work,

        [Parameter(Mandatory = $false, HelpMessage = 'Return only records that contain an Edge with this Relation.')]
        [EdgeGrammar.Modules.Dto.RelationEnum]$Relation,

        [Parameter(Mandatory = $false, HelpMessage = 'Max records to scan per Entity. Default 500; max 10 000.')]
        [ValidateRange(1, 10000)]
        [int]$MaxPerEntity = 500,

        [Parameter(Mandatory = $false, HelpMessage = 'Enable case-sensitive matching.')]
        [switch]$CaseSensitive,

        [Parameter(Mandatory = $false, HelpMessage = 'Treat Pattern as a literal string — disables regex interpretation.')]
        [switch]$SimpleMatch
    )

    try { Add-Type -Path $Global:EdgeGrammarDll } catch { Out-Error -CallerName $MyInvocation.MyCommand.Name }

    if ([string]::IsNullOrWhiteSpace($Pattern)) {
        throw "$($MyInvocation.MyCommand.Name) -> Pattern is required."
    }

    $entitiesToSearch = if ($PSBoundParameters.ContainsKey('Entity') -and $Entity.Count -gt 0) {
        $Entity
    } else {
        [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues()
    }

    $ssParams = @{
        Pattern       = $Pattern
        Quiet         = $true
        CaseSensitive = $CaseSensitive.IsPresent
        SimpleMatch   = $SimpleMatch.IsPresent
    }

    $entitiesToSearch |
        ForEach-Object {
            try { Get-MemoryByEntity -Entity $_ -Count $MaxPerEntity } catch { }
        } |
        ForEach-Object {
            $memory = $_

            $matchedNotes = @($memory.Notes | Where-Object { $_ | Select-String @ssParams })

            if ($matchedNotes.Count -eq 0) { return }

            [PSCustomObject]@{
                Entity       = $memory.Entity
                Work         = $memory.Work
                TickStamp    = $memory.TickStamp
                MatchCount   = $matchedNotes.Count
                MatchedNotes = $matchedNotes
                Edge         = $memory.Edge
            }
        } |
        Where-Object {
            if ($PSBoundParameters.ContainsKey('Work')) { $_.Work -eq $Work } else { $true }
        } |
        Where-Object {
            if ($PSBoundParameters.ContainsKey('Relation')) {
                ${_}?.Edge?.Relation -eq $Relation.ToString()
            } else { $true }
        } |
        Sort-Object -Property TickStamp -Descending
}

function Get-MemoryContext {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false, HelpMessage = 'Entities to include. Loads all when omitted.')]
        [Alias('Entity')]
        [EdgeGrammar.Modules.Dto.EntityEnum[]]$Entities,

        [Parameter(Mandatory = $false, HelpMessage = 'Max records per Entity. Default 500; max 10 000.')]
        [ValidateRange(1, 10000)]
        [int]$MaxPerEntity = 500,

        [Parameter(Mandatory = $false, HelpMessage = 'Optional file path — snapshot the context string to disk.')]
        [string]$OutFile
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    } catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    $memories = $Entities | Get-MemoryByEntity -Count $MaxPerEntity

    $contexts = $memories.ForEach({
        $context = @"
# $($_.Entity)

On $([EdgeGrammar.Modules.Unit.TickStampUnit]::new().ToUtcDateTime($_.TickStamp)).
$($_.Entity) was working on $($_.Work) with $($_.Edge.ToEntity).
Their relationship on this work was $($_.Edge.Relation).
Here is what $($_.Entity) had to say about that day:

$($_.Notes)

"@
        $context
    })

    $contexts
}

Export-ModuleMember -Function `
    New-Memory, `
    Get-MemoryByEntity, `
    Get-MemoryContext, `
    Get-AgentMemoryWorkDistribution, `
    Measure-MemoryStatistic, `
    Get-MemorySummary, `
    Measure-MemoryRelation, `
    Search-Memory