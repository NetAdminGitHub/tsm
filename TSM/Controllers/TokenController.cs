using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using TSM.BOL;
using TSM.DAL;

namespace TSM.Controllers
{
    public class TokenController : Controller
    {
        [HttpGet]
        public JsonResult GetToken(string trama)
        {
            string newToken;

            newToken = GenerarToken(trama);

            return Json(newToken, JsonRequestBehavior.AllowGet);
        }


        public async Task<ActionResult> Validar()
        {
            if (Request.Params["id_token"] !=null)
            {
                using (var tknvalid = new AzureAuthBOL(new AzureAuthDAL()))
                {
                    try
                    {

                        Session["aztkn"] = null;// limpia sesión
                        //obtiene token validado
                        var jwt = await tknvalid.ValidarToken(Request.Params["id_token"]);
                        string[] user = jwt.Payload["preferred_username"].ToString().Split('@');
                        //crea cookie de usuario
                        HttpCookie cookieinfo = new HttpCookie("user");
                        cookieinfo.Value = user[0];

                        //Crea cookie de validación
                        string zvalidstr = "";
                        using (var c = new FrwkSeguridadSrv.SeguridadClient())
                        {
                            var str = user[0] + '&' + jwt.Payload["nonce"].ToString();
                            zvalidstr = await c.EncriptarAsync(str, Utils.Config.App);
                        }

                        HttpCookie verifcookie = new HttpCookie("zvalidator");
                        verifcookie.Value = zvalidstr;

                        // asigna token a param
                        Session["aztkn"] = Request.Params["id_token"]; // asigna token

                        Response.Cookies.Remove("user");
                        Response.Cookies.Remove("zvalidator");
                        Response.Cookies.Add(cookieinfo);
                        Response.Cookies.Add(verifcookie);
                    }
                    catch (Exception)
                    {

                        throw;
                    }

                 
                }

               
            }
            else { Response.Redirect("Error"); }

            return Redirect(Url.Content("Validado"));
        }

        public void Validado()
        {
            Response.Redirect(Url.Content("/Home/Index"), false);
        }

        public static string GenerarToken(string trama)
        {
            Dictionary<string, string> tramaValores = JsonConvert.DeserializeObject<Dictionary<string, string>>(trama);

            string jToken = "";

            HttpBrowserCapabilities browser = System.Web.HttpContext.Current.Request.Browser;

            string Navegador = browser.Browser + " " + browser.Version;

            tramaValores.Add("App", Utils.Config.App);
            tramaValores.Add("Navegador", Navegador);

            FrwkAuthSrv.AuthClient Ldap = new FrwkAuthSrv.AuthClient("BasicHttpBinding_IAuth");

            string newToken;

            if (jToken != "")
                newToken = Ldap.Action(jToken);
            else
                newToken = Ldap.Action(JsonConvert.SerializeObject(tramaValores));

            return newToken;
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

        public static string ObtenerUsuarioLocal(string ip)
        {


            var client = new MyWebClient();
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

        private class MyWebClient : WebClient
        {
            protected override WebRequest GetWebRequest(Uri uri)
            {
                WebRequest w = base.GetWebRequest(uri);
                w.Timeout = 1 * 1000; //4 segundos
                return w;
            }
        }
    }
}