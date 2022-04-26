using Plutus.Domain.Interfaces;
using Plutus.Domain.Interfaces.Queries;
using Plutus.Domain.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Application.Queries
{
    public class PaymentsQuery : IPaymentsQuery
    {
        private readonly ICirclePaymentsRepo _circlePaymentsRepo;

        public PaymentsQuery(ICirclePaymentsRepo circlePaymentsRepo)
        {
            _circlePaymentsRepo = circlePaymentsRepo;
        }

        public async Task<CircleGetPublicKeyResponse> GetPgpPublicKey()
        {
            return await _circlePaymentsRepo.GetPgpPublicKey();
        }
    }
}
