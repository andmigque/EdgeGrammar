---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Search-Memory

## SYNOPSIS
Searches memory notes for matching text.

## SYNTAX

```
Search-Memory [-Pattern] <String> [-Entity <EntityEnum[]>] [-Work <WorkEnum>] [-Relation <RelationEnum>]
 [-MaxPerEntity <Int32>] [-CaseSensitive] [-SimpleMatch] [-ProgressAction <ActionPreference>]
 [<CommonParameters>]
```

## DESCRIPTION
Scans saved memory notes across one or more entities and returns only the records whose
note content matches the supplied pattern.
Supports regex or literal matching, optional
case sensitivity, and additional filtering by work domain or edge relation.

## EXAMPLES

### EXAMPLE 1
```
Search-Memory -Pattern 'PlatyPS' -SimpleMatch
Finds memory records whose notes contain the literal text 'PlatyPS'.
```

### EXAMPLE 2
```
Search-Memory -Pattern 'test|pester' -Entity Claude -Work AgentMemory
Searches Claude's AgentMemory entries with a regex pattern and returns the matching records.
```

## PARAMETERS

### -Pattern
Regex pattern (or literal string with -SimpleMatch) to search note content.

```yaml
Type: System.String
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Entity
Restrict search to one or more Entities.
Searches all when omitted.

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum[]
Parameter Sets: (All)
Aliases:
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex, Qwen

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Work
Return only records whose Work field matches this value.

```yaml
Type: EdgeGrammar.Modules.Dto.WorkEnum
Parameter Sets: (All)
Aliases:
Accepted values: PowerNixxServer, SystemPrompt, Npm, Pester, Devops, Infrastructure, DataPlane, ModelContextProtocol, Security, Reactor, MarkdownChat, AgentMemory, Research, Plan, Fragment, Frontend, Troubleshoot, GloriousFailure, CMMC, SharpeX, CMMCPower, CMMCPowerLearn, EdgeGrammar, Approval, Collab

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Relation
Return only records that contain an Edge with this Relation.

```yaml
Type: EdgeGrammar.Modules.Dto.RelationEnum
Parameter Sets: (All)
Aliases:
Accepted values: Depends, Creates, Tests, Refactors, Throws, Runs, Guides, Learns, Configures, Interrupts, Thinks, Delivers, Reviews, Documents, Implements, Fixes, Observes, Analyzes, Designs, Encourages, Requests, Reports, Credits, Evolves, Understands, Thanks, Accepts, Imagines, Decodes, Collaborates, Questions, Plans, Grows, Transcends, Reflects, Realizes, Integrates, Delegates, Proposes, Researches, Retrospects

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -MaxPerEntity
Max records to scan per Entity.
Default 500; max 10 000.

```yaml
Type: System.Int32
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: 500
Accept pipeline input: False
Accept wildcard characters: False
```

### -CaseSensitive
Enable case-sensitive matching.

```yaml
Type: System.Management.Automation.SwitchParameter
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```

### -SimpleMatch
Treat Pattern as a literal string - disables regex interpretation.

```yaml
Type: System.Management.Automation.SwitchParameter
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```

### -ProgressAction
{{ Fill ProgressAction Description }}

```yaml
Type: System.Management.Automation.ActionPreference
Parameter Sets: (All)
Aliases: proga

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](http://go.microsoft.com/fwlink/?LinkID=113216).

## INPUTS

## OUTPUTS

### System.Management.Automation.PSCustomObject
## NOTES

## RELATED LINKS
