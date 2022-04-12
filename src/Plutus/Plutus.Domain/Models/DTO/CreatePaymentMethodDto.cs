using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Models.DTO
{
    public class CreatePaymentMethodDto
    {
        public int ExpirationMonth { get; set; }
        public int ExpirationYear { get; set; }
        public Address Address { get; set; }
        public string Name { get; set; }
        public string? PhoneNumber { get; set; }
        public string Email { get; set; }
        public string IpAddress { get; set; }
        public EncryptedDataDto EncryptedData { get; set; }

    }
}
