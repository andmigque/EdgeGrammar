namespace EdgeGrammar.Modules.Unit;

public class TickStampUnit
{
    public long Ticks { get; }

    public TickStampUnit() => this.Ticks = DateTime.UtcNow.Ticks;

    public static DateTime ToUtcDateTime(long ticks) => new DateTime(ticks, DateTimeKind.Utc);

    public static DateTime ToLocalDateTime(long ticks) => ToUtcDateTime(ticks).ToLocalTime();
}
