using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Responses
{
    public class CirclePgp
    {
        [JsonProperty("keyId")]
        public string KeyId { get; set; }
        [JsonProperty("publicKey")]
        public string PublicKey { get; set; }
    }
}
