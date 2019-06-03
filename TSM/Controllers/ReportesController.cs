using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;

namespace TSM.Controllers
{
    public class ReportesController : Controller
    {
        // GET: Reportes
        [Route("Reportes/{controlador}/{accion}/{id}")]
        public ActionResult Visor(string controlador, string accion, long id)
        {
            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, controlador, accion, id));

            Session["data"] = data;
            Session["rpt"] = accion == "Cotizacion" ? "rptCotizacionPrograma2" : "rptCotizacionRentabilidad";

            return View();
        }
    }
}