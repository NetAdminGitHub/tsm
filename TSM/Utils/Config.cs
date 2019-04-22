﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Net.Http;

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

        public static string GetData(string url)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("UserAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36");

                var response = httpClient.GetStringAsync(new Uri(url)).Result;

                return response;
            }
        }
    }
}