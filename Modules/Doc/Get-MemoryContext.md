---
external help file: EdgeGrammar-help.xml
Module Name: EdgeGrammar
online version:
schema: 2.0.0
---

# Get-MemoryContext

## SYNOPSIS
{{ Fill in the Synopsis }}

## SYNTAX

```
Get-MemoryContext [[-Entities] <EntityEnum[]>] [[-MaxPerEntity] <Int32>] [[-OutFile] <String>]
 [-ProgressAction <ActionPreference>] [<CommonParameters>]
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

### -Entities
Entities to include.
Loads all when omitted.

```yaml
Type: EdgeGrammar.Modules.Dto.EntityEnum[]
Parameter Sets: (All)
Aliases: Entity
Accepted values: Architect, Gemini, Claude, Grok, GPT, Human, Self, System, Agent, Codex

Required: False
Position: 0
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -MaxPerEntity
Max records per Entity.
Default 500; max 10 000.

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

### -OutFile
Optional file path - snapshot the context string to disk.

```yaml
Type: System.String
Parameter Sets: (All)
Aliases:

Required: False
Position: 2
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
