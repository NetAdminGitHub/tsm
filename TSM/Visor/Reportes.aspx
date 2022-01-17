<%@ Page Language="C#" AutoEventWireup="true" Inherits="System.Web.Mvc.ViewPage" %>

<%@ Register Assembly="CrystalDecisions.Web" Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<%@ Import Namespace="CrystalDecisions.CrystalReports.Engine" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="TSM.Utils" %>
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
                ViewState["params"] = Session["Parametros_" + Datos];
                Session[Datos] = null;
                Session["rpt" + Datos] = null;
                Session["Parametros_" + Datos] = null;
            }

            DataSet ds;

            try
            {
                // Si solo trae un dataTable y falla para al catch
                ds = new DataSet("reportData");
                ds.Tables.Add(JsonConvert.DeserializeObject<DataTable>(ViewState["ds"].ToString()));

            }
            catch
            {
                ds = JsonConvert.DeserializeObject<DataSet>(ViewState["ds"].ToString());
                // si reporte Ficha Producción
                if(ViewState["rpt"].ToString() == "crptFichaProduccion")
                {

                    Dictionary<string,object> param = JsonConvert.DeserializeObject<Dictionary<string,object>>(ViewState["params"].ToString());
                    DataColumn cat = new DataColumn("ImgCatalogo", typeof(byte[]));
                    cat.DefaultValue = Convert.FromBase64String(param["imgCat"].ToString());
                    DataColumn pla = new DataColumn("Imgplacement", typeof(byte[]));
                    pla.DefaultValue = Convert.FromBase64String(param["imgPla"].ToString());
                    ds.Tables[0].Columns.Add(cat);
                    ds.Tables[0].Columns.Add(pla);

                }

            }


            reporte = new ReportDocument();
            reporte.Load(Config.DirectorioReportes + ViewState["rpt"].ToString() + ".rpt");
            reporte.SetDataSource(ds.Tables[0]);

            if (ds.Tables.Count > 1)
            {

                int subreportes = 0;

                foreach (var srpt in reporte.Subreports)
                {

                    reporte.Subreports[subreportes].SetDataSource(ds.Tables[subreportes+1]);

                    subreportes++;
                }


            }
            string Titulo = AddSpacesToSentence(ViewState["rpt"].ToString().Replace("crpt", ""));
            reporte.SummaryInfo.ReportTitle = Titulo;
            this.Title = Titulo;
            string fecha = string.Format("{0:yyyyMMdd_HHmm}", DateTime.Now);



            //exporta pdf a carpeta de descargas 
            reporte.ExportToHttpResponse(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat,Response,true,Titulo+"_"+fecha);
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
