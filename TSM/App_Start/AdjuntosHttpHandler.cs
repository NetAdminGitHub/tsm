using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace TSM.App_Start
{
    public class AdjuntosHttpHandler : IHttpHandler
    {
        public RequestContext RequestContext { get; set; }
        /*
                public AdjuntosHttpHandler(RequestContext reqcon) {
                    RequestContext = reqcon;
                }

                public AdjuntosHttpHandler()
                {

                }*/


        public bool IsReusable { get { return true; } }

        public void ProcessRequest(HttpContext context)
        {
      
            string Dominio = Utils.ContextHelper.GetHttpContext();
            string sinImagen = "/Images/NoDisponible.png";
            string tkn ="" ;
            // context.Response.Redirect("/Adjuntos/Index");
            //obtiene token de la solicitud
            if (System.Web.HttpContext.Current.Request.Cookies.AllKeys.Contains("t"))
                tkn = System.Web.HttpContext.Current.Request.Cookies["t"].Value;
            
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    String strRequestedFile = context.Server.MapPath(context.Request.FilePath);
                    if (context.Request.UrlReferrer != null || !String.IsNullOrEmpty(tkn) )
                    {
                        String strUrlRef = context.Request.Url.ToString();
                     if (strUrlRef.StartsWith(Dominio))
                        {
                            context = SendContentTypeAndFile(context, strRequestedFile);
                        }
                        else
                        {
                            context = SendContentTypeAndFile(context, sinImagen);
                        }
                    }
                    else
                    {
                        context.Response.Redirect("/Login");
                    }
                    break;
                case "POST":
                    context = SendContentTypeAndFile(context, sinImagen);
                    break;
            }
        }



        HttpContext SendContentTypeAndFile(HttpContext context, String strFile)
        {
            if (String.IsNullOrEmpty(strFile))
            {
                return null;
            }
            else
            {
                context.Response.ContentType = GetContentType(strFile);
                context.Response.TransmitFile(strFile);
                context.Response.End();
                return context;
            }
        }



        public string GetContentType(string filename)
        {
            // used to set the encoding for the reponse stream
            string res = null;

            FileInfo fileinfo = new System.IO.FileInfo(filename);

            if (fileinfo.Exists)
            {
                switch (fileinfo.Extension.Remove(0, 1).ToLower())
                {
                    case "png":
                        res = "image/png";
                        break;
                    case "jpeg":
                        res = "image/jpg";
                        break;
                    case "jpg":
                        res = "image/jpg";
                        break;
                    case "bmp":
                        res = "image/bmp";
                        break;
                    case "gif":
                        res = "image/gif";
                        break;

                }
                return res;
            }
            return null;
        }


    }
}