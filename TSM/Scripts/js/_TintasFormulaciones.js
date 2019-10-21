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

    fn_RTCargarMaquina();
};
var fn_TintasFCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
};

fun_List.push(fn_TintasFCargarConfiguracion);
fun_ListDatos.push(fn_TintasFCargarConfiguracion);

fPermisos = function (datos) {
    Permisos = datos;
};