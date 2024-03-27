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
    public class GetUserLeagueQueryHandler : IRequestHandler<GetUserLeaguesQuery, List<League>>
    {
        private readonly ISleeperConnector _connector;
        
        public GetUserLeagueQueryHandler(ISleeperConnector connector) => _connector = connector;

        public async Task<List<League>> Handle(GetUserLeaguesQuery request, CancellationToken cancellationToken) => await _connector.GetUsersLeagues(request.UserId, request.Season);
        
    }
}
