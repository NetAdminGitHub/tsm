using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class CrearEmbalajeController : Controller
    {
        // GET: CrearEmbalaje
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        [Route("CrearEmbalaje/{idCliente}/{IdDespachoEmbalajeMercancia}/{idPlanta}/{Sugerido}")]
        public ActionResult Index(long idCliente, long IdDespachoEmbalajeMercancia, int idPlanta,int Sugerido)
        {
            ViewBag.IdCliente = idCliente;
            ViewBag.IdDespachoEmbalajeMercancia = IdDespachoEmbalajeMercancia;
            ViewBag.Planta = idPlanta;
            ViewBag.Sugerido = Sugerido;
            return View();
        }
        [HttpGet]
        [Route("CrearEmbalaje/Edit/{idCliente}/{IdDespachoMercancia}")]
        public ActionResult Edit(long idCliente, long IdDespachoMercancia)
        {
            ViewBag.IdCliente = idCliente;
            ViewBag.IdDespachoMercancia = IdDespachoMercancia;
            return View("Index");
        }
    }
}