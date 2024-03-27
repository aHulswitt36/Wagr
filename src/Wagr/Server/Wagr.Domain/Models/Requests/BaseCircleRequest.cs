using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Requests
{
    public class BaseCircleRequest
    {
        [JsonProperty("idempotencyKey")]
        public Guid IdempotencyKey { get; set; }
    }
}
