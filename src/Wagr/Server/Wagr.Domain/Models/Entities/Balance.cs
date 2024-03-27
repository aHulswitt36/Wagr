using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Entities
{
    public class Balance
    {
        public decimal Amount { get; set; }
        //could possibly be a Enum
        public string Currency { get; set; }
    }
}
