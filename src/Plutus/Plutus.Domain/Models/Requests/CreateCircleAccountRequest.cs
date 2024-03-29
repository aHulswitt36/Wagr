﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Models.Requests
{
    public class CreateCircleAccountRequest : BaseCircleRequest
    {
        [JsonProperty("description")]
        public string? Description { get; set; }

        public CreateCircleAccountRequest(Guid key, string? description)
        {
            IdempotencyKey = key;
            Description = description;
        }
    }
}
