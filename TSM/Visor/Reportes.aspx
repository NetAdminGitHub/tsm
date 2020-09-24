﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Reportes.aspx.cs" Inherits="TSM.Visor.Reportes" %>

<%@ Register Assembly="CrystalDecisions.Web" Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Visor de Reportes</title>

    <script runat="server">
        private string Reporte;
        private string Datos;
        CrystalDecisions.CrystalReports.Engine.ReportDocument reporte;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["ds"] != null)
            {
                Datos = Request.QueryString["ds"].ToString();
            }

            if ((Session[Datos] != null && ViewState["ds"] == null))
            {
                ViewState["ds"] = Session[Datos];
                ViewState["rpt"] = Session["rpt-" + Datos];
                Session[Datos] = null;
                Session["rpt" + Datos] = null;
            }

            System.Data.DataTable ds = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Data.DataTable>(ViewState["ds"].ToString());

            reporte = new CrystalDecisions.CrystalReports.Engine.ReportDocument();
            reporte.Load("\\\\inqui2003.local\\ReportesTSM_IST\\" + ViewState["rpt"].ToString() + ".rpt");
            reporte.SetDataSource(ds);
            CrystalReportViewer1.ReportSource = reporte;
        }

        protected void Page_Unload(object sender, EventArgs e)
        {
            if (reporte != null)
            {
                reporte.Close();
                reporte.Dispose();
                reporte = null;
            }
            GC.Collect();
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <CR:CrystalReportViewer ID="CrystalReportViewer1" runat="server" Width="100%" Height="100%" BorderStyle="None"
             ToolPanelView="None" HasCrystalLogo="False" HasDrillUpButton="True" HasDrilldownTabs="False" ShowAllPageIds="true" PrintMode="ActiveX" />
        </div>
    </form>
</body>
</html>