using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Responses
{
    public class CircleAccount
    {
        [JsonProperty("walletId")]
        public string WalletId { get; set; }
        [JsonProperty("entityId")]
        public string EntityId { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
        [JsonProperty("balances")]
        public List<CircleAccountBalance> Balances { get; set; }
    }
}
