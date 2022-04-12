using Plutus.Domain.Models.DTO;
using Plutus.Domain.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Interfaces
{
    public interface ICirclePaymentsRepo
    {
        Task<CircleGetPublicKeyResponse> GetPgpPublicKey();

        Task<CircleCreateCardResponse> CreateCard(CreatePaymentMethodDto dto);
    }
}
