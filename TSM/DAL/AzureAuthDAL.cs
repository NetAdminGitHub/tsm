using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Runtime.Remoting.Channels;
using System.Threading.Tasks;
using TSM.FrwkSeguridadSrv;
using TSM.Models;

namespace TSM.DAL
{

    public interface IAzureAuthDal
    {
        AzureAuthConf GetAzureAuthConf();
    }

    public class AzureAuthDAL : IAzureAuthDal
    {

        public AzureAuthConf GetAzureAuthConf()
        {
            string data;
            string azjson;
            //obtiene dato de archivo cifrado de configuracion
            using (var stream = File.Open(HttpContext.Current.Server.MapPath("~\\jsonsettings.azconf"), FileMode.Open))
            {
                var reader = new StreamReader(stream);

                data = reader.ReadToEnd();

            }
           // descifra contenido con el método disponible y lo agrega a variable
            using (var c = new SeguridadClient()) { 
             azjson =  c.Desencriptar(data,Utils.Config.App);
            }

            // serializa para validar y generar GUID
            var conf = JsonConvert.DeserializeObject<AzureAuthConf>(azjson);
             
           
            var s = JsonConvert.SerializeObject(conf);

         

            return conf;
        }


    }
}