---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Measure-MemoryStatistic

## SYNOPSIS
Calculates note-length statistics for saved memories.

## SYNTAX

```
Measure-MemoryStatistic [-ProgressAction <ActionPreference>] [<CommonParameters>]
```

## DESCRIPTION
Loads recent memories across all entities, measures the total character length of each note set,
and returns aggregate statistics including mean, standard deviation, median, and percentiles.

## EXAMPLES

### EXAMPLE 1
```
Measure-MemoryStatistic
Returns a single object that summarizes memory note lengths across the ledger.
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
