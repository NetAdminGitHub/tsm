using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class GestionOTAsignacionesController : Controller
    {
        // GET: GestionOTAsignaciones
        public ActionResult Index()
        {
            ViewData["KanbanEtapa_IdEtapaProceso"] = 0;
            ViewData["KanbanEtapa_IdOrdenTrabajo"] = 0;
            return View();
        }

        [HttpGet]
        [Route("GestionOTAsignaciones/{idEtapaProceso}/{idOrdenTrabajo}")]
        public ActionResult KanbanAsiganciones(int idEtapaProceso,long idOrdenTrabajo)
        {
            ViewData["KanbanEtapa_IdEtapaProceso"] = idEtapaProceso;
            ViewData["KanbanEtapa_IdOrdenTrabajo"] = idOrdenTrabajo;
            return View("index");
        }
    }
}