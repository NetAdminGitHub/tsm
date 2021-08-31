using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ConsultaFichasDesarrollosController : Controller
    {
        // GET: ConsultarFichaOT
        public ActionResult Index()
        {
            ViewData["IdOrdenTrabajo"] = 0;
            return View();
        }

        [HttpGet]
        [Route("ConsultaFichasDesarrollos/FichaOT/{IdOrdenTrabajo}")]
        public ActionResult FichaOT(long IdOrdenTrabajo)
        {
            ViewData["IdOrdenTrabajo"] = IdOrdenTrabajo;
            return View("FichaOT");
        }
    }
}