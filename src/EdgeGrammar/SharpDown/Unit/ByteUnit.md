# ByteUnit


### Namespace
```csharp
EdgeGrammar.Modules.Unit
```
### Definition

```csharp
public class ByteUnit
```
## Methods
### ConvertFromBytes



```csharp
public (long Value, ResourceUnit Unit) ConvertFromBytes(long bytes)
```

- **Parameters**
  - `long` **bytes** - 

- **Returns**
  - `(long Value, ResourceUnit Unit)`
### ConvertFromBytesDouble



```csharp
public (double Value, ResourceUnit Unit) ConvertFromBytesDouble(long bytes)
```

- **Parameters**
  - `long` **bytes** - 

- **Returns**
  - `(double Value, ResourceUnit Unit)`
### CalculatePercent



```csharp
public double CalculatePercent(long numerator, long denominator, int precision = 2)
```

- **Parameters**
  - `long` **numerator** - 
  - `long` **denominator** - 
  - `int` **precision** - 

- **Returns**
  - `double`
- **Exceptions**
  - `ArgumentException`

