using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Responses.Sleeper
{
    public class User
    {
        public string UserName { get; set; }
        public int UserId { get; set; }
        public string DisplayName { get; set; }
        public string Avatar { get; set; }

        public Dictionary<string, string> Metadata{ get; set; }
        public bool IsOwner { get; set; }
    }
}
