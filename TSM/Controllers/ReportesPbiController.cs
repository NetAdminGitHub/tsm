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
            AuthenticationResult a = null;
            ViewBag.Titulo = "";
            //crea objeto para solicitud
            PbiConfRequestModel re = new PbiConfRequestModel()
            {
                CodEntorno = null,
                CodReporte = reporte.Trim(),
                NombrePagina = NombrePagina.Trim()
            };

            ViewBag.Embedded = "";

            using (ReportePbiBOL pbiBol = new ReportePbiBOL(new ReportePbiDAL()))
            {
                Session["PbiParams"] = Session["PbiParams"] == null ? new ReportePbi() : Session["PbiParams"];
                // obtiene configuración de reporte
                 PbiResult = pbiBol.ObtieneParametrosPbi(Utils.Config.TSM_WebApi, re, (ReportePbi)Session["PbiParams"]);
                if (PbiResult == null)
                {
                    throw new Exception("No se han obtenido parámeros para el reporte");
                } // se agrega URl para redireccionar luego de login
                else
                {
                    PbiResult.reportRedirecUrl = String.Format("ReportesPbi/{0}/{1}/", reporte, NombrePagina);
                    Session["PbiParams"] = PbiResult; // agrega objeto a variable de sesion
                    PbiUtils.PbiReport = PbiResult;
                }
            }

           if (Session[PbiUtils.authResultString] != null)
            {
                 a = (AuthenticationResult)Session[PbiUtils.authResultString];
                    //obtiene datos del reporte
                    using (ReportePbiBOL rpbiBo = new ReportePbiBOL(new ReportePbiDAL()))
                    {
                        rpt = rpbiBo.GetReport(PbiResult, a.AccessToken);

                    ViewBag.Embedded = rpt.EmbedUrl;
                    //asigna a variable de sesion.
                    PbiUtils.SetEmbedDataSet(rpt.EmbedUrl, rpt.DatasetId);
                    }
                ViewBag.pbat = a.AccessToken;
            }
            else
            {

                if (!String.IsNullOrEmpty(PbiResult.MasterAcc) || !String.IsNullOrEmpty(PbiResult.MasterAccKey))
                {
                    return Redirect("~/PbiToken/AutenticaMaster");

                }
                else
                {
                    ViewBag.EmbedType = "EmbedReport";
                    var urlToRedirect = PbiUtils.GetAuthorizationCode(PbiResult);

                    //Redirect to Azure AD to get an authorization code
                    Response.Redirect(urlToRedirect);
                }
            }

            // ViewBag.Reporte = rpt;
            ViewBag.Titulo = (PbiResult != null) ? PbiResult.NombreReporte: "";
            ViewBag.ReportSet = (ReportePbi)Session["PbiParams"];
          
            return View();
         
        }


    }

}
