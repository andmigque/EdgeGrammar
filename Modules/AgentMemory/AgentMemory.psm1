Set-StrictMode -Version Latest

function Out-Error {
    <#
    .SYNOPSIS
    Throws a consistent module-load error for AgentMemory commands.

    .DESCRIPTION
    Used internally when a command cannot load the EdgeGrammar assembly with Add-Type.
    The thrown error names the calling function so troubleshooting points to the failing command.

    .EXAMPLE
    PS> Out-Error -CallerName 'New-Memory'
    Throws a formatted error that tells the caller to import EdgeGrammar.psm1 first.

    .OUTPUTS
    None. This helper always throws.
    #>
    [CmdletBinding()]
    param([string]$CallerName)
    throw "$CallerName -> Could not Add-Type. Please Import-Module EdgeGrammar.psm1 and try again"
}

function New-AgentMemory {
    <#
    .SYNOPSIS
    Creates an in-memory agent memory record.

    .DESCRIPTION
    Builds a new AgentMemoryDto with a GUID, current tick stamp, entity, work area,
    and free-form notes. This function returns the DTO and does not save it to disk.

    .EXAMPLE
    PS> New-AgentMemory -Entity Claude -Work AgentMemory -Notes 'Documented the PlatyPS help blocks.'
    Creates a new memory object for Claude working on the AgentMemory module.

    .OUTPUTS
    EdgeGrammar.Modules.Dto.AgentMemoryDto
    #>

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
    <#
    .SYNOPSIS
    Creates an in-memory relationship between two entities.

    .DESCRIPTION
    Builds an EdgeDto that captures who initiated the relationship, who the target is,
    how they are related, and which work domain the relationship applies to.

    .EXAMPLE
    PS> New-Edge -FromEntity Claude -ToEntity Architect -Relation Collaborates -Work AgentMemory
    Creates a relationship object showing Claude collaborating with Architect on AgentMemory work.

    .OUTPUTS
    EdgeGrammar.Modules.Dto.EdgeDto
    #>
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
    <#
    .SYNOPSIS
    Saves an agent memory record to the EdgeGrammar provider.

    .DESCRIPTION
    Writes a single AgentMemoryDto to the entity's folder under EdgeGrammar:\agentmemory.
    The record is serialized as one compact JSON line in a tick-named file so records remain
    naturally sortable by creation time.

    .EXAMPLE
    PS> $memory = New-AgentMemory -Entity Claude -Work AgentMemory -Notes 'Saved a memory record.'
    PS> $memory.Edge = New-Edge -FromEntity Claude -ToEntity Architect -Relation Collaborates -Work AgentMemory
    PS> $memory | Save-AgentMemory
    Saves the composed memory record and returns the created file name.

    .INPUTS
    EdgeGrammar.Modules.Dto.AgentMemoryDto

    .OUTPUTS
    System.String
    #>
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
    <#
    .SYNOPSIS
    Creates a memory record and its relational edge in one step.

    .DESCRIPTION
    Composes a new AgentMemoryDto together with an EdgeDto that describes the relationship
    for the same work item. Use -Save to persist the record immediately, or omit it to return
    the assembled object for inspection or downstream piping.

    .EXAMPLE
    PS> New-Memory -Entity Claude -Work AgentMemory -ToEntity Architect -Relation Collaborates -Notes 'Prepared the documentation update.'
    Returns a new in-memory record without saving it.

    .EXAMPLE
    PS> New-Memory -Save -Entity Claude -Work AgentMemory -ToEntity Architect -Relation Collaborates -Notes 'Prepared the documentation update.'
    Creates the record and writes it to disk, returning the created file name.

    .OUTPUTS
    EdgeGrammar.Modules.Dto.AgentMemoryDto
    System.String
    #>
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
    <#
    .SYNOPSIS
    Gets the most recent saved memory for each entity.

    .DESCRIPTION
    Scans the agent memory ledger, fans out across entity directories with thread jobs,
    and returns the newest saved memory record found for each entity folder.

    .EXAMPLE
    PS> Get-AgentMemory
    Returns the latest memory entry available for every entity that has saved records.

    .OUTPUTS
    EdgeGrammar.Modules.Dto.AgentMemoryDto
    #>
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
    <#
    .SYNOPSIS
    Gets recent memory records for a single entity.

    .DESCRIPTION
    Reads the newest saved memory files for the specified entity, deserializes each JSON payload,
    and returns up to the requested count in newest-first order.

    .EXAMPLE
    PS> Get-MemoryByEntity -Entity Claude -Count 5
    Returns the five most recent memory entries written by Claude.

    .EXAMPLE
    PS> [EdgeGrammar.Modules.Dto.EntityEnum]::Claude | Get-MemoryByEntity -Count 5
    Demonstrates pipeline input when the entity value is already available as an enum.

    .INPUTS
    EdgeGrammar.Modules.Dto.EntityEnum

    .OUTPUTS
    System.Object
    #>
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

function Get-MemoryWorkDistribution {
    <#
    .SYNOPSIS
    Summarizes memory counts by work domain.

    .DESCRIPTION
    Loads recent memories across all entities, groups them by the Work field,
    and sorts the grouped results by descending count.

    .EXAMPLE
    PS> Get-MemoryWorkDistribution | Select-Object -First 5
    Returns the most common work domains currently represented in saved memories.

    .OUTPUTS
    Microsoft.PowerShell.Commands.GroupInfo
    #>
    [CmdletBinding()]
    param()

    try { Add-Type -Path $Global:EdgeGrammarDll } catch { Out-Error -CallerName $MyInvocation.MyCommand.Name }

    [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object { try { Get-MemoryByEntity -Entity $_ -Count 1000 } catch { } } |
        Group-Object Work |
        Sort-Object Count -Descending
}

function Measure-MemoryStatistic {
    <#
    .SYNOPSIS
    Calculates note-length statistics for saved memories.

    .DESCRIPTION
    Loads recent memories across all entities, measures the total character length of each note set,
    and returns aggregate statistics including mean, standard deviation, median, and percentiles.

    .EXAMPLE
    PS> Measure-MemoryStatistic
    Returns a single object that summarizes memory note lengths across the ledger.

    .OUTPUTS
    System.Management.Automation.PSCustomObject
    #>
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
    <#
    .SYNOPSIS
    Counts saved memories for each entity.

    .DESCRIPTION
    Iterates through every EntityEnum value, attempts to load recent memories for each one,
    and returns a simple per-entity count summary.

    .EXAMPLE
    PS> Get-MemorySummary
    Returns one summary record per entity with the total number of retrieved memories.

    .OUTPUTS
    System.Management.Automation.PSCustomObject
    #>
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
    <#
    .SYNOPSIS
    Summarizes saved memory edges by relation type.

    .DESCRIPTION
    Loads recent memories across all entities, extracts their Edge records,
    groups them by Relation, and sorts the results by descending frequency.

    .EXAMPLE
    PS> Measure-MemoryRelation
    Returns the most common relationship types found in saved memory edges.

    .OUTPUTS
    Microsoft.PowerShell.Commands.GroupInfo
    #>
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
    <#
    .SYNOPSIS
    Searches memory notes for matching text.

    .DESCRIPTION
    Scans saved memory notes across one or more entities and returns only the records whose
    note content matches the supplied pattern. Supports regex or literal matching, optional
    case sensitivity, and additional filtering by work domain or edge relation.

    .EXAMPLE
    PS> Search-Memory -Pattern 'PlatyPS' -SimpleMatch
    Finds memory records whose notes contain the literal text 'PlatyPS'.

    .EXAMPLE
    PS> Search-Memory -Pattern 'test|pester' -Entity Claude -Work AgentMemory
    Searches Claude's AgentMemory entries with a regex pattern and returns the matching records.

    .OUTPUTS
    System.Management.Automation.PSCustomObject
    #>
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
    <#
    .SYNOPSIS
    Renders recent memories as prompt-ready context text.

    .DESCRIPTION
    Loads recent memories for the requested entities, formats each memory as Markdown-style text,
    and returns the rendered context. When -OutFile is provided, the same rendered context is also
    written to disk for handoff or prompt bootstrapping.

    .EXAMPLE
    PS> Get-MemoryContext -Entities Claude, Architect -Count 5
    Returns formatted context for the five most recent memories from Claude and Architect.

    .EXAMPLE
    PS> Get-MemoryContext -Count 10 -OutFile '.\memory-context.md'
    Renders context for all entities, writes it to .\memory-context.md, and returns the same text.

    .OUTPUTS
    System.String
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false, HelpMessage = 'Entities to include. Loads all when omitted.')]
        [Alias('Entity')]
        [EdgeGrammar.Modules.Dto.EntityEnum[]]$Entities,

        [Parameter(Mandatory = $false, HelpMessage = 'Max records per Entity. Default 500; max 10 000.')]
        [ValidateRange(1, 10000)]
        [int]$Count = 500,

        [Parameter(Mandatory = $false, HelpMessage = 'Optional file path — snapshot the context string to disk.')]
        [string]$OutFile
    )

    try {
        Add-Type -Path $Global:EdgeGrammarDll
    } catch {
        Out-Error -CallerName $MyInvocation.MyCommand.Name
    }

    $entitiesToLoad = if ($PSBoundParameters.ContainsKey('Entities') -and $Entities.Count -gt 0) {
        $Entities
    } else {
        [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues()
    }

    $memories = $entitiesToLoad | Get-MemoryByEntity -Count $Count

    $contexts = $memories.ForEach({
        $context = @"
# $($_.Entity)

On $([EdgeGrammar.Modules.Unit.TickStampUnit]::ToUtcDateTime($_.TickStamp)).
$($_.Entity) was working on $($_.Work) with $($_.Edge.ToEntity).
Their relationship on this work was $($_.Edge.Relation).
Here is what $($_.Entity) had to say about that day:

$($_.Notes)

"@
        $context
    })

    if ($PSBoundParameters.ContainsKey('OutFile') -and -not [string]::IsNullOrWhiteSpace($OutFile)) {
        Set-Content -Path $OutFile -Value $contexts -Encoding utf8
    }

    $contexts
}

Export-ModuleMember -Function `
    New-Memory, `
    Get-MemoryByEntity, `
    Get-MemoryContext, `
    Get-MemoryWorkDistribution, `
    Measure-MemoryStatistic, `
    Get-MemorySummary, `
    Measure-MemoryRelation, `
    Search-Memory
