using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class CatalogoDisenosController : Controller
    {
        // GET: CatalogoDisenos
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult CatalogoDisenoInf()
        {
            return PartialView();
        }
    }
}