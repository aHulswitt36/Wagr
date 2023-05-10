using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Responses.Sleeper
{
    public class Matchup
    {
        public List<string> Starters { get; set; }
        public int RosterId { get; set; }
        public int MatchupId { get; set; }
        public decimal Points { get; set; }
    }
}
