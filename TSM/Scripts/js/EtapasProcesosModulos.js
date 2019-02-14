
var fn_MostrarEtapasProceso = function (DivIdElement,IdModulo, forma) {

    var UrlEP = TSM_Web_APi + "EtapasProcesos";
    $.ajax({
        url: UrlEP + "/GetByModulo/" + IdModulo,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null && respuesta.length !== 0) {
                CrearEtapasProcesosModulo(DivIdElement, respuesta, forma);
            }
            RequestEndMsg(respuesta, "Get");
        }
    });  
}

var CrearEtapasProcesosModulo = function (DivIdElement, etapas, forma) {

    DivIdElement.children().remove();
    DivIdElement.append("<ul id=\"EtapaOpc\"></ul>");
    DivIdElement.append("<div id=\"EtapSeccion\"></div>");

    let EtapaOpc = $("#EtapaOpc");
    let EtapSeccion = $("#EtapSeccion");

    EtapaOpc.children().remove();
    EtapSeccion.children().remove();

    $.each(etapas, function (index, elemento) {
        var SetEtapa = "Etp" + elemento.IdModulo + elemento.IdEtapaProceso;
        EtapaOpc.append(
            "<li>" +
            "<a href=\"" + SetEtapa + "\">" +
            "<span class=\"k-icon " + elemento.Icono + " ficonEtp\"></span><br>" +
            "<small>" + elemento.Nombre + "</small>" +
            "</a>" +
            "</li>"
        );
        EtapSeccion.append("<div id=\"" + SetEtapa + "\"><\div>");
    });

    // Smart Wizard
    DivIdElement.smartWizard({
        selected: 0,
        theme: givenOrDefault(forma, "arrows"),
        transitionEffect: 'fade',
        toolbarSettings: {
            toolbarPosition: 'bottom'
        },
        lang: {
            next: '',
            previous: ''
        },
        anchorSettings: {
            markDoneStep: true,
            markAllPreviousStepsAsDone: true,
            removeDoneStepOnNavigateBack: true,
            enableAnchorOnDoneStep: true
        }
    });

    // modificar pluging de acuerdo standar TSM 
    KdoButton($("#swbtnnext"), "arrow-double-60-right", "Etapa siguiente");
    KdoButton($("#swbtnprev"), "arrow-double-60-left", "Etapa Previa");
    $("#swbtnnext").removeClass("btn btn-secondary");
    $("#swbtnprev").removeClass("btn btn-secondary");
}