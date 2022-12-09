using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ConsultaCorteMacroController : Controller
    {
        // GET: ConsultaCorteMacro
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("ConsultaCorteMacro/SetFiltrosValue")]
        public ActionResult SetFiltrosValue(string IdCliente, string IdPlanta, string IdEtapaMacro, string IdCatalogo, 
                                            string IdServicio, string FechaDesde, string FechaHasta)
        {
            HttpContext.Session["IdCliente"] = IdCliente == null ? "" : IdCliente;
            HttpContext.Session["IdPlanta"] = IdPlanta == null ? "" : IdPlanta;
            HttpContext.Session["IdEtapaMacro"] = IdEtapaMacro == null ? "" : IdEtapaMacro;
            HttpContext.Session["IdCatalogo"] = IdCatalogo == null ? "" : IdCatalogo;
            HttpContext.Session["IdServicio"] = IdServicio == null ? "" : IdServicio;
            HttpContext.Session["FechaDesde"] = FechaDesde == null ? "" : FechaDesde;
            HttpContext.Session["FechaHasta"] = FechaHasta == null ? "" : FechaHasta;

            var result = FiltrosValue();
            return Json(result);
        }

        [HttpGet]
        [Route("ConsultaCorteMacro/GetFiltrosValue")]
        public ActionResult GetFiltrosValue()
        {
            var result = FiltrosValue();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private Dictionary<string, object> FiltrosValue()
        {
            Dictionary<string, object> result = new Dictionary<string, object>();

            result.Add("IdCliente", HttpContext.Session["IdCliente"] as string);
            result.Add("IdPlanta", HttpContext.Session["IdPlanta"] as string);
            result.Add("IdEtapaMacro", HttpContext.Session["IdEtapaMacro"] as string);
            result.Add("IdCatalogo", HttpContext.Session["IdCatalogo"] as string);
            result.Add("IdServicio", HttpContext.Session["IdServicio"] as string);
            result.Add("FechaDesde", HttpContext.Session["FechaDesde"] as string);
            result.Add("FechaHasta", HttpContext.Session["FechaHasta"] as string);

            return result;
        }
    }
}