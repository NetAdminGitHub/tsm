using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TSM.Models;

namespace TSM.DAL
{

    public interface IAzureAuthDal
    {
        AzureAuthConf GetAzureAuthConf();
    }

    public class AzureAuthDAL : IAzureAuthDal
    {

        public AzureAuthConf GetAzureAuthConf()
        {

            AzureAuthConf conf = new AzureAuthConf()
            {
                Authority = "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize",
                Tenant = "54174ba1-f659-408b-b1e6-f8789266f1d8",
                Client_id = "40d8d80c-b29c-4d5b-bc37-35cbf54c6d6c",
                ClientSecret = "n42i1k74Vm.A-IuXZrd-~3O6vu.55Vy.4A",
                Scope = "openid profile",
                ResponseMode = "form_post",
                ResponseType = "id_token",
                RedirectUrl = "https://localhost:44311/Token/Validar",
                DiscoveryEndPoint = "https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration",
                InstanciaAz = "https://login.microsoftonline.com/{tenant}/v2.0"

            };
         //   var conf = JsonConvert.DeserializeObject<AzureAuthConf>("");

            return conf;
        }


    }
}