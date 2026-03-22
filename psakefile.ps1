Task default -Depends Install, Compile, Test, Document

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
    Import-Module $ModuleFile -Force
    New-MarkdownHelp -Module EdgeGrammar -OutputFolder '.\Doc' -UseFullTypeName -Force
}
