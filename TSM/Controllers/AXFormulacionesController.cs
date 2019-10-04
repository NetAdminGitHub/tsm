using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class AXFormulacionesController : Controller
    {
        // GET: AXFormulaciones
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ConsultaHistoricaFormulas()
        {
            return PartialView();
        }
    }
}

