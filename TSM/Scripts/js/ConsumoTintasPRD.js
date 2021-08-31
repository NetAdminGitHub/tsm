var Permisos;
var xidOT = 0;

$(document).ready(function () {
    KdoButton($("#btnBuscar"), "search", "Buscar");
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un Cliente...");
    OrdenesTrabajos($("#cmbOrdenTrabajo"));

    $("#tsContenido").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip").select(0);

    fn_HabilitarControles(false);

    //#region Grid Consolidado

    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return crudServiceBaseUrl + "GetConsultaConsumoTintasPRD/" + xidOT;
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                fields: {
                    NoOrdenTrabajo: { type: "string" },
                    NoCuenta: { type: "string" },
                    NomCliente: { type: "string" },
                    IdArticulo: { type: "string" },
                    NomArticulo: { type: "string" },
                    NoCotizacion: { type: "string" },
                    NoPrograma: { type: "string" },
                    CantidadPiezas: { type: "number" },
                    PiezasProducidas: { type: "number" },
                    CostoMP: { type: "number" },
                    PrecioCliente: { type: "number" },
                    ValorTotal: { type: "number" },
                    CostoPorPieza: { type: "number" },
                    Diferencia: { type: "number" },
                    Peso: { type: "number" },
                    Costo: { type: "number" },
                    Valor: { type: "number" }                    
                }
            }
        },
        aggregate: [
            { field: "Peso", aggregate: "sum" },
            { field: "Costo", aggregate: "sum" },
            { field: "Valor", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gConsolidado").kendoGrid({
        toolbar: ["excel"],
        excel: {
            fileName: "ConsumosConsolidados.xlsx",
            filterable: true,
            allPages: true
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            {
                field: "NoOrdenTrabajo", title: "Orden de Trabajo", minResizableWidth: 120,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NoCuenta", title: "No. Cuenta", minResizableWidth: 120,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NomCliente", title: "Nombre Cliente", minResizableWidth: 250, width: 250,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "IdArticulo", title: "Cod. Articulo", minResizableWidth: 120,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NomArticulo", title: "Nombre Articulo", minResizableWidth: 300, width: 300,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "NoCotizacion", title: "NoCotizacion", hidden: true },
            { field: "NoPrograma", title: "NoPrograma", hidden: true },
            { field: "CantidadPiezas", title: "CantidadPiezas", hidden: true },
            { field: "PiezasProducidas", title: "PiezasProducidas", hidden: true },
            { field: "CostoMP", title: "CostoMP", hidden: true },
            { field: "PrecioCliente", title: "PrecioCliente", hidden: true },
            { field: "ValorTotal", title: "ValorTotal", hidden: true },
            { field: "CostoPorPieza", title: "CostoPorPieza", hidden: true },
            { field: "Diferencia", title: "Diferencia", hidden: true },
            {
                field: "Peso", title: "Peso (g)", minResizableWidth: 120,
                format: "{0:n4}", footerTemplate: "#: data.Peso ? kendo.format('{0:n4}', sum) : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Costo", title: "Costo", minResizableWidth: 120,
                format: "{0:c4}", footerTemplate: "#: data.Costo ? kendo.format('{0:c4}', sum) : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Valor", title: "Valor", minResizableWidth: 120,
                format: "{0:c4}", footerTemplate: "#: data.Valor ? kendo.format('{0:c4}', sum) : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gConsolidado").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0, true, "row");
    SetGrid_CRUD_Command($("#gConsolidado").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gConsolidado").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gConsolidado").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gConsolidado"), selectedRows);
    });

    $("#gConsolidado").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gConsolidado"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gConsolidado"), $(window).height() - "340");
    });

    Fn_Grid_Resize($("#gConsolidado"), $(window).height() - "340");

    //#endregion

    //#region Grid Detalle

    var dsDetalle = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return crudServiceBaseUrl + "GetConsultaConsumoTintasPRDDetalle/" + xidOT;
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                fields: {
                    NoOrdenTrabajo: { type: "string" },
                    NoCuenta: { type: "string" },
                    NomCliente: { type: "string" },
                    IdArticulo: { type: "string" },
                    NomArticulo: { type: "string" },
                    Peso: { type: "number" },
                    Costo: { type: "number" },
                    Valor: { type: "number" },
                    FichaPrd: { type: "string" },
                    OrdenPrd: { type: "string" },
                    Planta: { type: "string" },
                    Maquina: { type: "string" },
                    RegistroPrd: { type: "string" },
                    IdentificadorLote: { type: "string" },
                    ColorPrd: { type: "string" },
                    EntregaTintaPrd: { type: "string" },
                    AjusteTinta: { type: "string" },
                    PartidaArancelaria: { type: "string" },
                    FechaEntrega: { type: "date" },
                    CreatedBy: { type: "string" },
                    Tipo: { type: "string" }
                }
            }
        },
        aggregate: [
            { field: "Peso", aggregate: "sum" },
            { field: "Costo", aggregate: "sum" },
            { field: "Valor", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gDetalle").kendoGrid({
        toolbar: ["excel"],
        excel: {
            fileName: "ConsumosDetalle.xlsx",
            filterable: true,
            allPages: true
        },
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            {
                field: "NoOrdenTrabajo", title: "Orden de Trabajo", minResizableWidth: 120,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NoCuenta", title: "No. Cuenta", minResizableWidth: 120,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "IdArticulo", title: "Cod. Articulo", minResizableWidth: 120,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NomArticulo", title: "Nombre Articulo", minResizableWidth: 300, width: 300,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Peso", title: "Peso (g)", minResizableWidth: 120,
                format: "{0:n4}", footerTemplate: "#: data.Peso ? kendo.format('{0:n4}', sum) : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Costo", title: "Costo", minResizableWidth: 120,
                format: "{0:c4}", footerTemplate: "#: data.Costo ? kendo.format('{0:c4}', sum) : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Valor", title: "Valor", minResizableWidth: 120,
                format: "{0:c4}", footerTemplate: "#: data.Valor ? kendo.format('{0:c4}', sum) : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "FichaPrd", title: "Ficha de Producci&oacute;n", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "OrdenPrd", title: "Orden de Producci&oacute;n", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Planta", title: "Planta", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Maquina", title: "M&aacute;quina", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "RegistroPrd", title: "Registro de Producci&oacute;n", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "IdentificadorLote", title: "Identificador Lote", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "ColorPrd", title: "Color de Producci&oacute;n", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "EntregaTintaPrd", title: "Entrega Tinta de Producci&oacute;n", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "AjusteTinta", title: "Ajuste Tinta de Producci&oacute;n", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "PartidaArancelaria", title: "Partida Arancelaria", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "FechaEntrega", title: "Fecha Entrega", minResizableWidth: 150, width: 150, format: "{0: dd/MM/yyyy HH:mm:ss}",
                filterable: {
                    cell: {
                        operator: "eq",
                        suggestionOperator: "eq"
                    }
                }
            },
            {
                field: "CreatedBy", title: "Creado Por", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Tipo", title: "Tipo de Movimiento", minResizableWidth: 150, width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gDetalle").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0, true, "row");
    SetGrid_CRUD_Command($("#gDetalle").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gDetalle").data("kendoGrid"), dsDetalle);

    var selectedRowsDetalle = [];
    $("#gDetalle").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gDetalle"), selectedRowsDetalle);
    });

    $("#gDetalle").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gDetalle"), selectedRowsDetalle);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gDetalle"), $(window).height() - "340");
    });

    Fn_Grid_Resize($("#gDetalle"), $(window).height() - "340");
    //#endregion

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").text("");
        $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").trigger("change");
        $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").dataSource.read();
    });

    $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function (e) {
        if (this.dataItem() !== undefined) {
            fn_Consultar(this.dataItem().IdOrdenTrabajo);
        } else {
            fn_HabilitarControles(false);
            fn_Consultar(0);
        }
    });
});

let fn_HabilitarControles = function (estado) {
    if (estado) {
        $("#gConsolidado").removeClass("k-state-disabled");
        $("#gDetalle").removeClass("k-state-disabled");        
    }
    else {
        $("#gConsolidado").addClass("k-state-disabled");
        $("#gDetalle").addClass("k-state-disabled");
    }
};

let fn_Consultar = function (idOrdenTrabajo) {
    kendo.ui.progress($("#body"), true);
    xidOT = idOrdenTrabajo;

    $("#gConsolidado").data("kendoGrid").dataSource.data([]);
    $("#gDetalle").data("kendoGrid").dataSource.data([]);
    $("#txtNomCliente").val("");
    $("#txtNoCotizacion").val("");
    $("#txtNoPrograma").val("");
    $("#txtCantidadPiezas").val("");
    $("#txtPiezasProducidas").val("");
    $("#txtCostoMP").val("");
    $("#txtPrecioCliente").val("");
    $("#txtValorTotal").val("");
    $("#txtCostoPorPieza").val("");
    $("#txtDiferencia").val("");
    $("#txtProyeccionProducida").val("");
    $("#txtFacPerdidaGanancia").val("");

    $("#gConsolidado").data("kendoGrid").dataSource.read().then(fn_CargarCabecera);
    $("#gDetalle").data("kendoGrid").dataSource.read();
};

let fn_CargarCabecera = function () {
    let view = $("#gConsolidado").data("kendoGrid").dataSource.view();
    if (view.length > 0) {
        $("#txtNomCliente").val(view[0].NomCliente);
        $("#txtNoCotizacion").val(view[0].NoCotizacion);
        $("#txtNoPrograma").val(view[0].NoPrograma);
        $("#txtCantidadPiezas").val(kendo.toString(view[0].CantidadPiezas, "n0"));
        $("#txtPiezasProducidas").val(kendo.toString(view[0].PiezasProducidas, "n0"));
        $("#txtCostoMP").val(kendo.toString(view[0].CostoMP, "c4"));
        $("#txtPrecioCliente").val(kendo.toString(view[0].PrecioCliente, "c4"));
        $("#txtValorTotal").val(kendo.toString(view[0].ValorTotal, "c4"));
        $("#txtCostoPorPieza").val(kendo.toString(view[0].CostoPorPieza, "c4"));
        $("#txtDiferencia").val(kendo.toString(view[0].Diferencia, "n0"));
        $("#txtFacPerdidaGanancia").val(kendo.toString(view[0].FacPerdidaGanancia, "c4"));
        $("#txtProyeccionProducida").val(kendo.toString(view[0].ProyeccionProducida, "c4"));

        fn_HabilitarControles(true);
    }
    else if (xidOT !== 0) {
        fn_HabilitarControles(false);
        ErrorMsg("No se encontraron registros que mostrar.");
    }

    kendo.ui.progress($("#body"), false);
};

let OrdenesTrabajos = function (cmb) {
    cmb.kendoMultiColumnComboBox({
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
                    url: function (datos) { return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosRequerimientos/1/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                    contentType: "application/json; charset=utf-8"
                }
            }
        },
        columns: [
            { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
            { field: "NoDocReq", title: "Requerimiento", width: 100 },
            { field: "Nombre", title: "Nombre del Diseño", width: 200 },
            { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
            { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 },
            { field: "Tecnicas", title: "Tecnicas", width: 200 },
            { field: "Tallas", title: "Tallas", width: 200 },
            { field: "FechaFinalMuestra", title: "Final Des. Muestra", template: '#:kendo.toString(kendo.parseDate(data.FechaFinalMuestra), "dd/MM/yyyy")#', width: 125 },
            { field: "FechaFinal", title: "Fecha Fin OT", template: '#:kendo.toString(kendo.parseDate(data.FechaFinalMuestra), "dd/MM/yyyy HH:mm:ss")#', width: 200 }
        ]
    });
};

fPermisos = function (datos) {
    Permisos = datos;
};