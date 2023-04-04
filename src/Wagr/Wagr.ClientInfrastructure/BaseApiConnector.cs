using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.ClientInfrastructure
{
    internal abstract class BaseApiConnector
    {
        private readonly HttpClient _httpClient;

        public abstract string Controller { get; }

        public BaseApiConnector(HttpClient httpClient) 
        {
            _httpClient = httpClient;
        }

        public async Task<T> PostAsync()
    }
}
