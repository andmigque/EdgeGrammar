---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Get-MemoryContext

## SYNOPSIS
Renders recent memories as prompt-ready context text.

## SYNTAX

```
Get-MemoryContext [[-Entities] <EntityEnum[]>] [[-Count] <Int32>] [[-OutFile] <String>]
 [-ProgressAction <ActionPreference>] [<CommonParameters>]
```

## DESCRIPTION
Loads recent memories for the requested entities, formats each memory as Markdown-style text,
and returns the rendered context.
When -OutFile is provided, the same rendered context is also
written to disk for handoff or prompt bootstrapping.

## EXAMPLES

### EXAMPLE 1
```
Get-MemoryContext -Entities Claude, Architect -Count 5
Returns formatted context for the five most recent memories from Claude and Architect.
```

### EXAMPLE 2
```
Get-MemoryContext -Count 10 -OutFile '.\memory-context.md'
Renders context for all entities, writes it to .\memory-context.md, and returns the same text.
```

## PARAMETERS

### -Entities
Entities to include.
Loads all when omitted.

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum[]
Parameter Sets: (All)
Aliases: Entity
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex

Required: False
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Count
Max records per Entity.
Default 500; max 10 000.

```yaml
Type: System.Int32
Parameter Sets: (All)
Aliases:

Required: False
Position: 2
Default value: 500
Accept pipeline input: False
Accept wildcard characters: False
```

### -OutFile
Optional file path - snapshot the context string to disk.

```yaml
Type: System.String
Parameter Sets: (All)
Aliases:

Required: False
Position: 3
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

### System.String
## NOTES

## RELATED LINKS
