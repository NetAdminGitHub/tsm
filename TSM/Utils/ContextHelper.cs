using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TSM.Utils
{
    public static class ContextHelper
    {
        public static string GetHttpContext()
        {
            HttpRequest rq = HttpContext.Current.Request;
            string url = rq.Url.GetLeftPart(UriPartial.Authority).ToString();
            
            return url;
        }

       


    }
}