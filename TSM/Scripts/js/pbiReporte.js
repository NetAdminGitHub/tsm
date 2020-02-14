

let accessToken;
let embedUrl;
let reportId;
let models;
let UrlPbiConf = TSM_Web_APi + "ParametrosReportesPbi/GetReporte/";
let navbarEnabled = '<%=TSM.Utils.PbiUtils.PbiReport.HabilitaBarraNav%>';



//Configure IFrame for the Report after you have an Access Token. See Default.aspx.cs to learn how to get an Access Token
window.onload=function () {
    embedUrl = EmbedUrl;//document.getElementById('EmbedUrl').value;
    reportId = Client; 
    accessToken = Token;
    // Get models. models contains enums that can be used.
    models = window['powerbi-client'].models;
    if (!accessToken || accessToken == "") {
        return;
    }


    // Embed configuration used to describe the what and how to embed.
    // This object is used when calling powerbi.embed.
    // This also includes settings and options such as filters.
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
    var config = {
        type: 'report',
        accessToken: accessToken,
        embedUrl: embedUrl,
        id: reportId,
        pageName: PageN, //nombre de reporte sacado de la url
        settings: {
            filterPaneEnabled: true,
            navContentPaneEnabled: false,
            localeSettings: {
                language: "es",
                formatLocale: "es"
            },
            layoutType: models.LayoutType.Custom,
            customLayout: {
                displayOption: models.DisplayOption.FitToPage
            }



        }
    };


    let ObtenerParametros = function () {
       
        $.ajax({
            url: UrlPbiConf,
            type: "Post",
            dataType: "json",
            data: JSON.stringify({
                
                    CodEntorno: WSpace,
                    CodReporte: ReportN,
                    NombrePagina: PageN
                
                }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
              var t =   data.PbiDataUrl;
              //  RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($(document.body), false);
                ErrorMsg(data);
            }
        });
    };


    $(document).ready(function () {
        setHeight();
     

    });



    function setHeight() {
        windowHeight = $(window).innerHeight();
        console.log('window height ' + windowHeight);
        windowHeight = windowHeight - 150;
        console.log('NEW window height ' + windowHeight);
        $('#reportWrapper').css('height', windowHeight);
    };
    $(window).resize(function () {
        setHeight();
    });

    // Grab the reference to the div HTML element that will host the report.
    var reportContainer = document.getElementById('reportContainer');

    // Embed the report and display it within the div container.
    var report = powerbi.embed(reportContainer, config);

    // Report.on will add an event handler which prints to Log window.
    report.on("loaded", function () {
        var logView = document.getElementById('logView');
        logView.innerHTML = logView.innerHTML + "Loaded<br/>";

        // Report.off removes a given event handler if it exists.
        report.off("loaded");
    });

    // Report.on will add an event handler which prints to Log window.
    report.on("rendered", function () {
        var logView = document.getElementById('logView');
        logView.innerHTML = logView.innerHTML + "Rendered<br/>";

        // Report.off removes a given event handler if it exists.
        report.off("rendered");
    });


    document.getElementById("FullSize").onclick = _Report_FullScreen;

    function _Report_FullScreen() {
        // Get a reference to the embedded report HTML element
        var embedContainer = $('#reportContainer')[0];

        // Get a reference to the embedded report.
        report = powerbi.get(embedContainer);

        // Displays the report in full screen mode.
        report.fullscreen();
    }

    function _Report_ExitFullScreen() {
        // Get a reference to the embedded report HTML element
        var embedContainer = $('#embedContainer')[0];

        // Get a reference to the embedded report.
        report = powerbi.get(embedContainer);

        // Exits full screen mode.
        report.exitFullscreen();
    }

    // ---- PaginatedReport Operations ----------------------------------------------------

    function _PaginatedReport_GetId() {
        // Get a reference to the embedded report HTML element
        var paginatedReportContainer = $('#paginatedReportContainer')[0];

        // Get a reference to the embedded report.
        paginatedReport = powerbi.get(paginatedReportContainer);

        // Retrieve the report id.
        var reportId = paginatedReport.getId();

        Log.logText(reportId);
    }

    function _PaginatedReport_FullScreen() {
        // Get a reference to the paginated embedded report HTML element
        var paginatedReportContainer = $('#paginatedReportContainer')[0];

        // Get a reference to the paginated embedded report.
        paginatedReport = powerbi.get(paginatedReportContainer);

        // Displays the paginated report in full screen mode.
        paginatedReport.fullscreen();
    }

    function _PaginatedReport_ExitFullScreen() {
        // Get a reference to the paginated embedded report HTML element
        var paginatedReportContainer = $('#paginatedReportContainer')[0];

        // Get a reference to the paginated embedded report.
        paginatedReport = powerbi.get(paginatedReportContainer);

        // Exits full screen mode.
        paginatedReport.exitFullscreen();
    }
};

