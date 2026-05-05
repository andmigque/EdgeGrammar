---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# New-Memory

## SYNOPSIS
Creates a memory record and its relational edge in one step.

## SYNTAX

```
New-Memory [-Save] [[-Entity] <EntityEnum>] [[-Work] <WorkEnum>] [[-ToEntity] <EntityEnum>]
 [[-Relation] <RelationEnum>] [[-Notes] <String[]>] [-ProgressAction <ActionPreference>] [<CommonParameters>]
```

## DESCRIPTION
Composes a new AgentMemoryDto together with an EdgeDto that describes the relationship
for the same work item.
Use -Save to persist the record immediately, or omit it to return
the assembled object for inspection or downstream piping.

## EXAMPLES

### EXAMPLE 1
```
New-Memory -Entity Claude -Work AgentMemory -ToEntity Architect -Relation Collaborates -Notes 'Prepared the documentation update.'
Returns a new in-memory record without saving it.
```

### EXAMPLE 2
```
New-Memory -Save -Entity Claude -Work AgentMemory -ToEntity Architect -Relation Collaborates -Notes 'Prepared the documentation update.'
Creates the record and writes it to disk, returning the created file name.
```

## PARAMETERS

### -Save
Automatically save this Memory, or return the object for downstream pipelining

```yaml
Type: System.Management.Automation.SwitchParameter
Parameter Sets: (All)
Aliases:

Required: True
Position: Named
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```

### -Entity
Who is creating this memory and link (the owner of the entry).

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum
Parameter Sets: (All)
Aliases:
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex, Qwen

Required: False
Position: 1
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
Accepted values: PowerNixxServer, SystemPrompt, Npm, Pester, Devops, Infrastructure, DataPlane, ModelContextProtocol, Security, Reactor, MarkdownChat, AgentMemory, Research, Plan, Fragment, Frontend, Troubleshoot, GloriousFailure, CMMC, SharpeX, CMMCPower, CMMCPowerLearn, EdgeGrammar, Approval, Collab

Required: False
Position: 2
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
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex, Qwen

Required: False
Position: 3
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
Accepted values: Depends, Creates, Tests, Refactors, Throws, Runs, Guides, Learns, Configures, Interrupts, Thinks, Delivers, Reviews, Documents, Implements, Fixes, Observes, Analyzes, Designs, Encourages, Requests, Reports, Credits, Evolves, Understands, Thanks, Accepts, Imagines, Decodes, Collaborates, Questions, Plans, Grows, Transcends, Reflects, Realizes, Integrates, Delegates, Proposes, Researches, Retrospects

Required: False
Position: 4
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
Position: 5
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

## OUTPUTS

### EdgeGrammar.Modules.Dto.AgentMemoryDto
### System.String
## NOTES

## RELATED LINKS
