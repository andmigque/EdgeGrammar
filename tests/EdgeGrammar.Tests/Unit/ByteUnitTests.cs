using EdgeGrammar.Modules.Unit;
using Xunit;

namespace EdgeGrammar.Tests.Unit;

public class ByteUnitTests
{
    private readonly ByteUnit _unit = new();

    [Fact]
    public void ConvertFromBytes_ReturnsMB_WhenBytesInMegabyteRange()
    {
        var (value, resourceUnit) = _unit.ConvertFromBytes(1_048_576);
        Assert.Equal(1, value);
        Assert.Equal(ResourceUnit.MB, resourceUnit);
    }

    [Fact]
    public void ConvertFromBytesDouble_ReturnsPreciseValue()
    {
        var (value, resourceUnit) = _unit.ConvertFromBytesDouble(1_572_864);
        Assert.Equal(1.5, value);
        Assert.Equal(ResourceUnit.MB, resourceUnit);
    }

    [Fact]
    public void CalculatePercent_ReturnsCorrectValue()
    {
        var result = _unit.CalculatePercent(50, 200);
        Assert.Equal(25.00, result);
    }

    [Fact]
    public void CalculatePercent_ThrowsArgumentException_WhenDenominatorIsZero()
    {
        Assert.Throws<ArgumentException>(() => _unit.CalculatePercent(50, 0));
    }
}
