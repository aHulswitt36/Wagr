using Microsoft.AspNetCore.Components;
using Plutus.Domain.Interfaces;
using Plutus.Domain.Models.DTO;
using Plutus.Domain.Models.Entities;

namespace Plutus.Pages
{
    public partial class CreateAccount : ComponentBase
    {
        [Inject]
        private NavigationManager _navigationManager { get; set; }
        [Inject]
        private ICircleAccountsRepo _circleAccountsRepo { get; set; }

        [Inject]
        private Account Account { get; set; }
        
        private string WalletName { get; set; }
        private string Email { get; set; }
        private string Password { get; set; }
        private bool _accountCreated { get; set; }

        private async Task OnClick_CreateAccount()
        {
            var newAccount = (await _circleAccountsRepo.CreateAccount(WalletName)).Data;

            Account = new Account()
            {
                Email = Email,
                Password = Password,
                Wallet = new Wallet
                {
                    WalletId = newAccount.WalletId,
                    Type = newAccount.Type,
                    Description = newAccount.Description,
                    Balances = MapWalletBalances(newAccount.Balances)
                }                
            };
            _accountCreated = true;
        }

        private async Task FundWallet()
        {
            _navigationManager.NavigateTo("/Account/AddPaymentMethod");
        }

        private List<Balance> MapWalletBalances(List<Domain.Models.Responses.CircleAccountBalance> balances)
        {
            return (from balance in balances
                    let balanceDto = new Balance
                    {
                        Amount = Convert.ToDecimal(balance.Amount),
                        Currency = balance.Currency
                    }
                    select balanceDto).ToList();
        }

    }
}
