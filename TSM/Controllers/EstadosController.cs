using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    //[Authorize]
    public class EstadosController : Controller
    {
        // GET: Estados
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CambioEstado()
        {

            return PartialView("_CambioEstado");
        }
    }

}