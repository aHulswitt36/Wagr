using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Entities
{
    public class Wallet
    {
        public string WalletId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public List<Balance> Balances { get; set; }
    }
}
