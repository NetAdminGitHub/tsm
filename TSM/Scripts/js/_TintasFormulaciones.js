var Permisos;
var fn_TintasFCargarConfiguracion = function () {
    KdoButton($("#btnBTTintas"), "delete", "Limpiar");
    KdoButtonEnable($("#btnBTTintas"), false);
    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaTintas"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaTintas"), false);
    KdoCmbSetValue($("#CmbMaquinaTintas"), maq[0].IdMaquina);

};
var fn_TintasFCargarEtapa = function () {
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
EtapaPush2.FnEtapa = fn_TintasFCargarConfiguracion;
fun_ListDatos.push(EtapaPush2);

//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_TintasFCargarEtapa;
fun_ListDatos.push(EtapaPush3);


fPermisos = function (datos) {
    Permisos = datos;
};