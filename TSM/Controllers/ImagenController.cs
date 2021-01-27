using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace TSM.Controllers
{
    public class ImagenController : Controller
    {
      
        [HttpPost]
        [Route("Imagen/ImgStr/")]
        public JsonResult ObtieneImagenStr()
        {
            //crea dictionario respuesta
            Dictionary<string, object> data = new Dictionary<string, object>();
            Dictionary<string, object> Imagenes = new Dictionary<string, object>();

            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();

            Imagenes = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            foreach (KeyValuePair<string, object> i in Imagenes)
            {
                data.Add(i.Key, Utils.Config.GetBase64Image(i.Value.ToString()));

            }
            return Json(data,JsonRequestBehavior.AllowGet);
        }


    }
}
