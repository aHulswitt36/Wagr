﻿namespace Plutus.ViewModel
{
    public class CardExpiration
    {
        public string Month { get; set; }
        public string Year { get; set; }

        public override string ToString() => $"{Month} / {Year}";
    }
}
