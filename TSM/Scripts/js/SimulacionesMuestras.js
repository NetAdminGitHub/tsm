
let UrlServ = TSM_Web_APi + "Servicios";
let UrlClie = TSM_Web_APi + "Clientes";
let vIdModulo = 2;
var Permisos;
let VIdSer =0;
let VIdCliente =0;
let data;
$(document).ready(function () {
    $("#MbtnSimu").kendoDialog({
        height: "auto",
        width: "30%",
        title: "Generar Simulación por No. OT",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900,
        close:fn_closeGS
    });


    //KdoButton($("#btnRecalcular"), "gears", "Recalcular simulación");
    KdoButton($("#btnSimulacion"), "gear", "Nueva simulación");
    KdoButton($("#btnAceptarSimu"), "check", "Nueva simulación");
    $("#btnSimulacion").data("kendoButton").enable(false);
    //$("#btnRecalcular").data("kendoButton").enable(false);
   
    // configurar clientes y servicios
    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), "");
    KdoCmbSetValue($("#CmbIdServicio"), "");

    // transformar div en multicolumn
    $("#CmbNoOT").OrdenesTrabajos();

    $("#CmbNoOT").data("kendoMultiColumnComboBox").bind("change", function (e) {
        if (this.dataItem() !== undefined) {
            data = this.dataItem();
        }
    });

    //#region campos para generar simulacion
    $("#TxtNuevaCantidadPiezas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtNoMontaje").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#txtPersonalExtra").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });

    $("#txtCombos").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 1,
        value: 1
    });

    $("#txtVeloMaquina").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 1,
        value: 1
    });

    let ValidNuevoSim = $("#FrmNuevoSim").kendoValidator({
        rules: {
            SOT: function (input) {
                if (input.is("[name='CmbNoOT']")) {
                    return $("#CmbNoOT").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                }
                return true;
            },
            Mayor0: function (input) {
                if (input.is("[name='TxtNuevaCantidadPiezas']")) {
                    return input.val() > 0;
                }
                return true;
            },
            NoMontajeMayor0: function (input) {
                if (input.is("[name='TxtNoMontaje']") ) {
                    return input.val() > 0;
                }
                return true;
            },
            PersonalMayorIgual0: function (input) {
                if (input.is("[name='txtPersonalExtra']") ) {
                    return input.val() >= 0;
                }
                return true;
            },
            CombosMayorIgual0: function (input) {
                if (input.is("[name='txtCombos']") ) {
                    return input.val() > 0;
                }
                return true;
            },
            VeloMayorIgual0: function (input) {
                if (input.is("[name='txtVeloMaquina']")) {
                    return input.val() > 0;
                }
                return true;
            }
        },
        messages: {
            Mayor0: "requerido",
            NoMontajeMayor0: "requerido.",
            PersonalMayorIgual0: "requerido",
            CombosMayorIgual0: "requerido",
            VeloMayorIgual0: "requerido",
            SOT:"Requerido"
        }
    }).data("kendoValidator");

    //#endregion 


    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION
    let DsRD = new kendo.data.DataSource({
      
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SimulacionesMuestras/GetSimulacionesMuestrasOT/" + VIdSer + "/" + VIdCliente + "/" + vIdModulo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSimulacion",
                fields: {
                    IdSimulacion: { type: "number" },
                    IdRequerimiento: { type: "number" },
                    IdOrdenTrabajo: { type: "number" },
                    NoDocOT: {type:"string"},
                    IdCliente: { type: "number" },
                    NoCuenta: { type: "string" },
                    IdPrograma: { type: "number" },
                    NoPrograma: { type: "string" },
                    IdServicio: { type: "number" },
                    IdUbicacion: { type: "number" },
                    NoDocRequerimiento: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    UbicacionVertical: { type: "string" },
                    Estado: { type: "string" },
                    Fecha: { type: "date" },
                    NombreArte: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    IdArte: { type: "number" },
                    NoDocSimulacion: { type: "string" },
                    NombreProg: { type: "string" },
                    NombreClie: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    NombreEstado: { type: "string" },
                    Tallas: { type: "string" },
                    FechaFinal: { type: "date"},
                    FechaFinalMuestra: { type: "date"}

                }
            }
        }
    });

    var selectedRows = [];
    $("#gridSimulacion").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        dataBound: function () {
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                window.location.href = "/SimulacionesMuestras/SimulacionesMuestrasInfo/" + grid.dataItem(this).IdSimulacion.toString() + "/" + grid.dataItem(this).IdServicio.toString() + "/" + grid.dataItem(this).IdOrdenTrabajo.toString();
            });
            Grid_SetSelectRow($("#gridSimulacion"), selectedRows);
        },
        columns: [
            { field: "NoDocSimulacion", title: "No.Simulación", width: 100},
            { field: "NoDocOT", title: "No OT", width: 100},
            { field: "Fecha", title: "Fecha simulación", format: "{0: dd/MM/yyyy}" },
            { field: "IdSimulacion", title: "Cod. simulación", hidden: true },
            { field: "IdRequerimiento", title: "Código requerimiento", hidden: true },
            { field: "NoDocRequerimiento", title: "Requerimiento", width: 100},
            { field: "Fecha", title: "Fecha del simulación", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "NombreArte", title: "Nombre del diseño" },
            { field: "EstiloDiseno", title: "Estilo diseno" },
            { field: "NumeroDiseno", title: "Número diseno", width: 100},
            { field: "IdPrograma", title: "Código Programa", hidden: true },
            { field: "NoPrograma", title: "No Programa" },
            { field: "NombreProg", title: "Nombre del programa" },
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta cliente", hidden: true },
            { field: "NombreClie", title: "Nombre del cliente" },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "IdUbicacion", title: "Código ubicación", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", hidden: true },
            { field: "UbicacionVertical", title: "Ubicacion vertical", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "TallaPrincipal", title: "Talla principal", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Tecnicas", title: "Técnicas" },
            { field: "Tallas", title: "Tallas" },
            { field: "FechaFinalMuestra", title: "Desarrollo Muestra", width: 125, format: "{0: dd/MM/yyyy}" },
            { field: "FechaFinal", title: "Finalización OT", width: 100, format: "{0: dd/MM/yyyy HH:mm:ss}" },
            { field: "NombreEstado", title: "Estado simulación", width: 100}

        ]
    });

    SetGrid($("#gridSimulacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 550);
    SetGrid_CRUD_ToolbarTop($("#gridSimulacion").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimulacion").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridSimulacion").data("kendoGrid"), DsRD,50);

    $("#gridSimulacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSimulacion"), selectedRows);
    });

    //#endregion FIN GRID PRINCIPAL

    //#region seleccion de servicio y cliente

    $("#CmbIdServicio").data("kendoComboBox").bind("select", function (e) {
        kendo.ui.progress($("#CmbIdServicio"), true);
        if (e.item) {
            Fn_ConsultarSimu(this.dataItem(e.item.index()).IdServicio.toString(), Kendo_CmbGetvalue($("#CmbIdCliente")));
        } else {
            Fn_ConsultarSimu(0, Kendo_CmbGetvalue($("#CmbIdCliente")));
        }

    });

    $("#CmbIdServicio").data("kendoComboBox").bind("change", function (e) {
        kendo.ui.progress($("#CmbIdServicio"), true);
        let value = this.value();
        if (value === "") {
            Fn_ConsultarSimu(0, Kendo_CmbGetvalue($("#CmbIdCliente")));
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), this.dataItem(e.item.index()).IdCliente.toString());
        } else {
            Fn_ConsultarSimu(0, 0);
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), 0);
        }
    });

    //#endregion
 


    //generar nueva simulacion y aceptar nueva simulación
    $("#btnSimulacion").bind("click", function () {
  
        $("#MbtnSimu").data("kendoDialog").open();
        $("#CmbNoOT").data("kendoMultiColumnComboBox").text("");
        $("#CmbNoOT").data("kendoMultiColumnComboBox").trigger("change");
        $("#CmbNoOT").data("kendoMultiColumnComboBox").dataSource.read();
    });

    $("#btnAceptarSimu").click(function () {
        if (ValidNuevoSim.validate()) { fn_GenNuevaSim(data.IdOrdenTrabajo, kdoNumericGetValue($("#TxtNuevaCantidadPiezas")), kdoNumericGetValue($("#TxtNoMontaje")), kdoNumericGetValue($("#txtPersonalExtra")), kdoNumericGetValue($("#txtCombos")), kdoNumericGetValue($("#txtVeloMaquina")), $("#chkUsarTermofijado").is(':checked') ? "1" : "0");} 
    });

});

let fn_hbbtnSimu = function () {
    if (Number(KdoCmbGetValue($("#CmbIdServicio"))) === 0) {
        $("#btnSimulacion").data("kendoButton").enable(false);
        //$("#btnRecalcular").data("kendoButton").enable(false);
    } else {
        $("#btnSimulacion").data("kendoButton").enable(fn_SNProcesar(true));
        //$("#btnRecalcular").data("kendoButton").enable(fn_SNProcesar(true));
    }
};
let Fn_ConsultarSimu = function (IdServicio, IdCliente) {
    kendo.ui.progress($("#splitter"), true);
    VIdSer = Number(IdServicio);
    VIdCliente = Number(IdCliente);
    //leer grid
    $("#gridSimulacion").data("kendoGrid").dataSource.data([]);
    $("#gridSimulacion").data("kendoGrid").dataSource.read().then(function () { fn_hbbtnSimu(); });
};
var fPermisos = function (datos) {
    Permisos = datos;
};
let fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
};
let fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
};
let fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
};
let fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};
let fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
};

$.fn.extend({
    OrdenesTrabajos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                //minLength: 3,
                height: 400,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosRequerimientos/" + (KdoCmbGetValue($("#CmbIdServicio")) === null ? 0 : KdoCmbGetValue($("#CmbIdServicio"))) + "/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                    //schema: {
                    //    model: {
                    //        fields: {
                    //            NoDocumento: { type: "String" },
                    //            NoDocReq: { type: "string" },
                    //            Nombre: { type: "string" },
                    //            NumeroDiseno: { type: "string" },
                    //            EstiloDiseno: { type: "string" },
                    //            Tecnicas: { type: "string" },
                    //            Tallas: { type: "string" },
                    //            FechaFinalMuestra: { type: "date" },
                    //            FechaFinal: { type: "date" }
                    //        }
                    //    }
                    //}
                },
                columns: [
                    //{ field: "IdOrdenTrabajo", title: "ID. Orden Trabajo", width: 200 },
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "NoDocReq", title: "Requerimiento", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 },
                    { field: "Tecnicas", title: "Tecnicas", width: 200 },
                    { field: "Tallas", title: "Tallas", width: 200 },
                    { field: "FechaFinalMuestra", title: "Final Des. Muestra", template: '#:kendo.toString(kendo.parseDate(data.FechaFinalMuestra), "dd/MM/yyyy")#'  ,width: 125 },
                    { field: "FechaFinal", title: "Fecha Fin OT", template: '#:kendo.toString(kendo.parseDate(data.FechaFinalMuestra), "dd/MM/yyyy HH:mm:ss")#',  width: 200}
                
                ]
            });
        });
    }
});

let fn_GenNuevaSim = function (vIdOrdenTrabajo, vpiezas, vmontajes, vpersonalExtra, vcombos, vvelocidadMaquina, vusarTermofijado) {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestras/GenerarSimulacionOT/" + vIdOrdenTrabajo.toString() + "/" + vpiezas.toString() + "/" + vmontajes.toString() + "/" + vpersonalExtra.toString() + "/" + vcombos.toString() + "/" + vvelocidadMaquina.toString() + "/" + vusarTermofijado.toString(),
        type: "Post",
        dataType: "json",
        data: JSON.stringify({ IdAnalisisDiseno: null }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#gridSimulacion").data("kendoGrid").dataSource.read();
            $("#MbtnSimu").data("kendoDialog").close();
            kendo.ui.progress($(".k-dialog"), false);
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($(".k-dialog"), false);
            ErrorMsg(data);
        }
    });
};

let fn_closeGS = function () {
    $("#CmbNoOT").data("kendoMultiColumnComboBox").text("");
    $("#CmbNoOT").data("kendoMultiColumnComboBox").trigger("change");
};