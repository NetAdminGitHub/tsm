using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TSM.DAL;
using TSM.Models;

using System.IdentityModel.Tokens.Jwt;

namespace TSM.BOL
{
    public class AzureAuthBOL :IDisposable
    {
        IAzureAuthDal _azureAuthDal;

        public AzureAuthBOL(IAzureAuthDal AuthDal)
        {
            _azureAuthDal = AuthDal;
        }

        public string GetAzAuthorizeRequest()
        {
                      
           return Utils.RestSharpHelper.AzGeneraGetRequest(_azureAuthDal.GetAzureAuthConf());
                
         }


        public async Task<JwtSecurityToken> ValidarToken(string id_token)
        {

           SecurityToken jwt;
            var confinicial = _azureAuthDal.GetAzureAuthConf(); // obtine objeto con la configuración.

          string EndPointReferencia = confinicial.DiscoveryEndPoint;

   

            ConfigurationManager<OpenIdConnectConfiguration> configurador = new ConfigurationManager<OpenIdConnectConfiguration>(EndPointReferencia, new OpenIdConnectConfigurationRetriever());

            OpenIdConnectConfiguration config =await Task.Run(()=> configurador.GetConfigurationAsync().Result);

            var parametrosValidacion = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = confinicial.InstanciaAz,
                ValidateAudience = true,
                IssuerSigningKeys = config.SigningKeys,
                IssuerSigningKey = new SymmetricSecurityKey( Encoding.UTF8.GetBytes(confinicial.ClientSecret)),
                ValidateLifetime = true,
                ValidAudience = confinicial.Client_id,
                                
            };


            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();

            var result = handler.ValidateToken(id_token, parametrosValidacion, out jwt);
            
            return jwt as JwtSecurityToken;
        }

     
        #region Dispose
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~AzureAuthBOL()
        {
            Dispose(false);
        }

        protected virtual void Dispose(bool disposing)
        {

        }
        #endregion


    }
}