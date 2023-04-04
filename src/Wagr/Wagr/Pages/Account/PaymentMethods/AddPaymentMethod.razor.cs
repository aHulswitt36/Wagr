using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Wagr.Domain.Interfaces.Commands;
using Wagr.Domain.Interfaces.Queries;
using Wagr.Domain.Models.DTO;
using Wagr.Domain.Models.Entities;
using Wagr.Domain.Models.Responses;
using Wagr.Extensions;
using Wagr.ViewModel;

namespace Wagr.Pages.Account.PaymentMethods
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
        private Wagr.Domain.Models.Entities.Account _account { get; set; }

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

        private bool WasAttemptMade { get; set; } = false;
        private bool Successful { get; set; } = false;

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
            }
        }
        public async ValueTask DisposeAsync()
        {
             if (_jsModule != null) 
                await _jsModule.DisposeAsync();
        }

        private async Task CreatePayment()
        {
            var encryptedData = await _jsModule.InvokeAsync<EncryptedDataDto>("encryptCardData", pgpPublicKey, CardNumber.Replace(" ", ""), CVV);
            var createPaymentRequest = new CreatePaymentMethodDto
            {
                EncryptedData = encryptedData,
                Name = Name,
                Email = Email,
                ExpirationMonth = Convert.ToInt32(Expiry.Month),
                ExpirationYear = Convert.ToInt32("20" + Expiry.Year),
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
            WasAttemptMade = true;
            if (cardDetails == null)
                Successful = false;
            else
            {
                //eventually just return to a /Account/PaymentMethods page
                Successful = true;
                ClearAllFields();
            }

        }

        private void ClearAllFields()
        {
            CardNumber = "";
            Name = "";
            Email = "";
            CVV = "";
            Expiry = null;
            PhoneNumber = "";
            Address1 = "";
            Address2 = "";
            City = "";
            District = "";
            Country = "";
            PostalCode = "";
        }
    }
}
