using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class CotizacionesMuestrasController : Controller
    {
        // GET: CotizacionesProgramasMuestras
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("CotizacionesMuestras/CotizacionesMuestrasDatos/{IdCotizacion}/{IdEstado}")]
        public ActionResult CotizacionesMuestrasDatos(long IdCotizacion,string IdEstado)
        {
            ViewData["IdCotizacion"] = IdCotizacion;
            ViewData["IdEstado"] = IdEstado;
            return View("CotizacionesMuestrasDatos");
        }
    }
}