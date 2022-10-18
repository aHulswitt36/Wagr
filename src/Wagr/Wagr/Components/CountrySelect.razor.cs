using Microsoft.AspNetCore.Components;
using Wagr.Domain.Settings;
using Wagr.ViewModel;
using System.Linq;

namespace Wagr.Components
{
    public partial class CountrySelect : ComponentBase
    {
        private string? _country;
        [Inject]
        public List<Country> Countries { get; set; }
        [Parameter]
        public string Country 
        { 
            get => _country;
            set
            {
                if (_country == value) return;
                _country = value;
                CountryChanged.InvokeAsync(value);
            }
        }
        [Parameter]
        public EventCallback<string> CountryChanged { get; set; }

        private List<CountryCode> CountryCodes { get { return GetCountryList(); } }

        private List<CountryCode> GetCountryList()
        {
            return (Countries.Select(country => new CountryCode { Code = country.Code, Name = country.Name })).ToList();
        }

    }
}
