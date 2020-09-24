using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Text;
using TSM.BOL;
using TSM.DAL;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;

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

                // si existe token de azure en variable de sesión y la cookie de validación no es válida.
                if (filterContext.HttpContext.Session["aztkn"] != null && !CookieValida(filterContext, "zvalidator"))
                {
                    using (var tknvalid = new AzureAuthBOL(new AzureAuthDAL()))
                    {
                        var azconf = tknvalid.GetCurrenConfig();
                        var tarea = Utils.AsyncUtil.RunSync(async () => await tknvalid.ValidarToken(filterContext.HttpContext.Session["aztkn"].ToString(), azconf));

                        var usuariojwt = tarea.Payload["preferred_username"].ToString().Split('@');
                        // validasi el usuario de token es diferente del usuario y reasigna la cookie de usuario
                        if (usuariojwt[0] != usuario) {
                            filterContext.RequestContext.HttpContext.Response.Cookies.Set(new HttpCookie("user", usuariojwt[0]));
                            usuario = usuariojwt[0];
                        }

                    }
                }
                else if (CookieValida(filterContext, "zvalidator"))
                {
                    //Crea cookie de validación
                    string zvalidstr = filterContext.RequestContext.HttpContext.Request.Cookies.Get("zvalidator").Value;
                    string decripted = "";
                    using (var c = new FrwkSeguridadSrv.SeguridadClient())
                    {
                        decripted = c.Desencriptar(zvalidstr, Utils.Config.App);
                        if (decripted.Split('&')[0] != usuario)
                        {
                            filterContext.RequestContext.HttpContext.Response.Cookies.Set(new HttpCookie("user", decripted.Split('&')[0]));
                            usuario = decripted.Split('&')[0];
                        }

                    }


                } else if (Utils.Config.AppMode == "EXT") {
                    usuario = "";
                    filterContext.RequestContext.HttpContext.Response.Cookies.Remove("user");
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