using EdgeGrammar.Modules.Unit;
using Xunit;

namespace EdgeGrammar.Tests.Unit;

public class TickStampUnitTests
{
    [Fact]
    public void Ticks_IsPositive()
    {
        var unit = new TickStampUnit();
        Assert.True(unit.Ticks > 0);
    }

    [Fact]
    public void Ticks_IsMonotonicallyIncreasing()
    {
        var first  = new TickStampUnit();
        var second = new TickStampUnit();
        Assert.True(second.Ticks >= first.Ticks);
    }

    [Fact]
    public void ToUtcDateTime_ReturnsUtcKind()
    {
        var unit   = new TickStampUnit();
        var result = TickStampUnit.ToUtcDateTime(unit.Ticks);
        Assert.Equal(DateTimeKind.Utc, result.Kind);
    }
}
