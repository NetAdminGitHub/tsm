var Permisos;

var fn_DMueCargarConfiguracion = function () {

    KdoButton($("#btnAjuste_Mues"), "warning", "Ajuste tinta/marco");
    KdoButton($("#btnConsultarPesos"), "search", "Consultar");
    KdoButton($("#btnCambiarEstadoEtapa"), "gear", "Cambiar Estado Muestra");
    KdoButton($("#btnRestablecerSecuencia"), "undo", "Deshacer");

    $("#MbtConsulta").kendoDialog({
        height: "70%",
        width: "40%",
        title: "Detalle de pesos en muestra",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });
    //kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's')
    // colocar grid para arrastre

    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
   
    $("#btnConsultarPesos").click(function () {
        $("#MbtConsulta").data("kendoDialog").open();
        $("#gridEstacionPeso").data("kendoGrid").dataSource.read();
        $("#gridEstacionPeso").data("kendoGrid").refresh();
    });

    //Fn_VistaCambioEstado($("#vCamEstado"));

    $("#btnCambiarEstadoEtapa").click(function (event) {
        var lstId = {
            IdOrdenTrabajo: idOrdenTrabajo,
            IdEtapaProceso: idEtapaProceso,
            Item: $("#txtItem").val(),
        };
        Fn_VistaCambioEstadoMostrar("OrdenesTrabajosDetalles", $("#txtEstado").val(), TSM_Web_APi + "OrdenesTrabajosDetalles/CambiarEstado", "Sp_CambioEstado", lstId, undefined);
    });

    fn_ConsultaPesos($("#gridEstacionPeso"));

    $("#btnAjuste_Mues").click(function (e) {
        //fn_OpenModalEstacionAjuste();
        fn_SolicitarIngresoAjuste("vSoliIngresoAjuste", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val(), maq[0].IdSeteo, idTipoOrdenTrabajo.toString());

    });

    $("#btnRestablecerSecuencia").click(function (e) {
        fn_RestablecerSecuenciaAnt(idOrdenTrabajo, maq[0].IdSeteo);
    });

    $("#maquinaDesarrolloMues").maquinaSerigrafia({
        maquina: {
            /*data: maq,*/
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    if (PermiteAddEstacion === true) {
                        AgregaEstacion(e);
                        maq = fn_GetMaquinas();
                        $("#maquinaDesarrolloMues").data("maquinaSerigrafia").cargarDataMaquina(maq);
                    } else {
                        $("#kendoNotificaciones").data("kendoNotification").show("NO SE PUEDE AGREGAR ESTACIÓN PORQUE SUPERA AL MÁXIMO PERMITIDO, CANTIDAD : " + $("#TxtCntEstacionesPermitidas").val(), "error");
                    }
                    
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    if (PermiteAddEstacion === true) {
                        var dataCopy = e.detail[0];
                        fn_DuplicarBrazoMaquina($("#maquinaDesarrolloMues").data("maquinaSerigrafia").maquina, dataCopy, function () { return fn_ObtCntMaxEstaciones($("#AlertaEstacionDesarrollo")); });
                    } else {
                        $("#kendoNotificaciones").data("kendoNotification").show("NO SE PUEDE AGREGAR ESTACIÓN PORQUE SUPERA AL MÁXIMO PERMITIDO, CANTIDAD : " + $("#TxtCntEstacionesPermitidas").val(), "error");
                    }
                   
                },
                trasladarEstacion: function (e) {
                    var informacionTraslado = e.detail[0];
                    fn_TrasladarEstacion(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio, $("#maquinaDesarrolloMues"));
                },
                desplazamientoEstacion: function (e) {
                    var elementoADesplazar = e.detail[0];
                    var sType = $("#maquinaDesarrolloMues").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_OpenModalDesplazamiento(elementoADesplazar.number, $("#maquinaDesarrolloMues"), sType.CantidadEstaciones);
                },
                eliminarEstacion: function (e) {
                    fn_EliminarEstacion(maq[0].IdSeteo,e, $("#maquinaDesarrolloMues"));
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaDesarrolloMues").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaDesarrolloMues"), 1, function () { return fn_ObtCntMaxEstaciones($("#AlertaEstacionDesarrollo")); });


                }
            }
        },
        tipoMaquina:
        {
            mostrar: true,
            eventos: {
                onChange: elementoSeleccionado_DesarrolloMues
            }
        },
        accesorios: { mostrar: true }
    });

    fn_GetFormasMaquina($("#maquinaDesarrolloMues").data("maquinaSerigrafia"));
    $("#maquinaDesarrolloMues").data("maquinaSerigrafia").tipoMaquinaVue.setSelected(maq[0].IdFormaMaquina);
    fn_Accesorios($("#maquinaDesarrolloMues").data("maquinaSerigrafia"));

    fn_ObtCntMaxEstaciones($("#AlertaEstacionDesarrollo"));
};

var fn_DMCargarEtapa = function () {
    vhb = !estadoPermiteEdicion || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    KdoButtonEnable($("#btnAjuste_Mues"), vhb);
    KdoButtonEnable($("#btnRestablecerSecuencia"), vhb);
    $("#maquinaDesarrolloMues").data("maquinaSerigrafia").activarSoloLectura(!vhb);
    fn_ObtCntMaxEstaciones($("#AlertaEstacionDesarrollo"));

};


var elementoSeleccionado_DesarrolloMues = function (e) {
    if (Number(maq[0].IdFormaMaquina) !== Number(e.detail[0].IdFormaMaquina)) {
        if ($("#maquinaDesarrolloMues").data("maquinaSerigrafia").maquinaVue.initialize(e.detail[0].CantidadEstaciones, e.detail[0].NomFiguraMaquina) === "OK") {
            fn_UpdFormaRevTec(e.detail[0].CantidadEstaciones, e.detail[0].IdFormaMaquina, e.detail[0].NomFiguraMaquina, $("#maquinaDesarrolloMues"), 0);
        }
    } 
};

//Agregar a Lista de ejecucion funcion configurar 
fun_List.push(fn_DMueCargarConfiguracion);

//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_DMCargarEtapa;
fun_ListDatos.push(EtapaPush3);


// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = function () { return $("#maquinaDesarrolloMues").data("maquinaSerigrafia").cargarDataMaquina(maq); };
fun_ListDatos.push(EtapaPush);

fPermisos = function (datos) {
    Permisos = datos;
};

var fn_ConsultaPesos = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetByIdSeteo/" + maq[0].IdSeteo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdEstacion",
                fields: {
                    IdSeteo: {
                        type: "number"
                    },
                    IdEstacion: {
                        type: "number"
                    },
                    DescripcionEstacion: {
                        type: "string"

                    },
                    ColorHex: {
                        type: "string"

                    },
                    NombreColorEstacion: {
                        type: "string"
                    },
                    Peso: { type: "number" }
                }
            }
        },
        aggregate: [
            { field: "Peso", aggregate: "sum" }
        ],
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
       
        columns: [
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50, footerTemplate: "Totales" },
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120 },
            { field: "Peso", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "n2", 2], format: "{0:n2}", footerTemplate: "#: data.Peso ? kendo.format('{0:n2}', sum) : 0 #" },
            { field: "PesoUnidadMedida", title: "Unidad", minResizableWidth: 100 }
         
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 550);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow4 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow4);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow4);
    });
};

var fn_cerrarModal = function () {
    $("#vSoliIngresoAjuste").data("kendoDialog").close();
}


let fn_RestablecerSecuenciaAnt = (idOt, idseteo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstaciones/Maquina/RestablecerSecuenciaAnt",
        type: "Post",
        data: JSON.stringify({
            IdOrdenTrabajo: idOt,
            IdSeteo: idseteo
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {


            let limpiar = [{
                IdSeteo: maq[0].IdSeteo,
                IDOrdenTrabajo: maq[0].IDOrdenTrabajo,
                IdEtapaProceso: maq[0].IdEtapaProceso,
                Item: maq[0].Item,
                IdMaquina: maq[0].IdMaquina,
                NomIdMaquina: maq[0].NomIdMaquina,
                IdEstacion: null,
                IdTipoFormulacion: null,
                IdRequerimientoColor: null,
                Color: null,
                IdBase: null,
                NomIdBase: null,
                IdRequerimientoTecnica: null,
                NomIdTecnica: null,
                IdAccesorio: null,
                NomIdAccesorio: null,
                ToolTips: null,
                IdSistemaPigmento: null,
                TemperaturaHorno: maq[0].TemperaturaHorno,
                ColorHex: null,
                Letra: null,
                IdTecnica: null,
                Icono: null,
                TipoBrazo: null,
                IdFormaMaquina: maq[0].IdFormaMaquina,
                CantidadEstaciones: maq[0].CantidadEstaciones,
                NomFiguraMaquina: maq[0].NomFiguraMaquina,
                IdTiposMarco: null
            }];
    
            $("#maquinaDesarrolloMues").children().remove()

            maq = limpiar;
            $("#maquinaDesarrolloMues").data("maquinaSerigrafia").init()
            maq = fn_GetMaquinas();
            $("#maquinaDesarrolloMues").data("maquinaSerigrafia").maquinaVue.initialize(maq[0].CantidadEstaciones, maq[0].NomFiguraMaquina)
            $("#maquinaDesarrolloMues").data("maquinaSerigrafia").cargarDataMaquina(maq);
            fn_GetFormasMaquina($("#maquinaDesarrolloMues").data("maquinaSerigrafia"));
            $("#maquinaDesarrolloMues").data("maquinaSerigrafia").tipoMaquinaVue.setSelected(maq[0].IdFormaMaquina);
            fn_Accesorios($("#maquinaDesarrolloMues").data("maquinaSerigrafia"));
       
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, "Post");
  
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });

};