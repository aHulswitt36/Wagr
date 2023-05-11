using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
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

        public Task<League> GetLeague(long leagueId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Matchup>> GetLeagueMatchupsByWeek(long leagueId, int week)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetLeagueUsers(long leagueId)
        {
            throw new NotImplementedException();
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
