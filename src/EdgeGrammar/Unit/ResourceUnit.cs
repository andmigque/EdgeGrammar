/// # ResourceUnit
///
/// > Defines the supported units of measurement for system resources and data types.
///
/// - Used in conjunction with `ByteUnit` for human-readable resource reporting.
/// - Includes units for frequency (GHz/MHz), storage (GB/MB), and time (TickStamp/DateTime).
///
/// ## Values
///
/// - **GHz**: GigaHertz
/// - **MHz**: MegaHertz
/// - **KHz**: KiloHertz
/// - **GB**: GigaBytes
/// - **MB**: MegaBytes
/// - **KB**: KiloBytes
/// - **B**: Bytes
/// - **TB**: TeraBytes
/// - **PB**: PetaBytes
/// - **Mbps**: Megabits per second
/// - **TickStamp**: High-resolution `DateTime` ticks
/// - **DateTime**: Standard .NET `DateTime`
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
/// public enum ResourceUnit
/// ```
namespace EdgeGrammar.Modules.Unit;
public enum ResourceUnit {
    GHz,
    MHz,
    KHz,
    GB,
    MB,
    KB,
    B,
    TB,
    PB,
    Mbps,
    TickStamp,
    DateTime
}