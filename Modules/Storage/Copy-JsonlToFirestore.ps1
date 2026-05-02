$credential = [EdgeGrammar.Modules.Storage.FirestoreClient]::GetCredential()
$firestoreDb = [EdgeGrammar.Modules.Storage.FirestoreClient]::GetFirestoreDb(
    [EdgeGrammar.Modules.Mcp.EdgeGrammarMcp]::firestoreProjectId,
    $credential
).Result

Get-ChildItem -Recurse -Force -File ~\EdgeGrammar\agentmemory | ForEach-Object {

    $jsonlRecord = Get-Content -Path $_.FullName -Raw | Out-String | ConvertFrom-Json -Depth 10

    $firestoreDto = [EdgeGrammar.Modules.Dto.AgentMemoryFirestoreDto]::new()

    $firestoreDto.TickStamp = $jsonlRecord.TickStamp
    $firestoreDto.Entity    = $jsonlRecord.Entity
    $firestoreDto.Work      = $jsonlRecord.Work
    $firestoreDto.Notes     = $jsonlRecord.Notes
    $firestoreDto.ToEntity  = $jsonlRecord.Edge.ToEntity
    $firestoreDto.Relation  = $jsonlRecord.Edge.Relation


    Write-Output $firestoreDto

    $collection = $firestoreDb.Collection($jsonlRecord.Entity)
    $document   = $collection.AddAsync($firestoreDto).Result

    Write-Output "Migrated: $($_.Name) → $($document.Id)"

    Start-Sleep -Milliseconds 400
}