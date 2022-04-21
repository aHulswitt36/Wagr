using BlazorState;
using Plutus.Domain.Models.Entities;

namespace Plutus.Features.Account
{
    public partial class AccountState
    {
        public class CreateAccountAction : IAction
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public Wallet Wallet { get; set; }

        }
    }
    
}
