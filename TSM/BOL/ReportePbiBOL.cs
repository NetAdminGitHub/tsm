using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TSM.DAL;
using TSM.Models;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using TSM.Utils;
using System.Web.Mvc;


namespace TSM.BOL
{
    public class ReportePbiBOL : IDisposable
    {
        public IReportePbiDAL _iReportePbiDAL;

        public string errorLabel { get; private set; }

        public ReportePbiBOL(IReportePbiDAL ReportePbiDal)
        {
            _iReportePbiDAL = ReportePbiDal;

        }


        public ReportePbi ObtieneParametrosPbi(string urlBase,  PbiConfRequestModel data, string aplicacion = "/ParametrosReportesPbi/GetReporte/")
        {
            if (PbiUtils.PbiReport != null && data.CodReporte.Trim() == PbiUtils.PbiReport.CodReporte.Trim() && data.NombrePagina.Trim() == PbiUtils.PbiReport.NombrePagina.Trim())
            {
                return PbiUtils.PbiReport;
            }
            else
            {
                return _iReportePbiDAL.ObtenerParametrosPbi(urlBase, aplicacion, data);
            }
        }




        public Report GetReport(ReportePbi PbiResult,string AccessToken)
        {
            string WorkspaceId = "";//"eb3ce37f-f8ff-469f-82cf-c0deea99da0a";
            string reportId ="" ;// "b2a70493-b8fa-4fa0-87c6-19a26257f0a2";
            string powerBiApiUrl = "";//"https://api.powerbi.com/";
            Report report;
            try
            {
            
                using (var client = new PowerBIClient(new Uri(PbiResult.PbiApiUrl), new TokenCredentials(AccessToken, "Bearer")))
                {


                    // Settings' workspace ID is not empty
                    if (!string.IsNullOrEmpty(PbiResult.Entorno))
                    {
                        // Gets a report from the workspace.
                        report = GetReportFromWorkspace(client, PbiResult.Entorno, PbiResult.Reporte);
                    }
                    // Settings' report and workspace Ids are empty, retrieves the user's first report.
                    else if (string.IsNullOrEmpty(PbiResult.Reporte))
                    {
                        report = client.Reports.GetReports().Value.FirstOrDefault();
                        AppendErrorIfReportNull(report, "No se encontró el reporte. Favor verificar los datos de configuración.");
                    }
                    // Settings contains report ID. (no workspace ID)
                    else
                    {
                        report = client.Reports.GetReports().Value.FirstOrDefault(r => r.Id == PbiResult.Reporte);
                        AppendErrorIfReportNull(report, $"El reporte '{PbiResult.NombreReporte}' no se encontró. Favor verificar los datos del Workspace de Power Bi");
                    }

                    //if (report != null)
                    //{
                    //    txtEmbedUrl.Text = report.EmbedUrl;
                    //    txtReportId.Text = report.Id;
                    //    txtReportName.Text = report.Name;
                    //}
                }
            } // Fin try
            catch (Exception ex)
            {
                throw;
            }
            return report;
        }

        // Gets the report with the specified ID from the workspace. If report ID is emty it will retrieve the first report from the workspace.
        private Report GetReportFromWorkspace(PowerBIClient client, string WorkspaceId, string reportId)
        {
            // Gets the workspace by WorkspaceId.
            var workspaces = client.Groups.GetGroups();
            var sourceWorkspace = workspaces.Value.FirstOrDefault(g => g.Id == WorkspaceId);

            // No workspace with the workspace ID was found.
            if (sourceWorkspace == null)
            {
                errorLabel = $"Workspace with id: '{WorkspaceId}' not found. Please validate the provided workspace ID.";
                return null;
            }

            Report report = null;
            if (string.IsNullOrEmpty(reportId))
            {
                // Get the first report in the workspace.
                report = client.Reports.GetReportsInGroup(sourceWorkspace.Id).Value.FirstOrDefault();
                AppendErrorIfReportNull(report, "Workspace doesn't contain any reports.");
            }

            else
            {
                try
                {
                    // retrieve a report by the workspace ID and report ID.
                    report = client.Reports.GetReportInGroup(WorkspaceId, reportId);
                }

                catch (HttpOperationException)
                {
                    errorLabel = $"Report with ID: '{reportId}' not found in the workspace with ID: '{WorkspaceId}', Please check the report ID.";

                }
            }

            return report;
        }

        private void AppendErrorIfReportNull(Report report, string errorMessage)
        {
            if (report == null)
            {
                errorLabel = errorMessage;
            }
        }

        #region Dispose
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~ReportePbiBOL()
        {
            Dispose(false);
        }

        protected virtual void Dispose(bool disposing)
        {

        }
        #endregion

    }
}