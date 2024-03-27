using MediatR;
using Wagr.Domain.Interfaces.Connectors;
using Wagr.Domain.Models.DTO.Requests.Sleeper;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Application.Queries.Sleeper
{
    public class GetUserByUsernameQueryHandler : IRequestHandler<GetUserByUsernameQuery, User>
    {
        private readonly ISleeperConnector _connector;

        public GetUserByUsernameQueryHandler(ISleeperConnector connector) => _connector = connector;

        public async Task<User> Handle(GetUserByUsernameQuery request, CancellationToken cancellationToken) => await _connector.GetUserByUsername(request.Username);
    }
}
