using Microsoft.AspNetCore.Components;

namespace Plutus.Components
{
    public partial class CVVInput : ComponentBase
    {
        private string _cvv;

        [Parameter]
        public string Cvv 
        { 
            get => _cvv;
            set
            {
                if (_cvv == value) return;
                _cvv = value;
                CvvChanged.InvokeAsync(value);
            } 
        }

        [Parameter]
        public EventCallback<string> CvvChanged { get; set; }

        public async Task OnCvvChanged(ChangeEventArgs e)
        {
            _cvv = e.Value?.ToString();

            await CvvChanged.InvokeAsync(_cvv);
        }

        private IEnumerable<string> Validate(string cvv)
        {
            if(string.IsNullOrEmpty(cvv.Trim()))
                yield return "Please enter your Credit Card's CVV";
            if (!IsValid())
                yield return "Please enter a valid CVV";
        }

        private bool IsValid()
        {
            var trimmed = Cvv.Replace(" ", "").Trim();
            if (string.IsNullOrEmpty(trimmed) || trimmed.Length < 3 || !int.TryParse(trimmed, out var intCvv))
                return false;
            return true;
        }
    }
}
