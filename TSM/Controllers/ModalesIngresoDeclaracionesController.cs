using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ModalesIngresoDeclaracionesController : Controller
    {
        // GET: ModalesIngresoDeclaraciones
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult IngresoNotaRemision()
        {
            return PartialView("_IngresoNotaRemision");
        }
        public ActionResult ModalVerNotasRemision()
        {
            return PartialView("_ModalVerNotasRemision");
        }

        public ActionResult IngresoBultoAddItem()
        {
            return PartialView("_IngresoBultoAddItem");
        }
        public ActionResult ListaEmpaqueAddPL()
        {
            return PartialView("_ListaEmpaqueAddPL");
        }

    }
}