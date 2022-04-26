using Plutus.Domain.Interfaces;
using Plutus.Domain.Models.Requests;
using Plutus.Domain.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Plutus.Domain.Settings;

namespace Plutus.Infrastructure
{
    public class CircleAccountsRepo : ICircleAccountsRepo
    {
        private const string WalletsEndpoint = "wallets";
        private HttpClient _httpClient;
        private readonly Settings _settings;

        public CircleAccountsRepo(HttpClient httpClient, Settings settings)
        {
            _httpClient = httpClient;
            _settings = settings;
        }

        public async Task<CreateCircleAccountResponse> CreateAccount(string walletName)
        {
            try
            {
                //todo: need to take in User information for Description.  
                //TODO: will need a way to keep track of user wallet IDs
                var request = new CreateCircleAccountRequest(Guid.NewGuid(), walletName);

                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _settings.CircleApiKey);
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                var result = await _httpClient.PostAsync(WalletsEndpoint, new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json"));
                if (result.StatusCode != System.Net.HttpStatusCode.Created)
                    throw new Exception(result.StatusCode.ToString());
                var data = await result.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<CreateCircleAccountResponse>(data);
            }
            catch (Exception)
            {
                //set up logging
                throw;
            }
            
        }
    }
}
