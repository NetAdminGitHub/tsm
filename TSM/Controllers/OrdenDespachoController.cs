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
        [Route("OrdenDespacho/Edit/{idCliente}/{IdDespachoMercancia}/{fecha}/{planta}/{NoDocumento}")]
        public ActionResult Edit(long idCliente, long IdDespachoMercancia, DateTime fecha, int planta, string NoDocumento)
        {
            ViewBag.IdCliente = idCliente;
            ViewBag.IdDespachoMercancia = IdDespachoMercancia;
            ViewBag.Fecha = fecha;
            ViewBag.Planta = planta;
            ViewBag.NoDocumento = NoDocumento;
            return View("Index");
        }
    }
}