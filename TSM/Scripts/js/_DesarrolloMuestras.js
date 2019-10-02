var Permisos;
let vIdIdDisenoMuestra;

var fn_DMCargarConfiguracion = function () {
    KdoButton($("#btnBTDis"), "delete", "Limpiar");
    KdoButtonEnable($("#btnBTDis"), false);
    // colocar grid para arrastre

    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaDis"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaDis"), false);

    KdoCmbSetValue($("#CmbMaquinaDis"), maq[0].IdMaquina);

    let vContenedor = $("#container");
    $(vContenedor).kendoDropTarget({
        drop: function (e) { dropElemento(e); },
        group: "gridGroup"
    });
    //*****************************
    let UrlUMDM = TSM_Web_APi + "UnidadesMedidas";
    Kendo_CmbFiltrarGrid($("#CmbIdUnidad"), UrlUMDM, "Abreviatura", "IdUnidad", "Seleccione...");
    let UrlDM_OP = TSM_Web_APi + "OrientacionPositivos";
    Kendo_CmbFiltrarGrid($("#CmbIdOrientacionPositivo"), UrlDM_OP, "Nombre", "IdOrientacionPositivo", "Seleccione...");
    let UrlDM_TS = TSM_Web_APi + "TiposSeparaciones";
    Kendo_CmbFiltrarGrid($("#CmbIdTipoSeparacion"), UrlDM_TS, "Nombre", "IdTipoSeparacion", "Seleccione...");
    KdoButton($("#btnGuardarDiseñoMues"), "save", "Guardar");

    $("#btnBTDis").data("kendoButton").bind('click', function () {
        ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });
    });

    fn_RTCargarMaquina();
};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    KdoButtonEnable($("#btnBTDis"), vhb);
};

fun_List.push(fn_DMCargarConfiguracion);
fun_ListDatos.push(fn_DMCargarEtapa);

//let fn_GetDisenoMuestra = function () {
//    kendo.ui.progress($("#vistaParcial"), true);
//    $.ajax({
//        url: TSM_Web_APi + "DisenoMuestras/" + $("#txtId").val(),
//        dataType: "json",
//        type: 'GET',
//        async: false,
//        success: function (respuesta) {
//            if (respuesta !== null) {
//                vIdIdDisenoMuestra = respuesta.IdDisenoMuestra;
//                kendo.ui.progress($("#vistaParcial"), true);
//                kdoNumericSetValue($("#NumResolucionDPI"), respuesta.ResolucionDPI);
//                kdoNumericSetValue($("#NumLineajeLPI"), respuesta.LineajeLPI);
//                kdoNumericSetValue($("#NumAltoDiseno"), respuesta.Alto);
//                kdoNumericSetValue($("#NumAnchoDiseno"), respuesta.Ancho);
//                KdoCmbSetValue($("#CmbIdUnidad"), respuesta.IdUnidad);
//                KdoCmbSetValue($("#CmbIdOrientacionPositivo"), respuesta.IdOrientacionPositivo);
//                KdoCmbSetValue($("#CmbIdTipoSeparacion"), respuesta.IdTipoSeparacion);
//                $("#DtFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
//                $("#TxtObservaciones").val(respuesta.Observaciones);
//                $("#TxtDirectorio").val(respuesta.RutaArchivos);
//            }
//        },
//        error: function () {
//            kendo.ui.progress($("#vistaParcial"), false);
//        }
//    });
//};
//let fn_GuardarDM = function () {
//    kendo.ui.progress($("#vistaParcial"), true);
//    $.ajax({
//        url: TSM_Web_APi + "DisenoMuestras/" + vIdIdDisenoMuestra,
//        dataType: "json",
//        type: "Put",
//        contentType: 'application/json; charset=utf-8',
//        data: JSON.stringify({
//            IdDisenoMuestra: vIdIdDisenoMuestra,
//            IdRequerimiento: $("#txtIdRequerimiento").val(),
//            Fecha: kendo.toString(kendo.parseDate($("#DtFecha").val()), 's'),
//            Alto: kdoNumericGetValue($("#NumAltoDiseno")),
//            Ancho: kdoNumericGetValue($("#NumAnchoDiseno")),
//            IdUnidad: KdoCmbGetValue($("#CmbIdUnidad")),
//            ResolucionDPI: kdoNumericGetValue($("#NumResolucionDPI")),
//            LineajeLPI: kdoNumericGetValue($("#NumLineajeLPI")),
//            RutaArchivos: $("#TxtDirectorio").val(),
//            IdOrientacionPositivo: KdoCmbGetValue($("#CmbIdOrientacionPositivo")),
//            IdTipoSeparacion: KdoCmbGetValue($("#CmbIdTipoSeparacion")),
//            Observaciones: $("#TxtObservaciones").val()
//        }),
//        success: function (data) {
//            RequestEndMsg(data, "Put");
//            kendo.ui.progress($("#vistaParcial"), false);
//        },
//        error: function (data) {
//            kendo.ui.progress($("#vistaParcial"), false);
//            ErrorMsg(data);
//            KdoCmbFocus($("CmbIdOrientacionPositivo"));
//        }

//    });
//};
fPermisos = function (datos) {
    Permisos = datos;
};