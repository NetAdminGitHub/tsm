using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TSM.Models
{
    public class ReportePbi
    {

        public string CodEntorno { get; set; }
        public string NombreEntorno { get; set; }
        public string Entorno { get; set; }
        public string ApplicationId { get; set; }
        public string AppSecret { get; set; }
        public string PbiApiResourceUrl { get; set; }
        public string PbiDataUrl { get; set; }
        public string PbiApiUrl { get; set; }
        public string AADAuthorityUri { get; set; }
        public string RedirectUrl { get; set; } //Redirect desde pantalla de login de pbi.
        public string CodReporte { get; set; }
        public string NombreReporte { get; set; }
        public string Reporte { get; set; }
        public bool HabilitaBarraNav { get; set; }
        public bool HabilitaPanelFil { get; set; }
        public string NombrePagina { get; set; }
        public string Pagina { get; set; }
        public string reportRedirecUrl { get; set; } // redirect a vista de reporte.
        public string MasterAcc { get; set; }
        public string MasterAccKey { get; set; }
        



    }
}