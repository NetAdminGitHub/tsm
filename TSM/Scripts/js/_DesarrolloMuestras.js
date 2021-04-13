var Permisos;

var fn_DMueCargarConfiguracion = function () {

    KdoButton($("#btnAjuste_Mues"), "warning", "Ajuste tinta/marco");
    KdoButton($("#btnConsultarPesos"), "search", "Consultar");
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

    fn_ConsultaPesos($("#gridEstacionPeso"));

    $("#btnAjuste_Mues").click(function (e) {
        //fn_OpenModalEstacionAjuste();
        fn_SolicitarIngresoAjuste("vSoliIngresoAjuste", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val(), maq[0].IdSeteo);

    });

    $("#maquinaDesarrolloMues").maquinaSerigrafia({
        maquina: {
            data: maq,
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
                    maq = fn_GetMaquinas();
                    $("#maquinaDesarrolloMues").data("maquinaSerigrafia").cargarDataMaquina(maq);
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    var dataCopy = e.detail[0];
                    fn_DuplicarBrazoMaquina($("#maquinaDesarrolloMues").data("maquinaSerigrafia").maquina, dataCopy);
                },
                trasladarEstacion: function (e) {
                    var informacionTraslado = e.detail[0];
                    //$("#maquinaDesarrolloMues").data("maquinaSerigrafia").maquinaVue.aplicarTraspaso(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio);
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
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaDesarrolloMues"), 1);


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

    //$("#maquina").data("maquinaSerigrafia").maquinaVue.readOnly(true); 
};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    KdoButtonEnable($("#btnAjuste_Mues"), vhb);
    $("#maquinaDesarrolloMues").data("maquinaSerigrafia").activarSoloLectura(!vhb);

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