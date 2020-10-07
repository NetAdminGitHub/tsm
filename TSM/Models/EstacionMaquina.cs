using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services.Description;

namespace TSM.Models
{
    public class EstacionMaquina
    {
		private bool _ocupado =  true;
		public int IdEstacion { get; set; }
		

		public bool Ocupado
		{
			get { return _ocupado; }
			set { _ocupado = value; }
		}




	}
}