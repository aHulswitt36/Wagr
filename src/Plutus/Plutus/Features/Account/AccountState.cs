using BlazorState;
using models = Plutus.Domain.Models.Entities;

namespace Plutus.Features.Account
{
    public partial class AccountState : State<AccountState>
    {
        public models.Account Account { get; set; }
        public override void Initialize()
        {
            Account = new models.Account();
        }


    }
}
