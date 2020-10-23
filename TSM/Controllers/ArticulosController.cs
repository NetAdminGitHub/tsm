using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ArticulosController : Controller
    {
        // GET: Articulos
        public ActionResult Index()
        {
            return View();
        }
    }
}