using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    //[Authorize]
    public class CategoriaPrendasController : Controller
    {
        // GET: CategoriaPrendas
        public ActionResult Index()
        {
            return View();
        }
    }
}