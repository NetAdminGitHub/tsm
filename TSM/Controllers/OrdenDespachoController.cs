using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class OrdenDespachoController : Controller
    {
        // GET: OrdenDespacho
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("OrdenDespacho/{idCliente}")]
        public ActionResult Index(long idCliente)
        {
            ViewBag.IdCliente = idCliente;
            return View();
        }

        [HttpGet]
        [Route("OrdenDespacho/Edit/{idCliente}/{IdDespachoMercancia}")]
        public ActionResult Edit(long idCliente, long IdDespachoMercancia)
        {
            ViewBag.IdCliente = idCliente;
            ViewBag.IdDespachoMercancia = IdDespachoMercancia;
            return View("Index");
        }
    }
}