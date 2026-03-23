BeforeAll {
    $ModuleFile = Join-Path "$PSScriptRoot" "AgentMemory.psm1"
    Import-Module $ModuleFile -Force
}

Describe "Get-AgentMemoryWorkDistribution" {
    It "returns grouped Work records" {
        $result = Get-AgentMemoryWorkDistribution
        $result | Should -Not -BeNullOrEmpty
    }

    It "each group has a Name and Count" {
        $result = Get-AgentMemoryWorkDistribution
        $result[0].Name  | Should -Not -BeNullOrEmpty
        $result[0].Count | Should -BeGreaterThan 0
    }

    It "is sorted descending by Count" {
        $result = Get-AgentMemoryWorkDistribution
        $counts = $result | Select-Object -ExpandProperty Count
        $sorted = $counts | Sort-Object -Descending
        $counts | Should -Be $sorted
    }
}

Describe "Measure-MemmoryStatistic" {
    It "returns a single statistics object" {
        $result = Measure-MemmoryStatistic
        $result | Should -Not -BeNullOrEmpty
        ($result | Measure-Object).Count | Should -Be 1
    }

    It "has all required statistical properties" {
        $result = Measure-MemmoryStatistic
        $result.PSObject.Properties.Name | Should -Contain 'Count'
        $result.PSObject.Properties.Name | Should -Contain 'Mean'
        $result.PSObject.Properties.Name | Should -Contain 'StdDev'
        $result.PSObject.Properties.Name | Should -Contain 'Min'
        $result.PSObject.Properties.Name | Should -Contain 'Median'
        $result.PSObject.Properties.Name | Should -Contain 'P90'
        $result.PSObject.Properties.Name | Should -Contain 'P99'
        $result.PSObject.Properties.Name | Should -Contain 'Max'
    }

    It "Min is not greater than Max" {
        $result = Measure-MemmoryStatistic
        $result.Min | Should -BeLessOrEqual $result.Max
    }
}

Describe "Get-MemorySummary" {
    It "returns a record per entity" {
        $result = Get-MemorySummary
        $result | Should -Not -BeNullOrEmpty
    }

    It "each record has Entity and Count properties" {
        $result = Get-MemorySummary
        $result[0].PSObject.Properties.Name | Should -Contain 'Entity'
        $result[0].PSObject.Properties.Name | Should -Contain 'Count'
    }
}

Describe "Measure-MemoryRelation" {
    It "returns grouped Relation records" {
        $result = Measure-MemoryRelation
        $result | Should -Not -BeNullOrEmpty
    }

    It "each group has a Name and Count" {
        $result = Measure-MemoryRelation
        $result[0].Name  | Should -Not -BeNullOrEmpty
        $result[0].Count | Should -BeGreaterThan 0
    }

    It "is sorted descending by Count" {
        $result = Measure-MemoryRelation
        $counts = $result | Select-Object -ExpandProperty Count
        $sorted = $counts | Sort-Object -Descending
        $counts | Should -Be $sorted
    }
}

Describe "Search-Memory" {
    It "returns matches for a broad pattern" {
        $result = Search-Memory -Pattern "."
        $result | Should -Not -BeNullOrEmpty
    }

    It "each result has Entity, Work, TickStamp, MatchCount, and MatchedNotes" {
        $result = Search-Memory -Pattern "." | Select-Object -First 1
        $result.PSObject.Properties.Name | Should -Contain 'Entity'
        $result.PSObject.Properties.Name | Should -Contain 'Work'
        $result.PSObject.Properties.Name | Should -Contain 'TickStamp'
        $result.PSObject.Properties.Name | Should -Contain 'MatchCount'
        $result.PSObject.Properties.Name | Should -Contain 'MatchedNotes'
    }

    It "respects -Entity filter" {
        $result = Search-Memory -Pattern "." -Entity Claude
        $result | ForEach-Object { $_.Entity | Should -Be 'Claude' }
    }

    It "results are sorted descending by TickStamp" {
        $result = Search-Memory -Pattern "."
        $stamps = $result | Select-Object -ExpandProperty TickStamp
        $sorted = $stamps | Sort-Object -Descending
        $stamps | Should -Be $sorted
    }

    It "returns no results for an unmatched literal" {
        $result = Search-Memory -Pattern "ZZZZZZ_NO_MATCH_ZZZZZZ" -SimpleMatch
        $result | Should -BeNullOrEmpty
    }
}
