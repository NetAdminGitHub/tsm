using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class NotaRemisionController : Controller
    {
        // GET: NotaRemision
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("NotaRemision/{idOD}")]
        public ActionResult Index(long idOD)
        {
            ViewBag.IdDespachoMercancia = idOD;
            return View();
        }

    }
}