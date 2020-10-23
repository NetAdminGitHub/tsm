using System;
using System.Collections.Generic;
using System.Linq;

using System.Web.Mvc;
using System.Web.Routing;
using TSM.BOL;
using TSM.Models;

namespace TSM.Controllers
{
    public class MaquinasController : Controller
    {
        // GET: Maquinas
        public ActionResult Index()
        {
            return View();
        }

        
       
        [Route("Maquinas/Desplazar")]
        public JsonResult Desplazar(List<SolicitudDesplazamiento> value) 
        {
            var respuesta = new Dictionary<string, object>();
         
            using (var omaquina = new OperacionMaquinasBOL(value[0]))
            {
              respuesta =  omaquina.DesplazarBrazos();
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }


      

    }
}