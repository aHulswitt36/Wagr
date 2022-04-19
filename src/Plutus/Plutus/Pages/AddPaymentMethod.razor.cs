using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.JSInterop;
using Plutus.Domain.Interfaces.Commands;
using Plutus.Domain.Interfaces.Queries;
using Plutus.Domain.Models.DTO;
using Plutus.Domain.Models.Entities;
using Plutus.Domain.Models.Responses;
using Plutus.Extensions;
using Plutus.ViewModel;

namespace Plutus.Pages
{
    public partial class AddPaymentMethod : ComponentBase, IAsyncDisposable
    {
        [Inject]
        private IPaymentsCommand _paymentsCommand { get; set; }
        [Inject]
        private IPaymentsQuery _paymentsQuery { get; set; }
        [Inject]
        private IJSRuntime _jsRuntime { get; set; }
        [Inject]
        private Account _account { get; set; }

        private IJSObjectReference _jsModule;

        private CircleGetPublicKeyResponse pgpPublicKey { get; set; }

        private string Name { get; set; }
        private string Email { get; set; }
        private string CardNumber { get; set; }
        private string CVV { get; set; }
        private CardExpiration Expiry { get; set; }
        private string? PhoneNumber { get; set; }
        private string Address1 { get; set; }
        private string Address2 { get; set; }
        private string City { get; set; }
        private string District { get; set; }
        private string Country { get; set; }
        private string PostalCode { get; set; }


        protected override async Task OnInitializedAsync()
        {

            pgpPublicKey = await _paymentsQuery.GetPgpPublicKey();
            await base.OnInitializedAsync();
        }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                _jsModule = await _jsRuntime.ComponentModule<AddPaymentMethod>();
                //_jsModule = await _jsRuntime.InvokeAsync<IJSObjectReference>("import", "./js/Pages/AddPaymentMethod.razor.js");
            }
        }

        public async ValueTask DisposeAsync()
        {
             if (_jsModule != null) 
                await _jsModule.DisposeAsync();
        }

        private async Task CreatePayment()
        {
            var encryptedData = await _jsModule.InvokeAsync<EncryptedDataDto>("encryptCardData", pgpPublicKey, CardNumber, CVV);
            var createPaymentRequest = new CreatePaymentMethodDto
            {
                EncryptedData = encryptedData,
                Name = Name,
                Email = Email,
                ExpirationMonth = Convert.ToInt32(Expiry.Month),
                ExpirationYear = Convert.ToInt32(Expiry.Year),
                PhoneNumber = PhoneNumber,
                Address = new Address
                {
                    Address1 = Address1,
                    Address2 = Address2,
                    City = City,
                    District = District,
                    Country = Country,
                    PostalCode = PostalCode
                }
            };
            var cardDetails = await _paymentsCommand.AddNewPayment(createPaymentRequest);
        }
    }
}
