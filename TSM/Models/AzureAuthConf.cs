using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Web;
using Newtonsoft.Json;

namespace TSM.Models
{
    public class AzureAuthConf
    {
        private string _authority;
        private string _discoveryEndpoint;
        private string _instanciaAz;

        public string Tenant { get; set; }

        public string Client_id { get; set; }

        public string Scope { get; set; }

        public string ClientSecret { get; set; }
        public string ResponseType { get; set; }

        public string ResponseMode { get; set; }

        public string Nonce { get { return Guid.NewGuid().ToString(); }  }

        public string State { get { return Guid.NewGuid().ToString(); } }

        /// <summary>
        /// incluir variable {tenant}
        /// </summary>
        public string Authority
        {
            get { return _authority.Replace("{tenant}", this.Tenant); }
            set { _authority = value; }
        }

        /// <summary>
        /// incluir variable {tenant} 
        /// </summary>
        public string DiscoveryEndPoint
        {
            get { return _discoveryEndpoint.Replace("{tenant}", this.Tenant); }
            set { _discoveryEndpoint = value; }
        }

        public string InstanciaAz
        {
            get { return _instanciaAz.Replace("{tenant}", this.Tenant); }
            set { _instanciaAz = value; }
        }


        private string _redirectUrl;

        public string RedirectUrl
        {
            get { return _redirectUrl.Replace("{appbaseurl}", Utils.ContextHelper.GetHttpContext()); }
            set { _redirectUrl = value; }
        }


    }
}