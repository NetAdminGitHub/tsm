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
    xIdQuimicaCliente = maq[0].IdQuimica;

    KdoButton($("#btnAddColorRev"), "plus-circle", "Agregar color o técnica");
    KdoButton($("#btnUpdCantidaEsta"), "wrench", "Actualizar Estaciones Permitidas");

    $("#maquinaRevTec").maquinaSerigrafia({
        maquina: {
            data: maq,
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    if (PermiteAddEstacion === true) {
                         //validar arrastre
                        if (e.detail[0].tipo === "TECNICA" && tecnicasFlags.find(q => q.IdTecnica === e.detail[0].data.IdTecnica && q.PermiteArrastrar === false)) {
                            $("#kendoNotificaciones").data("kendoNotification").show("LA TECNICA ESTA CONFIGURADA COMO NO PERMITIDA PARA ARRASTRE ", "warning");
                            return;
                        }
                         AgregaEstacion(e);
                    } else {
                        $("#kendoNotificaciones").data("kendoNotification").show("NO SE PUEDE AGREGAR ESTACIÓN PORQUE SUPERA AL MÁXIMO PERMITIDO, CANTIDAD : " + $("#TxtCntEstacionesPermitidas").val(), "error");
                    }
                  
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    if (PermiteAddEstacion === true) {
                        //validar arrastre
                        if (e.detail[0].tipo === "TECNICA" && tecnicasFlags.find(q => q.IdTecnica === e.detail[0].data.IdTecnica && q.PermiteArrastrar === false)) {
                            $("#kendoNotificaciones").data("kendoNotification").show("LA TECNICA ESTA CONFIGURADA COMO NO PERMITIDA PARA ARRASTRE ", "warning");
                            return;
                        }
                        var dataCopy = e.detail[0];
                        fn_DuplicarBrazoMaquina($("#maquinaRevTec").data("maquinaSerigrafia").maquina, dataCopy, function () { return fn_ObtCntMaxEstaciones($("#AlertaEstacion")); });
                    } else {
                        $("#kendoNotificaciones").data("kendoNotification").show("NO SE PUEDE AGREGAR ESTACIÓN PORQUE SUPERA AL MÁXIMO PERMITIDO, CANTIDAD : " + $("#TxtCntEstacionesPermitidas").val(), "error");
                    }
                    
                },
                trasladarEstacion: function (e) {
                    var informacionTraslado = e.detail[0];
                    fn_TrasladarEstacion(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio, $("#maquinaRevTec"));
                },
                desplazamientoEstacion: function (e) {
                    var elementoADesplazar = e.detail[0];
                    var sType = $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_OpenModalDesplazamiento(elementoADesplazar.number, $("#maquinaRevTec"), sType.CantidadEstaciones);
                },
                eliminarEstacion: function (e) {
                    fn_EliminarEstacion(maq[0].IdSeteo, e, $("#maquinaRevTec"), function () { return fn_ObtCntMaxEstaciones($("#AlertaEstacion"));});
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaRevTec"), 1, function () { return fn_ObtCntMaxEstaciones($("#AlertaEstacion")); });


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
  
        fn_ActualizarEstacionesPermitidas("vAutCntEstaciones", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val(), function () { return fn_ObtCntMaxEstaciones($("#AlertaEstacion")); });

    });
     
    fn_ObtCntMaxEstaciones($("#AlertaEstacion"));


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
    fn_ObtCntMaxEstaciones($("#AlertaEstacion"));
    //obtener tecnicas flags
    fn_SeteoTecnicasCondiciones(maq.length !== 0 ? maq[0].IdSeteo : 0);
    xIdQuimicaCliente = maq[0].IdQuimica;
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




