using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class PruebasLaboratorioController : Controller
    {
        // GET: PiezasDesarrolladas
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult InfoPruebaLaboratorio()
        {

            return PartialView("_InfoPruebaLaboratorio");
        }
    }
}