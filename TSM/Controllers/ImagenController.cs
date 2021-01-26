using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ImagenController : Controller
    {
      
        [HttpPost]
        [Route("Imagen/ImgStr/")]
        public Dictionary<string,object> ObtieneImagenStr(Dictionary<string,object> Imagenes)
        {
            //crea dictionario respuesta
            Dictionary<string, object> data = new Dictionary<string, object>();

            foreach (KeyValuePair<string,object> i in Imagenes)
            {
                data.Add(i.Key, Utils.Config.GetBase64Image(i.Value.ToString()));    

            }
            return data;
        }


    }
}
