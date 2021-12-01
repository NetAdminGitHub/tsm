let xIdCatDisgfp;

var fn_InicializarCargarFichaProd = function (gFpIdot, listaTallasNoOT) {
    TextBoxEnable($("#TxtGFP_CodigoFM"), false);
    TextBoxEnable($("#TxtGFP_OrdenTrabajo"), false);
    TextBoxEnable($("#TxtGFP_NombreDiseno"), false);
    TextBoxEnable($("#TxtGFP_Talla"), false);
    TextBoxEnable($("#TxtTallasSelecionadas"), false);
    $("#TxtTallasSelecionadas").val(listaTallasNoOT);
    fn_GetOT(gFpIdot);
};

var fn_CrearFichaProd = function (gFpIdot, listaTallasNoOT) {
    $("#TxtTallasSelecionadas").val(listaTallasNoOT);
    fn_GetOT(gFpIdot);
};

let fn_FichaProGenerar = function (gFpIdot, gFpIdSimulacion, gFpIdCotizacion, listDimensionesOT) {
    fn_GenerarSolicitudProducciones(gFpIdot, gFpIdSimulacion, gFpIdCotizacion, listDimensionesOT);
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
                
            } else {
                $("#TxtGFP_CodigoFM").val("");
                $("#TxtGFP_OrdenTrabajo").val("");
                $("#TxtGFP_NombreDiseno").val("");
                $("#TxtGFP_Talla").val("");
                

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


let fn_GenerarSolicitudProducciones = function (gFpIdot, gFpIdSimulacion, gFpIdCotizacion, listDimensionesOT) {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "SolicitudProducciones/Procesar",
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdOrdenTrabajo: gFpIdot,
            IdSimulacion: gFpIdSimulacion,
            IdCotizacion: gFpIdCotizacion,
            StrOrdenesProd: null,
            StrDimensiones: listDimensionesOT
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