using Newtonsoft.Json;
using Plutus.Domain.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Models.Responses
{
    public class CircleCreateCard
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("status")]
        public string Status { get; set; }
        [JsonProperty("billingDetails")]
        public CircleCreateCardBillingDetails BillingDetails { get; set; }
        [JsonProperty("expMonth")]
        public int ExpirationMonth { get; set; }
        [JsonProperty("expYear")]
        public int ExpirationYear { get; set; }
        [JsonProperty("network")]
        public string Network { get; set; }
        [JsonProperty("last4")]
        public string Last4 { get; set; }
        [JsonProperty("bin")]
        public string Bin { get; set; }
        [JsonProperty("issuerCountry")]
        public string IssuerCountry { get; set; }
        [JsonProperty("fundingType")]
        public string FundingType { get; set; }
        [JsonProperty("fingerprint")]
        public string Fingerprint { get; set; }
        [JsonProperty("errorCode")]
        public string ErrorCode { get; set; }
        [JsonProperty("createDate")]
        public string CreateDate { get; set; }
        [JsonProperty("updateDate")]
        public string UpdateDate { get; set; }

        [JsonProperty("verification")]
        public CirlceCreateCardVerification Verification { get; set; }

        public CircleCreateCardRiskEvaluation RiskEvaluation { get; set; }

        public CircleCreatePaymentMetadata Metadat { get; set; }
    }

    public class CircleCreateCardRiskEvaluation
    {
        [JsonProperty("decision")]
        public string Decision { get; set; }

        [JsonProperty("reason")]
        public string Reason { get; set; }
    }

    public class CirlceCreateCardVerification
    {
        [JsonProperty("avs")]
        public string AVS { get; set; }

        [JsonProperty("cvv")]
        public string CVV { get; set; }
    }
}
