using System.Net.Http.Json;
using Wagr.Domain.Interfaces.Connectors;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Infrastructure.Connectors
{
    public class SleeperConnector : ISleeperConnector
    {
        private const string UserEndpoint = "/user";
        private const string LeagueEndpoint = "/league";

        private readonly HttpClient _httpClient;

        public SleeperConnector(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("Sleeper");
        }

        public async Task<League> GetLeague(long leagueId)
        {
            var leagueResponse = await _httpClient.GetAsync($"{LeagueEndpoint}/{leagueId}");
            return await leagueResponse.Content.ReadFromJsonAsync<League>();
        }

        public async Task<List<Matchup>> GetLeagueMatchupsByWeek(long leagueId, int week)
        {
            var matchupsResponse = await _httpClient.GetAsync($"{LeagueEndpoint}/{leagueId}/matchups/{week}");
            return await matchupsResponse.Content.ReadFromJsonAsync<List<Matchup>>();
        }

        public async Task<User> GetLeagueUsers(long leagueId)
        {
            var leagueUsersResponse = await _httpClient.GetAsync($"{LeagueEndpoint}/{leagueId}/users");
            return await leagueUsersResponse.Content.ReadFromJsonAsync<User>();
        }

        public async Task<User> GetUserByUserId(string userId)
        {
            var userResponse = await _httpClient.GetAsync($"{UserEndpoint}/{userId}");
            return await userResponse.Content.ReadFromJsonAsync<User>();
        }

        public async Task<User> GetUserByUsername(string username)
        {
            var userResponse = await _httpClient.GetAsync($"{UserEndpoint}/{username}");
            return await userResponse.Content.ReadFromJsonAsync<User>();
        }

        public async Task<List<League>> GetUsersLeagues(string userId, int year, string sport = "nfl")
        {
            var usersLeaguesResponse = await _httpClient.GetAsync($"{UserEndpoint}/{userId}{LeagueEndpoint}/{sport}/{year}");
            return await usersLeaguesResponse.Content.ReadFromJsonAsync<List<League>>();
        }
    }
}
