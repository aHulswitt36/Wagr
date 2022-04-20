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

        public async Task<CircleCreateCardResponse> CreateNewPayment(CircleCreateCardRequest request)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _settings.CircleApiKey);
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                var response = await _httpClient.PostAsync(CreatePaymentEndpoint, new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json"));
                if(!response.IsSuccessStatusCode)
                    throw new Exception(response.StatusCode.ToString());
                var data = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<CircleCreateCardResponse>(data);
            }
            catch (Exception)
            {
                //log
                return null;
            }
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
