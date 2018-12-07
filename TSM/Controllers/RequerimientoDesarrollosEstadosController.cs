using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class RequerimientoDesarrollosEstadosController : Controller
    {
        // GET: RequerimientoDesarrollosEstados
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Consulta()
        {
            return PartialView("_RequerimientoDesarrollosEstados");

        }
    }
}