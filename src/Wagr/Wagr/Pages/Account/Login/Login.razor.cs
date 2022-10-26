using BlazorState;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Wagr.Extensions;

namespace Wagr.Pages.Account.Login
{
    public partial class Login : BlazorStateComponent
    {
        [Inject]
        private IJSRuntime _jsRuntime { get; set; }

        private IJSObjectReference _jsModule;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
                _jsModule = await _jsRuntime.ComponentModule<Login>();
            await _jsModule.InvokeVoidAsync("Init");
            await base.OnAfterRenderAsync(firstRender);
        }

        private async Task LoginUser()
        {
            await _jsModule.InvokeVoidAsync("CreateWeb3AuthConnection");

        }
    }
}
