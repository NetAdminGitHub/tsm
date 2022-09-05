﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TSM.Controllers
{
    public class ConsultaCorteMacroController : Controller
    {
        // GET: ConsultaCorteMacro
        public ActionResult Index()
        {
            return View();
        }

        [Route("ConsultaCorteMacro/{IdCliente}/{IdMarca}/{IdPlanta}/{IdEtapa}/{IdCatalogo}/{IdServicio}/{FM?}")]
        public ActionResult Index(long IdCliente, long IdMarca, long IdPlanta, long IdEtapa, long IdCatalogo, long IdServicio, string FM = "")
        {
            ViewBag.IdCliente = IdCliente;
            ViewBag.IdMarca = IdMarca;
            ViewBag.IdPlanta = IdPlanta;
            ViewBag.IdEtapaProcesoMacro = IdEtapa;
            ViewBag.IdCatalogoDiseno = IdCatalogo;
            ViewBag.FM = FM;
            ViewBag.IdServicio = IdServicio;

            return View();
        }
    }
}