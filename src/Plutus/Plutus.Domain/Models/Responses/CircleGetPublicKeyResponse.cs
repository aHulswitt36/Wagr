using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Models.Responses
{
    public class CircleGetPublicKeyResponse
    {
        [JsonProperty("data")]
        public CirclePgp Data { get; set; }
    }
}
