using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace TSM.Controllers
{
    public class TokenController : Controller
    {
        [HttpGet]
        public JsonResult GetToken(string trama)
        {
            Dictionary<string, string> tramaValores = JsonConvert.DeserializeObject<Dictionary<string, string>>(trama);

            string jToken = "";

            HttpBrowserCapabilitiesBase browser = Request.Browser;

            string Navegador = browser.Browser + " " + browser.Version;

            tramaValores.Add("App", Utils.Config.App);
            tramaValores.Add("Navegador", Navegador);

            FrwkAuthSrv.AuthClient Ldap = new FrwkAuthSrv.AuthClient("BasicHttpBinding_IAuth");

            string newToken;

            if (jToken != "")
                newToken = Ldap.Action(jToken);
            else
                newToken = Ldap.Action(JsonConvert.SerializeObject(tramaValores));

            return Json(newToken, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetUser()
        {
            return Json(ObtenerUsuarioLocal(Request.UserHostAddress), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Redirect()
        {
            if (ObtenerUsuarioLocal(Request.UserHostAddress) != "")
                return RedirectToAction("Index", "Home", new { area = "" });
            else
                return RedirectToAction("Index", "Login", new { area = "" });
        }

        private string ObtenerUsuarioLocal(string ip)
        {
            var client = new WebClient();
            client.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");

            string url = "http://" + ip.Replace("::1", "localhost") + ":8888/RESTWCFServiceLibrary/LDAPUser";

            try
            {
                var response_data = client.DownloadData(url);

                Dictionary<string, string> usuario = JsonConvert.DeserializeObject<Dictionary<string, string>>(UnicodeEncoding.UTF8.GetString(response_data));

                return usuario["getUserResult"].Split('\\')[1];
            }
            catch
            {
                return "";
            }
        }
    }
}