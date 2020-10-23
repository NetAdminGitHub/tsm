using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class CatalogoDisenosController : Controller
    {
        // GET: CatalogoDisenos
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult CatalogoDisenoInf()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("CatalogoDisenos/ConsultarCatalogoDisenos/{idCliente}")]
        public ActionResult ConsultarCatalogoDisenos(long idCliente)
        {
            ViewData["IdCliente"] = idCliente;
            return PartialView("ConsultarCatalogoDisenos");
        }
        [HttpGet]
        [Route("CatalogoDisenos/CatalogoDisenoInf/{idCatalogoDiseno}/{idArte}")]
        public ActionResult CatalogoDisenoInf(long idCatalogoDiseno,long idArte)
        {
            ViewData["idCatalogoDiseno"] = idCatalogoDiseno;
            ViewData["IdArte"] = idArte;
            return PartialView("CatalogoDisenoInf");
        }
    }
}