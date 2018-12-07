using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    //[Authorize]
    public class CategoriaConfeccionesController : Controller
    {
        // GET: CategoriaConfecciones
        public ActionResult Index()
        {
            return View();
        }
    }
}