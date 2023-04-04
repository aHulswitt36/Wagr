using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Wagr;
using Wagr.Application.Commands;
using Wagr.Application.Queries;
using Wagr.Domain.Interfaces;
using Wagr.Domain.Interfaces.Queries;
using Wagr.Domain.Interfaces.Commands;
using Wagr.Domain.Models.Entities;
using Wagr.Domain.Settings;
using Wagr.Infrastructure;
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
        BaseAddress = new Uri(settings.ApiUrl)
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
