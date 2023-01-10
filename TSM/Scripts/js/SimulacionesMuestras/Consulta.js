let UrlServ = TSM_Web_APi + "Servicios";
let UrlClie = TSM_Web_APi + "Clientes";
let vIdModulo = 2;
var Permisos;
let VIdSer = 0;
let VIdCliente = 0;
let VIdOrdenTra = 0;
let vIdPrograma = 0;
let vNoFM = "";
let data = null;
let Mul1;
let Mul2;
let Mul3;
$(document).ready(function () {
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    //KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("Simue_CmbIdCliente") === null ? "" : sessionStorage.getItem("Simue_CmbIdCliente"));

    Kendo_MultiSelect($("#CmbTallas"), TSM_Web_APi + "CategoriaTallas", "Nombre", "IdCategoriaTalla", "Seleccione ...");
    Kendo_MultiSelect($("#CmbTallasRecalcular"), TSM_Web_APi + "CategoriaTallas", "Nombre", "IdCategoriaTalla", "Seleccione ...");

    // transformar div en multicolumn
    $("#cmbNoFM").ControlSelecionFMCatalogo();
    $("#CmbNoOrdenTrabajo").OrdenesTrabajos();
    $("#CmbPrograma").ControlSelecionPrograma();

    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION
    let DsRD = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SimulacionesMuestras/GetSimulacionesMuestras/"; },
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                } else if (type === "read") {
                    return kendo.stringify({
                        'idCliente': VIdCliente,
                        'idOrdentrabajo': VIdOrdenTra,
                        'idPrograma': vIdPrograma,
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
                    NoDocSimulacion: { type: "string" },
                    NoDocOT: { type: "string" },
                    NoReferencia: { type: "string" },
                    Fecha: { type: "date" },
                    NoDocRequerimiento: { type: "string" },
                    NombreDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    PorcVariacion: { type: "number" },
                    NombreEstado: { type: "string" },
                    NoPrograma: { type: "string" },
                    NombreProg: { type: "string" },
                    NombreClie: { type: "string" },
                    Tecnicas: { type: "string" },
                    Tallas: { type: "string" },
                    FechaFinalMuestra: { type: "date" },
                    FechaFinal: { type: "date" },
                    CantidadPiezas: { type: "number" },
                    Montajes: { type: "number" },
                    PersonalExtra: { type: "number" },
                    CantidadCombos: { type: "number" },
                    ProductividadHora: { type: "number" },
                    ProductividadHoraProduccion: { type: "string" },
                    UsarTermofijado: { type: "boolean" },
                    AplicarCostoTransporte: { type: "boolean" },
                    RentabilidadCliente: { type: "number" },
                    UtilidadCliente: { type: "number" },
                    PrecioVentaCliente: { type: "number" },
                    RentabilidadTechno: { type: "number" },
                    UtilidadTechno: { type: "number" },
                    PrecioVentaTechno: { type: "number" }
                }
            }
        }
    });


    var selectedRows = [];
    $("#grid").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        dataBound: function () {
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        toolbar: ["excel"],
        excel: {
            fileName: "SimulacionesMuestras.xlsx",
            filterable: true,
            allPages: true
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
                field: "NoDocOT", title: "No OT", width: 150,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
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
                field: "Fecha", title: "Fecha simulación", format: "{0: dd/MM/yyyy}", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NoDocRequerimiento", title: "Requerimiento", width: 100,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NombreDiseno", title: "Nombre del diseño", width: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NumeroDiseno", title: "Número diseño", width: 200, filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "EstiloDiseno", title: "Estilo diseño", width: 150, filterable: {
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
            {
                field: "NombreClie", title: "Nombre del cliente", width: 200,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Tecnicas", title: "Técnicas", width: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Tallas", title: "Tallas", width: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "FechaFinalMuestra", title: "Desarrollo Muestra", width: 150, format: "{0: dd/MM/yyyy}",
                filterable: {
                    cell: {
                        operator: "eq",
                        suggestionOperator: "eq"
                    }
                }
            },
            {
                field: "FechaFinal", title: "Finalización OT", width: 150, format: "{0: dd/MM/yyyy HH:mm:ss}",
                filterable: {
                    cell: {
                        operator: "eq",
                        suggestionOperator: "eq"
                    }
                }
            },
            {
                field: "CantidadPiezas", title: "Cantidad Piezas", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Montajes", title: "Montajes", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "PersonalExtra", title: "Personal Extra", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "CantidadCombos", title: "Combos", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "ProductividadHora", title: "Productividad Hora", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "ProductividadHoraProduccion", title: "Productividad Hora F. Producción", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "UsarTermofijado", title: "Usar termofijado", width: 125,
                template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "UsarTermofijado"); },
                filterable: {
                    cell: {
                        operator: "eq",
                        suggestionOperator: "eq"
                    }
                }
            },
            {
                field: "AplicarCostoTransporte", title: "Aplica costo transporte", width: 125,
                template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "AplicarCostoTransporte"); },
                filterable: {
                    cell: {
                        operator: "eq",
                        suggestionOperator: "eq"
                    }
                }
            },
            {
                field: "RentabilidadCliente", title: "Rentabilidad Cliente", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "UtilidadCliente", title: "Utilidad Cliente", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "PrecioVentaCliente", title: "Precio Venta Cliente", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "RentabilidadTechno", title: "Rentabilidad Techno Screen", width: 130,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "UtilidadTechno", title: "Utilidad Techno Screen", width: 125,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "PrecioVentaTechno", title: "Precio Venta Techno Screen", width: 130,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            }
        ]
    });

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 0, true, "row");
    //SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), DsRD, 50);

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    //#endregion FIN GRID PRINCIPAL

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_Consultar(this.dataItem(e.item.index()).IdCliente.toString(), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                KdoMultiColumnCmbGetValue($("#cmbNoFM")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbNoFM")));
        } else {
            Fn_Consultar(0, KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                KdoMultiColumnCmbGetValue($("#cmbNoFM")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbNoFM")));
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_Consultar(0, KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                KdoMultiColumnCmbGetValue($("#cmbNoFM")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbNoFM")));
        }
        else
            validacion.validate();
    });

    $("#CmbNoOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbNoOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdCliente")), 0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                KdoMultiColumnCmbGetValue($("#cmbNoFM")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbNoFM")));
        } else {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdCliente")), data.IdOrdenTrabajo, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                KdoMultiColumnCmbGetValue($("#cmbNoFM")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbNoFM")));
        }
    });

    $("#cmbNoFM").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#cmbNoFM").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            Fn_Consultar(
                Kendo_CmbGetvalue($("#CmbIdCliente")),
                KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                ""
            );
        } else {

            Fn_Consultar(
                Kendo_CmbGetvalue($("#CmbIdCliente")),
                KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                data.NoReferencia
            );
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), 0,
                KdoMultiColumnCmbGetValue($("#cmbNoFM")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbNoFM")));
        } else {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbNoOrdenTrabajo")), data.IdPrograma,
                KdoMultiColumnCmbGetValue($("#cmbNoFM")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbNoFM")));
        }
    });
    $("#CmbIdCliente").focus();
    $("#grid").addClass("k-state-disabled");
});

let validacion = $("#frmBuscar").kendoValidator({
    rules: {
        cliente: function (input) {
            if (input.is("[name='CmbIdCliente']")) {
                return $(input).data("kendoComboBox").selectedIndex >= 0;
            }
            return true;
        },
    },
    messages: {
        cliente: "Cliente requerido"
    }
}).data("kendoValidator");

let Fn_Consultar = function (idCliente, idOrdenTra, idPrograma, noFM = "") {
    VIdCliente = Number(idCliente);
    VIdOrdenTra = Number(idOrdenTra);
    vIdPrograma = Number(idPrograma);
    vNoFM = noFM;

    //let validacion = $("#frmBuscar").data("kendoValidator");

    //leer grid
    validacion.validate();
    kendo.ui.progress($("#body"), true);
    $("#gConsolidado").addClass("k-state-disabled");
    $("#grid").data("kendoGrid").dataSource.data([]);
    $("#grid").data("kendoGrid").dataSource.read().then(function () {
        kendo.ui.progress($("#body"), false);
        if ($("#grid").data("kendoGrid").dataSource.total() > 0)
            $("#grid").removeClass("k-state-disabled");
        else
            $("#grid").addClass("k-state-disabled");
    });
};

var fPermisos = function (datos) {
    Permisos = datos;
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
                            url: function (datos) { return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosRequerimientos/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
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
        });
    }
});