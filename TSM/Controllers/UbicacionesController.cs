using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    //[Authorize]
    public class UbicacionesController : Controller
    {
        // GET: Ubicaciones
        public ActionResult Index()
        {
            return View();
        }
    }
}