using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Wagr.ClientInfrastructure.Extensions;

namespace Wagr.ClientInfrastructure
{
    internal abstract class BaseApiConnector
    {
        private readonly HttpClient _httpClient;
        private string _endpointUrl;

        public abstract string Controller { get; }

        public BaseApiConnector(HttpClient httpClient) 
        {
            _httpClient = httpClient;
            _endpointUrl = Controller + "/";
        }

        public async Task<TResponse> PostAsync<TRequest, TResponse>(string endpoint, TRequest request, CancellationToken token)
        {
            var endpointUrl = _endpointUrl + endpoint;
            var response = await _httpClient.PostAsJsonAsync(endpointUrl, request, token);
            await response.CheckForSuccessfulResponse();
          
            return await response.Content.ReadFromJsonAsync<TResponse>(cancellationToken: token);
        }

        
    }
}
