using BlazorState;
using models = Wagr.Domain.Models.Entities;

namespace Wagr.Features.Account
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
