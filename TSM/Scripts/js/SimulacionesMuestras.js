
let UrlServ = TSM_Web_APi + "Servicios";
let UrlClie = TSM_Web_APi + "Clientes";
let vIdModulo = 2;
var Permisos;
let VIdSer =0;
let VIdCliente = 0;
let VIdOrdenTra = 0;
let vIdPrograma = 0;
let vNoFM = "";
let data = null;
let Mul1;
let Mul2;
let Mul3;
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

    $("#MbtnSimuRecalcular").kendoDialog({
        height: "auto",
        width: "30%",
        title: "Recalcular Simulación por No. OT",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900,
        close: fn_closeGSRecal
    });

    KdoButton($("#btnRecalcular"), "gears", "Recalcular simulación");
    KdoButton($("#btnSimulacion"), "gear", "Nueva simulación");
    KdoButton($("#btnAceptarSimu"), "check", "Nueva simulación");
    KdoButton($("#btnAceptarSimuRecal"), "check", "Recalcular Simulación");
    $("#btnSimulacion").data("kendoButton").enable(false);
    $("#btnRecalcular").data("kendoButton").enable(false);
   
    // configurar clientes y servicios
    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    KdoCmbSetValue($("#CmbIdServicio"), sessionStorage.getItem("Simue_CmbIdServicio") === null ? "" : sessionStorage.getItem("Simue_CmbIdServicio")); 

    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("Simue_CmbIdCliente") === null ? "" : sessionStorage.getItem("Simue_CmbIdCliente"));

    Kendo_MultiSelect($("#CmbTallas"), TSM_Web_APi + "CategoriaTallas", "Nombre", "IdCategoriaTalla", "Seleccione ...");
    Kendo_MultiSelect($("#CmbTallasRecalcular"), TSM_Web_APi + "CategoriaTallas", "Nombre", "IdCategoriaTalla", "Seleccione ...");
   
    $("#CmbTallasRecalcular").data("kendoMultiSelect").value("");
    $("#CmbTallasRecalcular").data("kendoMultiSelect").trigger("change");

    $("#CmbTallas").data("kendoMultiSelect").value("");
    $("#CmbTallas").data("kendoMultiSelect").trigger("change");

    // transformar div en multicolumn
    $("#cmbNoFM").ControlSelecionFMCatalogo();
    if (sessionStorage.getItem("Simue_cmbNoFM") !== null && sessionStorage.getItem("Simue_cmbNoFM") !== "") {
        Mul2 = $("#cmbNoFM").data("kendoMultiColumnComboBox");
        Mul2.search(sessionStorage.getItem("Simue_NoReferencia"));
        Mul2.text(sessionStorage.getItem("Simue_NoReferencia") === null ? "" : sessionStorage.getItem("Simue_NoReferencia"));
        Mul2.trigger("change");
        Mul2.close();
    }

    $("#CmbNoOT").OrdenesTrabajos();

    $("#CmbNoOrdenTrabajo").OrdenesTrabajosSimulacion();
    if (sessionStorage.getItem("Simue_CmbNoOrdenTrabajo") !== null && sessionStorage.getItem("Simue_CmbNoOrdenTrabajo") !== "") {
        Mul1 = $("#CmbNoOrdenTrabajo").data("kendoMultiColumnComboBox");
        Mul1.search(sessionStorage.getItem("Simue_NoDocumento"));
        Mul1.text(sessionStorage.getItem("Simue_NoDocumento") === null ? "" : sessionStorage.getItem("Simue_NoDocumento"));
        Mul1.trigger("change");
        Mul1.close();
    }

    //KdoMultiColumnCmbSetValue($("#CmbNoOrdenTrabajo"), sessionStorage.getItem("Simue_CmbNoOrdenTrabajo") === null ? "" : sessionStorage.getItem("Simue_CmbNoOrdenTrabajo"));
    //KdoMultiColumnCmbSetValue($("#cmbNoFM"), sessionStorage.getItem("Simue_cmbNoFM") === null ? "" : sessionStorage.getItem("Simue_cmbNoFM"));

    $("#CmbPrograma").ControlSelecionPrograma();
    //KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("Simue_CmbPrograma") === null ? "" : sessionStorage.getItem("Simue_CmbPrograma")); 
    if (sessionStorage.getItem("Simue_CmbPrograma") !== null && sessionStorage.getItem("Simue_CmbPrograma") !== "") {
        Mul3 = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        Mul3.search(sessionStorage.getItem("Simue_NombrePrograma"));
        Mul3.text(sessionStorage.getItem("Simue_NombrePrograma") === null ? "" : sessionStorage.getItem("Simue_NombrePrograma"));
        Mul3.trigger("change");
        Mul3.close();

    }


    $("#CmbNoOT").data("kendoMultiColumnComboBox").bind("change", function (e) {
        if (this.dataItem() !== undefined) {
            data = this.dataItem();
            fn_getDimensionesTallas(data.IdRequerimiento);
        } else {
            fn_getDimensionesTallas(0);
        }
      
    });

    //#region campos para generar simulacion
    $("#TxtNuevaCantidadPiezas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    
    $("#txtPorcVariacion").kendoNumericTextBox({
        format: "p",
        restrictDecimals: true,
        decimals: 2,
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

    //#region campos para generar simulacion
    $("#NumCantidadTallas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#NumCantidadTallasRecal").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtNuevaCantidadPiezasRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#txtPorcVariacionRecalcular").kendoNumericTextBox({
        format: "p",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });

    $("#TxtNoMontajeRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#txtPersonalExtraRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });

    $("#txtCombosRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 1,
        value: 1
    });

    $("#txtVeloMaquinaRecalcular").kendoNumericTextBox({
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
            },
            PorcMayorIgual0: function (input) {
                if (input.is("[name='txtPorcVariacion']")) {
                    return input.val() >= 0;
                }
                return true;
            },
            Talla: function (input) {
                if (input.is("[name='CmbTallas']")) {
                    return $("#CmbTallas").data("kendoMultiSelect").value().length > 0;
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
            Talla: "requerido",
            SOT:"Requerido"
        }
    }).data("kendoValidator");

    let ValidNuevoSimRecal = $("#FrmRecalcularSim").kendoValidator({
        rules: {
            TallaRec: function (input) {
                if (input.is("[name='CmbTallasRecalcular']")) {
                    return $("#CmbTallasRecalcular").data("kendoMultiSelect").value().length > 0;
                }
                return true;
            },
            Mayor0: function (input) {
                if (input.is("[name='TxtNuevaCantidadPiezasRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            NoMontajeMayor0: function (input) {
                if (input.is("[name='TxtNoMontajeRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            PersonalMayorIgual0: function (input) {
                if (input.is("[name='txtPersonalExtraRecalcular']")) {
                    return input.val() >= 0;
                }
                return true;
            },
            CombosMayorIgual0: function (input) {
                if (input.is("[name='txtCombosRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            VeloMayorIgual0: function (input) {
                if (input.is("[name='txtVeloMaquinaRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            PorcMayorIgual0: function (input) {
                if (input.is("[name='txtPorcVariacionRecalcular']")) {
                    return input.val() >= 0;
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
            PorcMayorIgual0: "requerido",
            TallaRec: "requerido"
        }
    }).data("kendoValidator");

    KdoNumerictextboxEnable($("#NumCantidadTallas"), false);
    KdoNumerictextboxEnable($("#NumCantidadTallasRecal"), false);
    //#endregion 

    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION
    let DsRD = new kendo.data.DataSource({
      
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SimulacionesMuestras/GetSimulacionesMuestrasOT/"; },
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                } else if(type === "read") {
                    return kendo.stringify({
                        'idServicio': VIdSer,
                        'idCliente': VIdCliente,
                        'idOrdentrabajo': VIdOrdenTra,
                        'idPrograma': vIdPrograma,
                        'IdModulo': vIdModulo,
                        'noFM': vNoFM
                        });
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
                    FechaFinalMuestra: { type: "date"},
                    CantidadCombos: { type: "number" },
                    UsarTermofijado: { type: "boolean" },
                    Montajes: { type: "number" },
                    PersonalExtra: { type: "number" },
                    CantidadPiezas: { type: "number" },
                    PorcVariacion: { type: "number" },
                    ProductividadHora: { type: "number" },
                    NoReferencia: { type: "string" }
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
            {
                field: "NoDocSimulacion", title: "No.Simulación", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NoReferencia", title: "No FM", width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NoDocOT", title: "No OT", width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Fecha", title: "Fecha simulación", format: "{0: dd/MM/yyyy}", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdSimulacion", title: "Cod. simulación", width: 200, hidden: true},
            { field: "IdRequerimiento", title: "Código requerimiento", hidden: true, width: 200},
            { field: "IdOrdenTrabajo", title: "Cod. Orden Trabajo", hidden: true, width: 200},
            {
                field: "NoDocRequerimiento", title: "Requerimiento", width: 100,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "Fecha", title: "Fecha del simulación", format: "{0: dd/MM/yyyy}", hidden: true },
            {
                field: "NombreArte", title: "Nombre del diseño", width: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "EstiloDiseno", title: "Estilo diseno", width: 150, filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NumeroDiseno", title: "Número diseno", width: 200, filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "IdPrograma", title: "Código Programa", hidden: true,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "PorcVariacion", title: "Porc. Variación", format: "{0:P2}", width: 100,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "Estado", title: "Estado", hidden: true },
            {
                field: "NombreEstado", title: "Estado simulación", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NoPrograma", title: "No Programa", width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NombreProg", title: "Nombre del programa", width: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta cliente", hidden: true },
            {
                field: "NombreClie", title: "Nombre del cliente", width: 200,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "IdUbicacion", title: "Código ubicación", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", hidden: true },
            { field: "UbicacionVertical", title: "Ubicacion vertical", hidden: true },
            { field: "TallaPrincipal", title: "Talla principal", hidden: true },
            {
                field: "Tecnicas", title: "Técnicas", width: 200,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Tallas", title: "Tallas", width: 200,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "FechaFinalMuestra", title: "Desarrollo Muestra", width: 150, format: "{0: dd/MM/yyyy}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "FechaFinal", title: "Finalización OT", width: 150, format: "{0: dd/MM/yyyy HH:mm:ss}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "CantidadCombos", title: "Cantidad de piezas", hidden: true },
            { field: "UsarTermofijado", title: "Cantidad de piezas", hidden: true },
            { field: "Montajes", title: "Cantidad de piezas", hidden: true },
            { field: "PersonalExtra", title: "Cantidad de piezas", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true }
        ]
    });

    SetGrid($("#gridSimulacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true,0,true,"row");
    SetGrid_CRUD_ToolbarTop($("#gridSimulacion").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimulacion").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridSimulacion").data("kendoGrid"), DsRD,50);

    $("#gridSimulacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSimulacion"), selectedRows);

        fn_getEstado($("#gridSimulacion").data("kendoGrid")) !== "CONFIRMADO" ? $("#btnRecalcular").data("kendoButton").enable(true) : $("#btnRecalcular").data("kendoButton").enable(false);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridSimulacion"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridSimulacion"), $(window).height() - "371");
    //#endregion FIN GRID PRINCIPAL

    //#region seleccion de servicio y cliente

    $("#CmbIdServicio").data("kendoComboBox").bind("select", function (e) {
       
        if (e.item) {
            Fn_ConsultarSimu(this.dataItem(e.item.index()).IdServicio.toString(), Kendo_CmbGetvalue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbIdServicio",this.dataItem(e.item.index()).IdServicio);
        } else {
            Fn_ConsultarSimu(0, Kendo_CmbGetvalue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbIdServicio","");
        }

    });

    $("#CmbIdServicio").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_ConsultarSimu(0, Kendo_CmbGetvalue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbIdServicio", "");
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), this.dataItem(e.item.index()).IdCliente.toString(), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbIdCliente", this.dataItem(e.item.index()).IdCliente);
        } else {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), 0, KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbIdCliente", "");
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), 0, KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbIdCliente", "");
        }

    });



    $("#CmbNoOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbNoOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), Kendo_CmbGetvalue($("#CmbIdCliente")), 0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbNoOrdenTrabajo", "");
        } else {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), Kendo_CmbGetvalue($("#CmbIdCliente")), data.IdOrdenTrabajo, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("Simue_CmbNoOrdenTrabajo", data.IdOrdenTrabajo);
            sessionStorage.setItem("Simue_NoDocumento", data.NoDocumento);
        }

    });

    $("#cmbNoFM").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#cmbNoFM").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            Fn_ConsultarSimu(
                Kendo_CmbGetvalue($("#CmbIdServicio")),
                Kendo_CmbGetvalue($("#CmbIdCliente")),
                KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                ""
            );
            sessionStorage.setItem("Simue_cmbNoFM", "");
            sessionStorage.setItem("Simue_NoReferencia","");
        } else {

            Fn_ConsultarSimu(
                Kendo_CmbGetvalue($("#CmbIdServicio")),
                Kendo_CmbGetvalue($("#CmbIdCliente")),
                KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                data.NoReferencia
            );

            sessionStorage.setItem("Simue_cmbNoFM", data.NoReferencia);
            sessionStorage.setItem("Simue_NoReferencia", data.NoReferencia);
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), Kendo_CmbGetvalue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), 0);
            sessionStorage.setItem("Simue_CmbPrograma", "");
            sessionStorage.setItem("Simue_NombrePrograma", "");

        } else {

            Fn_ConsultarSimu(Kendo_CmbGetvalue($("#CmbIdServicio")), Kendo_CmbGetvalue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), data.IdPrograma);
            sessionStorage.setItem("Simue_CmbPrograma", data.IdPrograma);
            sessionStorage.setItem("Simue_NombrePrograma", data.Nombre);
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

    $("#btnRecalcular").click(function (event) {
        let g = $("#gridSimulacion").data("kendoGrid");
        fn_getSimulacionesTallas(fn_getIdSimulacion(g));
        kdoNumericSetValue($("#txtCombosRecalcular"), fn_getCantidadCombos(g));
        kdoNumericSetValue($("#TxtNuevaCantidadPiezasRecalcular"), fn_getCantidadPiezas(g));
        kdoNumericSetValue($("#TxtNoMontajeRecalcular"), fn_getMontajes(g));
        kdoNumericSetValue($("#txtPersonalExtraRecalcular"), fn_getPersonalExtra(g));
        kdoNumericSetValue($("#txtVeloMaquinaRecalcular"), fn_getProductividadHora(g));
        kdoNumericSetValue($("#txtPorcVariacionRecalcular"), fn_getPorcVariacion(g) === null ? 0 : fn_getPorcVariacion(g));
        kdoChkSetValue($("#chkUsarTermofijadoRecalcular"), fn_getUsarTermofijado(g));
        $("#MbtnSimuRecalcular").data("kendoDialog").open();
    });

    $("#btnAceptarSimuRecal").click(function () {
        if (ValidNuevoSimRecal.validate()) { fn_RecalSimulacion(); }
    });

    $("#CmbTallas").data("kendoMultiSelect").bind("deselect", function (e) {
        
        var MultiSelect = $("#CmbTallas").data('kendoMultiSelect');
        var count = MultiSelect.value().length;
        kdoNumericSetValue($("#NumCantidadTallas"), count - 1);
    });

    $("#CmbTallas").data("kendoMultiSelect").bind("select", function (e) {
        var MultiSelect = $("#CmbTallas").data('kendoMultiSelect');
        var count = MultiSelect.value().length;
        kdoNumericSetValue($("#NumCantidadTallas"), count + 1);
     
    });

    $("#CmbTallasRecalcular").data("kendoMultiSelect").bind("deselect", function (e) {

        var MultiSelect = $("#CmbTallasRecalcular").data('kendoMultiSelect');
        var count = MultiSelect.value().length;
        kdoNumericSetValue($("#NumCantidadTallasRecal"), count - 1);
    });

    $("#CmbTallasRecalcular").data("kendoMultiSelect").bind("select", function (e) {
        var MultiSelect = $("#CmbTallasRecalcular").data('kendoMultiSelect');
        var count = MultiSelect.value().length;
        kdoNumericSetValue($("#NumCantidadTallasRecal"), count + 1);

    });

    //Coloca el filtro de cliente guardado en la sesion
    if (sessionStorage.getItem("Simue_CmbIdServicio") !== null || sessionStorage.getItem("Simue_CmbIdCliente") !== null ||
        sessionStorage.getItem("Simue_CmbNoOrdenTrabajo") !== null || sessionStorage.getItem("Simue_CmbPrograma") !== null) {
        Fn_ConsultarSimu(sessionStorage.getItem("Simue_CmbIdServicio"),
                          sessionStorage.getItem("Simue_CmbIdCliente"),
                          sessionStorage.getItem("Simue_CmbNoOrdenTrabajo"),
                          sessionStorage.getItem("Simue_CmbPrograma") );

    }
});

let fn_hbbtnSimu = function () {
    if (Number(KdoCmbGetValue($("#CmbIdServicio"))) === 0) {
        $("#btnSimulacion").data("kendoButton").enable(false);
        $("#btnRecalcular").data("kendoButton").enable(false);
    } else {
        $("#btnSimulacion").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnRecalcular").data("kendoButton").enable(fn_SNProcesar(true));
    }
};
let Fn_ConsultarSimu = function (IdServicio, IdCliente,IdOrdenTra, IdPrograma, NoFM = "") {
    kendo.ui.progress($("#splitter"), true);
    VIdSer = Number(IdServicio);
    VIdCliente = Number(IdCliente);
    VIdOrdenTra = Number(IdOrdenTra);
    vIdPrograma = Number(IdPrograma);
    vNoFM = NoFM;

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

let fn_RecalSimulacion = function () {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestras/Recalcular/" + fn_getIdOrdenTrabajo($("#gridSimulacion").data("kendoGrid")) + "/" + fn_getIdSimulacion($("#gridSimulacion").data("kendoGrid")) + "/" + kdoNumericGetValue($("#TxtNuevaCantidadPiezasRecalcular")) + "/" + kdoNumericGetValue($("#TxtNoMontajeRecalcular")) + "/" + kdoNumericGetValue($("#txtPersonalExtraRecalcular")) + "/" + kdoNumericGetValue($("#txtCombosRecalcular")) + "/" + kdoNumericGetValue($("#txtVeloMaquinaRecalcular")) + "/" + ($("#chkUsarTermofijadoRecalcular").is(':checked') ? "1" : "0"),
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            PorcVariacion: kdoNumericGetValue($("#txtPorcVariacionRecalcular")),
            Tallas: $("#CmbTallasRecalcular").data("kendoMultiSelect").value().toString()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#gridSimulacion").data("kendoGrid").dataSource.read();
            $("#MbtnSimuRecalcular").data("kendoDialog").close();
            kendo.ui.progress($(".k-dialog"), false);
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($(".k-dialog"), false);
            ErrorMsg(data);
        }
    });
};

let fn_GenNuevaSim = function (vIdOrdenTrabajo, vpiezas, vmontajes, vpersonalExtra, vcombos, vvelocidadMaquina, vusarTermofijado) {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestras/GenerarSimulacionOT/" + vIdOrdenTrabajo.toString() + "/" + vpiezas.toString() + "/" + vmontajes.toString() + "/" + vpersonalExtra.toString() + "/" + vcombos.toString() + "/" + vvelocidadMaquina.toString() + "/" + vusarTermofijado.toString(),
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            PorcVariacion: kdoNumericGetValue($("#txtPorcVariacion")),
            Tallas: $("#CmbTallas").data("kendoMultiSelect").value().toString()
        }),
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
                placeholder: "Selección de Ordenes de trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosRequerimientos/" + (KdoCmbGetValue($("#CmbIdServicio")) === null ? 0 : KdoCmbGetValue($("#CmbIdServicio"))) + "/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
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

$.fn.extend({
    OrdenesTrabajosSimulacion: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                clearButton:false,
                height: 400,
                placeholder:"Seleccione orden de trabajo...",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosRequerimientos/" + (KdoCmbGetValue($("#CmbIdServicio")) === null ? 0 : KdoCmbGetValue($("#CmbIdServicio"))) + "/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    //{ field: "IdOrdenTrabajo", title: "ID. Orden Trabajo", width: 200 },
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "NoDocReq", title: "Requerimiento", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 },
                    { field: "Tecnicas", title: "Tecnicas", width: 200 },
                    { field: "Tallas", title: "Tallas", width: 200 }

                ]
            });
        });
    }
});
let fn_closeGS = function () {
    $("#CmbNoOT").data("kendoMultiColumnComboBox").text("");
    $("#CmbNoOT").data("kendoMultiColumnComboBox").trigger("change");
    kdoNumericSetValue($("#NumCantidadTallas"), 0);
    kdoNumericSetValue($("#TxtNuevaCantidadPiezas"), 0);
    kdoNumericSetValue($("#txtPorcVariacion"), 0);
    kdoNumericSetValue($("#TxtNoMontaje"), 0);
    kdoNumericSetValue($("#txtCombos"), 1);
    kdoNumericSetValue($("#txtVeloMaquina"), 1);
    kdoNumericSetValue($("#txtPersonalExtra"), 0);
};

let fn_closeGSRecal = function () {
    $("#CmbTallasRecalcular").data("kendoMultiSelect").value("");
    $("#CmbTallasRecalcular").data("kendoMultiSelect").trigger("change");
    kdoNumericSetValue($("#NumCantidadTallasRecal"), 0);
    kdoNumericSetValue($("#TxtNuevaCantidadPiezasRecalcular"), 0);
    kdoNumericSetValue($("#txtPorcVariacionRecalcular"), 0);
    kdoNumericSetValue($("#TxtNoMontajeRecalcular"), 0);
    kdoNumericSetValue($("#txtCombosRecalcular"), 1);
    kdoNumericSetValue($("#txtVeloMaquinaRecalcular"), 1);
    kdoNumericSetValue($("#txtPersonalExtraRecalcular"), 0);
};

var fn_getIdOrdenTrabajo = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdOrdenTrabajo;

};
var fn_getIdSimulacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSimulacion;

};
var fn_getEstado = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;

};
var fn_getIdRequerimiento = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;

};
let fn_getCantidadCombos = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.CantidadCombos;
};
let fn_getUsarTermofijado = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.UsarTermofijado;
};
let fn_getMontajes = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Montajes;
};
let fn_getPersonalExtra = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.PersonalExtra;
};
let fn_getCantidadPiezas = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.CantidadPiezas;
};
let fn_getPorcVariacion = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.PorcVariacion;
};
let fn_getProductividadHora = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.ProductividadHora;
};
let fn_getDimensionesTallas = function (vidreq) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "Dimensiones/GetbyRequerimiento/" + vidreq,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdCategoriaTalla + ",";
            });

            $("#CmbTallas").data("kendoMultiSelect").value(lista.split(","));
            kdoNumericSetValue($("#NumCantidadTallas"), respuesta.length);
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_getSimulacionesTallas = function (vidSim) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestrasTallas/GetbyIdSimulacion/" + vidSim,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdCategoriaTalla + ",";
            });

            $("#CmbTallasRecalcular").data("kendoMultiSelect").value(lista.split(","));
            kdoNumericSetValue($("#NumCantidadTallasRecal"), respuesta.length);
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};

