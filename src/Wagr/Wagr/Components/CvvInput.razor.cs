using Microsoft.AspNetCore.Components;

namespace Wagr.Components
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

        private IEnumerable<string> Validate(string cvv)
        {
            if(string.IsNullOrEmpty(cvv))
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
