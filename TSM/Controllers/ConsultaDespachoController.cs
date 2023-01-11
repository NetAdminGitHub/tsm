﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ConsultaDespachoController : Controller
    {
        // GET: ConsultaDespacho
        public ActionResult Index()
        {
            return View();
        }

        [Route("ConsultaDespacho/{IdCliente}")]
        public ActionResult Index(long IdCliente)
        {
            ViewBag.IdCliente = IdCliente;

            return View();
        }
    }
}