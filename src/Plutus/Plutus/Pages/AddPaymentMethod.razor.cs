using Microsoft.AspNetCore.Components;
using Plutus.Domain.Interfaces;
using Plutus.Domain.Models.Entities;
using Plutus.Domain.Models.Responses;

namespace Plutus.Pages
{
    public partial class AddPaymentMethod : ComponentBase
    {
        [Inject]
        private ICirclePaymentsRepo _circlePaymentsRepo { get; set; }
        [Inject]
        private Account _account { get; set; }

        private CircleGetPublicKeyResponse pgpPublicKey { get; set; }

        private decimal Amount { get; set; }
        private string CardNumber { get; set; }
        private string CVV { get; set; }
        //will need its own component
        private string Expiry { get; set; }
        private string Description { get; set; }
        private string Channel { get; set; }


        protected override async Task OnInitializedAsync()
        {
            pgpPublicKey = await _circlePaymentsRepo.GetPgpPublicKey();
            await base.OnInitializedAsync();
        }

        private async Task MakePayment()
        {

        }
    }
}
