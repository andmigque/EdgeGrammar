---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Get-MemoryByEntity

## SYNOPSIS
{{ Fill in the Synopsis }}

## SYNTAX

```
Get-MemoryByEntity [[-Entity] <EntityEnum>] [[-Count] <Int32>] [-ProgressAction <ActionPreference>]
 [<CommonParameters>]
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

### -Count
How many recent entries you want back.

```yaml
Type: System.Int32
Parameter Sets: (All)
Aliases:

Required: False
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Entity
Which entity's memories to retrieve.

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum
Parameter Sets: (All)
Aliases:
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex

Required: False
Position: 0
Default value: None
Accept pipeline input: True (ByValue)
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
