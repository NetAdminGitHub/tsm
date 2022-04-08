using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;
using System.IO;
using Newtonsoft.Json;

namespace TSM.Controllers
{
    public class ReportesController : Controller
    {
        // GET: Reportes
        [Route("Reportes/{controlador}/{accion}/{id}")]
        public ActionResult Visor(string controlador, string accion, long id)
        {
            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, controlador, accion, id));

            Session["data"] = data;
            Session["rpt"] = accion == "Cotizacion" ? "rptCotizacionPrograma2" : "rptCotizacionRentabilidad";

            return View();
        }

        // GET: Reportes
        [Route("Reportes/{rptName}/{controlador}/{accion}/{id}")]
        public JsonResult VisorCrpt(string rptName, string controlador, string accion, long id)
        {
            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, controlador, accion, id));

            string NombreDatos = Guid.NewGuid().ToString();

            Session[NombreDatos] = data;
            Session["rpt-"+ NombreDatos] = rptName;

            string baseUrl = Request.Url.GetLeftPart(UriPartial.Authority) + Url.Content("~/Visor/Reportes.aspx") + "?ds=" + NombreDatos;

            return Json(baseUrl, JsonRequestBehavior.AllowGet);
        }



        // GET: Reportes
        [Route("ReportesStr/{rptName}/{controlador}/{accion}/{id}")]
        public JsonResult VisorCrpt(string rptName, string controlador, string accion, string id)
        {
            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, controlador, accion, id));

            string NombreDatos = Guid.NewGuid().ToString();

            Session[NombreDatos] = data;
            Session["rpt-" + NombreDatos] = rptName;

            string baseUrl = Request.Url.GetLeftPart(UriPartial.Authority) + Url.Content("~/Visor/Reportes.aspx") + "?ds=" + NombreDatos;

            return Json(baseUrl, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Route("Reportes/ReportesCreate/")]
        public JsonResult CallReport()
        {
            Dictionary<string, object> ds = new Dictionary<string, object>();

            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();


            ds = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, ds["controlador"].ToString(), ds["accion"].ToString(), ds["id"].ToString()));

            string NombreDatos = Guid.NewGuid().ToString();
            
            Session[NombreDatos] = data;
            Session["Parametros_" + NombreDatos] = JsonConvert.SerializeObject(ds);
            Session["rpt-" + NombreDatos] = ds["rptName"].ToString();

            string baseUrl = Request.Url.GetLeftPart(UriPartial.Authority) + Url.Content("~/Visor/Reportes.aspx") + "?ds=" + NombreDatos;

            return Json(baseUrl, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Route("Reportes/ReporteFichaStrikeOff/")]
        public JsonResult ReporteFichaStrikeOff()
        {
            Dictionary<string, object> ds = new Dictionary<string, object>();

            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();


            ds = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            string data = Utils.Config.GetData(string.Format("{0}/{1}/{2}/{3}", Utils.Config.TSM_WebApi, ds["controlador"].ToString(), ds["accion"].ToString(), ds["id"].ToString()));

            string NombreDatos = Guid.NewGuid().ToString();

            Session[NombreDatos] = data;
            Session["Parametros_" + NombreDatos] = JsonConvert.SerializeObject(ds);
            Session["rpt-" + NombreDatos] = ds["rptName"].ToString();

            string baseUrl = Request.Url.GetLeftPart(UriPartial.Authority) + Url.Content("~/Visor/Reportes.aspx") + "?ds=" + NombreDatos;

            return Json(baseUrl, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [Route("Reportes/Vinetas/")]
        public JsonResult GenerarVineta()
        {
            Dictionary<string, object> ds = new Dictionary<string, object>();

            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();


            ds = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            string data = Utils.Config.PostData(string.Format("{0}/{1}/{2}/", Utils.Config.TSM_WebApi, ds["controlador"].ToString(), ds["accion"].ToString()),ds["Vineta"].ToString());

            string NombreDatos = Guid.NewGuid().ToString();

            Session[NombreDatos] = data;
            Session["Parametros_" + NombreDatos] = JsonConvert.SerializeObject(ds);
            Session["rpt-" + NombreDatos] = ds["rptName"].ToString();

            string baseUrl = Request.Url.GetLeftPart(UriPartial.Authority) + Url.Content("~/Visor/Reportes.aspx") + "?ds=" + NombreDatos;

            return Json(baseUrl, JsonRequestBehavior.AllowGet);
        }


    }
}