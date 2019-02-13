using System.Web;
using System.Web.Optimization;

namespace TSM
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery/jquery-{version}.js",
                                                                "~/Scripts/jquery/jquery.sparkline.min.js",
                                                                "~/Scripts/jquery/jquery.scrollbar.min.js",
                                                                "~/Scripts/jquery/jquery-ui.min.js",
                                                                "~/Scripts/jquery/jquery-{version}.js", "~/Scripts/js.cookie.js"
                                                                ));
            
            bundles.Add(new ScriptBundle("~/bundles/jqueryAjax").Include("~/Scripts/jqueryAjax/jquery.unobtrusive-ajax.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap/bootstrap.bundle.js"));

            bundles.Add(new ScriptBundle("~/bundles/Kendo/js").Include("~/Scripts/kendo/kendo.all.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/Kendo/messages/js").Include("~/Scripts/kendo/messages/Kendo.messages.es-ES.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/Kendo/culture/js").Include("~/Scripts/kendo/cultures/kendo.culture.es-SV.min.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/Utils/js").Include("~/Scripts/Utils/GridPersonalizar.js",
                                                                       "~/Scripts/Utils/Generico.js",
                                                                       "~/Scripts/Utils/CmbPersonalizar.js",
                                                                       "~/Scripts/js/Layout.js",
                                                                       "~/Scripts/Utils/MltSelectPersonalizar.js",
                                                                       "~/Scripts/Utils/Menu.js",
                                                                        "~/Scripts/js/CambioEstado.js",
                                                                        "~/Scripts/Utils/TSM-LayoutSet.js"
                                                                        ));

            bundles.Add(new ScriptBundle("~/bundles/Login").Include("~/Scripts/js/Login.js"));

            bundles.Add(new ScriptBundle("~/bundles/pdfobject").Include("~/Scripts/pdfobject.min.js"));

            bundles.Add(new StyleBundle("~/Content/bootstrap/css").Include("~/Content/bootstrap/bootstrap.css",
                                                                           "~/Content/bootstrap/bootstrapMod.css"));

            bundles.Add(new StyleBundle("~/Content/Login").Include("~/Content/Login.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include( "~/Content/Font-HelveticaNeue.css",
                                                                 "~/Content/Font-TS-Icons.css",
                                                                 "~/Content/Font-TSM-General.css",
                                                                 "~/Content/TSM-Style.css"
                                                                 ));
            
            bundles.Add(new StyleBundle("~/Content/Kendo/css").Include("~/Content/kendo/kendo.bootstrap-v4.min.css",
                                                                        "~/Content/bootstrap/boostrapKendoMod.css"));

            //BundleTable.EnableOptimizations = true;
        }
    }
}