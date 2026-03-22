namespace EdgeGrammar.Modules.Unit;

/// <summary>
/// Utility class for byte unit conversions and percentage calculations.
/// Module utility for transforming data, not boundary-crossing DTO.
/// </summary>
public class ByteUnit
{
    private const long KB = 1024;
    private const long MB = 1048576;           // 1024²
    private const long GB = 1073741824;        // 1024³
    private const long TB = 1099511627776;     // 1024⁴
    private const long PB = 1125899906842624;  // 1024⁵

    public ByteUnit() { }

    /// <summary>
    /// Converts bytes to appropriate unit with human-readable value.
    /// </summary>
    /// <param name="bytes">Raw byte count</param>
    /// <returns>Tuple of (Value, Unit) where Value is converted and Unit is ResourceUnit</returns>
    public (long Value, ResourceUnit Unit) ConvertFromBytes(long bytes)
    {
        if (bytes >= PB) return (bytes / PB, ResourceUnit.PB);
        if (bytes >= TB) return (bytes / TB, ResourceUnit.TB);
        if (bytes >= GB) return (bytes / GB, ResourceUnit.GB);
        if (bytes >= MB) return (bytes / MB, ResourceUnit.MB);
        if (bytes >= KB) return (bytes / KB, ResourceUnit.KB);
        return (bytes, ResourceUnit.B);
    }

    /// <summary>
    /// Converts bytes to appropriate unit with human-readable value (double precision).
    /// </summary>
    /// <param name="bytes">Raw byte count</param>
    /// <returns>Tuple of (Value, Unit) where Value is converted and Unit is ResourceUnit</returns>
    public (double Value, ResourceUnit Unit) ConvertFromBytesDouble(long bytes)
    {
        if (bytes >= PB) return ((double)bytes / PB, ResourceUnit.PB);
        if (bytes >= TB) return ((double)bytes / TB, ResourceUnit.TB);
        if (bytes >= GB) return ((double)bytes / GB, ResourceUnit.GB);
        if (bytes >= MB) return ((double)bytes / MB, ResourceUnit.MB);
        if (bytes >= KB) return ((double)bytes / KB, ResourceUnit.KB);
        return (bytes, ResourceUnit.B);
    }

    /// <summary>
    /// Calculates percentage with specified precision.
    /// </summary>
    /// <param name="numerator">Partial value</param>
    /// <param name="denominator">Total value</param>
    /// <param name="precision">Decimal places (default: 2)</param>
    /// <returns>Percentage as double</returns>
    /// <exception cref="ArgumentException">Thrown when denominator is zero</exception>
    public double CalculatePercent(long numerator, long denominator, int precision = 2)
    {
        if (denominator == 0)
            throw new ArgumentException("Denominator cannot be zero", nameof(denominator));
        
        return Math.Round((double)numerator / denominator * 100, precision);
    }
}
