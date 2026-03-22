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

# ────────────────────────────────────────────────────────────────────────────
# Get-AgentMemory
# ────────────────────────────────────────────────────────────────────────────
function Get-AgentMemory {
    <#
    .SYNOPSIS
        Returns the most-recent AgentMemory record for every Entity.

    .DESCRIPTION
        Scans ~/.EdgeGrammar/agentmemory/ for all Entity sub-directories and,
        using parallel thread jobs (ThrottleLimit = 4), retrieves the single
        most-recently-written file from each directory.

        Returns one [EdgeGrammar.Modules.Dto.EdgeDtoEdgeGrammar.Modules.Dto.AgentMemoryDto] per Entity that has at least
        one persisted record.

    .OUTPUTS
        [EdgeGrammar.Modules.Dto.EdgeDtoEdgeGrammar.Modules.Dto.AgentMemoryDto[]]

    .EXAMPLE
        Get-AgentMemory | Format-Table entity, work, notes
    #>
    [CmdletBinding()]
    param()

    $basePath     = Join-Path -Path "~" ".EdgeGrammar" "agentmemory"
    $resolvedPath = Resolve-Path $basePath

    if (-not (Test-Path $resolvedPath)) {
        Write-Warning 'AgentMemory:Get-AgentMemory - The agent memory directory is empty.'
        return
    }

    $threadJobs = @()

    # Fan-out: one thread job per Entity directory for parallel I/O.
    Get-ChildItem -Path $resolvedPath -Directory |
    ForEach-Object {
        $threadJobs += Start-ThreadJob -ArgumentList "$($_.FullName)" -ThrottleLimit 4 -ScriptBlock {
            param([string]$directoryPath)
            # Each job returns only the most-recent file's FullName.
            return Get-ChildItem -Path $directoryPath -File |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1 | Select-Object -Property FullName
        }
    }

    # Fan-in: collect all thread job results, deserialise each JSONL line back
    # into a typed DTO.
    $outputs = $threadJobs | Wait-Job | Receive-Job | ForEach-Object {
        $job = $_
        [EdgeGrammar.Modules.Dto.EdgeDtoEdgeGrammar.Modules.Dto.AgentMemoryDto]$AgentMemory = (Get-Content $job.FullName | ConvertFrom-Json)
        return $AgentMemory
    }

    return $outputs
}

# ────────────────────────────────────────────────────────────────────────────
# Get-AgentMemoryByEntity
# ────────────────────────────────────────────────────────────────────────────
function Get-AgentMemoryByEntity {
    <#
    .SYNOPSIS
        Returns the N most-recent AgentMemory records for a specific Entity.

    .DESCRIPTION
        Reads up to $Count JSONL files from the Entity's ledger directory,
        sorted by LastWriteTime descending (newest first).  Hard-capped at
        10 000 records to prevent runaway memory usage.

    .PARAMETER Entity
        The EntityEnum whose records to retrieve.

    .PARAMETER Count
        Maximum number of records to return (1 – 10 000).

    .OUTPUTS
        [EdgeGrammar.Modules.Dto.EdgeDtoEdgeGrammar.Modules.Dto.AgentMemoryDto[]]

    .EXAMPLE
        Get-AgentMemoryByEntity -Entity Claude -Count 5
    #>
    [CmdletBinding()]
    param(
        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Which personas memories to retrieve.'
        )]
        [EdgeGrammar.Modules.Dto.EntityEnum]$Entity,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'How many recent entries you want back.'
        )]
        [int]$Count
    )

    # Guard: both parameters are required.
    if (
        [string]::IsNullOrWhiteSpace($Entity.ToString()) -or
        -not $Count -or $Count -lt 1
    ) {
        Write-Warning 'AgentMemory:Get-AgentMemoryByEntity - Entity and Count are required.'
        return
    }

    # Cap to prevent accidental full-ledger loads.
    $limit = $Count
    if ($limit -gt 10000) {
        $limit = 10000
    }

    $basePath     = Join-Path -Path "~" ".EdgeGrammar" "agentmemory"
    $resolvedPath = Resolve-Path $basePath

    if (-not (Test-Path $resolvedPath)) {
        Write-Warning 'AgentMemory:Get-AgentMemoryByEntity - The agent memory directory is empty.'
        return
    }

    # Validate that this Entity has any records at all.
    $entityPath = Join-Path $resolvedPath $Entity
    if (-not (Test-Path $entityPath)) {
        Write-Warning "AgentMemory:Get-AgentMemoryByEntity - $entityPath does not exist."
        return
    }

    # Stream records newest-first, deserialising each JSONL line into a DTO.
    Get-ChildItem -Path $entityPath |
    Sort-Object -Property LastWriteTime -Descending |
    Select-Object -First $limit |
    ForEach-Object {
        Write-Verbose "Getting memory at $($_.FullName)"
        [EdgeGrammar.Modules.Dto.AgentMemoryDto]$agentMemory = Get-Content -Path $_.FullName -Encoding utf8 | ConvertFrom-Json
        return $agentMemory
    }
}

# ────────────────────────────────────────────────────────────────────────────
# Analytics helpers  (all read-only, SilentlyContinue on missing entities)
# ────────────────────────────────────────────────────────────────────────────

function Get-AgentMemoryWorkDistribution {
    <#
    .SYNOPSIS
        Displays a percentage breakdown of memory records grouped by Work domain
        across all Entities.

    .DESCRIPTION
        Aggregates up to 1 000 records per Entity, groups by the Work field,
        and prints a formatted table showing Name, Count, and Percentage.
        Useful for understanding where cognitive effort is concentrated.

    .EXAMPLE
        Get-AgentMemoryWorkDistribution
    #>
    [CmdletBinding()]
    param()

    $ErrorActionPreference = 'SilentlyContinue'

    [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object { Get-AgentMemoryByEntity -Entity $_ -Count 1000 } |
        Tee-Object -Variable m |          # capture total count for % calculation
        Group-Object work |
        Sort-Object Count -Descending
}

function Get-AgentMemoryNoteLengthStatistics {
    <#
    .SYNOPSIS
        Computes descriptive statistics (mean, std-dev, percentiles) for note
        length across all persisted memories.

    .DESCRIPTION
        Flattens all notes in each record to a single string and measures its
        character length.  Returns Min, Median, P90, P99, Max, Mean, StdDev,
        and Count — useful for monitoring note quality and token budget trends.

    .EXAMPLE
        Get-AgentMemoryNoteLengthStatistics
    #>
    [CmdletBinding()]
    param()

    $ErrorActionPreference = 'SilentlyContinue'

    # Flatten notes per record to a single string for length measurement.
    $lengths = [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object { Get-AgentMemoryByEntity -Entity $_ -Count 1000 } |
        ForEach-Object { ($_.notes -join "`n").Length } |
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

function Get-AgentMemoryEntityActivitySummary {
    <#
    .SYNOPSIS
        Shows how many memory records each Entity has written, sorted by
        activity descending.

    .DESCRIPTION
        Iterates every EntityEnum value and counts its persisted records
        (up to 1 000).  Useful for identifying which agents are most active
        in the system.

    .EXAMPLE
        Get-AgentMemoryEntityActivitySummary
    #>
    [CmdletBinding()]
    param()

    $ErrorActionPreference = 'SilentlyContinue'

    $Activity = [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object {
            [PSCustomObject]@{
                Entity = $_
                Count  = (Get-AgentMemoryByEntity -Entity $_ -Count 1000).Count
            }
        }
    $Activity
}

function Get-AgentMemoryRelationTypeDistribution {
    <#
    .SYNOPSIS
        Shows the distribution of RelationEnum values across all embedded Links.

    .DESCRIPTION
        Collects every Link from every memory record across all Entities and
        groups them by their Relation type.  Provides a percentage breakdown
        to reveal which relationship patterns (Creates, Tests, Learns, etc.)
        dominate the system's activity graph.

    .EXAMPLE
        Get-AgentMemoryRelationTypeDistribution
    #>
    [CmdletBinding()]
    param()

    $ErrorActionPreference = 'SilentlyContinue'

    $RelationTypes = [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues() |
        ForEach-Object { Get-AgentMemoryByEntity -Entity $_ -Count 1000 } |
        ForEach-Object { $_.links } |
        Where-Object { ${_}?.relation } |         # skip records with no links
        Tee-Object -Variable allLinks |
        Group-Object relation
    $RelationTypes
}

# ────────────────────────────────────────────────────────────────────────────
# Search-AgentMemory
# ────────────────────────────────────────────────────────────────────────────
function Search-AgentMemory {
    <#
    .SYNOPSIS
        Full-text search across all AgentMemory note content.

    .DESCRIPTION
        Scans the notes of every persisted AgentMemory record for a given
        pattern, returning structured result objects for each match.

        Designed for 1M-token context workflows: use this to locate specific
        memories before loading the full ledger, or to surface failure records,
        plan votes, and cross-domain decisions buried in the ledger.

        Optional filters narrow results by Entity, Work domain, or Link
        Relation type.  Results are sorted newest-first by TickStamp.

        Returns [PSCustomObject[]] — callers own formatting so results can be
        piped, filtered, or injected into context prompts.

    .PARAMETER Pattern
        Regex pattern to search for across all note strings.
        Use -SimpleMatch to disable regex interpretation (literal match).

    .PARAMETER Entity
        Limit the search scope to one or more EntityEnum values.
        When omitted every Entity in the ledger is searched.

    .PARAMETER Work
        Post-match filter: only return results whose Work field equals this
        WorkEnum value.  Applied after pattern matching.

    .PARAMETER Relation
        Post-match filter: only return records that also contain at least one
        Link whose Relation equals this RelationEnum value.

    .PARAMETER MaxPerEntity
        Maximum records to scan per Entity.  Default: 500.
        Raise to search deeper history; lower for speed on large ledgers.

    .PARAMETER CaseSensitive
        Switch — makes the pattern match case-sensitive.
        Default is case-insensitive.

    .PARAMETER SimpleMatch
        Switch — treat Pattern as a plain literal string rather than a regex.
        Useful when searching for code snippets, file paths, or enum names
        that contain regex-special characters.

    .OUTPUTS
        [PSCustomObject[]] — each object has:
            Entity       [EdgeGrammar.Modules.Dto.EntityEnum]  — owner of the record
            Work         [EdgeGrammar.Modules.Dto.WorkEnum]     — domain of the record
            TickStamp    [long]                       — Unix-ms write time
            MatchCount   [int]                        — notes that matched
            MatchedNotes [string[]]                   — the matching note strings
            Links        [EdgeGrammar.Modules.Dto.Link[]]       — all links in the record

    .EXAMPLE
        # Find every memory that mentions CMMC
        Search-AgentMemory -Pattern 'CMMC'

    .EXAMPLE
        # Surface failure memories across the ledger
        Search-AgentMemory -Pattern 'fail|error|broken' -Work GloriousFailure

    .EXAMPLE
        # Locate quorum votes by Claude and Architect
        Search-AgentMemory -Pattern 'quorum' -Entity Claude, Architect

    .EXAMPLE
        # Literal search for a file path fragment (disables regex)
        Search-AgentMemory -Pattern 'AgentMemoryDto.cs' -SimpleMatch

    .EXAMPLE
        # Pipe results to extract just the matched text
        Search-AgentMemory -Pattern 'TypeGen' |
            ForEach-Object { $_.MatchedNotes } |
            Select-Object -Unique
    #>
    [CmdletBinding()]
    param(
        [Parameter(
            Mandatory   = $true,
            Position    = 0,
            HelpMessage = 'Regex pattern (or literal string with -SimpleMatch) to search note content.'
        )]
        [string]$Pattern,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Restrict search to one or more Entities. Searches all when omitted.'
        )]
        [EdgeGrammar.Modules.Dto.EntityEnum[]]$Entity,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Return only records whose Work field matches this value.'
        )]
        [EdgeGrammar.Modules.Dto.WorkEnum]$Work,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Return only records that contain a Link with this Relation.'
        )]
        [EdgeGrammar.Modules.Dto.RelationEnum]$Relation,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Max records to scan per Entity. Default 500; max 10 000.'
        )]
        [ValidateRange(1, 10000)]
        [int]$MaxPerEntity = 500,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Enable case-sensitive matching. Default is case-insensitive.'
        )]
        [switch]$CaseSensitive,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Treat Pattern as a literal string — disables regex interpretation.'
        )]
        [switch]$SimpleMatch
    )

    # Guard: pattern required (redundant with Mandatory but explicit is better).
    if ([string]::IsNullOrWhiteSpace($Pattern)) {
        Write-Warning 'AgentMemory:Search-AgentMemory - Pattern is required and cannot be empty or whitespace.'
        return
    }

    # Resolve entity scope: caller-specified subset or every known EntityEnum.
    $entitiesToSearch = if ($PSBoundParameters.ContainsKey('Entity') -and $Entity.Count -gt 0) {
        $Entity
    }
    else {
        [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues()
    }

    # Build Select-String options once — applied per-note inside the loop.
    $ssParams = @{
        Pattern       = $Pattern
        Quiet         = $true
        CaseSensitive = $CaseSensitive.IsPresent
        SimpleMatch   = $SimpleMatch.IsPresent
    }

    $entitiesToSearch |
        ForEach-Object {
            $ErrorActionPreference = 'SilentlyContinue'
            Get-AgentMemoryByEntity -Entity $_ -Count $MaxPerEntity
        } |
        ForEach-Object {
            $memory = $_

            # Test each note string individually so we can return only the
            # matching subset — callers may want to inspect the exact match.
            $matchedNotes = @(
                $memory.notes | Where-Object {
                    $_ | Select-String @ssParams
                }
            )

            # Skip records with no note hits.
            if ($matchedNotes.Count -eq 0) { return }

            [PSCustomObject]@{
                Entity       = $memory.entity
                Work         = $memory.work
                TickStamp    = $memory.tickStamp
                MatchCount   = $matchedNotes.Count
                MatchedNotes = $matchedNotes
                Links        = $memory.links
            }
        } |
        # Optional: narrow to a specific Work domain.
        Where-Object {
            if ($PSBoundParameters.ContainsKey('Work')) { $_.Work -eq $Work }
            else { $true }
        } |
        # Optional: keep only records with at least one Link of the requested Relation.
        Where-Object {
            if ($PSBoundParameters.ContainsKey('Relation')) {
                ($_.Links | Where-Object { ${_}?.relation -eq $Relation.ToString() }).Count -gt 0
            }
            else { $true }
        } |
        Sort-Object -Property TickStamp -Descending
}

# ────────────────────────────────────────────────────────────────────────────
# Get-AgentMemoryContext
# ────────────────────────────────────────────────────────────────────────────
function Get-AgentMemoryContext {
    <#
    .SYNOPSIS
        Serializes the entire AgentMemory ledger as structured markdown for
        injection into a 1M-token context window.

    .DESCRIPTION
        Loads memories for every Entity (or a specified subset), organises them
        by Entity → Work domain → newest-first, and emits a single markdown
        string ready to be injected as a system prompt or context block.

        A header table reports: generation time, entities loaded, total record
        count, estimated token cost, and percentage of a 1M-token budget
        consumed.  Token estimate uses the standard 4-chars-per-token heuristic.

        Use -OutFile to persist the snapshot to disk for reuse across sessions
        without re-reading the ledger.

        This function is the reason Search-AgentMemory exists: search first to
        locate what matters, then call Get-AgentMemoryContext for the entities
        and Work domains you need — rather than loading the full ledger blindly.

    .PARAMETER Entity
        One or more EntityEnum values to include.
        When omitted every Entity in the ledger is loaded.

    .PARAMETER MaxPerEntity
        Maximum records to include per Entity.  Default: 500.
        Set to 10 000 to load complete history for all entities.

    .PARAMETER OutFile
        Optional file path — writes the context string to disk in addition to
        returning it.  Useful for snapshotting a stable context across sessions.

    .OUTPUTS
        [string] — structured markdown, token-budget aware, injection-ready.

    .EXAMPLE
        # Full ledger, default depth
        $ctx = Get-AgentMemoryContext

    .EXAMPLE
        # Inject into a chat system prompt
        $system = Get-AgentMemoryContext -MaxPerEntity 200

    .EXAMPLE
        # Save a snapshot then inject from file
        Get-AgentMemoryContext -OutFile '~/.EdgeGrammar/context-snapshot.md'
        $ctx = Get-Content '~/.EdgeGrammar/context-snapshot.md' -Raw

    .EXAMPLE
        # Deep history for two entities only
        Get-AgentMemoryContext -Entity Claude, Architect -MaxPerEntity 1000
    #>
    [CmdletBinding()]
    param(
        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Entities to include. Loads all when omitted.'
        )]
        [EdgeGrammar.Modules.Dto.EntityEnum[]]$Entity,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Max records per Entity. Default 500; max 10 000.'
        )]
        [ValidateRange(1, 10000)]
        [int]$MaxPerEntity = 500,

        [Parameter(
            Mandatory   = $false,
            HelpMessage = 'Optional file path — snapshot the context string to disk.'
        )]
        [string]$OutFile
    )

    # Resolve entity scope.
    $entitiesToLoad = if ($PSBoundParameters.ContainsKey('Entity') -and $Entity.Count -gt 0) {
        $Entity
    }
    else {
        [EdgeGrammar.Modules.Dto.EntityEnum].GetEnumValues()
    }

    # Emoji per entity — purely cosmetic, aids visual scanning in context.
    $entityEmoji = @{
        Architect = '🏗️'
        Claude    = '🧠'
        Codex     = '🤖'
        Gemini    = '✨'
        Grok      = '⚡'
        GPT       = '🔵'
        Human     = '👤'
        Self      = '🔮'
        System    = '⚙️'
        Agent     = '👻'
    }

    # ── Load all memories, grouped by entity ──────────────────────────────
    $allByEntity = [ordered]@{}
    $totalCount  = 0

    foreach ($e in $entitiesToLoad) {
        $ErrorActionPreference = 'SilentlyContinue'
        $memories = @(Get-AgentMemoryByEntity -Entity $e -Count $MaxPerEntity)

        if ($memories.Count -gt 0) {
            $allByEntity[$e.ToString()] = $memories
            $totalCount += $memories.Count
        }
    }

    $generated = [DateTimeOffset]::UtcNow.LocalDateTime.ToString('yyyy-MM-dd HH:mm')

    # ── Build markdown using List<string> for O(n) concatenation ──────────
    $lines = [System.Collections.Generic.List[string]]::new()

    # Header — token estimate injected after the body is built.
    $lines.Add('# AgentMemory Context')
    $lines.Add('')
    $lines.Add('| Field | Value |')
    $lines.Add('|---|---|')
    $lines.Add("| Generated     | $generated |")
    $lines.Add("| Entities      | $($allByEntity.Keys -join ', ') |")
    $lines.Add("| Total Records | $totalCount |")
    $lines.Add("| MaxPerEntity  | $MaxPerEntity |")
    $lines.Add('| Est. Tokens   | calculating… |')
    $lines.Add('')
    $lines.Add('---')
    $lines.Add('')

    # ── Per-entity sections ────────────────────────────────────────────────
    foreach ($entityName in $allByEntity.Keys) {
        $memories    = $allByEntity[$entityName]
        $emoji       = if ($entityEmoji.ContainsKey($entityName)) { $entityEmoji[$entityName] } else { '•' }

        $lines.Add("## $emoji $entityName ($($memories.Count) records)")
        $lines.Add('')

        # Group by Work domain, highest-count domains first.
        $byWork = $memories | Group-Object work | Sort-Object Count -Descending

        foreach ($workGroup in $byWork) {
            $lines.Add("### $($workGroup.Name) ($($workGroup.Count))")
            $lines.Add('')

            # Newest-first within each Work group.
            $workGroup.Group | Sort-Object tickStamp -Descending | ForEach-Object {
                $memory  = $_
                $dateStr = ([DateTimeOffset]::FromUnixTimeMilliseconds($memory.tickStamp)).LocalDateTime.ToString('yyyy-MM-dd HH:mm')

                # Single-note records: flat bullet.  Multi-note: nested bullets.
                if ($memory.notes.Count -eq 1) {
                    $lines.Add("- **$dateStr** — $($memory.notes[0])")
                }
                else {
                    $lines.Add("- **$dateStr**")
                    foreach ($note in $memory.notes) {
                        $lines.Add("  - $note")
                    }
                }

                # Inline link metadata — surfaces the relationship graph inline.
                foreach ($link in $memory.links) {
                    $lines.Add("  - 🔗 ``$($link.fromEntity)`` **$($link.relation)** ``$($link.toEntity)`` [$($link.work)]")
                }
            }

            $lines.Add('')
        }

        $lines.Add('---')
        $lines.Add('')
    }

    $context = $lines -join "`n"

    # ── Inject real token estimate into the header placeholder ────────────
    $charCount     = $context.Length
    $tokenEstimate = [math]::Round($charCount / 4)
    $budgetPct     = [math]::Round($tokenEstimate / 1000000 * 100, 1)
    $tokenLabel    = "~$tokenEstimate (~$budgetPct% of 1M budget)"

    $context = $context.Replace('| Est. Tokens   | calculating… |', "| Est. Tokens   | $tokenLabel |")

    # ── Optional snapshot to disk ─────────────────────────────────────────
    if (-not [string]::IsNullOrWhiteSpace($OutFile)) {
        $resolvedOut = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutFile)
        Set-Content -Path $resolvedOut -Value $context -Encoding utf8 -Force
        Write-Verbose "Context snapshot written to $resolvedOut ($charCount chars, $tokenEstimate est. tokens)"
    }

    return $context
}

Export-ModuleMember -Function New-Memory