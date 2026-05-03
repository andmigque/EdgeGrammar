# ByteUnit

> Utility class for byte unit conversions and percentage calculations.

- Module utility for transforming data, not a boundary-crossing DTO.
- Supports conversions from bytes up to Petabytes.
- Provides both `long` and `double` precision conversion methods.

## Methods

### ConvertFromBytes

> Converts bytes to the largest appropriate unit with human-readable integer value.

```csharp
public (long Value, ResourceUnit Unit) ConvertFromBytes(long bytes)
```

- **Parameters**
  - `long` **bytes** - The raw byte count to convert.
- **Returns**
  - `(long, ResourceUnit)` - A tuple containing the converted value and the corresponding `ResourceUnit`.

### ConvertFromBytesDouble

> Converts bytes to the largest appropriate unit with double-precision decimal value.

```csharp
public (double Value, ResourceUnit Unit) ConvertFromBytesDouble(long bytes)
```

- **Parameters**
  - `long` **bytes** - The raw byte count to convert.
- **Returns**
  - `(double, ResourceUnit)` - A tuple containing the converted decimal value and the corresponding `ResourceUnit`.

### CalculatePercent

> Calculates the percentage of a numerator relative to a denominator with specified precision.

```csharp
public double CalculatePercent(long numerator, long denominator, int precision = 2)
```

- **Parameters**
  - `long` **numerator** - The partial value.
  - `long` **denominator** - The total value (must not be zero).
  - `int` **precision** - The number of decimal places to round to (default: 2).
- **Returns**
  - `double` - The calculated percentage.
- **Exceptions**
  - `ArgumentException` - Thrown when the denominator is zero.

## Namespace

```csharp
EdgeGrammar.Modules.Unit
```

## Definition

```csharp
public class ByteUnit
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
public class ByteUnit
```
