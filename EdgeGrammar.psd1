@{

    # Script module or binary module file associated with this manifest.
    RootModule        = '.\EdgeGrammar.psm1'

    # Version number of this module.
    ModuleVersion     = '0.1.0'

    # ID used to uniquely identify this module
    GUID              = 'c2d3e4f5-a6b7-c8d9-e0f1-a2b3c4d5e6f7'

    # Author of this module
    Author            = 'Andres Quesada'

    # Company or vendor of this module
    CompanyName       = 'EdgeGrammar'

    # Copyright statement for this module
    Copyright         = '(c) 2026 Andres Quesada. All Rights Reserved.'

    # Description of the functionality provided by this module
    Description       = 'Append-only cognitive ledger for multi-agent AI systems.'

    # Minimum version of the PowerShell engine required by this module
    PowerShellVersion = '7.5'

    # Modules that must be imported into the global environment prior to importing this module
    RequiredModules   = @(
        @{ ModuleName = 'platyPS'; RequiredVersion = '0.14.2' }
        @{ ModuleName = 'Pester'; RequiredVersion = '5.7.1' }
        @{ ModuleName = 'PSScriptAnalyzer'; RequiredVersion = '1.24.0' }
        @{ ModuleName = 'Psake'; RequiredVersion = '4.9.1' }
    )

    # Modules to import as nested modules of the module specified in RootModule/ModuleToProcess
    NestedModules     = @(
        '.\Modules\AgentMemory\AgentMemory.psm1',
        '.\Modules\Config\Config.psm1'
    )

    # Functions to export from this module
    FunctionsToExport = '*'
    CmdletsToExport = @()
    AliasesToExport = @()

    PrivateData = @{
        PSData = @{}
    }

}