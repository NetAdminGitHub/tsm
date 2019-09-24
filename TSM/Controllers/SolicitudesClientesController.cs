using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class SolicitudesClientesController : Controller
    {
        // GET: SolicitudesClientes
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("SolicitudesClientes/IngresoSolicitudesClientes/{idServicio}/{esContacto}/{idSolicitud}")]
        public ActionResult IngresoSolicitudesClientes(long idServicio, int esContacto,long idSolicitud)
        {
            ViewData["idServicio"] = idServicio;
            ViewData["esContacto"] = esContacto;
            ViewData["idSolicitud"] = idSolicitud;
            return View("IngresoSolicitudesClientes");
        }

        [HttpGet]
        [Route("SolicitudesClientes/SolicitudesPendientes/{idServicio}/{idEstado}")]
        public ActionResult SolicitudesPendientes(long idServicio,string idEstado )
        {
            ViewData["idServicio"] = idServicio;
            ViewData["idEstado"] = idEstado;
            return View("SolicitudesPendientes");
        }
    }
}