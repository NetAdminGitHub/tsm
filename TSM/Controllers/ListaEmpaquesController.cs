using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ListaEmpaquesController : Controller
    {
        // GET: ListaEmpaques
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("ListaEmpaques/{idOD}")]
        public ActionResult Index(long idOD)
        {
            ViewBag.idOD = idOD;
            return View();
        }
    }
}