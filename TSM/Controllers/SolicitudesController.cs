using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class SolicitudesController : Controller
    {
        // GET: Solicitudes
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetStep()
        {
            ActionResult pv = null;

            switch (Convert.ToInt16(Request["step_number"]))
            {
                case 0:
                    pv = PartialView("_SolicitudRegCliente");
                    break;
                case 1:
                    pv = PartialView("_SolicitudRegPrenda");
                    break;
                case 2:
                    pv = PartialView("_SolicitudRegDisenoPrendaPieza");
                    break;
                case 3:
                    pv = PartialView("_SolicitudRegDisenoPrendaTela");
                    break;
                case 4:
                    pv = PartialView("_SolicitudRegDisenoPrendaUbicacion");
                    break;
                case 5:
                    pv = PartialView("_SolicitudRegDisenoPrendaMuestra");
                    break;
                default:
                    break;
            }
            return pv;
        }
        [HttpGet]
        [Route("Solicitudes/IngresoSolicitudes/{id}/{idServicio}/{idCliente}")]
        public ActionResult IngresoSolicitudes(long id,long idServicio,long idCliente)
        {
            ViewData["idsolicitud"] = id;
            ViewData["idServicio"] = idServicio;
            ViewData["idCliente"] = idCliente;
            return View("IngresoSolicitudes");
        }

        [HttpPost]
        [Route("Solicitudes/SubirArchivo/{id}")]
        public ActionResult SubirArchivo(string id, IEnumerable<HttpPostedFileBase> Adjunto)
        {
            if (Adjunto != null)
            {
                foreach (var file in Adjunto)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var rutaFisica = Server.MapPath("~/Adjuntos");
                    var physicalPath = Path.Combine(rutaFisica, id);

                    if (!Directory.Exists(physicalPath))
                        Directory.CreateDirectory(physicalPath);

                    physicalPath = Path.Combine(physicalPath, fileName);

                    file.SaveAs(physicalPath);
                }
            }

            return Content("");
        }

        [HttpPost]
        public ActionResult BorrarArchivo(FormCollection form)
        {
        
            Dictionary<string, bool> respuesta = new Dictionary<string, bool>();
            try
            {
                if (form["fileName"] != null)
                {
                    var physicalPath = Path.Combine(Server.MapPath("~/Adjuntos"), form["id"], form["fileName"]);

                    if (System.IO.File.Exists(physicalPath))
                    {
                        System.IO.File.Delete(physicalPath);
                    }
                }

                respuesta.Add("Resultado", true);
                return Json(respuesta);
            }
            catch (Exception)
            {
                respuesta.Add("Resultado", false);
                return Json(respuesta);
            }
        }

        [HttpPost]
        [Route("Solicitudes/SubirArchivoReq")]
        public ActionResult SubirArchivoReq(List<Dictionary<string,object>> value)
        {
            Dictionary<string, bool> respuesta = new Dictionary<string, bool>();
            try
            {
                foreach (var item in value)
                {
                    var rutaFisica = Server.MapPath("~/Adjuntos");
                    var physicalPath = Path.Combine(rutaFisica, item["NoDocumentoSol"].ToString(), item["ReferenciaGrafica"].ToString());
                    var physicalPathDestino = Path.Combine(rutaFisica, item["NoDocumento"].ToString());

                    if (!Directory.Exists(physicalPathDestino))
                        Directory.CreateDirectory(physicalPathDestino);
                    if (System.IO.File.Exists(physicalPath))
                    {
                        physicalPathDestino = Path.Combine(physicalPathDestino, item["ReferenciaGrafica"].ToString());
                        System.IO.File.Copy(physicalPath, physicalPathDestino);
                    }
                }

                respuesta.Add("Resultado", true);
                return Json(respuesta);
            }
            catch (Exception)
            {

                respuesta.Add("Resultado", false);
                return Json(respuesta);
            }
            
           
        }
    }
}