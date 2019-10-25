var Permisos;

var fn_DMueCargarConfiguracion = function () {
    KdoButton($("#btnMuest"), "delete", "Limpiar");
    KdoButtonEnable($("#btnMuest"), false);
    // colocar grid para arrastre

    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaDis"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaDis"), false);
    KdoCmbSetValue($("#CmbMaquinaDis"), maq[0].IdMaquina);

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

    //fn_RTCargarMaquina();
};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
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