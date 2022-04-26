using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Plutus;
using Plutus.Application.Commands;
using Plutus.Application.Queries;
using Plutus.Domain.Interfaces;
using Plutus.Domain.Interfaces.Queries;
using Plutus.Domain.Interfaces.Commands;
using Plutus.Domain.Models.Entities;
using Plutus.Domain.Settings;
using Plutus.Infrastructure;
using System.Net.Http.Headers;
using MudBlazor.Services;
using BlazorState;
using System.Reflection;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

var settings = new Settings();
builder.Configuration.GetSection("Settings").Bind(settings);
builder.Services.AddSingleton(settings);

var countries = new List<Country>();
builder.Configuration.GetSection("Countries").Bind(countries);
builder.Services.AddSingleton(countries);

builder.Services.AddScoped(sp =>
    new HttpClient
    {
        BaseAddress = new Uri(settings.CircleBaseUrl)
    }
);

builder.Services.AddBlazorState(
    (aOptions) => aOptions.Assemblies = new Assembly[] { typeof(Program).GetTypeInfo().Assembly }
);

builder.Services.AddTransient<IPaymentsCommand, PaymentsCommand>();
builder.Services.AddTransient<IPaymentsQuery, PaymentsQuery>();

builder.Services.AddTransient<ICirclePaymentsRepo, CirclePaymentsRepo>();
builder.Services.AddTransient<ICircleAccountsRepo, CircleAccountsRepo>();

builder.Services.AddMudServices();
await builder.Build().RunAsync();
