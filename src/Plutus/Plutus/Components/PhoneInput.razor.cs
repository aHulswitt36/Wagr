using Microsoft.AspNetCore.Components;

namespace Plutus.Components
{
    public partial class PhoneInput : ComponentBase
    {
        private string _phoneNumber;

        [Parameter]
        public string PhoneNumber 
        { 
            get => _phoneNumber;
            set
            {
                if (_phoneNumber == value) return;
                _phoneNumber = value;
                PhoneNumberChanged.InvokeAsync(value);
            } 
        }

        [Parameter]
        public EventCallback<string> PhoneNumberChanged { get; set; }


    }
}
