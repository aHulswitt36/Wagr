using Microsoft.AspNetCore.Components;
using Plutus.ViewModel;

namespace Plutus.Components
{
    public partial class CardExpiry : ComponentBase
    {
        private CardExpiration _expiration;
        private string _expirationValue;

        [Parameter]
        public string Expiry { get; set; }

        [Parameter]
        public CardExpiration Expiration { get; set; }
        [Parameter]
        public EventCallback<CardExpiration> ExpirationChanged { get; set; }

        private async Task OnExpiryChanged(ChangeEventArgs e)
        {
            var split = e.Value?.ToString().Split(" / ");
            _expiration.Month = split[0];
            _expiration.Year = split[1];


            await ExpirationChanged.InvokeAsync(_expiration);
        }

        private IEnumerable<string> Validate(string expiration)
        {
            var split = expiration.Split(" / ");
            if (!int.TryParse(split[0].Trim(), out var expMonth))
                yield return "Please enter a valid date";
            if(!int.TryParse(split[1].Trim(), out var expYear))
                yield return "Please enter a valid date";

            if (expMonth > 12 || expMonth < 1)
                yield return "Please enter a valid month";

            if (expYear.ToString().Length < 4)
                yield return "Please enter a valid year";

            var date = new DateTime(expYear, expMonth, 1);
            if (date < DateTime.Now)
                yield return "Date has expired";

        }

    }
}
