using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Specialized;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using TSM.Utils;
using TSM.BOL;
using TSM.DAL;
using TSM.Models;

namespace TSM.Controllers
{
    public class ReportesPbiController : Controller
    {
        public string accessToken { get; set; }
        //public string baseUri = "https://api.powerbi.com/v1.0/myorg/";
        public string errorLabel = "";

        // GET: TrazabilidadExistencias
        [Route("ReportesPbi/{Reporte}/{NombrePagina}")]
        public ActionResult Index(string reporte = null,string NombrePagina = null)
        {
            Report rpt = null;
            ReportePbi PbiResult = null;
            //crea objeto para solicitud
            PbiConfRequestModel re = new PbiConfRequestModel()
            {
                CodEntorno = null,
                CodReporte = reporte.Trim(),
                NombrePagina = NombrePagina.Trim()
            };

            using (ReportePbiBOL test = new ReportePbiBOL(new ReportePbiDAL()))
            {
                // obtiene configuración de reporte
                 PbiResult = test.ObtieneParametrosPbi(Utils.Config.TSM_WebApi, re);
                if (PbiResult == null)
                {
                    throw new Exception("No se han obtenido parámeros para el reporte");
                } // se agrega URl para redireccionar luego de login
                else
                {
                    PbiResult.reportRedirecUrl = String.Format("ReportesPbi/{0}/{1}/", reporte, NombrePagina);
                    PbiUtils.PbiReport = PbiResult;
                }
            }


            if (Session[PbiUtils.authResultString] != null)
            {
               //obtiene datos del reporte
                using(ReportePbiBOL rpbiBo = new ReportePbiBOL(new ReportePbiDAL()))
                {
                      rpt = rpbiBo.GetReport(PbiResult);
                    //asigna a variable de sesion.
                    PbiUtils.SetEmbedDataSet(rpt.EmbedUrl, rpt.DatasetId);                
                }

            }
            else
            {
                PbiUtils.EmbedType = "EmbedReport";
                var urlToRedirect = PbiUtils.GetAuthorizationCode();

                //Redirect to Azure AD to get an authorization code
                Response.Redirect(urlToRedirect);
            }

            ViewBag.Reporte = rpt;
            ViewBag.pbat = accessToken;
            
            return View();
           // return View();
        }







    }

}
