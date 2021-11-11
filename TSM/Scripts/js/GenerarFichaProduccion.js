let xIdCatDisgfp;

var fn_InicializarCargarFichaProd = function (gFpIdot) {
    TextBoxEnable($("#TxtGFP_CodigoFM"), false);
    TextBoxEnable($("#TxtGFP_OrdenTrabajo"), false);
    TextBoxEnable($("#TxtGFP_NombreDiseno"), false);
    TextBoxEnable($("#TxtGFP_Talla"), false);
    KdoMultiSelectDatos($("#CmbNoDocFichaProd"), "[]", "NoDocumento", "IdOrdenTrabajo", "Seleccione ...", 100, true);
    fn_GetOT(gFpIdot);
    KdoMultiSelectEnable($("#CmbNoDocFichaProd"), false);
};

var fn_CrearFichaProd = function (gFpIdot) {
    fn_GetOT(gFpIdot);
    $("#CmbNoDocFichaProd").data("kendoMultiSelect").value("");
    KdoMultiSelectEnable($("#CmbNoDocFichaProd"), false);

};

let fn_FichaProGenerar = function (gFpIdot, gFpIdSimulacion, gFpIdCotizacion) {
    fn_GenerarSolicitudProducciones(gFpIdot, gFpIdSimulacion, gFpIdCotizacion);
};

let fn_GetOT = function (idOT) {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "SolicitudProduccionesOrdenesTrabajos/" + idOT,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            let datos;
            let lista = "";
            if (respuesta !== null) {
                $("#TxtGFP_CodigoFM").val(respuesta.NoFM);
                $("#TxtGFP_OrdenTrabajo").val(respuesta.NoDocumento);
                $("#TxtGFP_NombreDiseno").val(respuesta.NombreDiseno);
                $("#TxtGFP_Talla").val(respuesta.TallaDesarrollar);
                xIdCatDisgfp = respuesta.IdCatalogoDiseno;
                datos = fn_NoDocumento_FichaProd(xIdCatDisgfp);
                $("#CmbNoDocFichaProd").data("kendoMultiSelect").setDataSource(datos);
                datos.read().then(function () {
                    //var view = datos.view();
                    //$.each(view, function (index, elemento) {
                    //    lista = lista + elemento.IdOrdenTrabajo + ",";
                    //});
                    $("#CmbNoDocFichaProd").data("kendoMultiSelect").value(idOT);
                });
            } else {
                $("#TxtGFP_CodigoFM").val("");
                $("#TxtGFP_OrdenTrabajo").val("");
                $("#TxtGFP_NombreDiseno").val("");
                $("#TxtGFP_Talla").val("");
                xIdCatDisgfp = 0;
                datos = fn_NoDocumento_FichaProd(xIdCatDisgfp);
                $("#CmbNoDocFichaProd").data("kendoMultiSelect").setDataSource(datos);
                $("#CmbNoDocFichaProd").data("kendoMultiSelect").value("");

            }
            kendo.ui.progress($(".k-dialog"), false);
        },
        error: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });
};

let fn_NoDocumento_FichaProd = function (idcd) {
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "NoDocumento", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "GET",
                    async: false,
                    url: TSM_Web_APi + "SolicitudProduccionesAprobacionesEstados/GetFichaProd/" + idcd,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};


let fn_GenerarSolicitudProducciones = function (gFpIdot, gFpIdSimulacion, gFpIdCotizacion) {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "SolicitudProducciones/Procesar",
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdOrdenTrabajo: gFpIdot,
            IdSimulacion: gFpIdSimulacion,
            IdCotizacion: gFpIdCotizacion,
            StrOrdenesProd: $("#CmbNoDocFichaProd").data("kendoMultiSelect").value().toString()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {

            kendo.ui.progress($(".k-dialog"), false);
            RequestEndMsg(data, "Post");

        },
        error: function (data) {
            kendo.ui.progress($(".k-dialog"), false);
            ErrorMsg(data);
        }
    });
};