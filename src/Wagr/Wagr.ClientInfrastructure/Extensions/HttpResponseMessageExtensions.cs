using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.ClientInfrastructure.Extensions
{
    public static class HttpResponseMessageExtensions
    {
        public static async Task CheckForSuccessfulResponse(this HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
                return;
            //TODO create custom exception classes
            throw new Exception(await response.Content.ReadAsStringAsync());
        }
    }
}
