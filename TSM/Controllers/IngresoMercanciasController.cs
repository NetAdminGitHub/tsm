using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.IO;

namespace TSM.Controllers
{
    public class IngresoMercanciasController : Controller
    {
        // GET: IngresoMercancias
        public ActionResult Index()
        {
            return View();
        }

        [Route("IngresoMercancias/{idcliente}/{idingreso}")]
        public ActionResult Index(long idcliente, long idingreso)
        {
            ViewBag.IdCliente = idcliente;
            ViewBag.IdIngreso = idingreso;
            return View();
        }

        [HttpPost]
        public ActionResult SubirArchivo(string id, IEnumerable<HttpPostedFileBase> Adjunto)
        {
            string exten = "xlsx";
            string physicalPath = Path.Combine(Server.MapPath("~/Importaciones"), id);

            Dictionary<string, object> respuesta = new Dictionary<string, object>(); 

            if (Adjunto != null)
            {
                foreach (var file in Adjunto)
                {
                    if (Path.GetExtension(file.FileName).ToUpper() != exten.ToUpper())
                    {
                        respuesta.Add("Resultado", false);
                        respuesta.Add("Msj", "Extensión de archivo no permitida: " + Path.GetExtension(file.FileName).ToString());
                        return Json(respuesta);
                    }

                    var fileName = Path.GetFileName(file.FileName);
                    
                    if (!Directory.Exists(physicalPath))
                        Directory.CreateDirectory(physicalPath);

                    physicalPath = Path.Combine(physicalPath, fileName);

                    file.SaveAs(physicalPath);
                }
            }

            respuesta.Add("Ruta", physicalPath);
            respuesta.Add("Resultado", true);
            respuesta.Add("Msj", "");
            return Json(respuesta);
        }
    }
}