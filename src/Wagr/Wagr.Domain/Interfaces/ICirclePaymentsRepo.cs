using Wagr.Domain.Models.Requests;
using Wagr.Domain.Models.Responses;

namespace Wagr.Domain.Interfaces
{
    public interface ICirclePaymentsRepo
    {
        Task<CircleGetPublicKeyResponse> GetPgpPublicKey();

        Task<CircleCreateCardResponse> CreateNewPayment(CircleCreateCardRequest request);
    }
}
