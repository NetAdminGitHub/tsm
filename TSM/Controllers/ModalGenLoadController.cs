using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ModalGenLoadController : Controller
    {
        // GET: ModalGenLoad
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Load(string vistaParcial)
        {
            return PartialView(vistaParcial);
        }
    }
}