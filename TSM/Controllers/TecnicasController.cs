using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    //[Authorize]
    public class TecnicasController : Controller
    {
        // GET: Tecnicas
        public ActionResult Index()
        {
            return View();
        }
    }
}