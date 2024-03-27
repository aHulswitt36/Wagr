using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Domain.Models.DTO.Requests.Sleeper
{
    public class GetUserByUsernameQuery : IRequest<User>
    {
        public string Username { get; set; }
    }
}
