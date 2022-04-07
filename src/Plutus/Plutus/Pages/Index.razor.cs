using Microsoft.AspNetCore.Components;
using Plutus.Domain.Interfaces;
using Plutus.Domain.Models.DTO;
using Plutus.Domain.Models.Entities;
using System.Linq;

namespace Plutus.Pages
{
    public partial class Index : ComponentBase
    {
        [Inject]
        private NavigationManager _navigationManager { get; set; }

        [Inject]
        private Account Account { get; set; }

        protected override void OnInitialized()
        {
            Account.OnChange += OnChange;
        }

        public void OnChange()
        {
            InvokeAsync(() =>
            {
                StateHasChanged();
            });
        }

        public async Task NavigateToCreateAccount()
        {            
            _navigationManager.NavigateTo("/Account/Create");
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
