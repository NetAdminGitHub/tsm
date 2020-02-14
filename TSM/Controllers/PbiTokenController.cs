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


namespace TSM.Controllers
{
    public class PbiTokenController : Controller
    {

 

       [HttpGet]
        public void Validar()
        {
            //Redirect uri must match the redirect_uri used when requesting Authorization code.
            string redirectUri = PbiUtils.PbiReport.RedirectUrl;//$"https://localhost:44311/PbiToken/Validar";
            string authorityUri =PbiUtils.PbiReport.AADAuthorityUri;// "https://login.windows.net/common/";

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

                //Set Session "authResult" index string to the AuthenticationResult
                Session[PbiUtils.authResultString] = AR;

                //Get the authentication result from the session
                PbiUtils.authResult = (AuthenticationResult)Session[PbiUtils.authResultString];

                //Response.Redirect($"/{PbiUtils.EmbedType}.aspx");
            }
            else
            {
                //Remove Session "authResult"
                Session[PbiUtils.authResultString] = null;
            }
            //Redirect back to Default.aspx
            Response.Redirect(Url.Content("~"+PbiUtils.PbiReport.reportRedirecUrl),false);

        }
    }



    
}