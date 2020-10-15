var Permisos;
var xIdCliente = 0;

$(document).ready(function () {
    $("#ModalAcuerdos").kendoDialog({
        height: "auto",
        width: "70%",
        maxHeight: "700 px",
        title: "Plantillas de Acuerdos Comerciales",
        visible: false,
        closable: true,
        modal: true,
        actions: [
            { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
        ],
        close: function (e) {
            //KdoCmbSetValue($("#CmbMotivoDesarrollo"), "");
        }
    });

    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: crudServiceBaseUrl,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCliente; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCliente; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
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
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCliente",
                fields: {
                    IdCliente: { type: "number" },
                    NoCuenta: { type: "string" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 100) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 100");
                                    return false;
                                }

                                if (input.is("[name='Direccion']") && input.val().length > 250) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 100");
                                    return false;
                                }

                                if (input.is("[name='Contacto']") && input.val().length > 100) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 100");
                                    return false;
                                }

                                return true;
                            }
                        }
                    },
                    Direccion: {
                        type: "string",
                        validation: {
                            required: true                           
                        }
                    },
                    Contacto: { type: "string" }
                }
            }
        }
    });
       

    $("#GkClientes").kendoGrid({
        edit: function (e) {
            e.container.find("label[for=IdCliente]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdCliente]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },        
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCliente", title: "Cliente", editor: Grid_ColInt64NumSinDecimal },
            { field: "Nombre", title: "Nombre del cliente" },
            { field: "Direccion", title: "Dirección" },
            { field: "Contacto", title: "Contacto" },
            { field: "NoCuenta", title: "No Cuenta", editor: Grid_ColLocked },
            {
                command: {
                    name: "acuerdos",
                    iconClass: "k-icon k-i-track-changes-accept",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        xIdCliente = dataItem.get("IdCliente");
                        $("#ModalAcuerdos").data("kendoDialog").title("Plantillas de Acuerdos Comerciales: " + dataItem.get("Nombre"));
                        $("#ModalAcuerdos").data("kendoDialog").open();
                        dsAcuerdos.read();
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center;"
                }
            }
        ]
    });
    
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#GkClientes").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#GkClientes").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GkClientes").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GkClientes").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#GkClientes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GkClientes"), selectedRows);
    });

    $("#GkClientes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GkClientes"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#GkClientes"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#GkClientes"), ($(window).height() - "371"));

    $("#GkClientes").kendoTooltip({
        filter: ".k-grid-acuerdos",
        content: function (e) {
            return "Plantilla de Acuerdos Comerciales";
        }
    });

    //GRID DE ACUERDOS COMERCIALES
    var dsAcuerdos = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return crudAcuerdosUrl + "/GetClientesAcuerdosPlantillasByCliente/" + xIdCliente; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudAcuerdosUrl + "/" + datos.IdAcuerdo; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudAcuerdosUrl + "/" + datos.IdAcuerdo; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudAcuerdosUrl,
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
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdAcuerdo",
                fields: {
                    IdCliente: {
                        type: "number",
                        defaultValue: function (e) { return xIdCliente; }
                    },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='Contacto']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='PrecioDesarrolloMuestra']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='CondicionPagoDesarrollo']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='PrecioVendedorCTL']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='CondicionPagoCTL']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='Transporte']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='CondicionPagoProduccion']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='NumeroSeteos']") && input.val().length > 500) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 500");
                                    return false;
                                }

                                if (input.is("[name='CotizacionVigencia']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='PorcentajeSegundos']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='ExcesoSetup']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='PrecioAdicionalColorTela']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='PrecioSetup']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='PrecioSetupAdicional']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='RepeticionesCTL']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='RepeticionesDesarrollo']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='TerminosPago']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='Comentarios']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return false;
                                }

                                return true;
                            }
                        }
                    },
                    CotizaPromedio: { type: "boolean" },
                    PrecioPreliminar: {
                        type: "boolean",
                        defaultValue: true
                    },
                    FinalCotizacion: { type: "boolean" },
                    Contacto: { type: "string" },
                    PrecioDesarrolloMuestra: { type: "string" },
                    CondicionPagoDesarrollo: { type: "string" },
                    PrecioVendedorCTL: { type: "string" },
                    CondicionPagoCTL: { type: "string" },
                    Transporte: { type: "string" },
                    CondicionPagoProduccion: { type: "string" },
                    NumeroSeteos: { type: "string" },
                    CotizacionVigencia: { type: "string" },
                    PorcentajeSegundos: { type: "string" },
                    ExcesoSetup: { type: "string" },
                    PrecioAdicionalColorTela: { type: "string" },
                    PrecioSetup: { type: "string" },
                    PrecioSetupAdicional: { type: "string" },
                    RepeticionesCTL: { type: "string" },
                    RepeticionesDesarrollo: { type: "string" },
                    TerminosPago: { type: "string" },
                    Comentarios: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    $("#gAcuerdos").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdAcuerdo");
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");

            if (e.model.isNew())
                $('[field="PrecioPreliminar"]').prop('checked', true);
        },
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
        },
        editable: {
            "window": {
                "width": 800,
                "height": 900
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdAcuerdo", title: "No Plantilla", hidden: true },
            { field: "Nombre", title: "Nombre de plantilla" },            
            { field: "Contacto", title: "Contact" },
            { field: "PrecioDesarrolloMuestra", title: "Sample development price" },
            { field: "CondicionPagoDesarrollo", title: "Development payment condition" },
            { field: "PrecioVendedorCTL", title: "CTL's sample or vendor's sample price" },
            { field: "CondicionPagoCTL", title: "CTL's payament conditions" },
            { field: "Transporte", title: "Transport" },
            { field: "CondicionPagoProduccion", title: "Production payment condition" },
            { field: "NumeroSeteos", title: "Number of set-up's" },
            { field: "CotizacionVigencia", title: "Payment terms" },
            { field: "PorcentajeSegundos", title: "Porcetage of second's" },
            { field: "ExcesoSetup", title: "If the N° of set-up's exceds" },
            { field: "PrecioAdicionalColorTela", title: "Price per additional CW" },
            { field: "PrecioSetup", title: "Set-up price" },
            { field: "PrecioSetupAdicional", title: "Additional set-up price" },
            { field: "RepeticionesCTL", title: "N° of repeats" },
            { field: "RepeticionesDesarrollo", title: "N° of repeats:" },
            { field: "TerminosPago", title: "Payment terms" },
            { field: "Comentarios", title: "Technical aspect to consider" },
            { field: "CotizaPromedio", title: "Cotiza por average", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "CotizaPromedio"); } },
            { field: "PrecioPreliminar", title: "Preliminary price", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "PrecioPreliminar"); } },
            { field: "FinalCotizacion", title: "Final quote", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "FinalCotizacion"); } },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gAcuerdos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 550);
    SetGrid_CRUD_ToolbarTop($("#gAcuerdos").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gAcuerdos").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gAcuerdos").data("kendoGrid"), dsAcuerdos);

    var selectedRowsAcuerdos = [];
    $("#gAcuerdos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GkClientes"), selectedRowsAcuerdos);
    });

    $("#gAcuerdos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GkClientes"), selectedRows);
    });
});

fPermisos = function (datos) {
    Permisos = datos;
};