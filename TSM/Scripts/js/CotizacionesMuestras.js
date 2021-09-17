var Permisos;
let UrlClie = TSM_Web_APi + "Clientes";
let UrlPro = TSM_Web_APi + "Programas";
let VIdCliente = 0;
let vIdPrograma = 0;
let Mul3;
$(document).ready(function () {

    // configurar clientes y servicios
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("CotMu_CmbIdCliente") === null ? "" : sessionStorage.getItem("CotMu_CmbIdCliente")); 
    $("#CmbPrograma").GetCotizacionesMuestrasProgramas();

    if (sessionStorage.getItem("CotMu_CmbPrograma") !== null && sessionStorage.getItem("CotMu_CmbPrograma") !== "") {
        Mul3 = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        Mul3.search(sessionStorage.getItem("CotMu_NombrePrograma"));
        Mul3.text(sessionStorage.getItem("CotMu_NombrePrograma") === null ? "" : sessionStorage.getItem("CotMu_NombrePrograma"));
        Mul3.trigger("change");
        Mul3.close();
    }
    //#region PRGRANMACION DEL GRID citizacion
    var DsRD = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "CotizacionesMuestras/GetIdClienteIdPrograma/" + VIdCliente + "/" + vIdPrograma; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CotizacionesMuestras/" + datos.IdCotizacion; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "CotizacionesMuestras",
                dataType: "json",
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
            Grid_requestEnd(e);
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacion",
                fields: {
                    IdCotizacion: { type: "number" },
                    NoDocumento: { type: "string" },
                    IdPrograma: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdArticulo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdArticulo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdPrograma']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdPrograma").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NoDocumentoPrograma: { type: "string" },
                    NombrePro: { type: "string" },
                    IdCliente: {
                        type: "string"
                    },
                    NoCuenta: { type: "string" },
                    NombreCli: { type: "string" },
                    FechaCotizacion: { type: "date" },
                    FechaAprobacion: { type: "date" },
                    FechaCreacion: {
                        type: "date"
                    },
                    IdUsuario: { type: "string", defaultValue: getUser() },
                    Comentarios: { type: "string" },
                    Estado: { type: "string", defaultValue: "EDICION" },
                    Contacto: { type: "string" },
                    CotizaPromedio: { type: "bool" },
                    NombreEst: { type: "string" }
                }
            }
        }
    });

    var selectedRows = [];

    $("#gridCotizacion").kendoGrid({
        autoBind: false,
        dataBound: function () {
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                window.location.href = "/CotizacionesMuestras/CotizacionesMuestrasDatos/" + grid.dataItem(this).IdCotizacion.toString() + "/" + grid.dataItem(this).Estado.toString();
            });
            Grid_SetSelectRow($("#gridCotizacion"), selectedRows);
        },
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCotizacion");
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "FechaCotizacion");
            KdoHideCampoPopup(e.container, "NombreCli");
            KdoHideCampoPopup(e.container, "NombrePro");
            KdoHideCampoPopup(e.container, "FechaAprobacion");
            KdoHideCampoPopup(e.container, "IdUsuario");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NombreEst");
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "NoCuenta");
            KdoHideCampoPopup(e.container, "Contacto");
            KdoHideCampoPopup(e.container, "Comentarios");
            KdoHideCampoPopup(e.container, "NoDocumentoPrograma");

            let div = e.container.find("label[for=IdPrograma]").parent().next("div .k-edit-field");

            div.after("<div id='tablaSimulaciones' style='width: 100%; float: left; clear: left;'></div>");

            $('[name="IdPrograma"]').data("kendoMultiColumnComboBox").bind("select", function (e) {
                if (e.dataItem) {
                    kendo.ui.progress($(e.container), true);
                    $.ajax({
                        url: TSM_Web_APi + "CotizacionesMuestrasSimulaciones/GetSimulacionesByPrograma/" + e.dataItem.IdPrograma,
                        type: "Get",
                        dataType: "json",
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            fn_MostraTabla(data, $("#tablaSimulaciones"));
                        },
                        error: function (data) {
                            kendo.ui.progress($(document.body), false);
                            ErrorMsg(data);
                        }
                    });
                } else {
                    $("#tablaSimulaciones").children().remove();
                    kendo.ui.progress($(e.container), false);
                }
            });

            $('[name="IdPrograma"]').data("kendoMultiColumnComboBox").bind("select", function (e) {
                if (e.dataItem) {
                    kendo.ui.progress($(e.container), true);
                    $.ajax({
                        url: TSM_Web_APi + "CotizacionesMuestrasSimulaciones/GetSimulacionesByPrograma/" + e.dataItem.IdPrograma,
                        type: "Get",
                        dataType: "json",
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            fn_MostraTabla(data, $("#tablaSimulaciones"));
                        },
                        error: function (data) {
                            kendo.ui.progress($(document.body), false);
                            ErrorMsg(data);
                        }
                    });
                } else {
                    $("#tablaSimulaciones").children().remove();
                    kendo.ui.progress($(e.container), false);
                }
            });

            $('[name="IdPrograma"]').data("kendoMultiColumnComboBox").bind("change", function () {
                var multicolumncombobox = $('[name="IdPrograma"]').data("kendoMultiColumnComboBox");
                let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
                if (data === undefined) {
                    $("#tablaSimulaciones").children().remove();
                }
            });

            if (!e.model.isNew()) {
                KdoComboBoxEnable($('[name="IdPrograma"]'), false);
            }
            $('[name="FechaCreacion"]').data("kendoDatePicker").enable(false);
        },
        editable: {
            "window": {
                "width": 700
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCotizacion", title: "Cod. Cotización", hidden: true },
            {
                field: "NoDocumento", title: "No Cotización",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "FechaCotizacion", title: "Fecha Cotización", format: "{0: dd/MM/yyyy}", hidden: true },
            {
                field: "FechaCreacion", title: "Fecha Creación", format: "{0: dd/MM/yyyy}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdCliente", title: "Cliente", hidden: true },
            {
                field: "NoCuenta", title: "NoCuenta",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NombreCli", title: "Nombre del Cliente",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            //{ field: "IdPrograma", title: "Programa", editor: Grid_Combox, values: ["IdPrograma", "Nombre", UrlPro, "", "Seleccione....", "required", "CmbIdCliente", "requerido"], hidden: true },
            {
                field: "IdPrograma", title: "Programa", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).SelecionProgramas();
                }
            },
            {
                field: "NoDocumentoPrograma", title: "No Programa",
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NombrePro", title: "Nombre del Programa",
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "FechaAprobacion", title: "Fecha Aprobación", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "IdUsuario", title: "Usuario", hidden: true },
            {
                field: "Estado", title: "Estado", hidden: true,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NombreEst", title: "Estado cotización",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "Contacto", title: "Contacto", hidden: true },
            { field: "Comentarios", title: "Comentarios", hidden: true }
            ]
    });

    SetGrid($("#gridCotizacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 0,true,"row");
    SetGrid_CRUD_ToolbarTop($("#gridCotizacion").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCotizacion").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCotizacion").data("kendoGrid"), DsRD);

    Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);

    //#endregion FIN PROGRAMACIÓN DEL GRID cotizacion

    //#region seleccion de servicio y cliente


    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_ConsultarCotiza(this.dataItem(e.item.index()).IdCliente.toString(), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("CotMu_CmbIdCliente", this.dataItem(e.item.index()).IdCliente);
            Grid_HabilitaToolbar($("#gridCotizacion"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        } else {
            Fn_ConsultarCotiza(0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("CotMu_CmbIdCliente", "");
            Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_ConsultarCotiza(0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("CotMu_CmbIdCliente", "");
            Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);
        }
    });

    //$("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
    //    if (e.item) {
    //        KdoCmbSetValue($("#CmbIdCliente"), this.dataItem(e.item.index()).IdCliente);
    //        Grid_HabilitaToolbar($("#gridCotizacion"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
    //        Fn_ConsultarCotiza(this.dataItem(e.item.index()).IdCliente, this.dataItem(e.item.index()).IdPrograma);
    //        sessionStorage.setItem("CotMu_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);
    //    } else {
    //        Fn_ConsultarCotiza(KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente")), 0);
    //        sessionStorage.setItem("CotMu_CmbPrograma", "");
    //    }
    //});

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            Fn_ConsultarCotiza(KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente")), 0);
            if (KdoCmbGetValue($("#CmbIdCliente")) === null) Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);
            sessionStorage.setItem("CotMu_CmbPrograma", "");
            sessionStorage.setItem("CotMu_NombrePrograma","");
        } else {
            Fn_ConsultarCotiza(KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente")), data.IdPrograma);
            sessionStorage.setItem("CotMu_CmbPrograma", data.IdPrograma);
            sessionStorage.setItem("CotMu_NombrePrograma", data.Nombre);

        }

    });

    $("#gridCotizacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCotizacion"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridCotizacion"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridCotizacion"), ($(window).height() - "371"));
    //#endregion

    //Coloca el filtro de cliente guardado en la sesion
    if ((sessionStorage.getItem("CotMu_CmbIdCliente") === "" ? null : sessionStorage.getItem("CotMu_CmbIdCliente")) !== null || (sessionStorage.getItem("CotMu_CmbPrograma") === "" ? null : sessionStorage.getItem("CotMu_CmbPrograma")) !== null) {

        Grid_HabilitaToolbar($("#gridCotizacion"), Permisos.SNAgregar, false, Permisos.SNBorrar);
        Fn_ConsultarCotiza(sessionStorage.getItem("CotMu_CmbIdCliente"), sessionStorage.getItem("CotMu_CmbPrograma"));
    }
        
    $("#gridCotizacion").kendoTooltip({
        filter: "tr[data-uid]",
        position: "buttom",
        content: function (e) {
            var dataItem = $("#gridCotizacion").data("kendoGrid").dataItem(e.target.closest("tr"));
            var result = "";
            if (dataItem) {
                $.ajax({
                    url: TSM_Web_APi + "CotizacionesMuestrasSimulaciones/GetSimulacionesByCotizacion/" + dataItem.IdCotizacion,
                    type: "Get",
                    async: false,
                    dataType: "json",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        result = fn_TablaEnMemoria(data);
                    },
                    error: function (data) {
                        kendo.ui.progress($(document.body), false);
                        ErrorMsg(data);
                    }
                });
            }

            return result;
        }
    });
});

let Fn_ConsultarCotiza = function (IdCliente,IdPrograma) {
    VIdCliente = Number(IdCliente);
    vIdPrograma = Number(IdPrograma);
    //leer grid
    $("#gridCotizacion").data("kendoGrid").dataSource.data([]);
    $("#gridCotizacion").data("kendoGrid").dataSource.read();
};

$.fn.extend({
    GetCotizacionesMuestrasProgramas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                autoBind: false,
                clearButton:false,
                minLength: 3,
                height: 400,
                placeholder:"Seleccione un programa ...",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CotizacionesMuestras/GetCotizacionesMuestrasProgramas/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "No Programa", width: 100 },
                    { field: "Nombre", title: "Nombre del Programa", width: 200 },
                    { field: "NombreCli", title: "Nombre del Cliente", width: 200 }
                ]
            });
        });
    }
});

$.fn.extend({
    SelecionProgramas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                filterFields: ["IdPrograma", "NoDocumento", "Nombre"],
                autoBind: false,
                //minLength: 3,
                height: 400,
                placeholder: "Selección de Programas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    batch: true,
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "Programas/GetByCliente/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente")));
                            },
                            contentType: "application/json; charset=utf-8"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read" && data.models) {
                                return kendo.stringify(data.models[0]);
                            }
                        }
                    },
                    schema: {
                        total: "count",
                        model: {
                            id: "IdPrograma",
                            fields: {
                                IdPrograma: { type: "number" },
                                NoDocumento: { type: "string" },
                                Nombre: { type: "string" }
                            }
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "Nombre", title: "Programa", width: 300 }
                ]
            });
        });
    }
});

let fn_MostraTabla = function (ds, tabla) {
    tabla.children().remove();
    if (ds.length > 0) {
        tabla.append('<table class="table mt-3" >' +
            '<thead>' +
            '<tr>' +
            '<th scope="col">Simulación</th>' +
            '<th scope="col">Orden de Trabajo</th>' +
            '<th scope="col">Diseño</th>' +
            '<th scope="col">Fecha</th>' +
            '<th scope="col">Cant Piezas</th>' +
            '<th scope="col">Costo</th>' +
            '<th scope="col">Precio Aprov.</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="' + tabla.id + '_Det">' +
            '</tbody>' +
            '</table>'
        );

        let tablaDet = $("#" + tabla.id + "_Det");
        tablaDet.children().remove();
        $.each(ds, function (index, elemento) {
            tablaDet.append('<tr>' +
                '<td>' + elemento.NoSimulacion + '</td>' +
                '<td>' + elemento.NoOrdenTrabajo + '</td>' +
                '<td>' + elemento.Nombre + '</td>' +
                '<td>' + kendo.format("{0:dd/MM/yyyy HH:mm:ss}", kendo.parseDate(elemento.Fecha)) + '</td>' +
                '<td>' + kendo.format("{0:n}", elemento.CantidadPiezas) + '</td>' +
                '<td>' + kendo.format("{0:c4}", elemento.CostoUnitario) + '</td>' +
                '<td>' + kendo.format("{0:c4}", elemento.PrecioVenta) + '</td>' +
                '</tr>');
        });
    }
};

let fn_TablaEnMemoria = function (ds) {
    let e;

    if (ds.length > 0) {
        $.each(ds, function (index, elemento) {
            e = '<tr>' +
                '<td>' + elemento.NoSimulacion + '</td>' +
                '<td>' + elemento.NoFM + '</td>' +
                '<td>' + elemento.NoOrdenTrabajo + '</td>' +
                '<td>' + elemento.Nombre + '</td>' +
                '<td>' + kendo.format("{0:dd/MM/yyyy HH:mm:ss}", kendo.parseDate(elemento.Fecha)) + '</td>' +
                '<td>' + kendo.format("{0:n}", elemento.CantidadPiezas) + '</td>' +
                '<td>' + kendo.format("{0:c4}", elemento.CostoUnitario) + '</td>' +
                '<td>' + kendo.format("{0:c4}", elemento.PrecioVenta) + '</td>' +
                '</tr>';
        });

        e = '<table class="table mt-3" style="color: #fff !important;" >' +
            '<thead style="color: #fff !important;">' +
            '<tr>' +
            '<th scope="col">Simulación</th>' +
            '<th scope="col">No FM</th>' +
            '<th scope="col">Orden de Trabajo</th>' +
            '<th scope="col">Diseño</th>' +
            '<th scope="col">Fecha</th>' +
            '<th scope="col">Cant Piezas</th>' +
            '<th scope="col">Costo</th>' +
            '<th scope="col">Precio Aprov.</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody">' +
            e +
            '</tbody>' +
            '</table>';        
    }

    return e;
};

var fPermisos = function (datos) {
    Permisos = datos;
};