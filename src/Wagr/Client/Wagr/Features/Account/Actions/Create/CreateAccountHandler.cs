using BlazorState;
using MediatR;
using models = Wagr.Domain.Models.Entities;

namespace Wagr.Features.Account
{
    public partial class AccountState
    {
        public class CreateAccountHandler : ActionHandler<CreateAccountAction>
        {
            public CreateAccountHandler(IStore store) : base(store) { }

            AccountState AccountState => Store.GetState<AccountState>();

            public override Task<Unit> Handle(CreateAccountAction aAction, CancellationToken aCancellationToken)
            {
                var account = new models.Account
                {
                    Email = aAction.Email,
                    Wallet = aAction.Wallet
                };
                AccountState.Account = account;

                return Unit.Task;
            }
        }
    }
    
}
