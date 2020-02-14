using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using TSM.Models;

namespace TSM.Utils
{
    public class PbiUtils
    {
        public const string authResultString = "authResult";
        public static string EmbedType { get; set; }

        public static AuthenticationResult authResult { get; set; }

        public static ReportePbi PbiReport {get;set;} 

        public static string GetAuthorizationCode()
        {
            //NOTE: Values are hard-coded for sample purposes.
            //Create a query string
            //Create a sign-in NameValueCollection for query string
            var @params = new NameValueCollection
            {
                //Azure AD will return an authorization code. 
                {"response_type", "code"},

                //Client ID is used by the application to identify themselves to the users that they are requesting permissions from. 
                //You get the client id when you register your Azure app.
                {"client_id", "61d6a8f2-188c-4bf3-8988-01f4ce27fb37"},

                //Resource uri to the Power BI resource to be authorized
                //The resource uri is hard-coded for sample purposes
                {"resource", "https://analysis.windows.net/powerbi/api"},

                //After app authenticates, Azure AD will redirect back to the web app. In this sample, Azure AD redirects back
                //to Default page (Default.aspx).
                { "redirect_uri", "https://localhost:44311/PbiToken/Validar"},
            };

            //Create sign-in query string
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            queryString.Add(@params);

            //Redirect to Azure AD Authority
            //  Authority Uri is an Azure resource that takes a application id and application secret to get an Access token
            //  QueryString contains 
            //      response_type of "code"
            //      client_id that identifies your app in Azure AD
            //      resource which is the Power BI API resource to be authorized
            //      redirect_uri which is the uri that Azure AD will redirect back to after it authenticates

            return "https://login.windows.net/common/"+$"oauth2/authorize?{queryString}";
        }
    }

    //Power BI Dashboards used to deserialize the Get Dashboard response.

    public class PBIDashboards
    {
        public PBIDashboard[] value { get; set; }
    }

    public class PBIDashboard
    {
        public string id { get; set; }
        public string displayName { get; set; }
        public string embedUrl { get; set; }
        public bool isReadOnly { get; set; }
    }

    //Power BI Tiles used to deserialize the Get Tiles response.
    public class PBITiles
    {
        public PBITile[] value { get; set; }
    }

    public class PBITile
    {
        public string id { get; set; }
        public string title { get; set; }
        public string embedUrl { get; set; }
    }


}
