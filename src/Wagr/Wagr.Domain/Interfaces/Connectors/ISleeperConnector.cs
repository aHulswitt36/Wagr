using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Domain.Interfaces.Connectors
{
    public interface ISleeperConnector
    {
        Task<User> GetUserByUsername(string username);
        Task<User> GetUserByUserId(string userId);

        Task<List<League>> GetUsersLeagues(string userId, int year, string sport = "nfl");
        Task<League> GetLeague(long leagueId);
        Task<User> GetLeagueUsers(long leagueId);
        Task<List<Matchup>> GetLeagueMatchupsByWeek(long leagueId, int week);

    }
}
