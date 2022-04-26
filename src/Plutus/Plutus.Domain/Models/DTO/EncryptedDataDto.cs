using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Models.DTO
{
    public class EncryptedDataDto
    {
        public string EncryptedData { get; set; }
        public string KeyId { get; set; }
    }
}
