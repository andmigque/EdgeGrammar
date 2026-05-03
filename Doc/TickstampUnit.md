# TickStampUnit

> Represents a high-resolution UTC timestamp used across the EdgeGrammar system.

- Automatically captures the current UTC ticks on instantiation.
- Provides static helpers for converting ticks to UTC and Local `DateTime` objects.

## Properties

- `long` **Ticks** - The high-resolution UTC tick count.

## Methods

### ToUtcDateTime

> Converts a tick count to a UTC `DateTime` object.

```csharp
public static DateTime ToUtcDateTime(long ticks)
```

- **Parameters**
  - `long` **ticks** - The raw UTC tick count.
- **Returns**
  - `DateTime` - The corresponding `DateTime` object in UTC.

### ToLocalDateTime

> Converts a tick count to a local system `DateTime` object.

```csharp
public static DateTime ToLocalDateTime(long ticks)
```

- **Parameters**
  - `long` **ticks** - The raw UTC tick count.
- **Returns**
  - `DateTime` - The corresponding `DateTime` object in local time.

## Namespace

```csharp
EdgeGrammar.Modules.Unit
```

## Definition

```csharp
public class TickStampUnit
```

## Imports

```csharp

```

## Namespace

```csharp
EdgeGrammar.Modules.Unit
```

## Definition

```csharp
public class TickStampUnit
```
