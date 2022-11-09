using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class SimulacionesMuestrasController : Controller
    {
        // GET: SimulacionesMuestras
        public ActionResult Index()
        {
        
            return View();
        }

        public ActionResult Consulta()
        {

            return View("Consulta");
        }

        [HttpGet]
        [Route("SimulacionesMuestras/SimulacionesMuestrasInfo/{IdSimulacion}/{IdServicio}/{IdOrdenTrabajo}")]
        public ActionResult SimulacionesMuestrasInfo(long IdSimulacion,long IdServicio,long IdOrdenTrabajo)
        {
            ViewData["IdSimulacion"] = IdSimulacion;
            ViewData["IdServicio"] = IdServicio;
            ViewData["IdOrdenTrabajo"] = IdOrdenTrabajo;
            return View("SimulacionesMuestrasInfo");
        }

        public ActionResult SimulacionMuestrasDatos()
        {
            return PartialView("_SimulacionMuestrasDatos");
        }
        public ActionResult SimulacionDatosMuestrasSubli()
        {
            return PartialView("_SimulacionMuestrasDatosSubli");
        }

        

    }
}