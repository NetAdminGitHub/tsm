using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ConsultaCorteMicroController : Controller
    {
        // GET: ConsultaCorteMicro
        public ActionResult Index()
        {
            return View();
        }

        [Route("ConsultaCorteMicro/{IdHojaBandeo}/{IdCatalogo}")]
        public ActionResult Index(long IdHojaBandeo, long IdCatalogo)
        {
            ViewBag.IdHojaBandeo = IdHojaBandeo;
            ViewBag.IdCatalogoDiseno = IdCatalogo;

            return View();
        }
    }
}