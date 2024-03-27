using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wagr.Domain.Interfaces.Connectors;
using Wagr.Domain.Models.DTO.Requests.Sleeper;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Application.Queries.Sleeper
{
    public class GetLeagueMatchupsForWeekQueryHandler : IRequestHandler<GetLeagueMatchupsForWeekQuery, List<Matchup>>
    {
        private readonly ISleeperConnector _connector;

        public GetLeagueMatchupsForWeekQueryHandler(ISleeperConnector connector) => _connector = connector;

        public async Task<List<Matchup>> Handle(GetLeagueMatchupsForWeekQuery request, CancellationToken cancellationToken)
        {
            return await _connector.GetLeagueMatchupsByWeek(request.LeagueId, request.Week);    
        }
    }
}
