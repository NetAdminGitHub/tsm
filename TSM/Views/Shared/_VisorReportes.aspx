<%@ Page Language="C#" AutoEventWireup="true" Inherits="System.Web.Mvc.ViewPage" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Visor de Reportes</title>

    <script runat="server">
        void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["data"] != null)
                {
                    string data = Session["data"].ToString();

                    System.Data.DataSet ds1 = new System.Data.DataSet("ds");
                    ds1.Tables.Add(Newtonsoft.Json.JsonConvert.DeserializeObject<System.Data.DataTable>(data));

                    ReportDataSource ds = new ReportDataSource("ds", ds1.Tables[0]);

                    ReportViewer1.LocalReport.ReportPath = "\\\\inqui2003.local\\ReportesTSM_IST\\" + Session["rpt"].ToString() + ".rdlc";
                    ReportViewer1.LocalReport.DataSources.Add(ds);
                    ReportViewer1.LocalReport.DisplayName = Session["rpt"].ToString().Replace("rpt", "");
                    ReportViewer1.LocalReport.Refresh();

                    Session["data"] = null;
                }
            }
        }

        protected void ReportViewer1_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                ReportViewer1.InteractivityPostBackMode = InteractivityPostBackMode.AlwaysSynchronous;
                ReportViewer1.PageCountMode = PageCountMode.Actual;
            }
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
        <rsweb:ReportViewer ID="ReportViewer1" runat="server"
            AsyncRendering="false" Width="100%" Height="100%"
            ZoomMode="FullPage" SizeToReportContent="True" ShowFindControls="false" ShowPrintButton="true" ShowZoomControl="true"
            OnLoad="ReportViewer1_Load">
        </rsweb:ReportViewer>
    </form>
</body>
</html>