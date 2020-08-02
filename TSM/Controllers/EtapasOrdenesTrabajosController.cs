using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class EtapasOrdenesTrabajosController : Controller
    {
        // GET: EtapasOrdenesTrabajos
        public ActionResult Index()
        {
            ViewData["Catalogo_IdOrdenTrabajo"] = 0;
            return View();
        }

        [HttpGet]
        [Route("EtapasOrdenesTrabajos/{idOrdenTrabajo}")]
        public ActionResult KanbanEtapa(long idOrdenTrabajo)
        {
            ViewData["Catalogo_IdOrdenTrabajo"] = idOrdenTrabajo;
            return View("index");
        }
    }
}