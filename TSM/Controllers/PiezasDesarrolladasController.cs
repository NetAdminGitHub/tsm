using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class PiezasDesarrolladasController : Controller
    {
        // GET: PiezasDesarrolladas
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CriteriosCriticos()
        {

            return PartialView("_CriteriosCriticos");
        }
    }
}