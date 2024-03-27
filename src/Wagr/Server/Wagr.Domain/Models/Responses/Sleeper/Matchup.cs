using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Responses.Sleeper
{
    public class Matchup
    {
        public List<string> Starters { get; set; }
        [JsonPropertyName("roster_id")]
        public int RosterId { get; set; }
        [JsonPropertyName("matchup_id")]
        public int MatchupId { get; set; }
        public decimal Points { get; set; }
    }
}
