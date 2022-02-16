using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ModalesIngresoMercanciaController : Controller
    {
        // GET: ModalesIngresoMercancia
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ControlBulto()
        {
            return PartialView("_ControlBulto");
        }

        public ActionResult IngresoBulto()
        {
            return PartialView("_IngresoBulto");
        }

        public ActionResult IngresoBultoSerie()
        {
            return PartialView("_IngresoBultoSerie");
        }

        public ActionResult CrearListaEmpaque()
        {
            return PartialView("_CrearListaEmpaque");
        }
    }
    
}