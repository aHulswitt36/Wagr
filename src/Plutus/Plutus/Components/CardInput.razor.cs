using Microsoft.AspNetCore.Components;

namespace Plutus.Components
{
    public partial class CardInput : ComponentBase
    {
        private string? _cardNumber;
        [Parameter]
        public string CardNumber { get; set; }

        [Parameter]
        public EventCallback<string> CardNumberChanged { get; set; }

        private async Task OnCardNumberChanged(ChangeEventArgs args)
        {
            _cardNumber = args?.Value?.ToString();

            await CardNumberChanged.InvokeAsync(_cardNumber);
        }

        private IEnumerable<string> RunRules(string input)
        {
            if (!IsValid())
                yield return "Please enter valid Credit Card";
            if (!IsRequired())
                yield return "Please enter a Credit Card number";            
        }

        private bool IsValid()
        {
            var trimmed = CardNumber.Trim().Replace(" ", "");
            if(string.IsNullOrWhiteSpace(trimmed) || trimmed.Length < 15 || trimmed.Length > 16)
                return false;

            return true;
        }

        private bool IsRequired()
        {
            return !string.IsNullOrEmpty(CardNumber.Trim());
        }
    }
}
