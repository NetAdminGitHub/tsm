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
        public ActionResult DimensionesRequerimiento()
        {

            return PartialView("_DimensionesRequerimiento");
        }
        [HttpPost]
        public ActionResult SubirArchivo(string id, IEnumerable<HttpPostedFileBase> Adjunto)
        {
            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, "ExtensionesArchivosModulos", "GetbyModuloVista", 1));
            List<Dictionary<string, object>> exten = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(data);
            Dictionary<string, object> respuesta = new Dictionary<string, object>();

            if (Adjunto != null)
            {
                foreach (var file in Adjunto)
                {
                    var sql = (from e in exten
                               where e["Extension"].ToString().ToUpper() == Path.GetExtension(file.FileName).ToUpper()
                               select new
                               {
                                   Extension = e["Extension"]

                               }).Take(1);


                    if (sql.ToList().Count == 0)
                    {
                        respuesta.Add("Resultado", false);
                        respuesta.Add("Msj", "Extensión de archivo no permitida: " + Path.GetExtension(file.FileName).ToString());
                        return Json(respuesta);
                    }

                    var fileName = Path.GetFileName(file.FileName);
                    var rutaFisica = Server.MapPath("~/Adjuntos");
                    var physicalPath = Path.Combine(rutaFisica, id);

                    if (!Directory.Exists(physicalPath))
                        Directory.CreateDirectory(physicalPath);

                    physicalPath = Path.Combine(physicalPath, fileName);

                    file.SaveAs(physicalPath);
                }
            }

            respuesta.Add("Resultado", true);
            respuesta.Add("Msj", "");
            return Json(respuesta);
        }

        [HttpPost]
        public ActionResult SubirArchivoSublimacion(string id, IEnumerable<HttpPostedFileBase> Adjunto)
        {
            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, "ExtensionesArchivosModulos", "GetbyModuloVista", 4));
            List<Dictionary<string, object>> exten = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(data);
            Dictionary<string, object> respuesta = new Dictionary<string, object>();

            if (Adjunto != null)
            {
                foreach (var file in Adjunto)
                {
                    var sql = (from e in exten
                               where e["Extension"].ToString().ToUpper() == Path.GetExtension(file.FileName).ToUpper()
                               select new
                               {
                                   Extension = e["Extension"]

                               }).Take(1);


                    if (sql.ToList().Count == 0)
                    {
                        respuesta.Add("Resultado", false);
                        respuesta.Add("Msj", "Extensión de archivo no permitida: " + Path.GetExtension(file.FileName).ToString());
                        return Json(respuesta);
                    }

                    var fileName = Path.GetFileName(file.FileName);
                    var rutaFisica = Server.MapPath("~/Adjuntos");
                    var physicalPath = Path.Combine(rutaFisica, id);

                    if (!Directory.Exists(physicalPath))
                        Directory.CreateDirectory(physicalPath);

                    physicalPath = Path.Combine(physicalPath, fileName);

                    file.SaveAs(physicalPath);
                }
            }

            respuesta.Add("Resultado", true);
            respuesta.Add("Msj", "");
            return Json(respuesta);
        }

        [HttpPost]
        [Route("RequerimientoDesarrollos/SubirAdjuntoCatalogo")]
        public ActionResult SubirAdjuntoCatalogo(List<Dictionary<string, object>> value)
        {
            Dictionary<string, bool> respuesta = new Dictionary<string, bool>();
            try
            {
                var rutaFisica = Server.MapPath("~/Adjuntos");
                var physicalPath = Path.Combine(rutaFisica, value[0]["NoDocumento"].ToString(), value[0]["NombreArchivo"].ToString()); 
                 var physicalPathDestino = Path.Combine(rutaFisica, value[0]["NoReferencia"].ToString());

                if (!Directory.Exists(physicalPathDestino))
                    Directory.CreateDirectory(physicalPathDestino);
                if (System.IO.File.Exists(physicalPath))
                {
                    physicalPathDestino = Path.Combine(physicalPathDestino, value[0]["NombreArchivo"].ToString());
                    System.IO.File.Copy(physicalPath, physicalPathDestino,true);
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
        [Route("RequerimientoDesarrollos/SubirArchivoAdjunto/{id}/{nombre}")]
        public ActionResult SubirArchivoAdjunto(string id, string nombre, IEnumerable<HttpPostedFileBase> Adjunto)
        {


            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, "ExtensionesArchivosModulos", "GetbyModuloVista", 2));
            List<Dictionary<string, object>> exten = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(data);
            Dictionary<string, object> respuesta = new Dictionary<string, object>();

            if (Adjunto != null)
            {
                foreach (var file in Adjunto)
                {
                    var sql = (from e in exten
                               where e["Extension"].ToString().ToUpper() == Path.GetExtension(file.FileName).ToUpper()
                               select new
                               {
                                   Extension = e["Extension"]

                               }).Take(1);


                    if (sql.ToList().Count == 0){
                        respuesta.Add("Resultado", false);
                        respuesta.Add("Msj", "Extensión de archivo no permitida: " + Path.GetExtension(file.FileName).ToString());
                        return Json(respuesta);
                    }

                    var fileName = Path.GetFileName(file.FileName);
                    var rutaFisica = Server.MapPath("~/Adjuntos");
                    var physicalPath = Path.Combine(rutaFisica, id);
                    var physicalPathDestino = Path.Combine(rutaFisica, id);

                    if (!Directory.Exists(physicalPath))
                        Directory.CreateDirectory(physicalPath);

                    physicalPath = Path.Combine(physicalPath, fileName);
                    file.SaveAs(physicalPath);
                    if (System.IO.File.Exists(physicalPath))
                    {
                        physicalPathDestino = Path.Combine(physicalPathDestino, nombre + Path.GetExtension(file.FileName));
                        if (file.FileName != nombre + Path.GetExtension(file.FileName))
                        {
                            System.IO.File.Copy(physicalPath, physicalPathDestino,true);
                            System.IO.File.Delete(physicalPath);
                        }


                    }


                }
            }
            respuesta.Add("Resultado", true);
            respuesta.Add("Msj", "");
            return Json(respuesta);
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