using BlazorState;
using Microsoft.AspNetCore.Components;
using Wagr.Domain.Interfaces;
using Wagr.Domain.Models.DTO;
using Models = Wagr.Domain.Models.Entities;
using System.Linq;
using Wagr.Features.Account;

namespace Wagr.Pages
{
    public partial class Index : BlazorStateComponent
    {
        [Inject]
        private NavigationManager _navigationManager { get; set; }

        private AccountState Account => GetState<AccountState>();

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
