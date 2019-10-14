var Permisos;
let vIdIdDisenoMuestra;

var fn_DMCargarConfiguracion = function () {
    KdoButton($("#btnMuest"), "delete", "Limpiar");
    KdoButtonEnable($("#btnMuest"), false);
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

    $("#btnMuest").data("kendoButton").bind('click', function () {
        ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });
    });

    fn_RTCargarMaquina();
};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
};

fun_List.push(fn_DMCargarConfiguracion);
fun_ListDatos.push(fn_DMCargarEtapa);

//let fn_GetDisenoMuestra = function () {

fPermisos = function (datos) {
    Permisos = datos;
};