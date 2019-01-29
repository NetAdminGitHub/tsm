var Permisos;

$(document).ready(function () {
    //#region Inicializacion de variables
    var VIdSer = 0;
    var VIdCliente = 0;
    var VIDSim = 0;

    $("#btnRecalcular").kendoButton({ icon: "gears" });
    $("#btnSimulacion").kendoButton({ icon: "gears" });
    $("#btnCerrar").kendoButton({ icon: "close-circle" });
    $("#btnAceptar").kendoButton({ icon: "check-circle" });
    $("#btnCambioEstado").kendoButton({ icon: "check" });
    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlApiServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlApiClient, "Nombre", "IdCliente", "Selecione un Cliente...");

    //Programacion del splitter
    $("#splitter").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: true, size: "50%", max: "95%", min: "20%", resizable: true },
            { collapsible: false, scrollable: true, size: "100%" }
        ]

    });

    $(window).resize(function () {
        resizeSplitter($(window).height())
    });

    resizeSplitter = function (height) {

        var splElement = $("#splitter"),
            splObject = splElement.data("kendoSplitter");
        splElement.css({ height: height - "230" + "px"});
        splObject.resize();

    };

    resizeSplitter($(window).height());


    $("#TabSimulacion").kendoTabStrip({
        tabPosition: "left",
        animation: { open: { effects: "fadeIn" } }
    });

    //var splitterElement = $("#splitter"),
    //    splitterObject = splitterElement.data("kendoSplitter");
    //splitterElement.css({ height: "760px" });
    //splitterObject.resize();

    var ValidNuevoSim = $("#FrmNuevoSim").kendoValidator({
        rules: {
            Mayor0: function (input) {
                if (input.is("[name='TxtNuevaCantidadPiezas']")) {
                    return input.val() > 0;
                }
                return true;
            },
            NoMontajeMayor0: function (input) {
                if (input.is("[name='TxtNoMontaje']")) {
                    return input.val() > 0;
                }
                return true;
            },
            PersonalMayorIgual0: function (input) {
                if (input.is("[name='txtPersonalExtra']")) {
                    return input.val() >= 0;
                }
                return true;
            },
            CombosMayorIgual0: function (input) {
                if (input.is("[name='txtCombos']")) {
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
            Mayor0: "La cantidad de piezas no puede ser 0.",
            NoMontajeMayor0: "El Montaje es requerido.",
            PersonalMayorIgual0: "La cantidad de personal extra no puede ser negativo.",
            CombosMayorIgual0: "La cantidad de combos no puede ser cero.",
            VeloMayorIgual0: "La velocidad de la maquina no puede ser cero",
            required:"requerido"
        }
    }).data("kendoValidator");

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
    $("#TxtCostoMP").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoMOD").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoPrimo").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoFabril").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoProduccion").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoOperacion").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoMPUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoMODUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoPrimoUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoFabrilUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoProduccionUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoOperacionUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#txtCostoTermofijado").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#txtCostoTermofijadoUnitario").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoTotal").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals:4,
        value: 0
    });
    $("#TxtPorcUtilidadConsiderada").kendoNumericTextBox({
        format: "P2",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtUtilidadDolares").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioCliente").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioTS").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioVenta").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCantidadTecnicas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtMontajes").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtCantidadPiezas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#txtNoPersonalExtra").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtCantidadColores").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtCantidadCombos").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtCantidadTallas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtVelocidadMaquina").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });

    $("#TxtFecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#TxtFecha").data("kendoDatePicker").value(Fhoy());
    $("#txtTiempoProyecto").kendoNumericTextBox({
        format: "n4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });

    DesHabilitarCamposSim();
    $("#btnSimulacion").data("kendoButton").enable(false);
    $("#btnRecalcular").data("kendoButton").enable(false);
    $("#btnCambioEstado").data("kendoButton").enable(false);
    //#endregion  fin Inicializacion de variABLES

    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION
    var DsRD = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlApiSimu + "/GetSimulacionesAnalisis/" + VIdSer + "/" + VIdCliente; },
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
                    IdAnalisisDiseno: { type: "number" },
                    IdRequerimiento: { type: "number" },
                    IdCliente: { type: "number" },
                    NoCuenta: { type: "string" },
                    IdPrograma: { type: "number" },
                    NoDocumento: { type: "string" },
                    IdServicio: { type: "number" },
                    Nombre: { type: "string" },
                    IdUbicacion: { type: "number" },
                    Nombre1: { type: "string" },
                    NoDocumento1: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    UbicacionVertical: { type: "string" },
                    CantidadPiezas: { type: "number" },
                    TallaPrincipal: { type: "string" },
                    Estado: { type: "string" },
                    Fecha: { type: "date" },
                    InstruccionesEspeciales: { type: "string" },
                    Nombre2: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    Fecha1: { type: "date" },
                    Estado1: { type: "string" },
                    IdArte: { type: "number" },
                    CostoMP: { type: "number" },
                    CostoMOD: { type: "number" },
                    CostoPrimo: { type: "number" },
                    CostoFabril: { type: "number" },
                    CostoProduccion: { type: "number" },
                    CostoOperacion: { type: "number" },
                    CostoTotal: { type: "number" },
                    PorcUtilidadConsiderada: { type: "number" },
                    UtilidadDolares: { type: "number" },
                    PrecioCliente: { type: "number" },
                    PrecioTS: { type: "number" },
                    CantidadTecnicas: { type: "number" },
                    NoDocumento2: { type: "string" },
                    Fecha2: { type: "date" },
                    CostoUnitario: { type: "number" },
                    ProductividadHora: { type: "number" },
                    PrecioVenta: { type: "number" },
                    Nombre3: { type: "string" },
                    Nombre4: { type: "string" },
                    DisenoFullColor: { type: "boolean" },
                    TiempoProyecto: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Nombre5: { type: "string" },
                    NoDocumento3: { type: "string" },
                    Tecnicas: { type: "string" }
                }
            }
        }
    });

    $("#gridSimulacion").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento2", title: "No.Simulación" },
            { field: "Fecha2", title: "Fecha simulación", format: "{0: dd/MM/yyyy}"},
            { field: "IdSimulacion", title: "Cod. simulación", hidden: true },
            { field: "IdRequerimiento", title: "Código requerimiento", hidden: true },
            { field: "NoDocumento1", title: "No Requerimiento" },
            {field: "IdAnalisisDiseno", title: "Cod. análisis diseño", hidden:true },
            {
                field: "NoDocumento3", title: "No Analisis Diseño", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerAnalisis(" + data["IdAnalisisDiseno"] + ")' >" + data["NoDocumento3"] + "</button>";
                }

            },
            { field: "Fecha1", title: "Fecha del análisis", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "Fecha", title: "Fecha del requeimiento", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "Nombre2", title: "Nombre del diseño" },
            { field: "EstiloDiseno", title: "Estilo diseno" },
            { field: "NumeroDiseno", title: "Número diseno" },
            { field: "IdPrograma", title: "Código Programa", hidden: true },
            { field: "NoDocumento", title: "No Programa" },
            { field: "Nombre3", title: "Nombre del programa" },
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta cliente" },
            { field: "Nombre4", title: "Nombre del cliente" },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "Nombre", title: "Servicio", hidden: true },
            { field: "IdUbicacion", title: "Código ubicación", hidden: true },
            { field: "Nombre1", title: "Ubicación", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", hidden: true },
            { field: "UbicacionVertical", title: "Ubicacion vertical", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "TallaPrincipal", title: "Talla principal", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Tecnicas", title: "Técnicas" },
            {field: "Nombre5", title: "Estado simulación", template: function (data) {
                return "<button class='btn btn-link nav-link' onclick='Fn_VerEstados(" + data["IdRequerimiento"] + ")' >" + data["Nombre5"] + "</button>";
               }
            },
            { field: "Estado1", title: "Estado del Analisis", hidden: true },
            { field: "InstruccionesEspeciales", title: "Instrucciones especiales", hidden: true },
            { field: "CostoMP", title: "Costo de Materia Prima Total", format: "{0:c2}",hidden: true  },
            { field: "CostoMOD", title: "Costo de Mano de Obra Directa", format: "{0:c2}",hidden: true  },
            { field: "CostoPrimo", title: "Costo Primo", format: "{0:c2}",hidden: true },
            { field: "CostoFabril", title: "Costo Fabril Total", format: "{0:c2}",hidden: true },
            { field: "CostoProduccion", title: "Costo Producción", format: "{0:c2}", hidden: true  },
            { field: "CostoOperacion", title: "Costo Operación", format: "{0:c2}",hidden: true  },
            { field: "CostoTotal", title: "Costo Total", format: "{0:c2}", hidden: true },
            { field: "PorcUtilidadConsiderada", title: "% Utilidad Considerada", format: "{0:p2}", hidden: true },
            { field: "UtilidadDolares", title: "Utilidad Dolares", format: "{0:c4}", hidden: true },
            { field: "PrecioCliente", title: "Precio Cliente", format: "{0:c4}", hidden: true },
            { field: "PrecioTS", title: "Precio Techno Screen", format: "{0:c4}",hidden: true },
            { field: "CantidadTecnicas", title: "Cantidad Técnicas", hidden: true },
            { field: "CostoUnitario", title: "Costo Unitario", format: "{0:c4}",hidden: true },
            { field: "ProductividadHora", title: "Productividad Hora", hidden: true },
            { field: "PrecioVenta", title: "Precio Venta", format: "{0:c4}", hidden: true },
            { field: "DisenoFullColor", title: "Diseno FullColor", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "DisenoFullColor"); }, hidden: true },
            { field: "TiempoProyecto", title: "Tiempo Proyecto", format: "{0:n}", hidden: true },
            { field: "IdBase", title: "IdBase", hidden: true }
        ]
    });

    SetGrid($("#gridSimulacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridSimulacion").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimulacion").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridSimulacion").data("kendoGrid"), DsRD);

    function Fn_Consultar(IdServicio, IdCliente) {
        VIdSer = IdServicio;
        VIdCliente = IdCliente;
        VIdCliente === 0 ? $("#gridSimulacion").data("kendoGrid").showColumn("Nombre4") : $("#gridSimulacion").data("kendoGrid").hideColumn("Nombre4");
        // limpiar etapas del proceso
        CargarEtapasProceso(0);

        $("#gridSimulacion").data("kendoGrid").dataSource.data([]);
        $("#gridSimulacion").data("kendoGrid").dataSource.read();
        if ($("#gridSimulacion").data("kendoGrid").dataSource.total() === 0) {
            $("#gridRentabilidad").data("kendoGrid").dataSource.data([]);
            $("#gridSimuConsumo").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridSimuConsumo"), false, false, false);
            Grid_HabilitaToolbar($("#gridRentabilidad"), false, false, false);
            LimpiarCamposSim();
            $("#btnSimulacion").data("kendoButton").enable(false);
            $("#btnRecalcular").data("kendoButton").enable(false);
            $("#btnCambioEstado").data("kendoButton").enable(false);
        } else {
            $("#btnSimulacion").data("kendoButton").enable(fn_SNProcesar(true));
            $("#btnRecalcular").data("kendoButton").enable(fn_SNProcesar(true));
            $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
        }
    }

    $("#CmbIdServicio").data("kendoComboBox").bind("select", function (e) {
        event.preventDefault();
        if (e.item) {
            if (this.dataItem(e.item.index()).IdServicio == 1)
                $("#gridSimuConsumo").data("kendoGrid").showColumn("Nombre1");
            else
                $("#gridSimuConsumo").data("kendoGrid").hideColumn("Nombre1");

            Fn_Consultar(this.dataItem(e.item.index()).IdServicio.toString(), Kendo_CmbGetvalue($("#CmbIdCliente")));
        } else {
            Fn_Consultar(0, Kendo_CmbGetvalue($("#CmbIdCliente")));
        }

    });

    $("#CmbIdServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            Fn_Consultar(0, Kendo_CmbGetvalue($("#CmbIdCliente")));
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        event.preventDefault();
        if (e.item) {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdServicio")), this.dataItem(e.item.index()).IdCliente.toString());
        } else {
            Fn_Consultar(0, 0);
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdServicio")), 0);
        }
    });

    var selectedRows = [];
    $("#gridSimulacion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSimulacion"), selectedRows);
    });

    $("#gridSimulacion").data("kendoGrid").bind("change", function (e) {
        getSimulacionGrid($("#gridSimulacion").data("kendoGrid"));
        VIDSim = getIdSimulacion($("#gridSimulacion").data("kendoGrid"));
        $("#gridRentabilidad").data("kendoGrid").dataSource.data([]);
        $("#gridRentabilidad").data("kendoGrid").dataSource.read();
        $("#gridSimuConsumo").data("kendoGrid").dataSource.data([]);
        $("#gridSimuConsumo").data("kendoGrid").dataSource.read();
        Grid_HabilitaToolbar($("#gridSimuConsumo"), Permisos.SNAgregar ? true : false, Permisos.SNEditar ? true : false, Permisos.SNBorrar ? true : false);
        Grid_HabilitaToolbar($("#gridRentabilidad"), Permisos.SNAgregar ? true : false, Permisos.SNEditar ? true : false, Permisos.SNBorrar ? true : false);
        $("#btnSimulacion").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnRecalcular").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnCambioEstado").data("kendoButton").enable(fn_SNProcesar(true));
        Grid_SelectRow($("#gridSimulacion"), selectedRows);        
    });
    //#endregion FIN GRID PRINCIPAL

    //#region CRUD para el grid Rentabilidad
    var DsRent = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSimRen + "/GetSimulacionesRentabilidadBySimulaciones/" + VIDSim; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSimRen + "/" + datos.IdSimulacionRentabilidad; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlSimRen + "/" + datos.IdSimulacionRentabilidad; },
                type: "DELETE"
            },
            create: {
                url: UrlSimRen,
                type: "POST",
                contentType: "application/json; charset=utf-8"

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },

        requestEnd: function (e) {
            if (e.type === "update") {               
                var Rentabilidad = 0;
                var Utilidad = 0;
                var PrecioCliente = 0;
                var PrecioTS = 0;
                var PrecioVenta = 0;

                if (e.response[0].Aprobado) {
                    PrecioVenta = e.response[0].PrecioVenta;
                    Rentabilidad = e.response[0].Rentabilidad;
                    PrecioTS = e.response[0].PrecioTS;
                    PrecioCliente = e.response[0].PrecioCliente;
                    Utilidad = e.response[0].Utilidad
                } else {
                    PrecioVenta =0;
                    Rentabilidad =0;
                    PrecioTS = 0;
                    PrecioCliente =0;
                    Utilidad =0
                }
                var uid = $("#gridSimulacion").data("kendoGrid").dataSource.get(e.response[0].IdSimulacion).uid;
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PrecioVenta", PrecioVenta);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PorcUtilidadConsiderada",Rentabilidad);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("UtilidadDolares", Utilidad);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PrecioCliente", PrecioCliente);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PrecioTS",PrecioTS);

                $("#TxtPrecioCliente").data("kendoNumericTextBox").value(PrecioCliente)
                $("#TxtPrecioTS").data("kendoNumericTextBox").value(PrecioTS)
                $("#TxtPrecioVenta").data("kendoNumericTextBox").value(PrecioVenta)
                $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value(Rentabilidad)
                $("#TxtUtilidadDolares").data("kendoNumericTextBox").value(Utilidad)
                $(".k-dirty-cell", $("#gridSimulacion")).removeClass("k-dirty-cell");
                $(".k-dirty", $("#gridSimulacion")).remove();
            }
            Grid_requestEnd(e);
          
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSimulacionRentabilidad",
                fields: {
                    IdSimulacionRentabilidad: { type: "number" },
                    IdSimulacion: {
                        type: "number", defaultValue: function (e) { return getIdSimulacion($("#gridSimulacion").data("kendoGrid")); }
                    },
                    IdRentabilidad: { type: "string", defaultValue:null },
                    Descripcion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Descripcion']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='PrecioVenta']")) {
                                    input.attr("data-maxlength-msg", "No puede ser menor al costo");
                                    return $("[name='PrecioVenta']").data("kendoNumericTextBox").value() >0;
                                }

                                return true
                            }
                        }
                    },
                    Rentabilidad: { type: "number" },
                    Utilidad: { type: "number" },
                    PrecioVenta: { type: "number" },
                    Aprobado: { type: "bool" },
                    CU: {
                        type: "number", defaultValue: function (e) { return $("#TxtCostoUnitario").data("kendoNumericTextBox").value();}

                    }

                }
            }
        }
    });

    $("#gridRentabilidad").kendoGrid({
      
        edit: function (e) {
            e.container.find("label[for=IdSimulacionRentabilidad]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSimulacionRentabilidad]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdSimulacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSimulacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdRentabilidad]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdRentabilidad]").parent().next("div .k-edit-field").hide();

            $('[name="Utilidad"]').data("kendoNumericTextBox").enable(false);
            $('[name="CU"]').data("kendoNumericTextBox").enable(false);

            if (e.model.isNew()) {
                e.container.find("label[for=Aprobado]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Aprobado]").parent().next("div .k-edit-field").hide();
                Grid_Focus(e, "Descripcion");

            } else {

                $('[name="CU"]').data("kendoNumericTextBox").value($("#TxtCostoUnitario").data("kendoNumericTextBox").value());

                if (e.model.Aprobado) {
                    $('[name="Rentabilidad"]').data("kendoNumericTextBox").enable(false);
                    $('[name="Descripcion"]').addClass("k-input k-textbox").attr("disabled", "disabled");
                    $('[name="PrecioVenta"]').data("kendoNumericTextBox").enable(false);
                }
                else {
                    if ((e.model.Descripcion.toUpperCase() == "CLIENTE") || (e.model.Descripcion.toUpperCase() == "TECHNO SCREEN")) {
                        $('[name="Descripcion"]').addClass("k-input k-textbox").attr("disabled", "disabled");
                    }

                    Grid_Focus(e, "Descripcion");
                }
            }

            $('[name="Rentabilidad"]').on("change", function (e) {
                var CU = parseFloat($("#TxtCostoUnitario").data("kendoNumericTextBox").value());
                var Utilidad = CU / (1 - parseFloat(this.value)) - CU;
                var PrecioVenta = fn_RoundToUp( (Utilidad + CU),4);
                $('[name="Utilidad"]').data("kendoNumericTextBox").value(Utilidad);
                $('[name="PrecioVenta"]').data("kendoNumericTextBox").value(PrecioVenta);

                $('[name="Utilidad"]').data("kendoNumericTextBox").trigger("change");
                $('[name="PrecioVenta"]').data("kendoNumericTextBox").trigger("change");
            });

            $('[name="PrecioVenta"]').on("change", function (e) {
                var CU = parseFloat($("#TxtCostoUnitario").data("kendoNumericTextBox").value());
                var Rentabilidad = (parseFloat(this.value) - CU) / parseFloat(this.value);
                $('[name="Rentabilidad"]').data("kendoNumericTextBox").value(Rentabilidad);
                $('[name="Rentabilidad"]').data("kendoNumericTextBox").trigger("change");

                var Utilidad = CU / (1 - Rentabilidad) - CU;
            
                $('[name="Utilidad"]').data("kendoNumericTextBox").value(Utilidad);
                $('[name="Utilidad"]').data("kendoNumericTextBox").trigger("change");
               
            });
           
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSimulacionRentabilidad", title: "IdSimulacionRentabilidad",hidden:true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden:true},
            { field: "IdRentabilidad", title: "IdRentabilidad", editor: Grid_Combox, values: ["IdRentabilidad", "Nombre", UrlFac, "", "Seleccione...."], hidden: true },
            { field: "CU", title: "Costo Unitario", editor: Grid_ColNumeric, values: ["", "0.0000", "99999999999999.99", "c4", 4], hidden: true},
            { field: "Descripcion", title: "Descripción" },
            { field: "Rentabilidad", title: "Rentabilidad", editor: Grid_ColNumeric, values: ["required", "-100", "100", "P2", 4] ,format:"{0:P2}"},
            { field: "Utilidad", title: "Utilidad $", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c4", 4], format: "{0:c4}"},
            { field: "PrecioVenta", title: "Precio Venta $", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c4", 4],format: "{0:c4}"},
            { field: "Aprobado", title: "Aprobar", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Aprobado"); } }
        ]

    });

    SetGrid($("#gridRentabilidad").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 650);
    SetGrid_CRUD_ToolbarTop($("#gridRentabilidad").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridRentabilidad").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridRentabilidad").data("kendoGrid"), DsRent);

    Grid_HabilitaToolbar($("#gridRentabilidad"),false,false,false)

    var selectedRowsRentabilidad = [];
    $("#gridRentabilidad").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRentabilidad"), selectedRowsRentabilidad);
    });

    $("#gridRentabilidad").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridRentabilidad"), selectedRowsRentabilidad);
    });
    //#endregion Fin RUD para el grid Rentabilidad

    //#region CRUD para el grid simulacion Consumo

    var DsSimConsu = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSimConsumo + "/GetSimulacionesConsumoBySimulaciones/" + VIDSim; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSimConsumo + "/" + datos.IdSimulacionConsumo; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlSimConsumo + "/" + datos.IdSimulacionConsumo; },
                type: "DELETE"
            },
            create: {
                url: UrlSimConsumo,
                type: "POST",
                contentType: "application/json; charset=utf-8"

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    if (type === "PUT" && data.EsBase == true)
                        data.idTecnica = null;

                    return kendo.stringify(data);
                }
            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSimulacionConsumo",
                fields: {
                    IdSimulacionConsumo: { type: "number" },
                    IdSimulacion: {
                        type: "number", defaultValue: function (e) { return getIdSimulacion($("#gridSimulacion").data("kendoGrid")); }
                    },
                    Costo: { type: "number" },
                    FechaMod: { type: "date" },
                    IdTecnica: { type: "string" },
                    Nombre: { type: "string" },
                    IdCostoTecnica: { type: "string" },
                    Nombre1: { type: "string" },
                    IdUnidad: { type: "string" },
                    Nombre2: { type: "string" },
                    IdCatalogoInsumo: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdCatalogoInsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCatalogoInsumo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre3: { type: "string" },
                    Consumo: { type: "number" }
                }
            }
        }
    });

    $("#gridSimuConsumo").kendoGrid({
        edit: function (e) {
            e.container.find("label[for=IdSimulacionConsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSimulacionConsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdSimulacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSimulacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre2]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre2]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre3]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre3]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaMod]").parent("div .k-edit-label").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();

            if (e.model.EsBase === true) {
                e.container.find("label[for=IdTecnica]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdTecnica]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=IdCostoTecnica]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdCostoTecnica]").parent().next("div .k-edit-field").hide();
            }
            else {
                e.container.find("label[for=Nombre]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Nombre]").parent().next("div .k-edit-field").hide();

                if (e.model.IdServicio === 1) {
                    e.container.find("label[for=IdCostoTecnica]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=IdCostoTecnica]").parent().next("div .k-edit-field").hide();
                }
            }
                        
            e.container.find("label[for=Consumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Consumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Costo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Costo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUnidad]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdUnidad]").parent().next("div .k-edit-field").hide();

            $('[name="FechaMod"]').data("kendoDatePicker").enable(false);
            Grid_Focus(e, "Rentabilidad");

            $('[name="IdTecnica"]').on('change', function (e, dtmodel) {
                $('[name="IdCostoTecnica"]').data("kendoComboBox").value("");
                $('[name="IdCatalogoInsumo"]').data("kendoComboBox").value("");
                MostrarCamposxTecnica();
                
                var DsCostoTec = new kendo.data.DataSource({
                    dataType: 'json',
                    sort: { field: "Nombre", dir: "asc" },
                    transport: {
                        read: function (datos) {
                            $.ajax({
                                dataType: 'json',
                                url: UrlCosTec + "/" + fn_getIdBase($("#gridSimulacion").data("kendoGrid")) + "/" + Kendo_CmbGetvalue($('[name="IdTecnica"]')).toString(),
                                async: false,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    datos.success(result);

                                }
                            });
                        }
                    }
                });

                // asignar DataSource al combobox tecnica
                $('[name="IdCostoTecnica"]').data("kendoComboBox").setDataSource(DsCostoTec);

            });

            if (!e.model.isNew()) {
                MostrarCamposxTecnica();
            };

            var NewDSTec = new kendo.data.DataSource({
                dataType: 'json',
                sort: { field: "Nombre", dir: "asc" },
                transport: {
                    read: function (datos) {
                        $.ajax({
                            type: "GET",
                            dataType: 'json',
                            url: UrlTec + "/GetbyServicio/" + Kendo_CmbGetvalue($("#CmbIdServicio")),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                datos.success(result);
                            }
                        });
                    }
                }
            });

            $('[name="IdTecnica"]').data("kendoComboBox").setDataSource(NewDSTec);

            var NewDSSub = new kendo.data.DataSource({
                dataType: 'json',
                sort: { field: "Nombre", dir: "asc" },
                transport: {
                    read: function (datos) {
                        $.ajax({
                            type: "POST",
                            dataType: 'json',
                            data: JSON.stringify({ idTecnica: Kendo_CmbGetvalue($('[name="IdTecnica"]')), EsPapel: true, EsRhinestone: false }),
                            url: UrlCI + "/Filtrado",
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                datos.success(result);
                            }
                        });
                    }
                }
            });

            $('[name="IdCatalogoInsumo"]').data("kendoComboBox").setDataSource(NewDSSub);            
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSimulacionConsumo", title: "IdSimulacionConsumo", hidden: true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden: true },
            { field: "FechaMod", title: "Fecha Modificación", format: "{0:dd/MM/yyyy}", hidden: true },
            { field: "IdTecnica", title: "Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "", "Seleccione...."], hidden: true },
            { field: "Nombre", title: "Nombre Técnica", editor: Grid_ColLocked },
            { field: "IdCostoTecnica", title: "Costo Técnica", editor: Grid_Combox, values: ["IdCostoTecnica", "Nombre", UrlCosTec, "", "Seleccione....", "", "IdTecnica", ""], hidden: true },
            { field: "Nombre1", title: "Nombre Costo Técnica", hidden: true },
            { field: "IdCatalogoInsumo", title: "Catalogo Insumo", editor: Grid_Combox, values: ["IdCatalogoInsumo", "Nombre", UrlCatalo, "", "Seleccione....","required","","Requerido"], hidden: true },
            { field: "Nombre3", title: "Catalogo Insumo" },
            { field: "Consumo", title: "Consumo", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "n4", 4], format: "{0:n4}" },
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "c", 4], format: "{0:c4}" },
            { field: "IdUnidad", title: "IdUnidad", editor: Grid_Combox, values: ["IdUnidad", "Nombre", UrlUM, "", "Seleccione...."], hidden: true },
            { field: "Nombre2", title: "Unidad de Medida" }
        ]

    });

    SetGrid($("#gridSimuConsumo").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 650);
    SetGrid_CRUD_ToolbarTop($("#gridSimuConsumo").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimuConsumo").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridSimuConsumo").data("kendoGrid"), DsSimConsu);

    Grid_HabilitaToolbar($("#gridSimuConsumo"), false, false, false);

    var selectedRowsConsumos = [];
    $("#gridSimuConsumo").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSimuConsumo"), selectedRowsConsumos);
    });

    $("#gridSimuConsumo").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSimuConsumo"), selectedRowsConsumos);
    });

    var MostrarCamposxTecnica = function() {
        kendo.ui.progress($("#splitter"), true);

        $.ajax({
            url: UrlTec + "/" + Kendo_CmbGetvalue($('[name="IdTecnica"]')),
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                if (respuesta !== null) {
                    if (respuesta.EsPapel === true) {
                        vEspapel = true;
                        vEstampado = false;
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(true);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();

                        var NewDS = {
                            dataType: 'json',
                            sort: { field: "Nombre", dir: "asc" },
                            transport: {
                                read: function (datos) {
                                    $.ajax({
                                        type: "POST",
                                        dataType: 'json',
                                        data: JSON.stringify({ idTecnica: Kendo_CmbGetvalue($('[name="IdTecnica"]')), EsPapel: true, EsRhinestone: false }),
                                        url: UrlCI + "/Filtrado",
                                        contentType: "application/json; charset=utf-8",
                                        success: function (result) {
                                            datos.success(result);
                                        }
                                    });
                                }
                            }
                        };

                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").setDataSource(NewDS);
                    }

                    if (respuesta.EsEstampado === true) {
                        vEspapel = false;
                        vEstampado = true;

                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();
                    }
                } else {
                    $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
                }
            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
            }
        });
    }
    //#endregion Fin RUD para el grid Rentabilidad
   
    //#region Precotizar una nueva
    $("#btnAceptar").click(function (event) {
        event.preventDefault();
        if (ValidNuevoSim.validate()) { ConfirmacionMsg("¿Está seguro de generar una nueva simulación de pre-costeo para el requerimiento : " + fn_NoRequerimiento($("#gridSimulacion").data("kendoGrid")).toString(), function () { return fn_NuevaSimulacion() }); }       
    });

    $("#btnRecalcular").click(function (event) {
        event.preventDefault();
        ConfirmacionMsg("¿Está seguro de volver a generar la simulación de pre-costeo para la simulación: " + fn_getNoSimulacion($("#gridSimulacion").data("kendoGrid")).toString() + "?", function () { return fn_RecalcularSimulacion() });
    });

    function fn_NuevaSimulacion() {       
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlApiSimu + "/Procesar/" + fn_getIdRequerimiento($("#gridSimulacion").data("kendoGrid")).toString() + "/" + $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").value() + "/" + $("#TxtNoMontaje").data("kendoNumericTextBox").value() + "/" + $("#txtPersonalExtra").data("kendoNumericTextBox").value() + "/" + $("#txtCombos").data("kendoNumericTextBox").value() + "/" + $("#txtVeloMaquina").data("kendoNumericTextBox").value() + "/" + ($("#chkUsarTermofijado").is(':checked') ? "1" : "0"),
            type: "Post",
            dataType: "json",
            data: JSON.stringify({ IdAnalisisDiseno: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridSimulacion").data("kendoGrid").dataSource.read();
                $("#NuevaSimulacion").modal('hide');
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });        
    }

    function fn_RecalcularSimulacion() {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlApiSimu + "/Recalcular/" + fn_getIdRequerimiento($("#gridSimulacion").data("kendoGrid")).toString() + "/" + getIdSimulacion($("#gridSimulacion").data("kendoGrid")).toString(),
            type: "Post",
            dataType: "json",
            data: { },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridSimulacion").data("kendoGrid").dataSource.read();
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }

    $('#NuevaSimulacion').on('hidden.bs.modal', function (e) {
        $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").value(0);
        $("#TxtNoMontaje").data("kendoNumericTextBox").value(0);
        $("#txtPersonalExtra").data("kendoNumericTextBox").value(0);
        $("#txtCombos").data("kendoNumericTextBox").value(0);
        $("#txtVeloMaquina").data("kendoNumericTextBox").value(0);
        $("#chkUsarTermofijado").prop("checked", false);
    })

    $('#NuevaSimulacion').on('shown.bs.modal', function (e) {
        getRDS();
    })

    //#region vista consulta estados

    Fn_VistaConsultaRequerimientoEstados(($("#vConsultaEstados")));

    //#endregion fin vista consulta estados

    //#region vista consulta Analisis

    Fn_VistaConsultaAnalisis($("#vConsultaAnalisis"));

    //#endregion fin vista consulta analisis

    // carga vista para el cambio de estado
    Fn_VistaCambioEstado($("#vCambioEstado"))

    $("#btnCambioEstado").click(function () {

        Fn_VistaCambioEstadoMostrar("Simulaciones", fn_getEstadoActual($("#gridSimulacion").data("kendoGrid")), UrlApiSimu + "/Simulaciones_CambiarEstado", "Sp_CambioEstado", getIdSimulacion($("#gridSimulacion").data("kendoGrid")));
    })

    //#endregion 


    //#region get requeriento desarrollo

    function getRDS() {
        kendo.ui.progress($("#NuevaSimulacion"), true);
        $.ajax({
            url: UrlRequeDesarrollo + "/" + fn_getIdRequerimiento($("#gridSimulacion").data("kendoGrid")).toString() ,
            dataType: 'json',
            type: 'GET',
            async: false,
            success: function (respuesta) {
                $.each(respuesta, function (index, elemento) {
                    elemento.IdServicio == 1 ? $("#TxtNoMontaje").data("kendoNumericTextBox").enable(true) : $("#TxtNoMontaje").data("kendoNumericTextBox").enable(false);
                    elemento.IdServicio == 1 ? $("#txtCombos").data("kendoNumericTextBox").enable(true) : $("#txtCombos").data("kendoNumericTextBox").enable(false);
                    elemento.IdServicio == 1 ? $("#txtVeloMaquina").data("kendoNumericTextBox").enable(true) : $("#txtVeloMaquina").data("kendoNumericTextBox").enable(false);
                    elemento.IdServicio == 1 ? $('#chkUsarTermofijado').prop('disabled', false) : $('#chkUsarTermofijado').prop('disabled', true);
                    
                    $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").focus();
                    $("#TxtNoMontaje").data("kendoNumericTextBox").value(elemento.Montaje);
                    $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
                    $("#txtCombos").data("kendoNumericTextBox").value(elemento.Combo);
                    $("#txtVeloMaquina").data("kendoNumericTextBox").value(elemento.VelocidadMaquina);
                    $('#chkUsarTermofijado').prop('checked', false);
                });

                kendo.ui.progress($("#NuevaSimulacion"), false);
            },
            error: function () {
                kendo.ui.progress($("#NuevaSimulacion"), false);
            }
        });
    }
    //#endregion 

});
//#region Metodos Generales
function onCloseCambioEstado(e) {
    $("#gridSimulacion").data("kendoGrid").dataSource.read();
}

/**
 * muestra vista modal esados.
 * @param {number} IdRequerimiento PK del requerimiento de desarrollo
 */
function Fn_VerEstados(IdRequerimiento) {
    Fn_VistaConsultaRequerimientoEstadosGet($("#vConsultaEstados"), "null", IdRequerimiento);
}

/**
 * Muestra vista modal consulta analisis
 * @param {number} IdServicio
 * @param {number} IdAnalisisDiseno
 */
function Fn_VerAnalisis(IdAnalisisDiseno) {
    Fn_VistaConsultaAnalisisDisenosGet($("#vConsultaAnalisis"), parseInt($("#CmbIdServicio").data("kendoComboBox").value()), IdAnalisisDiseno);
}

function getSimulacionGrid(g) {
    var elemento = g.dataItem(g.select());
    
    $("#TxtNoDocumento").val(elemento.NoDocumento2);
    $("#TxtCostoMP").data("kendoNumericTextBox").value(elemento.CostoMP);
    $("#TxtCostoMOD").data("kendoNumericTextBox").value(elemento.CostoMOD);
    $("#TxtCostoPrimo").data("kendoNumericTextBox").value(elemento.CostoPrimo);
    $("#TxtCostoFabril").data("kendoNumericTextBox").value(elemento.CostoFabril);
    $("#TxtCostoProduccion").data("kendoNumericTextBox").value(elemento.CostoProduccion);
    $("#TxtCostoOperacion").data("kendoNumericTextBox").value(elemento.CostoOperacion);
    $("#txtCostoTermofijado").data("kendoNumericTextBox").value(elemento.CostoTermofijado);
    $("#TxtCostoTotal").data("kendoNumericTextBox").value(elemento.CostoTotal);
    $("#TxtCostoMPUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoMP / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoMODUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoMOD / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoPrimoUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoPrimo / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoFabrilUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoFabril / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoProduccionUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoProduccion / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoOperacionUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoOperacion / elemento.CantidadPiezas * 10000) / 10000);
    $("#txtCostoTermofijadoUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoTermofijado / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoUnitario").data("kendoNumericTextBox").value(elemento.CostoUnitario);
    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value(elemento.PorcUtilidadConsiderada);
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").value(elemento.UtilidadDolares);
    $("#TxtPrecioCliente").data("kendoNumericTextBox").value(elemento.PrecioCliente);
    $("#TxtPrecioTS").data("kendoNumericTextBox").value(elemento.PrecioTS);
    $("#TxtPrecioVenta").data("kendoNumericTextBox").value(elemento.PrecioVenta);
    $("#TxtCantidadTecnicas").data("kendoNumericTextBox").value(elemento.CantidadTecnicas);
    $("#TxtMontajes").data("kendoNumericTextBox").value(elemento.Montajes);
    $("#TxtCantidadPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
    $("#txtNoPersonalExtra").data("kendoNumericTextBox").value(elemento.PersonalExtra);
    $("#txtCantidadColores").data("kendoNumericTextBox").value(elemento.CantidadColores);
    $("#txtCantidadCombos").data("kendoNumericTextBox").value(elemento.CantidadCombos);
    $("#txtCantidadTallas").data("kendoNumericTextBox").value(elemento.CantidadTallas);
    $("#txtVelocidadMaquina").data("kendoNumericTextBox").value(elemento.VelocidadMaquina);
    $("#chkUsarTermo").prop("checked", elemento.UsarTermofijado);
    $("#TxtEstado").val(elemento.Estado);
    $("#TxtFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha2), 'dd/MM/yyyy'));
    $("#txtTiempoProyecto").data("kendoNumericTextBox").value(elemento.TiempoProyecto);

    CargarEtapasProceso(elemento.IdRequerimiento);

    var dataChart = [{
        data: []
    }];

    dataChart[0].type = "pie";
    dataChart[0].startAngle = 150,
    dataChart[0].data.push(
        {
            category: "Costo de Materia Prima",
            value: elemento.CostoMP,
            color: "#011F4B"
        },
        {
            category: "Costo de Mano de Obra Directa",
            value: elemento.CostoMOD,
            color: "#03396C"
        },
        {
            category: "Costo Fabril",
            value: elemento.CostoFabril,
            color: "#005B96"
        },
        {
            category: "Costo Operación",
            value: elemento.CostoOperacion,
            color: "#6497B1"
        },
        {
            category: "Costo Termofijado",
            value: elemento.CostoTermofijado,
            color: "#178AB8"
        });

    $("#chart").kendoChart({
        title: {
            position: "bottom",
            text: "Distribución de costos " + elemento.Nombre2
        },
        legend: {
            visible: true
        },
        chartArea: {
            background: ""
        },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: \n $#= value# - #= kendo.toString(percentage * 100.0, 'n2')#%"
            }
        },
        series: dataChart,
        tooltip: {
            visible: true,
            format: "${0}"
        }
    });
}

function DesHabilitarCamposSim() {
    $("#TxtCostoMP").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMOD").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoPrimo").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoFabril").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoProduccion").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoOperacion").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMPUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMODUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoPrimoUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoFabrilUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoProduccionUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoOperacionUnitario").data("kendoNumericTextBox").enable(false);
    $("#txtCostoTermofijado").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoTotal").data("kendoNumericTextBox").enable(false);
    $("#txtCostoTermofijadoUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").enable(false);
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioCliente").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioTS").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioVenta").data("kendoNumericTextBox").enable(false);
    $("#TxtCantidadTecnicas").data("kendoNumericTextBox").enable(false);
    $("#TxtMontajes").data("kendoNumericTextBox").enable(false);
    $("#txtTiempoProyecto").data("kendoNumericTextBox").enable(false);
    $("#TxtCantidadPiezas").data("kendoNumericTextBox").enable(false);
    $("#txtNoPersonalExtra").data("kendoNumericTextBox").enable(false);
    $("#txtCantidadColores").data("kendoNumericTextBox").enable(false);
    $("#txtCantidadCombos").data("kendoNumericTextBox").enable(false);
    $("#txtCantidadTallas").data("kendoNumericTextBox").enable(false);
    $("#txtVelocidadMaquina").data("kendoNumericTextBox").enable(false);
    $("#chkUsarTermo").prop("disabled", false);
    $("#TxtFecha").data("kendoDatePicker").enable(false);
}

function LimpiarCamposSim() {
    $("#TxtCostoMP").data("kendoNumericTextBox").value("0");
    $("#TxtCostoMOD").data("kendoNumericTextBox").value("0");
    $("#TxtCostoPrimo").data("kendoNumericTextBox").value("0");
    $("#TxtCostoFabril").data("kendoNumericTextBox").value("0");
    $("#TxtCostoProduccion").data("kendoNumericTextBox").value("0");
    $("#TxtCostoOperacion").data("kendoNumericTextBox").value("0");
    $("#txtCostoTermofijado").data("kendoNumericTextBox").value("0");
    $("#TxtCostoTotal").data("kendoNumericTextBox").value("0");
    $("#txtCostoTermofijadoUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtCostoUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value("0");
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioCliente").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioTS").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioVenta").data("kendoNumericTextBox").value("0");
    $("#TxtCantidadTecnicas").data("kendoNumericTextBox").value("0");
    $("#TxtMontajes").data("kendoNumericTextBox").value("0");
    $("#TxtCantidadPiezas").data("kendoNumericTextBox").value("0");
    $("#txtNoPersonalExtra").data("kendoNumericTextBox").value("0");
    $("#txtCantidadColores").data("kendoNumericTextBox").value("0");
    $("#txtCantidadCombos").data("kendoNumericTextBox").value("0");
    $("#txtCantidadTallas").data("kendoNumericTextBox").value("0");
    $("#txtVelocidadMaquina").data("kendoNumericTextBox").value("0");
    $("#chkUsarTermo").prop("checked", false);
    $("#TxtFecha").data("kendoDatePicker").value(Fhoy());
    $("#TxtNoDocumento").val("");
    $("#TxtEstado").val("");
    $("#txtTiempoProyecto").data("kendoNumericTextBox").value("0");

    $("#TxtCostoMPUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtCostoMODUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtCostoPrimoUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtCostoFabrilUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtCostoProduccionUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtCostoOperacionUnitario").data("kendoNumericTextBox").value("0");
}

function getIdSimulacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSimulacion;
}

function fn_getNoSimulacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento2;
}

function fn_getIdBase(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdBase;
}

function fn_getIdRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;
}
function fn_NoRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento1;
}

fPermisos = function (datos) {
    Permisos = datos;
}
fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
}
fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
}
fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
}
fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
}
fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
}

function fn_getEstadoActual(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;
}
//#endregion Fin Metodos Generales