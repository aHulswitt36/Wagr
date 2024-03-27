using System.Reflection;
using Wagr.Application.Queries.Sleeper;
using Wagr.Domain.Interfaces.Connectors;
using Wagr.Infrastructure.Connectors;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient("Sleeper", c =>
{
    c.BaseAddress = new Uri("https://api.sleeper.app/v1/");
});
builder.Services.AddTransient<ISleeperConnector, SleeperConnector>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMediatR(c => c.RegisterServicesFromAssemblyContaining<GetUserByUsernameQueryHandler>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
