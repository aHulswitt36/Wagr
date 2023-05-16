using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Exceptions
{
    public class LeagueNotFoundException : Exception
    {
        public LeagueNotFoundException() { }
        public LeagueNotFoundException(string message) : base(message) { }
    }
}
