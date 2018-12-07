using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class AnalisisDisenosController : Controller
    {
        // GET: AnalisisDisenos
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("{controller}/{action}/{id}")]
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
        [Route("{controller}/{action}/{id}/{filename}")]
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
            return PartialView("_AnalisisDisenosConsulta");

        }
    }
}