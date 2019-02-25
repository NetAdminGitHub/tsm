using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class CatalogoInsumosController : Controller
    {
        // GET: CatalogoInsumos
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult InsumosComparar()
        {


            return PartialView("_CatalogoInsumosComparar");
        }
    }
}