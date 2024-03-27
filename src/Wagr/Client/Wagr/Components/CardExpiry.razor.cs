using Microsoft.AspNetCore.Components;
using MudBlazor;
using Wagr.ViewModel;

namespace Wagr.Components
{
    public partial class CardExpiry : ComponentBase
    {
        private CardExpiration _expiration;

        [Parameter]
        public CardExpiration Expiration
        {
            get => _expiration;
            set
            {
                if (_expiration == value) return;
                _expiration = value;
                ExpirationChanged.InvokeAsync(value);
            }
        }

        [Parameter]
        public EventCallback<CardExpiration> ExpirationChanged { get; set; }

        private IEnumerable<string> Validate(CardExpiration expiration)
        {
            if (expiration == null)
                yield return "Please enter a valid date";
            
            if (!int.TryParse(expiration.Month, out var expMonth))
                yield return "Please enter a valid date";
            if(!int.TryParse("20" + expiration.Year, out var expYear))
                yield return "Please enter a valid date";

            if (expMonth > 12 || expMonth < 1)
                yield return "Please enter a valid month";

            if (expYear.ToString().Length < 2)
                yield return "Please enter a valid year";

            var date = new DateTime(expYear, expMonth, 1);
            if (date < DateTime.Now)
                yield return "Date has expired";

        }

        private Converter<CardExpiration> Converter = new Converter<CardExpiration>
        {
            SetFunc = value => value.ToString(),
            GetFunc = text =>
            {
                var split = text.Split(" / ");
                return new CardExpiration { Month = split[0], Year = split[1] };
            }
        };

    }
}
