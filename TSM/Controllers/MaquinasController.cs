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

        
        [HttpPost]
        [Route("Maquinas/Desplazar")]
        public string Desplazar(List<SolicitudDesplazamiento> value) 
        {
            var respuesta = new Dictionary<string, object>();
         
            using (var omaquina = new OperacionMaquinasBOL(value[0]))
            {
              respuesta =  omaquina.DesplazarBrazos();
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(respuesta);
        }


      

    }
}