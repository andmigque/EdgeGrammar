using System.Globalization;

namespace EdgeGrammar.Modules.Unit;

/// <summary>
/// Utility class for tick conversions and timestamp normalization.
/// </summary>
public class TickStampUnit
{
    private static readonly DateTime UnixEpochUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
    /// <summary>UTC ticks captured at the moment this instance was constructed.</summary>
    public long Ticks { get; }
    public TickStampUnit() {
        Ticks = NowUtcTicks();
    }

    /// <summary>
    /// Returns current UTC tick stamp.
    /// </summary>
    public long NowUtcTicks()
    {
        return DateTime.UtcNow.Ticks;
    }

    /// <summary>
    /// Returns current local tick stamp.
    /// </summary>
    public long NowLocalTicks()
    {
        return DateTime.Now.Ticks;
    }

    /// <summary>
    /// Converts ticks to a UTC DateTime.
    /// </summary>
    public DateTime ToUtcDateTime(long ticks)
    {
        return new DateTime(ticks, DateTimeKind.Utc);
    }

    /// <summary>
    /// Converts ticks to a local DateTime.
    /// </summary>
    public DateTime ToLocalDateTime(long ticks)
    {
        return new DateTime(ticks, DateTimeKind.Utc).ToLocalTime();
    }

    /// <summary>
    /// Converts a DateTime to UTC ticks.
    /// </summary>
    public long FromDateTimeUtc(DateTime value)
    {
        return value.Kind == DateTimeKind.Utc ? value.Ticks : value.ToUniversalTime().Ticks;
    }

    /// <summary>
    /// Converts a DateTime to local ticks.
    /// </summary>
    public long FromDateTimeLocal(DateTime value)
    {
        return value.Kind == DateTimeKind.Local ? value.Ticks : value.ToLocalTime().Ticks;
    }

    /// <summary>
    /// Converts ticks to ISO 8601 UTC string.
    /// </summary>
    public string ToIso8601(long ticks)
    {
        return ToUtcDateTime(ticks).ToString("O", CultureInfo.InvariantCulture);
    }

    /// <summary>
    /// Parses ISO 8601 string to UTC ticks.
    /// </summary>
    public long FromIso8601(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("ISO string cannot be empty.", nameof(value));
        }

        var parsed = DateTime.Parse(value, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);
        return parsed.ToUniversalTime().Ticks;
    }

    /// <summary>
    /// Converts ticks to Unix time milliseconds.
    /// </summary>
    public long ToUnixMilliseconds(long ticks)
    {
        return (ticks - UnixEpochUtc.Ticks) / TimeSpan.TicksPerMillisecond;
    }

    /// <summary>
    /// Converts ticks to Unix time seconds.
    /// </summary>
    public long ToUnixSeconds(long ticks)
    {
        return (ticks - UnixEpochUtc.Ticks) / TimeSpan.TicksPerSecond;
    }

    /// <summary>
    /// Converts Unix time milliseconds to ticks.
    /// </summary>
    public long FromUnixMilliseconds(long milliseconds)
    {
        return UnixEpochUtc.AddMilliseconds(milliseconds).Ticks;
    }

    /// <summary>
    /// Converts Unix time seconds to ticks.
    /// </summary>
    public long FromUnixSeconds(long seconds)
    {
        return UnixEpochUtc.AddSeconds(seconds).Ticks;
    }

    /// <summary>
    /// Converts ticks to milliseconds with optional precision.
    /// </summary>
    public double TicksToMilliseconds(long ticks, int precision = 2)
    {
        return Math.Round(ticks / (double)TimeSpan.TicksPerMillisecond, precision);
    }

    /// <summary>
    /// Converts ticks to seconds with optional precision.
    /// </summary>
    public double TicksToSeconds(long ticks, int precision = 2)
    {
        return Math.Round(ticks / (double)TimeSpan.TicksPerSecond, precision);
    }

    /// <summary>
    /// Returns a non-negative delta between two tick stamps.
    /// </summary>
    public long DeltaTicks(long startTicks, long endTicks)
    {
        return endTicks <= startTicks ? 0 : endTicks - startTicks;
    }

    /// <summary>
    /// Returns a non-zero interval between two tick stamps.
    /// </summary>
    public long IntervalTicks(long startTicks, long endTicks, long minimumTicks = 1)
    {
        if (minimumTicks <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(minimumTicks), "Minimum ticks must be positive.");
        }

        long delta = DeltaTicks(startTicks, endTicks);
        return delta < minimumTicks ? minimumTicks : delta;
    }

    /// <summary>
    /// Converts milliseconds to ticks.
    /// </summary>
    public long MillisecondsToTicks(long milliseconds)
    {
        return milliseconds * TimeSpan.TicksPerMillisecond;
    }

    /// <summary>
    /// Converts seconds to ticks.
    /// </summary>
    public long SecondsToTicks(long seconds)
    {
        return seconds * TimeSpan.TicksPerSecond;
    }
}
