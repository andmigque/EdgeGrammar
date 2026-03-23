@{
    Severity            = @('Error', 'Warning', 'Information')
    IncludeDefaultRules = $true

    # CustomRulePath      = @(
    #     './analyzers/AvoidNewObjectRule.psm1'
    # )

    Rules               = @{

        # ── Unused Parameter Detection ────────────────────────────────────────
        # Expanded traversal list so pipeline-heavy functions are not false-flagged.
        PSReviewUnusedParameter    = @{
            CommandsToTraverse = @(
                'Where-Object',
                'ForEach-Object',
                'Select-Object',
                'Sort-Object',
                'Group-Object',
                'Remove-PodeRoute'
            )
        }

        # ── Custom Rule ───────────────────────────────────────────────────────
        AvoidNewObjectRule         = @{
            Severity = 'Warning'
        }

        # ── Indentation: 4-space, K&R pipeline style ──────────────────────────
        # Matches the established codebase standard across all .psm1 modules.
        PSUseConsistentIndentation = @{
            Enable              = $true
            IndentationSize     = 4
            PipelineIndentation = 'IncreaseIndentationForFirstPipeline'
            Kind                = 'space'
        }

        # ── Whitespace: operators, pipes, braces, separators ─────────────────
        # CheckParameter = false avoids false positives on typed param declarations.
        PSUseConsistentWhitespace  = @{
            Enable                          = $true
            CheckInnerBrace                 = $true
            CheckOpenBrace                  = $true
            CheckOpenParen                  = $true
            CheckOperator                   = $true
            CheckPipe                       = $true
            CheckPipeForRedundantWhitespace = $false
            CheckSeparator                  = $true
            CheckParameter                  = $false
        }

        # ── Brace Placement: same-line open (K&R), matching close ─────────────
        PSPlaceOpenBrace           = @{
            Enable             = $true
            OnSameLine         = $true
            NewLineAfter       = $true
            IgnoreOneLineBlock = $true
        }

        PSPlaceCloseBrace          = @{
            Enable             = $true
            NoEmptyLineBefore  = $false
            IgnoreOneLineBlock = $true
            NewLineAfter       = $false
        }

        # ── Line Length: 160 chars max ────────────────────────────────────────
        # Generous limit for pipe-chain heavy PowerShell. Tighten to 140 if desired.
        PSAvoidLongLines           = @{
            Enable            = $true
            MaximumLineLength = 130
        }

        # ── Syntax Compatibility: target PS 7.4 ──────────────────────────────
        # Validates the codebase runs on the project's declared runtime (pwsh 7).
        PSUseCompatibleSyntax      = @{
            Enable         = $true
            TargetVersions = @(
                '7.4'
            )
        }

    }

    ExcludeRules        = @(
        # Project standard is UTF-8 NoBOM (confirmed by Gemini AgentMemory audit).
        'PSUseBOMForUnicodeEncodedFile',

        # Editor handles trailing whitespace. Noisy in diffs.
        'PSAvoidTrailingWhitespace',

        # Pode web framework requires Write-Host for page rendering.
        'PSAvoidUsingWriteHost',

        # Invoke-Expression is used intentionally in controlled agent contexts.
        'PSAvoidUsingInvokeExpression'
    )

}
