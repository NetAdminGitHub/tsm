using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Net.Http;

namespace TSM.Utils
{
    public static class Config
    {

        private const string TsmWebApi = "TSM_WEB_API";

        /// <summary>
        /// Este metodo intenta obtener el valor de una variable de entorno, si no lo encuentra retornara el valor del segundo argumento <paramref name="valorPorDefecto"/>
        /// </summary>
        /// <param name="variableEntorno"></param>
        /// <param name="valorPorDefecto"></param>
        /// <returns></returns>
        private static string GetEnvironmentVariableOrDefault(string variableEntorno, string valorPorDefecto)
        {
            return Environment.GetEnvironmentVariable(variableEntorno) ?? valorPorDefecto;
        }

        public static string TSM_WebApi
        {
            get
            {
                return GetEnvironmentVariableOrDefault(TsmWebApi, ConfigurationManager.AppSettings["TSM-WebApi"]);
            }
        }

        public static string App
        {
            get
            {
                return ConfigurationManager.AppSettings["App"];
            }
        }

        public static string ColorApp
        {
            get
            {
                return ConfigurationManager.AppSettings["ColorApp"];
            }
        }

        public static string GetData(string url)
        {
            using (var httpClient = new HttpClient())
            {
                string token = "";
                if (System.Web.HttpContext.Current.Request.Cookies["t"] != null && !string.IsNullOrWhiteSpace(System.Web.HttpContext.Current.Request.Cookies.Get("t").Value))
                    token = System.Web.HttpContext.Current.Request.Cookies.Get("t").Value;

                httpClient.DefaultRequestHeaders.Add("UserAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36");
                httpClient.DefaultRequestHeaders.Add("t", token);

                var response = httpClient.GetStringAsync(new Uri(url)).Result;

                return response;
            }
        }
    }
}