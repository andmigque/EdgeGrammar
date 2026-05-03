/// # ByteUnit
///
/// > Utility class for byte unit conversions and percentage calculations.
///
/// - Module utility for transforming data, not a boundary-crossing DTO.
/// - Supports conversions from bytes up to Petabytes.
/// - Provides both `long` and `double` precision conversion methods.
///
/// ## Methods
///
/// ### ConvertFromBytes
///
/// > Converts bytes to the largest appropriate unit with human-readable integer value.
///
/// ```csharp
/// public (long Value, ResourceUnit Unit) ConvertFromBytes(long bytes)
/// ```
///
/// - **Parameters**
///   - `long` **bytes** - The raw byte count to convert.
/// - **Returns**
///   - `(long, ResourceUnit)` - A tuple containing the converted value and the corresponding `ResourceUnit`.
///
/// ### ConvertFromBytesDouble
///
/// > Converts bytes to the largest appropriate unit with double-precision decimal value.
///
/// ```csharp
/// public (double Value, ResourceUnit Unit) ConvertFromBytesDouble(long bytes)
/// ```
///
/// - **Parameters**
///   - `long` **bytes** - The raw byte count to convert.
/// - **Returns**
///   - `(double, ResourceUnit)` - A tuple containing the converted decimal value and the corresponding `ResourceUnit`.
///
/// ### CalculatePercent
///
/// > Calculates the percentage of a numerator relative to a denominator with specified precision.
///
/// ```csharp
/// public double CalculatePercent(long numerator, long denominator, int precision = 2)
/// ```
///
/// - **Parameters**
///   - `long` **numerator** - The partial value.
///   - `long` **denominator** - The total value (must not be zero).
///   - `int` **precision** - The number of decimal places to round to (default: 2).
/// - **Returns**
///   - `double` - The calculated percentage.
/// - **Exceptions**
///   - `ArgumentException` - Thrown when the denominator is zero.
///
/// ## Namespace
///
/// ```csharp
/// EdgeGrammar.Modules.Unit
/// ```
///
/// ## Definition
///
/// ```csharp
/// public class ByteUnit
/// ```
namespace EdgeGrammar.Modules.Unit;

public class ByteUnit
{
    private const long KB = 1024;
    private const long MB = 1048576;           // 1024²
    private const long GB = 1073741824;        // 1024³
    private const long TB = 1099511627776;     // 1024⁴
    private const long PB = 1125899906842624;  // 1024⁵

    public ByteUnit() { }

    public (long Value, ResourceUnit Unit) ConvertFromBytes(long bytes)
    {
        if (bytes >= PB) return (bytes / PB, ResourceUnit.PB);
        if (bytes >= TB) return (bytes / TB, ResourceUnit.TB);
        if (bytes >= GB) return (bytes / GB, ResourceUnit.GB);
        if (bytes >= MB) return (bytes / MB, ResourceUnit.MB);
        if (bytes >= KB) return (bytes / KB, ResourceUnit.KB);
        return (bytes, ResourceUnit.B);
    }

    public (double Value, ResourceUnit Unit) ConvertFromBytesDouble(long bytes)
    {
        if (bytes >= PB) return ((double)bytes / PB, ResourceUnit.PB);
        if (bytes >= TB) return ((double)bytes / TB, ResourceUnit.TB);
        if (bytes >= GB) return ((double)bytes / GB, ResourceUnit.GB);
        if (bytes >= MB) return ((double)bytes / MB, ResourceUnit.MB);
        if (bytes >= KB) return ((double)bytes / KB, ResourceUnit.KB);
        return (bytes, ResourceUnit.B);
    }

    public double CalculatePercent(long numerator, long denominator, int precision = 2)
    {
        if (denominator == 0)
            throw new ArgumentException("Denominator cannot be zero", nameof(denominator));
        
        return Math.Round((double)numerator / denominator * 100, precision);
    }
}
