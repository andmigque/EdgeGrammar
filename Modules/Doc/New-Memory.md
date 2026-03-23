---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# New-Memory

## SYNOPSIS
{{ Fill in the Synopsis }}

## SYNTAX

```
New-Memory [-Save] [[-Entity] <EntityEnum>] [[-Work] <WorkEnum>] [[-ToEntity] <EntityEnum>]
 [[-Relation] <RelationEnum>] [[-Notes] <String[]>] [-ProgressAction <ActionPreference>] [<CommonParameters>]
```

## DESCRIPTION
{{ Fill in the Description }}

## EXAMPLES

### Example 1
```powershell
PS C:\> {{ Add example code here }}
```

{{ Add example description here }}

## PARAMETERS

### -Entity
Who is creating this memory and link (the owner of the entry).

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum
Parameter Sets: (All)
Aliases:
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex

Required: False
Position: 0
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Notes
Human-readable rationale or context for the link.

```yaml
Type: System.String[]
Parameter Sets: (All)
Aliases:

Required: False
Position: 4
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Relation
Why the connection matters between the two entities.

```yaml
Type: EdgeGrammar.Modules.Dto.RelationEnum
Parameter Sets: (All)
Aliases:
Accepted values: Depends, Creates, Tests, Refactors, Throws, Runs, Guides, Learns, Configures, Interrupts, Thinks, Delivers, Reviews, Documents, Implements, Fixes, Observes, Analyzes, Designs, Encourages, Requests, Reports, Credits, Evolves, Understands, Thanks, Accepts, Imagines, Decodes, Collaborates, Questions, Plans, Grows, Transcends, Reflects, Realizes, Integrates, Delegates, Proposes, Researches

Required: False
Position: 3
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Save
Automatically save this Memory, or return the object for downstream pipelining

```yaml
Type: System.Management.Automation.SwitchParameter
Parameter Sets: (All)
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -ToEntity
Who/what the memory owner is connecting to.

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum
Parameter Sets: (All)
Aliases:
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex

Required: False
Position: 2
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Work
Which effort this memory+link is documenting.

```yaml
Type: EdgeGrammar.Modules.Dto.WorkEnum
Parameter Sets: (All)
Aliases:
Accepted values: PowerNixxServer, SystemPrompt, Npm, Pester, Devops, Infrastructure, DataPlane, ModelContextProtocol, Security, Reactor, MarkdownChat, AgentMemory, Research, Plan, Fragment, Frontend, Troubleshoot, GloriousFailure, CMMC

Required: False
Position: 1
Default value: None
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

### None

## OUTPUTS

### System.Object
## NOTES

## RELATED LINKS
