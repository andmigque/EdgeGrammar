---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Get-MemoryWorkDistribution

## SYNOPSIS
Summarizes memory counts by work domain.

## SYNTAX

```
Get-MemoryWorkDistribution [-ProgressAction <ActionPreference>] [<CommonParameters>]
```

## DESCRIPTION
Loads recent memories across all entities, groups them by the Work field,
and sorts the grouped results by descending count.

## EXAMPLES

### EXAMPLE 1
```
Get-MemoryWorkDistribution | Select-Object -First 5
Returns the most common work domains currently represented in saved memories.
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

### Microsoft.PowerShell.Commands.GroupInfo
## NOTES

## RELATED LINKS
