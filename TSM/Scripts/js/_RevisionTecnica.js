var Permisos;
let UrlArf = TSM_Web_APi + "AnalisisRequerimientoFactibilidades";
let UrlArfDet = TSM_Web_APi + "AnalisisRequerimientoFactibilidadesRevisiones";
let StrIdCatalogoInsu = "";
let vIdPlan = 0;
let gAlto = 300;

//#region Programacion Analisis Requerimiento Factibilidad
var fn_RTCargarConfiguracion = function () {
    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    KdoButton($("#btnAddColorRev"), "plus-circle", "Agregar color o técnica");
    fn_GetAutCambioEstacionPermitida();
    $("#TxtCntEstacionesPermitidas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    KdoNumerictextboxEnable($("#TxtCntEstacionesPermitidas"), false);

    $("#maquinaRevTec").maquinaSerigrafia({
        maquina: {
            data: maq,
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    var dataCopy = e.detail[0];
                    fn_DuplicarBrazoMaquina($("#maquinaRevTec").data("maquinaSerigrafia").maquina, dataCopy);
                },
                trasladarEstacion: function (e) {
                    var informacionTraslado = e.detail[0];
                    //$("#maquinaRevTec").data("maquinaSerigrafia").maquinaVue.aplicarTraspaso(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio);
                    fn_TrasladarEstacion(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio, $("#maquinaRevTec"));
                },
                desplazamientoEstacion: function (e) {
                    var elementoADesplazar = e.detail[0];
                    var sType = $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_OpenModalDesplazamiento(elementoADesplazar.number, $("#maquinaRevTec"), sType.CantidadEstaciones);
                },
                eliminarEstacion: function (e) {
                        fn_EliminarEstacion(maq[0].IdSeteo, e, $("#maquinaRevTec"));
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaRevTec"),1); 


                }
            }
        },
        tipoMaquina:
        {
            mostrar: true,
            eventos: {
                onChange: elementoSeleccionado
            }
        },
        colores: { mostrar: true },
        tecnicas: { mostrar: true },
        bases: { mostrar: true },
        accesorios: { mostrar: true }
    });

    fn_GetFormasMaquina($("#maquinaRevTec").data("maquinaSerigrafia"));
    $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.setSelected(maq[0].IdFormaMaquina);
    fn_GetColores($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Tecnicas($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Bases($("#maquinaRevTec").data("maquinaSerigrafia"));
    fn_Accesorios($("#maquinaRevTec").data("maquinaSerigrafia"));

    $("#btnAddColorRev").click(function () {
        fn_OpenModaAddColoresTecnicas(function () { return fn_closeRevTec(); });
    });

    fn_ObtenerCntMaxEstaciones();

    $("#TxtCntEstacionesPermitidas").data("kendoNumericTextBox").bind("change", function (e) {
        fn_actualizarCantidadPermitida();
    });
};


var fn_closeRevTec = function () {
    fn_GetColores($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Tecnicas($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
};

var fn_load_maquina_ColorTec_Rev = function () {
    $("#maquinaRevTec").data("maquinaSerigrafia").cargarDataMaquina(maq);
    fn_GetColores($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Tecnicas($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
   
};


var fn_RTMostrarGrid = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true;
    $("#maquinaRevTec").data("maquinaSerigrafia").activarSoloLectura(!vhb);
    KdoButtonEnable($("#btnAddColorRev"), vhb);
    fn_ObtenerCntMaxEstaciones();
    fn_GetAutCambioEstacionPermitida();
};

var elementoSeleccionado = function (e) {
    if (Number(maq[0].IdFormaMaquina) !== Number(e.detail[0].IdFormaMaquina)) {
        if ($("#maquinaRevTec").data("maquinaSerigrafia").maquinaVue.initialize(e.detail[0].CantidadEstaciones, e.detail[0].NomFiguraMaquina) === "OK") {
            fn_UpdFormaRevTec(e.detail[0].CantidadEstaciones, e.detail[0].IdFormaMaquina, e.detail[0].NomFiguraMaquina, $("#maquinaRevTec"),0); 
        }
    } 
};

//Agregar a Lista de ejecucion funcion configurar grid
fun_List.push(fn_RTCargarConfiguracion);

//Agregar a lista de ejecucion funcion mostrar grid.
var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_RTMostrarGrid;
fun_ListDatos.push(EtapaPush2);

// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa =  fn_load_maquina_ColorTec_Rev;
fun_ListDatos.push(EtapaPush);

fPermisos = function (datos) {
    Permisos = datos;
};

let fn_ObtenerCntMaxEstaciones = () => {
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajosDetalles/GetRequerimientoByOT/" + `${idOrdenTrabajo}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            kdoNumericSetValue($("#TxtCntEstacionesPermitidas"), datos[0].CantidadEstacionesPermitidas);
        }
    });
};


let fn_actualizarCantidadPermitida = function () {
    kendo.ui.progress($(document.body), true);
    if (kdoNumericGetValue($("#TxtCntEstacionesPermitidas")) > 0) {
        kendo.ui.progress($(document.body), true);
        //var item = e.item;
        $.ajax({
            url: TSM_Web_APi + "/RequerimientoDesarrollos/UpdCantidadEstacionesPermitidas",//
            type: "post",
            dataType: "json",
            data: JSON.stringify({
                IdOrdenTrabajo: idOrdenTrabajo,
                IdEtapaProceso: idEtapaProceso,
                Item: $("#txtItem").val(),
                CantidadEstacionesPermitidas: kdoNumericGetValue($("#TxtCntEstacionesPermitidas"))

            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                RequestEndMsg(data, "Post");
                kendo.ui.progress($(document.body), false);
            },
            error: function (data) {
                kendo.ui.progress($(document.body), false);
                ErrorMsg(data);
                fn_ObtenerCntMaxEstaciones();
                $("#TxtCntEstacionesPermitidas").data("kendoNumericTextBox").focus();
            }
        });
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("CANTIDAD DE ESTACIONES DEBE SER MAYOR A CERO", "error");
        fn_ObtenerCntMaxEstaciones();
        kendo.ui.progress($(document.body), false);
        $("#TxtCntEstacionesPermitidas").data("kendoNumericTextBox").focus();

    }
};


let fn_GetAutCambioEstacionPermitida = () => {
    $.ajax({
        url: TSM_Web_APi + "DepartamentosRoles/GetByIdUsuarioIdDepartamentoIdRol/" + `${getUser()}/${2}/${36}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                KdoNumerictextboxEnable($("#TxtCntEstacionesPermitidas"), datos.Editar === true && datos.Confidencial === true && EtpAsignado===true ? true : false);
                $("#maquinaRevTec").data("maquinaSerigrafia").activarSoloLectura(true);
                KdoButtonEnable($("#btnAddColorRev"), false);
                vhb = false;
                $("#TxtCntEstacionesPermitidas").data("kendoNumericTextBox").focus();
            } else {
                KdoNumerictextboxEnable($("#TxtCntEstacionesPermitidas"), false);
                $("#maquinaRevTec").data("maquinaSerigrafia").activarSoloLectura(false);
                KdoButtonEnable($("#btnAddColorRev"), true);
                vhb = true;
            }
        }
    });
};