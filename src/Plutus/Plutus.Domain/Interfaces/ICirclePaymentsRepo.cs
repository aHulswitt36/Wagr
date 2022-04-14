using Plutus.Domain.Models.Requests;
using Plutus.Domain.Models.Responses;

namespace Plutus.Domain.Interfaces
{
    public interface ICirclePaymentsRepo
    {
        Task<CircleGetPublicKeyResponse> GetPgpPublicKey();

        Task<CircleCreateCardResponse> CreateNewPayment(CircleCreateCardRequest request);
    }
}
