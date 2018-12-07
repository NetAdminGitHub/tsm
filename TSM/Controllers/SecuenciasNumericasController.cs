using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{ 

    //[Authorize]
    public class SecuenciasNumericasController : Controller
    {
        // GET: SecuenciasNumericas
        public ActionResult Index()
        {
            return View();
        }
    }
}