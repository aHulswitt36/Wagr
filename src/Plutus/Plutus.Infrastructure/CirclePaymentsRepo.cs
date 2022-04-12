using Newtonsoft.Json;
using Plutus.Domain.Interfaces;
using Plutus.Domain.Models.DTO;
using Plutus.Domain.Models.Requests;
using Plutus.Domain.Models.Responses;
using Plutus.Domain.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Infrastructure
{
    public class CirclePaymentsRepo : ICirclePaymentsRepo
    {
        private const string PublicKeyEndpoint = "encryption/public";
        private const string CreatePaymentEndpoint = "cards";
        private readonly HttpClient _httpClient;
        private readonly Settings _settings;

        public CirclePaymentsRepo(HttpClient httpClient, Settings settings)
        {
            _settings = settings;   
            _httpClient = httpClient;
        }

        public async Task<CircleCreateCardResponse> CreateCard(CreatePaymentMethodDto dto)
        {
            var payload = new CircleCreateCardRequest
            {
                IdempotencyKey = Guid.NewGuid().ToString(),
                KeyId = dto.EncryptedData.KeyId,
                ExpirationMonth = dto.ExpirationMonth,
                ExpirationYear = dto.ExpirationYear,
                EncryptedData = dto.EncryptedData.EncryptedData,
                BillingDetails = new CircleCreateCardBillingDetails
                {
                    AddressLine1 = dto.Address.Address1,
                    AddressLine2 = dto.Address.Address2,
                    City = dto.Address.City,
                    Country = dto.Address.Country,
                    District = dto.Address.District,
                    Name = dto.Name,
                    ZipCode = dto.Address.PostalCode
                },
                Metadata = new CircleCreatePaymentMetadata
                {
                    PhoneNumber = dto.PhoneNumber, 
                    Email = dto.Email,
                    SessionId = Guid.NewGuid().ToString(),
                    IpAddress = dto.IpAddress
                }
            };

            return new CircleCreateCardResponse();
        }

        public async Task<CircleGetPublicKeyResponse> GetPgpPublicKey()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _settings.CircleApiKey);
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                var result = await _httpClient.GetAsync(PublicKeyEndpoint);
                if (!result.IsSuccessStatusCode)
                    throw new Exception(result.StatusCode.ToString());
                var data = await result.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<CircleGetPublicKeyResponse>(data);
            }
            catch (Exception)
            {

                throw;
            }
            

        }
    }
}
