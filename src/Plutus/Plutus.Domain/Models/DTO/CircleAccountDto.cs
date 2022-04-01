using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plutus.Domain.Models.DTO
{
    public class CircleAccountDto
    {
        public string WalletId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public List<CircleBalanceDto> Balances { get; set; }
    }
}
