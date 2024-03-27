using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Responses.Sleeper
{
    public class League
    {
        [JsonPropertyName("total_rosters")]
        public int TotalRosters { get; set; }
        public string Status { get; set; }
        public string Sport { get; set; }
        //public Settings Settings { get; set; }
        public string SeasonType { get; set; }
        public int Season { get; set; }
        //public ScoringSettings ScoringSettings { get; set; }
        //public List<string> RosterPositions { get; set; }
        [JsonPropertyName("previous_league_id")]
        public string PreviousLeagueId { get; set; }
        public string Name { get; set; }
        [JsonPropertyName("league_id")]
        public string LeagueId { get; set; }
        public long DraftId { get; set; }
        public string Avatar { get; set; }
    }
}
