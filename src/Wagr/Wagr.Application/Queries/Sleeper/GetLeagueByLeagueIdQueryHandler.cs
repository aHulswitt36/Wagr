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
    public class GetLeagueByLeagueIdQueryHandler : IRequestHandler<GetLeagueByLeagueIdQuery, League>
    {
        private readonly ISleeperConnector _connector;

        public GetLeagueByLeagueIdQueryHandler(ISleeperConnector connector) => _connector = connector;

        public async Task<League> Handle(GetLeagueByLeagueIdQuery request, CancellationToken cancellationToken) => await _connector.GetLeague(request.LeagueId);
    }
}
