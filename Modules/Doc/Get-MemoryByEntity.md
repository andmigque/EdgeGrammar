---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Get-MemoryByEntity

## SYNOPSIS
Gets recent memory records for a single entity.

## SYNTAX

```
Get-MemoryByEntity [[-Entity] <EntityEnum>] [[-Count] <Int32>] [-ProgressAction <ActionPreference>]
 [<CommonParameters>]
```

## DESCRIPTION
Reads the newest saved memory files for the specified entity, deserializes each JSON payload,
and returns up to the requested count in newest-first order.

## EXAMPLES

### EXAMPLE 1
```
Get-MemoryByEntity -Entity Claude -Count 5
Returns the five most recent memory entries written by Claude.
```

### EXAMPLE 2
```
[EdgeGrammar.Modules.Dto.EntityEnum]::Claude | Get-MemoryByEntity -Count 5
Demonstrates pipeline input when the entity value is already available as an enum.
```

## PARAMETERS

### -Entity
Which entity's memories to retrieve.

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum
Parameter Sets: (All)
Aliases:
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex

Required: False
Position: 1
Default value: None
Accept pipeline input: True (ByValue)
Accept wildcard characters: False
```

### -Count
How many recent entries you want back.

```yaml
Type: System.Int32
Parameter Sets: (All)
Aliases:

Required: False
Position: 2
Default value: 10
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

### EdgeGrammar.Modules.Dto.EntityEnum
## OUTPUTS

### System.Object
## NOTES

## RELATED LINKS
