using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class RetencionesController : Controller
    {
        // GET: Retenciones
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult AutorizarRetenciones()
        {

            return PartialView("_AutorizarRetenciones");
        }
    }
}