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
        [Route("CrearEmbalaje/Edit/{idCliente}/{IdDespachoMercancia}")]
        public ActionResult Edit(long idCliente, long IdDespachoMercancia)
        {
            ViewBag.IdCliente = idCliente;
            ViewBag.IdDespachoMercancia = IdDespachoMercancia;
            return View("Index");
        }
    }
}