using BlazorState;
using Wagr.Domain.Models.Entities;

namespace Wagr.Features.Account
{
    public partial class AccountState
    {
        public class CreateAccountAction : IAction
        {
            public string Email { get; set; }
            public Wallet Wallet { get; set; }

        }
    }
    
}
