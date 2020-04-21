using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Specialized;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using TSM.Utils;
using TSM.Models;
using TSM.FrwkSeguridadSrv;

namespace TSM.Controllers
{
    public class PbiTokenController : Controller
    {


        public ActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public void Validar()
        {
            //var a = (ReportePbi)Session["PbiParams"];
            //Redirect uri must match the redirect_uri used when requesting Authorization code.
            string redirectUri = PbiUtils.PbiReport.RedirectUrl;//"https://localhost:44311/PbiToken/Validar";
            string authorityUri = PbiUtils.PbiReport.AADAuthorityUri;// "https://login.windows.net/common/";

            // Get the auth code
            string code = Request.Params["code"];

            if (code != null)
            {
                // Get auth token from auth code       
                TokenCache TC = new TokenCache();

                AuthenticationContext AC = new AuthenticationContext(authorityUri, TC);
                ClientCredential cc = new ClientCredential
                    (PbiUtils.PbiReport.ApplicationId,
                     PbiUtils.PbiReport.AppSecret);

                AuthenticationResult AR = AC.AcquireTokenByAuthorizationCodeAsync(code, new Uri(redirectUri), cc).Result;

                //asigna respuesta de tipo AuthenticationResult a variable de session
                Session[PbiUtils.authResultString] = AR;

                //Get the authentication result from the session
               //// PbiUtils.authResult = (AuthenticationResult)Session[PbiUtils.authResultString];
                              
            }
            else
            {
                //Remove Session "authResult"
                Session[PbiUtils.authResultString] = null;
            }
            //Redirect back to Default.aspx
            Response.Redirect(Url.Content("~/"+PbiUtils.PbiReport.reportRedirecUrl),false);

        }


        /// <summary>
        /// método autentica usuario y contraseña de cuenta master para login a herramienta de PowerBI
        /// </summary>
        [HttpGet]
        public void AutenticaMaster()
        {
            Session[PbiUtils.authResultString] = null; //reinicia la variable de sesión.
            SeguridadClient seg = new SeguridadClient("BasicHttpBinding_ISeguridad");
            var a = (ReportePbi)Session["PbiParams"];


            //Redirect uri must match the redirect_uri used when requesting Authorization code.
            string redirectUri = a.RedirectUrl;//$"https://localhost:44311/PbiToken/Validar";
            string authorityUri = a.AADAuthorityUri;// "https://login.windows.net/common/";
            AuthenticationResult authres = null;
          
               var authContext = new AuthenticationContext(authorityUri);

            // Authentication using master user credentials
            var credential = new UserPasswordCredential(a.MasterAcc, seg.Desencriptar(a.MasterAccKey,Utils.Config.App));
            authres = authContext.AcquireTokenAsync(a.PbiApiResourceUrl,a.ApplicationId, credential).Result;
            //asigna respuesta de tipo AuthenticationResult a variable de session
            Session[PbiUtils.authResultString] = authres;

            //Redirect back to Default.aspx
            Response.Redirect(Url.Content("~/" + a.reportRedirecUrl), false);
        }



    }



    
}