using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TSM.Models;
using Newtonsoft.Json;

namespace TSM.DAL
{
   public  interface IReportePbiDAL
    {
         ReportePbi ObtenerParametrosPbi(string urlBase, string aplicacion, PbiConfRequestModel data);

    }

    public class ReportePbiDAL : IReportePbiDAL
    {

        public ReportePbi ObtenerParametrosPbi(string urlBase,string aplicacion, PbiConfRequestModel data )
        {
            ReportePbi rpbi = null;
            IRestResponse response =  Utils.RestSharpHelper.GeneraPostRequest(urlBase,aplicacion,data);

            rpbi = JsonConvert.DeserializeObject< ReportePbi>(response.Content);

            return rpbi;
        }

    }


}
