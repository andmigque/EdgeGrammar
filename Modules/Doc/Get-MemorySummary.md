---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Get-MemorySummary

## SYNOPSIS
Counts saved memories for each entity.

## SYNTAX

```
Get-MemorySummary [-ProgressAction <ActionPreference>] [<CommonParameters>]
```

## DESCRIPTION
Iterates through every EntityEnum value, attempts to load recent memories for each one,
and returns a simple per-entity count summary.

## EXAMPLES

### EXAMPLE 1
```
Get-MemorySummary
Returns one summary record per entity with the total number of retrieved memories.
```

## PARAMETERS

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
