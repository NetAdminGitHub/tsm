var Permisos;
let UrlArf = TSM_Web_APi + "AnalisisRequerimientoFactibilidades";
let UrlArfDet = TSM_Web_APi + "AnalisisRequerimientoFactibilidadesRevisiones";
let StrIdCatalogoInsu = "";
let vIdPlan = 0;
let gAlto = 300;

//#region Programacion Analisis Requerimiento Factibilidad
var fn_RTCargarConfiguracion = function () {
    KdoButton($("#btnBT"), "delete", "Limpiar");
    KdoButtonEnable($("#btnBT"), false);

    fn_gridColorEstacion($("#dgColor"));
    $("#dgColor").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgColor").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgColor").data("TipoEstacion", "MARCO"); // guardar nombre archivo JS
    $("#dgColor").data("Formulacion", "COLOR"); // guarda el idformulacion

    fn_gridTecnicaEstacion($("#dgTecnica"));
    $("#dgTecnica").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgTecnica").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgTecnica").data("TipoEstacion", "MARCO"); // guardar nombre archivo JS
    $("#dgTecnica").data("Formulacion", "TECNICA"); // guarda el idformulacion

    fn_gridBasesEstacion($("#dgBases"));
    $("#dgBases").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgBases").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgBases").data("TipoEstacion", "MARCO"); // guardar nombre archivo JS
    $("#dgBases").data("Formulacion", "BASE"); //guarda el idformulacion

    fn_gridAccesoriosEstacion($("#dgAccesorios"));
    $("#dgAccesorios").data("Estacion", "MEstacionAccesorios"); // guardar nombre vista modal
    $("#dgAccesorios").data("EstacionJS", "EstacionAccesorios.js"); // guardar nombre archivo JS
    $("#dgAccesorios").data("TipoEstacion", "ACCESORIO"); // guardar nombre archivo JS
    $("#dgAccesorios").data("Formulacion", ""); //guarda el idformulacion

    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquina"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquina"), false);
    KdoCmbSetValue($("#CmbMaquina"), maq[0].IdMaquina);
    //hablitar el Drop Target de las maquinas
    let vContenedor = $("#container");
    $(vContenedor).kendoDropTarget({
        drop: function (e) { dropElemento(e); },
        group: "gridGroup"
    });

    $("#btnBT").data("kendoButton").bind('click', function () {
        ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });
        
    });
};

var fn_RTMostrarGrid = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true;
    Grid_HabilitaToolbar($("#dgColor"), vhb, vhb, vhb);
    Grid_HabilitaToolbar($("#dgTecnica"), vhb, vhb, vhb);
    Grid_HabilitaToolbar($("#dgBases"), vhb, vhb, vhb);
    Grid_HabilitaToolbar($("#dgAccesorios"), vhb, vhb, vhb);
    KdoButtonEnable($("#btnBT"), vhb);
    $("#dgTecnica").data("kendoGrid").dataSource.read();
    $("#dgColor").data("kendoGrid").dataSource.read();
    $("#dgBases").data("kendoGrid").dataSource.read();
    $("#dgAccesorios").data("kendoGrid").dataSource.read();
};

fun_List.push(fn_RTCargarConfiguracion);
fun_List.push(fn_RTCargarMaquina);
fun_ListDatos.push(fn_RTMostrarGrid);

let Fn_GetFilaSelect = function (data) {
    let fila = "";
    fila = {
        IdRequerimiento: data.IdRequerimiento,
        IdPlantillaListaVerificacion: data.IdPlantillaListaVerificacion,
        Item: data.Item,
        Descripcion: data.Descripcion,
        Comprobado: data.Comprobado
    };
    return fila;
};

let Grid_ColTempCheckBox = function (data, columna) {
    return "<input id=\"" + data.id + "\" type=\"checkbox\" class=\"k-checkbox\"" + (data[columna] ? "checked=\"checked\"" : "") + "" + ($("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? "disabled =\"disabled\"" : "") + " />" +
        "<label class=\"k-checkbox-label\" for=\"" + data.id + "\"></label>";
};

let fn_ConsultarGridConfEP = function () {
    vIdPlan = fn_GetIdPlan($("#gridRev").data("kendoGrid"));
    $("#gridRevDet").data("kendoGrid").dataSource.read();
    $("#gridRev").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridRevDet"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridRevDet"), false, false, false);
};

let fn_GetIdPlan = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdPlantillaListaVerificacion;
};

fPermisos = function (datos) {
    Permisos = datos;
};