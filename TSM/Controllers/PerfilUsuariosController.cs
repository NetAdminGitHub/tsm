using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class PerfilUsuariosController : Controller
    {
        [HttpGet]
        public JsonResult GetPerfilUsuario(string User)
        {
            FrwkAuthSrv.AuthClient vLdap = new FrwkAuthSrv.AuthClient("BasicHttpBinding_IAuth");

            Dictionary<string, string>[] Perfil = vLdap.getUserLDAP(User);

            if (Perfil == null || Perfil.Length==0) {
                return Json(new List<Dictionary<string, object>>(), JsonRequestBehavior.AllowGet);
            }
            return Json(Perfil, JsonRequestBehavior.AllowGet);
        }
    }
}