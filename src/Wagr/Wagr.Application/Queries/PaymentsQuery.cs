using Wagr.Domain.Interfaces;
using Wagr.Domain.Interfaces.Queries;
using Wagr.Domain.Models.Responses;

namespace Wagr.Application.Queries
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
