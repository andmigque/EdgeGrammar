using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using EdgeGrammar.Modules.Mcp;

var builder = Host.CreateApplicationBuilder(args);

builder.Logging.AddConsole(o => o.LogToStandardErrorThreshold = LogLevel.Trace);


builder.Services.AddMcpServer()
    .WithStdioServerTransport()
    .WithTools<EdgeGrammarMcp>();

var app = builder.Build();
await app.RunAsync();
