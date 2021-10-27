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
    KdoButton($("#btnUpdCantidaEsta"), "wrench", "Actualizar Estaciones Permitidas");
/*    fn_GetAutCambioEstacionPermitida();*/
    $("#TxtCntEstacionesPermitidas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    //KdoNumerictextboxEnable($("#TxtCntEstacionesPermitidas"), false);

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
                    fn_DuplicarBrazoMaquina($("#maquinaRevTec").data("maquinaSerigrafia").maquina, dataCopy, function () { return fn_ObtCntMaxEstaciones(); });
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
                    fn_EliminarEstacion(maq[0].IdSeteo, e, $("#maquinaRevTec"), function () { return fn_ObtCntMaxEstaciones();});
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaRevTec"), 1, function () { return fn_ObtCntMaxEstaciones(); });


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

    $("#btnUpdCantidaEsta").click(function (e) {
  
        fn_ActualizarEstacionesPermitidas("vAutCntEstaciones", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val(), function () { return fn_ObtCntMaxEstaciones(); });

    });
     
    fn_ObtCntMaxEstaciones();


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
    fn_ObtCntMaxEstaciones();
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

let fn_ObtCntMaxEstaciones = () => {
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/GetMaxEstacionesPermitida/" + `${idOrdenTrabajo}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            let AlertEst = $("#AlertaEstacion");
            AlertEst.children().remove();

            if (datos === null) {
                AlertEst.children().remove();
            } else {
                kdoNumericSetValue($("#TxtCntEstacionesPermitidas"), datos.EstacionesPermitidas);
                
                if (datos.CantidadNoPemitida === true) {
                    AlertEst.append('<div class="alert alert-warning alert-dismissible" id="AlertPermitidas">' +
                        '<strong>Warning!</strong> SETEO DE MAQUINA SUPERA AL MAXIMO DE ESTACIONES PERMITIDO' +
                        '</div>');
                   
                } else {
                    AlertEst.alert()
                }
             
            };
            



        }
    });
};


