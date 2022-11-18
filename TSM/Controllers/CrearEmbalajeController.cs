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
        [Route("CrearEmbalaje/{IdDespachoMercancia}")]
        public ActionResult Index(long IdDespachoMercancia)
        {
            ViewBag.IdDespachoMercancia = IdDespachoMercancia;
            return View("Index");
        }

        [HttpGet]
        [Route("CrearEmbalaje/Edit/{idCliente}/{IdDespachoMercancia}")]
        public ActionResult Edit(long IdDespachoMercancia)
        {
            ViewBag.IdDespachoMercancia = IdDespachoMercancia;
            return View("Index");
        }
    }
}