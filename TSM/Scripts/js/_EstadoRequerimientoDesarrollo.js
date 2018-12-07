var CargarEtapasProceso = function (idReq) {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: UrlEP + "/GetByRequerimientosPreCosteo/" + idReq,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                DibujarEtapasProcesos(respuesta)
            }
            kendo.ui.progress($("#body"), false);
            RequestEndMsg(respuesta, "Get");
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(respuesta);
        }
    });    
}

var DibujarEtapasProcesos = function (estados) {
    let divEstados = $("#divEstados");

    divEstados.children().remove();
    $.each(estados, function (index, elemento) {
        if (index > 0)
            divEstados.append(" <span class=\"bar" + (elemento.Terminado == true ? " done" : (elemento.Activo == true ? " active" : (elemento.Bloqueado == true ? " blocked" : ""))) + "\"></span>");

        divEstados.append(" <div class=\"circle" + (elemento.Terminado == true ? " done" : (elemento.Activo == true ? " active" : (elemento.Bloqueado == true ? " blocked" : ""))) + "\">" +
            "<span class=\"label\"><span class=\"k-icon " + elemento.Icono + "\"></span></span>" +
            "</div>");
    });

    let divEstadosTitulos = $("#divEstadosTitulos");

    divEstadosTitulos.children().remove();
    $.each(estados, function (index, elemento) {
        divEstadosTitulos.append(" <div class=\"tituloStep\">" +
            "<span>" + elemento.Nombre + "</span>" +
            "</div>");
    });
}