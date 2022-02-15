using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class IngresoMercanciasController : Controller
    {
        // GET: IngresoMercancias
        public ActionResult Index()
        {
            return View();
        }

        [Route("IngresoMercancias/{idcliente}/{idingreso}")]
        public ActionResult Index(long idcliente, long idingreso)
        {
            ViewBag.IdCliente = idcliente;
            ViewBag.IdIngreso = idingreso;
            return View();
        }
    }
}