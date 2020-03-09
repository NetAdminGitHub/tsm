using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class SublimacionOrdenesTrabajosController : Controller
    {
        // GET: OrdenTrabajoSimulacion
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("SublimacionOrdenesTrabajos/SublimacionRegistro/{IdCliente}/{IdRequerimiento}")]
        public ActionResult SublimacionOrdenesTrabajosReg(long IdCliente,long IdRequerimiento)
        {
            ViewData["IdCliente"] = IdCliente;
            ViewData["IdRequerimiento"] = IdRequerimiento;
            return View("SublimacionOrdenesTrabajosReg");
        }
    }
}