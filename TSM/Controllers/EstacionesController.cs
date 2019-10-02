using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class EstacionesController : Controller
    {
        // GET: Estaciones
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult EstacionColores()
        {
            return PartialView();
        }
        public ActionResult EstacionAccesorios()
        {
            return PartialView();
        }
        public ActionResult EstacionDisenos()
        {
            return PartialView();
        }
        public ActionResult EstacionAccesoriosDis()
        {
            return PartialView();
        }
        public ActionResult EstacionFormulas()
        {
            return PartialView();
        }
        public ActionResult EstacionMuestra()
        {
            return PartialView();
        }
    }
}