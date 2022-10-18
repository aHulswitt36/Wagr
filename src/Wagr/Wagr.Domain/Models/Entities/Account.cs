using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wagr.Domain.Models.Entities
{
    public class Account
    {
        private string _email;
        //private string _password;
        private Wallet _wallet;
        
        public string Email
        {
            get => _email;
            set
            {
                _email = value;
                NotifyDataChanged();
            }
        }
        //public string Password
        //{
        //    get => _password;
        //    set
        //    {
        //        _password = value;
        //        NotifyDataChanged();
        //    }
        //}

        public Wallet Wallet
        {
            get => _wallet;
            set
            {
                _wallet = value;
                NotifyDataChanged();
            }
        }



        public event Action OnChange;

        private void NotifyDataChanged() => OnChange?.Invoke();
    }
}
