using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class IngresoDeclaracionController : Controller
    {
        // GET: IngresoDeclaracion
        public ActionResult Index()
        {
            return View();
        }

        [Route("IngresoDeclaracion/{idcliente}/{IdDeclaracionMercancia}")]
        public ActionResult Index(long idcliente, long IdDeclaracionMercancia)
        {
            ViewBag.IdCliente = idcliente;
            ViewBag.IdDeclaracionMercancia = IdDeclaracionMercancia;
            return View();
        }
    }

   
}