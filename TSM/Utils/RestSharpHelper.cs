using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Antlr.Runtime;
using RestSharp;
using TSM.Controllers;
using TSM.Models;

namespace TSM.Utils
{
    public class RestSharpHelper
    {


        public static IRestResponse GeneraPostRequest(string UrlBase, string Aplicacion, object Data)
        {
            string token = "";
            if (System.Web.HttpContext.Current.Request.Cookies["t"] != null && !string.IsNullOrWhiteSpace(System.Web.HttpContext.Current.Request.Cookies.Get("t").Value))
                token = System.Web.HttpContext.Current.Request.Cookies.Get("t").Value;


            IRestResponse response = null;
            var client = new RestClient(UrlBase);
            var request = new RestRequest(Aplicacion,Method.POST);
            request.RequestFormat = DataFormat.Json; //document type
            request.AddHeader("t", token);
            request.AddHeader("UserAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36");
            
            try
            {
                request.AddJsonBody(Data);
                response = client.Execute(request);
            }
            catch (Exception ex)
            {

                throw;
            }
            return response;
        }

        //get request para autenticación
        public static string AzGeneraGetRequest( AzureAuthConf azconf)
        {
                              
          
            var client = new RestClient(azconf.Authority);
            var request = new RestRequest( Method.GET);
            request.AddHeader("content-type", "application/x-www-form-urlencoded");
            request.AddParameter("client_id",azconf.Client_id,ParameterType.GetOrPost);
            request.AddParameter("response_type",azconf.ResponseType, ParameterType.GetOrPost);
            request.AddParameter("redirect_uri", azconf.RedirectUrl, ParameterType.GetOrPost);
            request.AddParameter("response_mode",azconf.ResponseMode,ParameterType.GetOrPost);
            request.AddParameter("scope", azconf.Scope, ParameterType.GetOrPost);
            request.AddParameter("state", azconf.State, ParameterType.GetOrPost);
            request.AddParameter("nonce", azconf.Nonce, ParameterType.GetOrPost);

            return client.BuildUri(request).ToString();
            
        }





    }
}