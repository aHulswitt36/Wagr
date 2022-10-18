using Wagr.Domain.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Interfaces
{
    public interface ICircleAccountsRepo
    {
        Task<CreateCircleAccountResponse> CreateAccount(string walletName);

    }
}
