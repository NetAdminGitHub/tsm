<%@ Page Language="C#" AutoEventWireup="true" Inherits="System.Web.Mvc.ViewPage" %>

<%@ Register Assembly="CrystalDecisions.Web" Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<%@ Import Namespace="CrystalDecisions.CrystalReports.Engine" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="Newtonsoft.Json" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Visor de Reportes</title>

    <script runat="server">
        private string Reporte;
        private string Datos;
        ReportDocument reporte;

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

            DataTable ds = JsonConvert.DeserializeObject<DataTable>(ViewState["ds"].ToString());

            reporte = new ReportDocument();
            reporte.Load("\\\\inqui2003.local\\ReportesTSM_IST\\" + ViewState["rpt"].ToString() + ".rpt");
            reporte.SetDataSource(ds);
            string Titulo = AddSpacesToSentence(ViewState["rpt"].ToString().Replace("crpt", ""));
            reporte.SummaryInfo.ReportTitle = Titulo;
            this.Title = Titulo;
            CrystalReportViewer1.ReportSource = reporte;
        }

        private string AddSpacesToSentence(string text, bool preserveAcronyms = true)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;
            StringBuilder newText = new StringBuilder(text.Length * 2);
            newText.Append(text[0]);
            for (int i = 1; i < text.Length; i++)
            {
                if (char.IsUpper(text[i]))
                    if ((text[i - 1] != ' ' && !char.IsUpper(text[i - 1])) ||
                        (preserveAcronyms && char.IsUpper(text[i - 1]) &&
                         i < text.Length - 1 && !char.IsUpper(text[i + 1])))
                        newText.Append(' ');
                newText.Append(text[i]);
            }
            return newText.ToString();
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
