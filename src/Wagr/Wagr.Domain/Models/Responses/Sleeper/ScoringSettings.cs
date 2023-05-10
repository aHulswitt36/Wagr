using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Responses.Sleeper
{
    public class ScoringSettings
    {
        public decimal SpecialTeamsForcedFumble { get; set; }
        public decimal PointsAllowed7_13 { get; set; }
        public decimal DefenseForcedFumble { get; set; }
        public decimal ReceptionYard { get; set; }
    }
}
