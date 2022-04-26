using Plutus.Domain.Models.DTO;
using Plutus.Domain.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Interfaces.Commands
{
    public interface IPaymentsCommand
    {
        Task<CircleCreateCardResponse> AddNewPayment(CreatePaymentMethodDto dto);
    }
}
