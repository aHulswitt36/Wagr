using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Exceptions
{
    public class LeagueMatchupsNotFoundException : Exception
    { 
        public LeagueMatchupsNotFoundException() { }
        public LeagueMatchupsNotFoundException(string message) : base(message) { }
    }
}
