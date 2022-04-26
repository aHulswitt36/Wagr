using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Models.Requests
{
    public class CircleCreatePaymentRequest : BaseCircleRequest
    {
        [JsonProperty("keyId")]
        public string KeyId { get; set; }
        
        [JsonProperty("metadata")]
        public CircleCreatePaymentMetadata Metadata { get; set; }

        [JsonProperty("amount")]
        public CircleCreatePaymentAmount Amount { get; set; }

        [JsonProperty("autoCapture")]
        public bool AutoCapture { get; set; } = false;

        [JsonProperty("verification")]
        public string Verification { get; set; }

        [JsonProperty("description")]
        public string? Description { get; set; }

        [JsonProperty("source")]
        public CircleCreatePaymentSource Source { get; set; }

        [JsonProperty("encryptedData")]
        public string EncryptedData { get; set; }

        [JsonProperty("channel")]
        public string Channel { get; set; }
    }

    public class CircleCreatePaymentSource
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        //this will be enum 
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class CircleCreatePaymentAmount
    {
        [JsonProperty("amount")]
        public string Amount { get; set; }
        
        [JsonProperty("currency")]
        public string Currency { get; set; }
    }

    public class CircleCreatePaymentMetadata
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("phoneNumber")]
        public string? PhoneNumber { get; set; }

        [JsonProperty("sessionId")]
        public string SessionId { get; set; }

        [JsonProperty("ipAddress")]
        public string IpAddress { get; set; }

    }
}
