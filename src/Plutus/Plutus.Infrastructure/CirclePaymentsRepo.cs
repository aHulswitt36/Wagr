using Plutus.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Infrastructure
{
    public class CirclePaymentsRepo : ICirclePaymentsRepo
    {
        public readonly HttpClient _httpClient;

        public CirclePaymentsRepo(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }


    }
}
