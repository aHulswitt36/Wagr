﻿using BlazorState;
using Microsoft.AspNetCore.Components;
using Wagr.Domain.Interfaces;
using Wagr.Domain.Models.DTO;
using Wagr.Domain.Models.Entities;
using Wagr.Features.Account;

namespace Wagr.Pages.Account
{
    public partial class Create : BlazorStateComponent
    {
        [Inject]
        private NavigationManager _navigationManager { get; set; }
        [Inject]
        private ICircleAccountsRepo _circleAccountsRepo { get; set; }

        private string WalletName { get; set; }
        private string Email { get; set; }
        private string Password { get; set; }
        private bool _accountCreated { get; set; }

        private async Task OnClick_CreateAccount()
        {
            var newAccount = (await _circleAccountsRepo.CreateAccount(WalletName)).Data;

            await Mediator.Send(new AccountState.CreateAccountAction
            {
                Email = Email,
                Wallet = new Wallet
                {
                    WalletId = newAccount.WalletId,
                    Type = newAccount.Type,
                    Description = newAccount.Description,
                    Balances = MapWalletBalances(newAccount.Balances)
                }
            });
            _accountCreated = true;
        }

        private async Task FundWallet()
        {
            _navigationManager.NavigateTo("/Account/AddPaymentMethod");
        }

        private static List<Balance> MapWalletBalances(List<Domain.Models.Responses.CircleAccountBalance> balances)
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
