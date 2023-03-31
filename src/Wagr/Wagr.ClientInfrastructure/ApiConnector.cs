namespace Wagr.ClientInfrastructure
{
    public class ApiConnector
    {
        private const string ApiUrl = "/Api/WeatherForecast";
        public async Task GetWeatherForecast()
        {
            var httpclient = new HttpClient();
            httpclient.BaseAddress = new Uri("https://localhost:5555");
        }
    }
}