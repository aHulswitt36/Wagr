using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Domain.Models.DTO.Requests.Sleeper
{
    public class GetUserLeaguesQuery : IRequest<List<League>>
    {
        public string UserId { get; set; }
        public int Season { get; set; }
    }
}
