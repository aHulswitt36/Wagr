using Microsoft.AspNetCore.Components;

namespace Plutus.Components
{
    public partial class CardInput : ComponentBase
    {

        private string Value { get; set; }

        private string ValidationErrors { get; set; }

        private async Task<bool> Rules()
        {
            try
            {
                if (!IsValid())
                    throw new Exception("Please enter valid Credit Card");
                if (!IsRequired())
                    throw new Exception("Please enter a Credit Card number");
                return true;
            }
            catch (Exception e)
            {
                ValidationErrors = e.Message;
                return false;
            }
        }

        private bool IsValid()
        {
            var trimmed = Value.Trim().Replace(" ", "");
            if(string.IsNullOrWhiteSpace(trimmed) || trimmed.Length < 15 || trimmed.Length > 16)
                return false;

            return true;
        }

        private bool IsRequired()
        {
            return string.IsNullOrEmpty(Value.Trim());
        }
    }
}
