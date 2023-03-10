using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class OrdenesTrabajoController : Controller
    {
        // GET: OrdenesTrabajo
        public ActionResult Index()
        {
            return View();
        }

        [Route("OrdenesTrabajo/ElementoTrabajo/{idOrdenTrabajo}/{idEtapaProceso}")]
        public ActionResult ElementoTrabajo(long idOrdenTrabajo, int idEtapaProceso)
        {
            ViewBag.IdOrdenTrabajo = idOrdenTrabajo;
            ViewBag.IdEtapaProceso = idEtapaProceso;

            string result = Utils.Config.GetData(Utils.Config.TSM_WebApi + "EtapasProcesos/" + idEtapaProceso.ToString());

            if (result == null)
                return View("Views\\GestionOT");
            else
            {
                Dictionary<string, object> etapa = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                ViewBag.VistaParcial = etapa["VistaFormulario"].ToString();

                return View();
            }
        }

        public ActionResult SolicitarIngresoCambios()
        {

            return PartialView("_SolicitarIngresoCambios");
        }
        public ActionResult SolicitudReactivacionOrdenTrabajo()
        {

            return PartialView("_SolicitudReactivacionOrdenTrabajo");
        }


        public ActionResult RegistroOrdenesTrabajosAgendas()
        {

            return PartialView("_RegistroOrdenesTrabajosAgendas");
        }

        public ActionResult HistoricoSeteos()
        {
            return PartialView("_HistoricoSeteos");
        }

        public ActionResult SolicitarIngresoAjustes()
        {

            return PartialView("_SolicitarIngresoAjustes");
        }
        public ActionResult AutorizarEstacionesPermitidas()
        {

            return PartialView("_AutorizarEstacionesPermitidas");
        }
        [HttpPost]
        public ActionResult VistaParcial(string id)
        {
            return PartialView(id);
        }
    }
}