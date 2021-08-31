using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class FichaProduccionController : Controller
    {
        // GET: ConsultaFichaProduccion
        public ActionResult Index()
        {
            ViewData["IdOrdenTrabajo"] = 0;
            return View();
        }

        [HttpGet]
        [Route("FichaProduccion/Ficha/{IdOrdenTrabajo}/{IdSimulacion}/{IdCotizacion}")]
        public ActionResult FichaOT(long IdOrdenTrabajo, long IdSimulacion,long IdCotizacion)
        {
            ViewData["IdOrdenTrabajo"] = IdOrdenTrabajo;
            ViewData["IdSimulacion"] = IdSimulacion;
            ViewData["IdCotizacion"] = IdCotizacion;
            return View("Ficha");
        }
    }
}