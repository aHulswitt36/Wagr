using BlazorState;
using Plutus.Features.Account;

namespace Plutus.Shared
{
    public partial class NavMenu : BlazorStateComponent
    {
        private bool collapseNavMenu = true;
        private AccountState accountState => GetState<AccountState>();

        protected override Task OnInitializedAsync()
        {
            return base.OnInitializedAsync();
        }

        private string? NavMenuCssClass => collapseNavMenu ? "collapse" : null;

        private void ToggleNavMenu()
        {
            collapseNavMenu = !collapseNavMenu;
        }
    }
}
