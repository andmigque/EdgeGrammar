---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Measure-MemoryRelation

## SYNOPSIS
Summarizes saved memory edges by relation type.

## SYNTAX

```
Measure-MemoryRelation [-ProgressAction <ActionPreference>] [<CommonParameters>]
```

## DESCRIPTION
Loads recent memories across all entities, extracts their Edge records,
groups them by Relation, and sorts the results by descending frequency.

## EXAMPLES

### EXAMPLE 1
```
Measure-MemoryRelation
Returns the most common relationship types found in saved memory edges.
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
