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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdModulo; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdModulo; },
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
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdModulo",
                fields: {
                    IdModulo: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Estado: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Nombre1: {
                        type: "string"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdModulo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdModulo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaMod]").parent("div .k-edit-label").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdModulo", title: "Codigo de Tela", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Estado", title: "Estado", editor: Grid_Combox, values: ["Estado", "Nombre", UrlEstados, "Modulos", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Nombre1", title: "Estado" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
});

fPermisos = function (datos) {
    Permisos = datos;
};