using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class SimulacionesController : Controller
    {
        // GET: Simulaciones
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Consulta()
        {
            return PartialView("_SimulacionesConsulta");

        }

        public ActionResult SimulacionDatos()
        {
            return PartialView("_SimulacionDatos");
        }
        
        public ActionResult SimulacionDatosSubli()
        {
            return PartialView("_SimulacionDatosSubli");
        }

        public ActionResult CostosPorPartes()
        {
            return PartialView("_CostosPorPartes");
        }
    }
}