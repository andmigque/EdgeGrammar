Task default -Depends Install, Compile, Test, Document, AnalyzeScript

Task Install {
    $DataFile = Import-PowerShellDataFile -Path .\EdgeGrammar.psd1
    $DataFile.RequiredModules | ForEach-Object {
        Install-Module -Name $_.ModuleName -RequiredVersion $_.RequiredVersion -Force
    }
}

Task Compile {
    dotnet restore
    dotnet build
}

Task Test {
    Invoke-Pester -Output Minimal
}

Task Document {
    $ModuleFile = Join-Path "$PSScriptRoot" "EdgeGrammar.psm1"
    Import-Module $ModuleFile -Force -Global
    New-MarkdownHelp -Module EdgeGrammar -OutputFolder '.\Modules\Doc' -UseFullTypeName -Force
}

Task AnalyzeScript {
    Get-ChildItem -Recurse -Path $PSScriptRoot -File -Include *.ps1, *.psm1, *.psd1 | ForEach-Object {
        Invoke-ScriptAnalyzer -IncludeDefaultRules -Path "$($_.FullName)" -ReportSummary
    }

}
