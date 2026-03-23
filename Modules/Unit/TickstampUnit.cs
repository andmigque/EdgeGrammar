using System.Globalization;

namespace EdgeGrammar.Modules.Unit;

public class TickStampUnit
{
    private static readonly DateTime CenturyBegin = new DateTime(2001, 1, 1);

    public long Ticks { get; }

    public TickStampUnit()
    {
        Ticks = DateTime.UtcNow.Ticks - CenturyBegin.Ticks;
    }

    public DateTime ToUtcDateTime(long ticks)
    {
        return new DateTime(CenturyBegin.Ticks + ticks, DateTimeKind.Utc);
    }

    public DateTime ToLocalDateTime(long ticks)
    {
        return ToUtcDateTime(ticks).ToLocalTime();
    }
}
