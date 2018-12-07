using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
namespace TSM.Utils
{
    public static class Config
    {
        public static string TSM_WebApi
        {
            get
            {
                return ConfigurationManager.AppSettings["TSM-WebApi"];
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
    }
}