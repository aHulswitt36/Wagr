using Microsoft.AspNetCore.Components;
using Plutus.Domain.Interfaces;
using Plutus.Domain.Models.DTO;
using System.Linq;

namespace Plutus.Pages
{
    public partial class Index : ComponentBase
    {
        [Inject]
        private NavigationManager _navigationManager { get; set; }

        [Inject]
        private ICircleAccountsRepo _circleAccountsRepo { get; set; }

        private bool _accountCreated { get; set; }
        private CircleAccountDto account { get; set; }

        public async Task CreateAccount()
        {
            var newAccount = (await _circleAccountsRepo.CreateAccount()).Data;
            account = new CircleAccountDto
            {
                WalletId = newAccount.WalletId,
                Type = newAccount.Type,
                Description = newAccount.Description,
                Balances = MapWalletBalances(newAccount.Balances)
            };
            _accountCreated = true;
            //_navigationManager.NavigateTo("/Account/Create");
        }

        private List<CircleBalanceDto> MapWalletBalances(List<Domain.Models.Responses.CircleAccountBalance> balances)
        {
            return (from balance in balances
                    let balanceDto = new CircleBalanceDto
                    {
                        Amount = balance.Amount,
                        Currency = balance.Currency
                    }
                    select balanceDto).ToList();
        }


    }
}
