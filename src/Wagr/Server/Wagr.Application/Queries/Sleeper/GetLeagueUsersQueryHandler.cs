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
    public class GetLeagueUsersQueryHandler : IRequestHandler<GetLeagueUsersQuery, List<User>>
    {
        private readonly ISleeperConnector _connector;

        public GetLeagueUsersQueryHandler(ISleeperConnector connector) => _connector = connector;

        public async Task<List<User>> Handle(GetLeagueUsersQuery request, CancellationToken cancellationToken)
        {
            return await _connector.GetLeagueUsers(request.LeagueId);
        }
    }
}
