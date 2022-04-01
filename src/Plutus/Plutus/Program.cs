using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Plutus;
using Plutus.Domain.Interfaces;
using Plutus.Domain.Settings;
using Plutus.Infrastructure;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

var settings = new Settings();
builder.Configuration.GetSection("Settings").Bind(settings);
builder.Services.AddSingleton(settings);
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(settings.CircleBaseUrl)});

builder.Services.AddTransient<ICirclePaymentsRepo, CirclePaymentsRepo>();
builder.Services.AddTransient<ICircleAccountsRepo, CircleAccountsRepo>();
await builder.Build().RunAsync();
