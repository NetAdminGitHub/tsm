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

                    string token = Controllers.TokenController.GenerarToken(JsonConvert.SerializeObject(trama));

                    //toquen renovado
                    if (token != "")
                    {
                        filterContext.RequestContext.HttpContext.Response.Cookies.Set(new HttpCookie("t", token));

                        if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName == "Login")
                            filterContext.RequestContext.HttpContext.Response.Redirect("/");
                    }
                    else if (Controllers.TokenController.ObtenerUsuarioLocal(filterContext.RequestContext.HttpContext.Request.UserHostAddress) != "")
                    {
                        GenerarNuevoToken(filterContext, Controllers.TokenController.ObtenerUsuarioLocal(filterContext.RequestContext.HttpContext.Request.UserHostAddress));
                    }
                    else if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName != "Login")
                    {
                        filterContext.RequestContext.HttpContext.Response.Redirect("/Login");
                    }
                }
                else
                {
                    if (usuario == "" && filterContext.ActionDescriptor.ControllerDescriptor.ControllerName != "Login")
                    {
                        filterContext.RequestContext.HttpContext.Response.Redirect("/Login");
                    }
                    else if (usuario != "")
                    {
                        GenerarNuevoToken(filterContext, usuario);
                    }
                }
            }

            base.OnActionExecuting(filterContext);
        }

        private bool CookieValida(ActionExecutingContext filterContext, string nombreCookie)
        {
            return !(filterContext.RequestContext.HttpContext.Request.Cookies[nombreCookie] == null || string.IsNullOrWhiteSpace(filterContext.RequestContext.HttpContext.Request.Cookies.Get(nombreCookie).Value));
        }

        private void GenerarNuevoToken(ActionExecutingContext filterContext, string usuario)
        {
            Dictionary<string, object> trama = new Dictionary<string, object> {
                            { "Usuario", usuario },
                            { "TipoSolicitud", "GENERARTOKEN" }
                        };

            string token = Controllers.TokenController.GenerarToken(JsonConvert.SerializeObject(trama));

            if (token != "")
            {
                filterContext.RequestContext.HttpContext.Response.Cookies.Set(new HttpCookie("t", token));

                if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName == "Login")
                    filterContext.RequestContext.HttpContext.Response.Redirect("/");
            }
        }
    }
}