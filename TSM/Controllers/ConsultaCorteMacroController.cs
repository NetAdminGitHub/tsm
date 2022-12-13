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
                                            string IdServicio, string FechaDesde, string FechaHasta, string FM)
        {
            Session["CM_IdCliente"] = IdCliente == null ? "" : IdCliente;
            Session["CM_IdPlanta"] = IdPlanta == null ? "" : IdPlanta;
            Session["CM_IdEtapaMacro"] = IdEtapaMacro == null ? "" : IdEtapaMacro;
            Session["CM_IdCatalogo"] = IdCatalogo == null ? "" : IdCatalogo;
            Session["CM_IdServicio"] = IdServicio == null ? "" : IdServicio;
            Session["CM_FechaDesde"] = FechaDesde == null ? "" : FechaDesde;
            Session["CM_FechaHasta"] = FechaHasta == null ? "" : FechaHasta;
            Session["CM_FM"] = FM == null ? "" : FM;

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

            result.Add("IdCliente", Session["CM_IdCliente"] as string);
            result.Add("IdPlanta", Session["CM_IdPlanta"] as string);
            result.Add("IdEtapaMacro", Session["CM_IdEtapaMacro"] as string);
            result.Add("IdCatalogo", Session["CM_IdCatalogo"] as string);
            result.Add("IdServicio", Session["CM_IdServicio"] as string);
            result.Add("FechaDesde", Session["CM_FechaDesde"] as string);
            result.Add("FechaHasta", Session["CM_FechaHasta"] as string);
            result.Add("FM", Session["CM_FM"] as string);

            return result;
        }
    }
}