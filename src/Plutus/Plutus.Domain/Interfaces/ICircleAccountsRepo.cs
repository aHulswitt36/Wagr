using Plutus.Domain.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Interfaces
{
    public interface ICircleAccountsRepo
    {
        Task<CreateCircleAccountResponse> CreateAccount(string walletName);

    }
}
