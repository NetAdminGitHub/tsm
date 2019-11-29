var Permisos;

var fn_DMueCargarConfiguracion = function () {
    KdoButton($("#btnMuest"), "delete", "Limpiar");
    KdoButtonEnable($("#btnMuest"), false);
    KdoButton($("#btnFinOT"), "gear", "Finalizar OT");

    // colocar grid para arrastre

    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaMues"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaMues"), false);
    KdoCmbSetValue($("#CmbMaquinaMues"), maq[0].IdMaquina);

    let UrlUMDM = TSM_Web_APi + "UnidadesMedidas";
    Kendo_CmbFiltrarGrid($("#CmbIdUnidad"), UrlUMDM, "Abreviatura", "IdUnidad", "Seleccione...");
    let UrlDM_OP = TSM_Web_APi + "OrientacionPositivos";
    Kendo_CmbFiltrarGrid($("#CmbIdOrientacionPositivo"), UrlDM_OP, "Nombre", "IdOrientacionPositivo", "Seleccione...");
    let UrlDM_TS = TSM_Web_APi + "TiposSeparaciones";
    Kendo_CmbFiltrarGrid($("#CmbIdTipoSeparacion"), UrlDM_TS, "Nombre", "IdTipoSeparacion", "Seleccione...");
    KdoButton($("#btnGuardarDiseñoMues"), "save", "Guardar");

    $("#btnMuest").data("kendoButton").bind('click', function () {
        ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });
    });

     //FINALIZAR OT
    $("#btnFinOT").click(function () {
        ConfirmacionMsg("¿Esta seguro de finalizar la Orden de trabajo  " + $("#txtNoDocumentoOT").val() + "?", function () { return fn_FinOT(); });
    });


};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    KdoButtonEnable($("#btnFinOT"), vhb);
};

// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = fn_RTCargarMaquina;
fun_ListDatos.push(EtapaPush);
//Agregar a Lista de ejecucion funcion configurar 
var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_DMueCargarConfiguracion;
fun_ListDatos.push(EtapaPush2);

//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_DMCargarEtapa;
fun_ListDatos.push(EtapaPush3);

fPermisos = function (datos) {
    Permisos = datos;
};

let fn_FinOT = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/OrdenesTrabajosFinalizar/" + $("#txtIdOrdenTrabajo").val() + "/" + idEtapaProceso ,
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            CargarInfoEtapa(false);
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(document.body), false);
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

}