using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{

    public class RequerimientoDesarrollosController : Controller
    {

        // GET: RequerimientoDesarrollo
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
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
        public JsonResult BorrarArchivo(string id, string fileName)
        {
            Dictionary<string, bool> respuesta = new Dictionary<string, bool>();
            try
            {
                if (fileName != null)
                {
                    var physicalPath = Path.Combine(Server.MapPath("~/Adjuntos"), id, fileName);

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
       
        public ActionResult Consulta()
        {
            return PartialView("_RequerimientoDesarrollosConsulta");
            
        }

        [HttpPost]
        [Route("RequerimientoDesarrollos/SubirArchivoReq")]
        public ActionResult SubirArchivoReq(List<Dictionary<string, object>> value)
        {
            Dictionary<string, bool> respuesta = new Dictionary<string, bool>();
            try
            {
                foreach (var item in value)
                {
                    var rutaFisica = Server.MapPath("~/Adjuntos");
                    var physicalPath = Path.Combine(rutaFisica, item["NoReferencia"].ToString(), item["NombreArchivo"].ToString());
                    var physicalPathDestino = Path.Combine(rutaFisica, item["NoDocumento"].ToString());

                    if (!Directory.Exists(physicalPathDestino))
                        Directory.CreateDirectory(physicalPathDestino);
                    if (System.IO.File.Exists(physicalPath))
                    {
                        physicalPathDestino = Path.Combine(physicalPathDestino, item["NombreArchivo"].ToString());
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

        [HttpPost]
        [Route("RequerimientoDesarrollos/SubirArchivoCatalogo")]
        public ActionResult SubirArchivoCatalogo(List<Dictionary<string, object>> value)
        {
            Dictionary<string, bool> respuesta = new Dictionary<string, bool>();
            try
            {
                foreach (var item in value)
                {
                    var rutaFisica = Server.MapPath("~/Adjuntos");
                    var physicalPath = Path.Combine(rutaFisica, item["NoDocumento"].ToString(), item["NombreArchivo"].ToString());
                    var physicalPathDestino = Path.Combine(rutaFisica, item["NoReferencia"].ToString());

                    if (!Directory.Exists(physicalPathDestino))
                        Directory.CreateDirectory(physicalPathDestino);
                    if (System.IO.File.Exists(physicalPath))
                    {
                        physicalPathDestino = Path.Combine(physicalPathDestino, item["NombreArchivo"].ToString());
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