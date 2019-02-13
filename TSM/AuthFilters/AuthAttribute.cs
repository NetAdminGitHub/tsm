using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace TSM.AuthFilters
{
    public class AuthAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName != "Token")
            {
                string usuario;

                if (CookieValida(filterContext, "user"))
                    usuario = filterContext.RequestContext.HttpContext.Request.Cookies.Get("user").Value;
                else
                {
                    usuario = Controllers.TokenController.ObtenerUsuarioLocal(filterContext.RequestContext.HttpContext.Request.UserHostAddress);
                    filterContext.RequestContext.HttpContext.Response.Cookies.Set(new HttpCookie("user", usuario));
                }
                
                if (CookieValida(filterContext, "t"))
                {
                    Dictionary<string, object> trama = new Dictionary<string, object>{
                        { "Usuario", usuario },
                        { "t", filterContext.RequestContext.HttpContext.Request.Cookies.Get("t").Value },
                        { "TipoSolicitud", "RENOVARTOKEN" }
                    };

                    filterContext.RequestContext.HttpContext.Response.Cookies.Set(new HttpCookie("t", Controllers.TokenController.GenerarToken(JsonConvert.SerializeObject(trama))));

                    if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName == "Login")
                        filterContext.RequestContext.HttpContext.Response.Redirect("/");
                }
                else
                {
                    if (usuario == "" && filterContext.ActionDescriptor.ControllerDescriptor.ControllerName != "Login")
                    {
                        filterContext.RequestContext.HttpContext.Response.Redirect("/Login");
                    }
                    else if (usuario != "")
                    {
                        Dictionary<string, object> trama = new Dictionary<string, object> {
                            { "Usuario", usuario },
                            { "TipoSolicitud", "GENERARTOKEN" }
                        };

                        filterContext.RequestContext.HttpContext.Response.Cookies.Set(new HttpCookie("t", Controllers.TokenController.GenerarToken(JsonConvert.SerializeObject(trama))));

                        if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName == "Login")
                            filterContext.RequestContext.HttpContext.Response.Redirect("/");
                    }
                }
            }

            base.OnActionExecuting(filterContext);
        }

        private bool CookieValida(ActionExecutingContext filterContext, string nombreCookie)
        {
            return !(filterContext.RequestContext.HttpContext.Request.Cookies[nombreCookie] == null || string.IsNullOrWhiteSpace(filterContext.RequestContext.HttpContext.Request.Cookies.Get(nombreCookie).Value));
        }
    }
}