using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TSM.FrwkSeguridadSrv;
using TSM.FrwkAuthSrv;
using Newtonsoft.Json;
using TSM.BOL;
using TSM.DAL;

namespace TSM.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
             if (Utils.Config.AppMode == "LCL")
            {
                return View();
            }
            else if (Utils.Config.AppMode == "EXT")
            {
                if (Session["aztkn"] == null)
                {

                    using (var v = new AzureAuthBOL(new AzureAuthDAL()))
                    {
                        var result = v.GetAzAuthorizeRequest();

                        if (!Response.IsRequestBeingRedirected) {    
                            Response.Redirect(result);
                        }
                        
                    }
                    
                }
                else {

                    //remueve cookie t
                    HttpCookie tcookie = System.Web.HttpContext.Current.Request.Cookies["t"];
                    if (tcookie != null)
                    {
                        tcookie.Expires = DateTime.Now.AddDays(-1D);
                        Response.Cookies.Add(tcookie);
                    }
                    return RedirectToAction("Validar", "Token", new { id_token = Session["aztkn"].ToString() });
          
                }


            }

            return View(); 
        }



        [HttpPost]
        //string user, string password
        public JsonResult Login(FormCollection form)
        {
            SeguridadClient seguridad = new SeguridadClient("BasicHttpBinding_ISeguridad");

            string c = seguridad.Encriptar(form["password"], Utils.Config.App);

            HttpBrowserCapabilitiesBase browser = Request.Browser;

            string Navegador = browser.Browser + " " + browser.Version;

            Dictionary<string, string> trama = new Dictionary<string, string>()
            {
                {"Usuario", form["user"] },
                {"App", Utils.Config.App },
                {"TipoSolicitud", "VALIDARUSUARIO" },
                {"Navegador", Navegador },
                {"c", c }
            };

            AuthClient Ldap = new AuthClient("BasicHttpBinding_IAuth");

            string newToken = "";

            newToken = Ldap.Action(JsonConvert.SerializeObject(trama));

            return Json(newToken, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult OAuth(FormCollection form)
        {
            string keychain = form["keychain"];
            SeguridadClient seguridad = new SeguridadClient("BasicHttpBinding_ISeguridad");
            string datasec = seguridad.Desencriptar(keychain, Utils.Config.App);
                        
            //verifico cadena no vacia
            if (keychain.Trim().Equals(""))
            {
                return RedirectToAction("Index", "Login");
            }

            Dictionary<string, string> tramaValores = JsonConvert.DeserializeObject<Dictionary<string, string>>(datasec);

            if (tramaValores == null)
            {
                return RedirectToAction("Index", "Login");
            }

            ViewBag.Usuario = tramaValores["Usuario"];
            ViewBag.Token = keychain;

            return View();
        }
    }
}