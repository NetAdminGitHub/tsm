using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Specialized;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;
using TSM.Utils;
using TSM.BOL;
using TSM.DAL;
using TSM.Models;
using TSM.FrwkSeguridadSrv;

namespace TSM.Controllers
{
    public class GetCipherController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        ///obtiene cadena cifrada 
        /// </summary>
        /// <param name="c"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Master(FormCollection form)
        {
            string cc = form["cadena"];
            string cifer = "";
            SeguridadClient seg = new SeguridadClient("BasicHttpBinding_ISeguridad");
            cifer = seg.Encriptar(cc, Utils.Config.App);
             return Json(cifer, JsonRequestBehavior.AllowGet);


        }
        
    }
}