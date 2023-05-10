using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wagr.Domain.Interfaces.Connectors;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Infrastructure.Connectors
{
    public class SleeperConnector : ISleeperConnector
    {
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

        public Task<User> GetUserByUserId(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUserByUsername(string username)
        {
            throw new NotImplementedException();
        }

        public Task<List<League>> GetUsersLeagues(string userId, int year, string sport = "nfl")
        {
            throw new NotImplementedException();
        }
    }
}
