using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Requests
{
    public class CircleCreateCardRequest : BaseCircleRequest
    {
        [JsonProperty("idempotencyKey")]
        public string IdempotencyKey { get; set; }

        [JsonProperty("keyId")]
        public string KeyId { get; set; }

        [JsonProperty("encryptedData")]
        public string EncryptedData { get; set; }

        [JsonProperty("expMonth")]
        public int ExpirationMonth { get; set; }
        
        [JsonProperty("expYear")]
        public int ExpirationYear { get; set; }

        [JsonProperty("metadata")]
        public CircleCreatePaymentMetadata Metadata { get; set; }

        [JsonProperty("billingDetails")]
        public CircleCreateCardBillingDetails BillingDetails { get; set; }
    }

    public class CircleCreateCardBillingDetails
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }
        [JsonProperty("country")]
        public string Country { get; set; }
        [JsonProperty("line1")]
        public string AddressLine1 { get; set; }
        [JsonProperty("lin2")]
        public string AddressLine2 { get; set; }
        [JsonProperty("district")]
        public string District { get; set; }
        [JsonProperty("postalCode")]
        public string PostalCode { get; set; }
    }
}
