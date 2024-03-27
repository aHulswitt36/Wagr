using Wagr.Domain.Models.DTO;
using Wagr.Domain.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Interfaces.Commands
{
    public interface IPaymentsCommand
    {
        Task<CircleCreateCardResponse> AddNewPayment(CreatePaymentMethodDto dto);
    }
}
