using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TSM.Models
{
    public class SolicitudDesplazamiento
    {

        public string Direccion { get; set; }
        public string RespetaVacio { get; set; }

        public int Numbrazos { get; set; }
        public int BrazoInicial { get; set; }

        public int CantDesplazar { get; set; }

        public List<EstacionMaquina> Brazos { get; set; }


    }
}