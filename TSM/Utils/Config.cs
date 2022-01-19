using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Net.Http;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;

namespace TSM.Utils
{
    public static class Config
    {

        public static string AppMode
        {
            get
            {
                return ConfigurationManager.AppSettings["AppMode"];
            }
        }

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

        public static string DirectorioReportes
        {
            get
            {
                return ConfigurationManager.AppSettings["DirectorioReportes"];
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

        /// <summary>
        /// método para cambiar tamano. Si no recibe nuevo ancho o alto , divide tamano actual por la mitad.
        /// </summary>
        /// <param name="imagen"></param>
        /// <param name="tamanoActual">tamano actual objeto de tipo Size</param>
        /// <param name="newWidth">nuevo ancho</param>
        /// <param name="newHeight">nuevo alto</param>
        /// <returns></returns>
        public static Image ResizeImage(Image imagen, Size tamanoActual, int newWidth = 0, int newHeight = 0  ) {

            Size nuevoTamano = (newWidth != 0 && newHeight != 0) ? new Size(newWidth, newHeight) : new Size(tamanoActual.Width / 2, tamanoActual.Height / 2);
            return (Image)(new Bitmap(imagen, nuevoTamano));                    
        }

        public static string GetBase64Image(string path)
        { 
            string imgstr;
            string realPath = HttpContext.Current.Server.MapPath(path);
            try
            {
                using (Image img = Image.FromFile(realPath))
                {                                                 
                    using (MemoryStream m = new MemoryStream())
                    {

                        ResizeImage(img, img.Size).Save(m, img.RawFormat);
                        byte[] bimg = m.ToArray();
                        imgstr = Convert.ToBase64String(bimg);
                     }
                }
            }
            catch (Exception ex)
            {
                imgstr = "MA=="; //0 en base 64 para manejo de error 
            }

          return imgstr;
        }

        public static byte[] GetBytesFromB64(string raw)
        {
            return Convert.FromBase64String(raw);
        }




    }
}