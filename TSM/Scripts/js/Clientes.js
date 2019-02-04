var Permisos;
$(document).ready(function () {
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
});

fPermisos = function (datos) {
    Permisos = datos;
}